'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
  Badge,
  Spinner,
  Alert,
  OverlayTrigger,
  Tooltip,
} from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import GymPostersBackground from '../components/GymPostersBackground';
import ModernNavbar from '../components/ModernNavbar';
import { api, ReminderPayload } from '../lib/api';

type RepeatFrequency = 'once' | 'daily' | 'weekly' | 'custom';

interface Reminder extends ReminderPayload {
  id: string;
  message?: string | null;
  daysOfWeek: number[];
  enabled: boolean;
  startDate?: string | null;
  repeatEndsAt?: string | null;
  repeatInterval?: number | null;
  timezone?: string | null;
  notificationChannel?: 'browser' | 'push' | 'email';
}

interface ReminderFormState {
  type: string;
  title: string;
  message: string;
  time: string;
  daysOfWeek: number[];
  enabled: boolean;
  startDate: string;
  repeatFrequency: RepeatFrequency;
  repeatInterval: number;
  repeatEndsAt: string;
  timezone: string;
  notificationChannel: 'browser' | 'push' | 'email';
}

const DAY_MS = 24 * 60 * 60 * 1000;
const LOOK_AHEAD_DAYS = 90;
const NOTIFICATION_ICON = '/favicon.ico';

const dayLabels = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

const createInitialFormState = (timezone: string): ReminderFormState => {
  const today = new Date().toISOString().slice(0, 10);
  return {
    type: 'workout',
    title: '',
    message: '',
    time: '09:00',
    daysOfWeek: [],
    enabled: true,
    startDate: today,
    repeatFrequency: 'weekly',
    repeatInterval: 1,
    repeatEndsAt: '',
    timezone,
    notificationChannel: 'browser',
  };
};

const startOfDay = (date: Date) => {
  const clone = new Date(date);
  clone.setHours(0, 0, 0, 0);
  return clone;
};

const setTimeOnDate = (date: Date, time: string) => {
  const [hours, minutes] = time.split(':').map(Number);
  const adjusted = new Date(date);
  adjusted.setHours(hours ?? 0, minutes ?? 0, 0, 0);
  return adjusted;
};

const sameDay = (a: Date, b: Date) => startOfDay(a).getTime() === startOfDay(b).getTime();

const computeNextOccurrences = (
  reminder: Reminder,
  now: Date,
  lookAheadDays: number,
  count: number
): Date[] => {
  const results: Date[] = [];
  const frequency: RepeatFrequency = reminder.repeatFrequency || 'weekly';
  const interval = reminder.repeatInterval && reminder.repeatInterval > 0 ? reminder.repeatInterval : 1;
  const startDate = reminder.startDate ? new Date(reminder.startDate) : new Date();
  const base = setTimeOnDate(startDate, reminder.time);
  const endDate = reminder.repeatEndsAt ? new Date(reminder.repeatEndsAt) : null;
  const normalizedDays =
    reminder.daysOfWeek && reminder.daysOfWeek.length > 0
      ? reminder.daysOfWeek
      : [base.getDay()];

  let cursor = new Date(now);
  cursor = setTimeOnDate(cursor, reminder.time);
  if (cursor <= now) {
    cursor.setDate(cursor.getDate() + 1);
    cursor = setTimeOnDate(cursor, reminder.time);
  }

  const maxIterations = lookAheadDays;

  for (let i = 0; i < maxIterations && results.length < count; i++) {
    const candidate = new Date(cursor);
    const candidateStart = startOfDay(candidate);
    const baseStart = startOfDay(base);
    const diffDays = Math.floor((candidateStart.getTime() - baseStart.getTime()) / DAY_MS);

    if (diffDays >= 0) {
      let matches = false;

      switch (frequency) {
        case 'once':
          matches = sameDay(candidate, base);
          break;
        case 'daily':
        case 'custom':
          matches = diffDays % interval === 0;
          break;
        case 'weekly': {
          const weeksDiff = Math.floor(diffDays / 7);
          matches =
            normalizedDays.includes(candidate.getDay()) &&
            weeksDiff % interval === 0;
          break;
        }
        default:
          matches = false;
      }

      if (matches && candidate > now) {
        if (!endDate || candidate <= endDate) {
          results.push(candidate);
        }
      }
    }

    cursor.setDate(cursor.getDate() + 1);
    cursor = setTimeOnDate(cursor, reminder.time);
  }

  return results.slice(0, count);
};

const formatDateTime = (date: Date) =>
  date.toLocaleString('uk-UA', {
    dateStyle: 'medium',
    timeStyle: 'short',
  });

const formatFrequencyLabel = (
  frequency: RepeatFrequency,
  interval: number,
  daysOfWeek: number[]
) => {
  switch (frequency) {
    case 'once':
      return 'Одноразово';
    case 'daily':
      return interval > 1 ? `Кожні ${interval} дні` : 'Щодня';
    case 'custom':
      return `Кожні ${interval} днів`;
    case 'weekly':
    default:
      if (!daysOfWeek || daysOfWeek.length === 0) {
        return interval > 1 ? `Що ${interval} тижнів` : 'Щотижня';
      }
      const labels = daysOfWeek.map(day => dayLabels[day]).join(', ');
      return interval > 1
        ? `Що ${interval} тижнів (${labels})`
        : `Щотижня (${labels})`;
  }
};

const buildReminderPayload = (state: ReminderFormState): ReminderPayload => {
  const payload: ReminderPayload = {
    type: state.type,
    title: state.title,
    message: state.message ? state.message.trim() : undefined,
    time: state.time,
    daysOfWeek: state.repeatFrequency === 'weekly' ? state.daysOfWeek : [],
    enabled: state.enabled,
    startDate: state.startDate || undefined,
    repeatFrequency: state.repeatFrequency,
    repeatInterval:
      state.repeatFrequency === 'weekly' ||
      state.repeatFrequency === 'daily' ||
      state.repeatFrequency === 'custom'
        ? state.repeatInterval || 1
        : undefined,
    repeatEndsAt: state.repeatEndsAt || undefined,
    timezone: state.timezone,
    notificationChannel: state.notificationChannel,
  };

  if (state.repeatFrequency === 'once') {
    payload.daysOfWeek = [];
  }

  return payload;
};

export default function RemindersPage() {
  const defaultTimezone =
    typeof window !== 'undefined'
      ? Intl.DateTimeFormat().resolvedOptions().timeZone
      : 'UTC';

  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [upcomingMap, setUpcomingMap] = useState<Record<string, Date[]>>({});
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState<ReminderFormState>(() =>
    createInitialFormState(defaultTimezone)
  );
  const [showAdvanced, setShowAdvanced] = useState(false);

  const notificationTimeouts = useRef<number[]>([]);
  const serviceWorkerRegistration = useRef<ServiceWorkerRegistration | null>(null);

  const timezoneOptions = useMemo(() => {
    if (typeof Intl.supportedValuesOf === 'function') {
      try {
        return Intl.supportedValuesOf('timeZone');
      } catch {
        return [defaultTimezone, 'UTC'];
      }
    }
    return [defaultTimezone, 'UTC'];
  }, [defaultTimezone]);

  useEffect(() => {
    fetchReminders();
    setupNotifications();
    requestNotificationPermission();

    return () => {
      notificationTimeouts.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    };
  }, []);

  useEffect(() => {
    if (!loading) {
      scheduleReminders(reminders);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [reminders, loading]);

  const setupNotifications = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.register('/reminder-sw.js');
        serviceWorkerRegistration.current = registration;
      } catch (error) {
        console.error('SW registration failed:', error);
      }
    }
  };

  const requestNotificationPermission = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const fetchReminders = async () => {
    try {
      const data = await api.getReminders();
      const parsed: Reminder[] = (data.reminders || []).map((rem: Reminder) => ({
        ...rem,
        daysOfWeek: Array.isArray(rem.daysOfWeek) ? rem.daysOfWeek : [],
        repeatInterval: rem.repeatInterval ?? 1,
        repeatFrequency: (rem.repeatFrequency as RepeatFrequency) || 'weekly',
        timezone: rem.timezone || defaultTimezone,
        notificationChannel: rem.notificationChannel || 'browser',
      }));
      setReminders(parsed);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const scheduleReminders = async (list: Reminder[]) => {
    notificationTimeouts.current.forEach(timeoutId => window.clearTimeout(timeoutId));
    notificationTimeouts.current = [];

    const now = new Date();
    const nextMap: Record<string, Date[]> = {};
    const permissionGranted =
      typeof window !== 'undefined' &&
      'Notification' in window &&
      Notification.permission === 'granted';

    const registration =
      permissionGranted && serviceWorkerRegistration.current
        ? serviceWorkerRegistration.current
        : permissionGranted
        ? await navigator.serviceWorker?.ready
        : null;

    if (registration) {
      serviceWorkerRegistration.current = registration;
    }

    list.forEach(reminder => {
      if (!reminder.enabled) {
        return;
      }

      const occurrences = computeNextOccurrences(
        reminder,
        now,
        LOOK_AHEAD_DAYS,
        3
      );
      if (occurrences.length > 0) {
        nextMap[reminder.id] = occurrences;
      }

      if (registration && permissionGranted) {
        occurrences.forEach(date => {
          const delay = date.getTime() - Date.now();
          if (delay > 0 && delay < 1000 * 60 * 60 * 24 * 30) {
            const timeoutId = window.setTimeout(() => {
              registration
                .showNotification(reminder.title, {
                  body: reminder.message || 'Час діяти!',
                  icon: NOTIFICATION_ICON,
                  tag: `reminder-${reminder.id}-${date.getTime()}`,
                  data: { reminderId: reminder.id },
                })
                .catch(err => console.error('Notification error:', err));
            }, delay);
            notificationTimeouts.current.push(timeoutId);
          }
        });
      }
    });

    setUpcomingMap(nextMap);
  };

  const handleCreate = () => {
    setEditingReminder(null);
    setShowAdvanced(false);
    setFormData(createInitialFormState(defaultTimezone));
    setShowModal(true);
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setShowAdvanced(true);

    setFormData({
      type: reminder.type,
      title: reminder.title,
      message: reminder.message || '',
      time: reminder.time,
      daysOfWeek: reminder.daysOfWeek || [],
      enabled: reminder.enabled,
      startDate: reminder.startDate ? reminder.startDate.slice(0, 10) : new Date().toISOString().slice(0, 10),
      repeatFrequency: (reminder.repeatFrequency as RepeatFrequency) || 'weekly',
      repeatInterval: reminder.repeatInterval && reminder.repeatInterval > 0 ? reminder.repeatInterval : 1,
      repeatEndsAt: reminder.repeatEndsAt ? reminder.repeatEndsAt.slice(0, 10) : '',
      timezone: reminder.timezone || defaultTimezone,
      notificationChannel: reminder.notificationChannel || 'browser',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const payload = buildReminderPayload(formData);

      if (editingReminder) {
        await api.updateReminder(editingReminder.id, payload);
      } else {
        await api.createReminder(payload);
      }

      setShowModal(false);
      fetchReminders();
    } catch (error) {
      console.error('Error saving reminder:', error);
      alert('Помилка збереження нагадування');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити це нагадування?')) return;

    try {
      await api.deleteReminder(id);
      fetchReminders();
    } catch (error) {
      console.error('Error deleting reminder:', error);
      alert('Помилка видалення нагадування');
    }
  };

  const toggleReminder = async (reminder: Reminder) => {
    try {
      await api.updateReminder(reminder.id, {
        enabled: !reminder.enabled,
      });
      fetchReminders();
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const toggleDay = (day: number) => {
    if (formData.daysOfWeek.includes(day)) {
      setFormData(prev => ({
        ...prev,
        daysOfWeek: prev.daysOfWeek.filter(d => d !== day),
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        daysOfWeek: [...prev.daysOfWeek, day].sort(),
      }));
    }
  };

  const handleTestNotification = async () => {
    if (typeof window === 'undefined' || !('Notification' in window)) return;
    if (Notification.permission !== 'granted') {
      const result = await Notification.requestPermission();
      if (result !== 'granted') {
        alert('Для тесту потрібно надати дозвіл на сповіщення.');
        return;
      }
    }

    const registration =
      serviceWorkerRegistration.current || (await navigator.serviceWorker?.ready);

    try {
      await registration?.showNotification('Тестове нагадування', {
        body: 'Все працює! Ви отримаєте сповіщення згідно з розкладом.',
        icon: NOTIFICATION_ICON,
        tag: `reminder-test-${Date.now()}`,
      });
    } catch (error) {
      console.error('Test notification error:', error);
    }
  };

  const getTypeLabel = (type: string) => {
    const labels: Record<string, string> = {
      workout: 'Тренування',
      nutrition: 'Харчування',
      water: 'Вода',
      custom: 'Інше',
    };
    return labels[type] || type;
  };

  const enabledReminders = reminders.filter(r => r.enabled);
  const disabledReminders = reminders.filter(r => !r.enabled);

  return (
    <>
      <BootstrapClient />
      <div className="min-h-screen bg-dark d-flex flex-column">
        <GymPostersBackground />
        <ModernNavbar />

        <main className="flex-grow-1" style={{ position: 'relative' }}>
          <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
            <div className="d-flex flex-wrap gap-3 justify-content-between align-items-center mb-4">
              <div>
                <h1 className="mb-2">Нагадування</h1>
                <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>
                  Налаштуйте повторення, таймзону та миттєві сповіщення
                </p>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <Button
                  variant="outline-light"
                  onClick={handleTestNotification}
                  className="d-flex align-items-center gap-2"
                >
                  <i className="bi bi-bell"></i>
                  Тест сповіщення
                </Button>
                <Button onClick={handleCreate} style={{ background: '#d4af37', border: 'none' }}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Додати нагадування
                </Button>
              </div>
            </div>

            {typeof window !== 'undefined' && !('Notification' in window) && (
              <Alert variant="warning" className="mb-4">
                Ваш браузер не підтримує нагадування. Будь ласка, використовуйте сучасний браузер.
              </Alert>
            )}

            {typeof window !== 'undefined' && Notification.permission === 'denied' && (
              <Alert variant="danger" className="mb-4">
                Дозвіл на нагадування відхилено. Увімкніть його в налаштуваннях браузера, щоб отримувати сповіщення.
              </Alert>
            )}

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <>
                {enabledReminders.length > 0 && (
                  <div className="mb-5">
                    <h3 className="mb-3" style={{ color: '#d4af37' }}>Активні нагадування</h3>
                    <Row className="g-4">
                      {enabledReminders.map(reminder => {
                        const upcoming = upcomingMap[reminder.id] || [];
                        return (
                          <Col md={6} key={reminder.id}>
                            <Card className="card-hover-lift h-100">
                              <Card.Body>
                                <div className="d-flex justify-content-between align-items-start mb-3">
                                  <div className="flex-grow-1">
                                    <h5 className="mb-2" style={{ color: '#d4af37' }}>{reminder.title}</h5>
                                    {reminder.message && (
                                      <p className="text-muted small mb-2">{reminder.message}</p>
                                    )}
                                    <div className="d-flex flex-wrap gap-2 align-items-center">
                                      <Badge bg="primary">{getTypeLabel(reminder.type)}</Badge>
                                      <Badge bg="info">
                                        {formatFrequencyLabel(
                                          reminder.repeatFrequency || 'weekly',
                                          reminder.repeatInterval || 1,
                                          reminder.daysOfWeek || []
                                        )}
                                      </Badge>
                                      <Badge bg="secondary">
                                        {reminder.timezone || defaultTimezone}
                                      </Badge>
                                    </div>
                                  </div>
                                  <div className="d-flex gap-2">
                                    <Button
                                      variant="outline-warning"
                                      size="sm"
                                      onClick={() => handleEdit(reminder)}
                                    >
                                      <i className="bi bi-pencil"></i>
                                    </Button>
                                    <Button
                                      variant="outline-secondary"
                                      size="sm"
                                      onClick={() => toggleReminder(reminder)}
                                    >
                                      <i className="bi bi-pause"></i>
                                    </Button>
                                    <Button
                                      variant="outline-danger"
                                      size="sm"
                                      onClick={() => handleDelete(reminder.id)}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </Button>
                                  </div>
                                </div>

                                <div className="d-flex flex-wrap gap-3 mb-3">
                                  <div>
                                    <strong style={{ color: '#f5f5f5' }}>Час:</strong>{' '}
                                    <span style={{ color: '#d4af37' }}>{reminder.time}</span>
                                  </div>
                                  {reminder.startDate && (
                                    <div>
                                      <strong style={{ color: '#f5f5f5' }}>Початок:</strong>{' '}
                                      <span style={{ color: '#d4af37' }}>
                                        {new Date(reminder.startDate).toLocaleDateString('uk-UA')}
                                      </span>
                                    </div>
                                  )}
                                  {reminder.repeatEndsAt && (
                                    <div>
                                      <strong style={{ color: '#f5f5f5' }}>Закінчення:</strong>{' '}
                                      <span style={{ color: '#d4af37' }}>
                                        {new Date(reminder.repeatEndsAt).toLocaleDateString('uk-UA')}
                                      </span>
                                    </div>
                                  )}
                                </div>

                                {reminder.repeatFrequency === 'weekly' && reminder.daysOfWeek.length > 0 && (
                                  <div className="mb-3">
                                    <strong style={{ color: '#f5f5f5' }}>Дні:</strong>{' '}
                                    <div className="d-flex gap-2 mt-2 flex-wrap">
                                      {reminder.daysOfWeek.map(day => (
                                        <Badge key={day} bg="secondary">
                                          {dayLabels[day]}
                                        </Badge>
                                      ))}
                                    </div>
                                  </div>
                                )}

                                {upcoming.length > 0 && (
                                  <div>
                                    <strong style={{ color: '#f5f5f5' }}>Найближчі сповіщення:</strong>
                                    <ul className="small mt-2 mb-0" style={{ color: '#d4af37' }}>
                                      {upcoming.map(date => (
                                        <li key={`${reminder.id}-${date.toISOString()}`}>
                                          {formatDateTime(date)}
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                )}
                              </Card.Body>
                            </Card>
                          </Col>
                        );
                      })}
                    </Row>
                  </div>
                )}

                {disabledReminders.length > 0 && (
                  <div>
                    <h3 className="mb-3" style={{ color: '#e0e0e0', fontWeight: 600 }}>Неактивні нагадування</h3>
                    <Row className="g-4">
                      {disabledReminders.map(reminder => (
                        <Col md={6} key={reminder.id}>
                          <Card className="card-hover-lift h-100" style={{ opacity: 0.7 }}>
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="flex-grow-1">
                                  <h5 className="mb-2" style={{ color: '#f5f5f5', fontWeight: 600 }}>{reminder.title}</h5>
                                  <Badge bg="secondary">Неактивне</Badge>
                                </div>
                                <div className="d-flex gap-2">
                                  <Button
                                    variant="outline-success"
                                    size="sm"
                                    onClick={() => toggleReminder(reminder)}
                                  >
                                    <i className="bi bi-play"></i>
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(reminder.id)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </Button>
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {reminders.length === 0 && (
                  <Card className="text-center py-5">
                    <Card.Body>
                      <i className="bi bi-bell" style={{ fontSize: '4rem', color: '#e0e0e0' }}></i>
                      <h4 className="mt-3 mb-3" style={{ color: '#d4af37' }}>Ще немає нагадувань</h4>
                      <p className="text-muted mb-4">Створіть нагадування, щоб не забувати про тренування!</p>
                      <Button onClick={handleCreate} style={{ background: '#d4af37', border: 'none' }}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Додати нагадування
                      </Button>
                    </Card.Body>
                  </Card>
                )}
              </>
            )}
          </Container>
        </main>
      </div>

      <Modal show={showModal} onHide={() => setShowModal(false)} centered size="lg">
        <Modal.Header closeButton style={{ background: '#1a1a1a', borderColor: '#d4af37' }}>
          <Modal.Title style={{ color: '#d4af37' }}>
            {editingReminder ? 'Редагувати нагадування' : 'Нове нагадування'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#1a1a1a' }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#f5f5f5' }}>Тип</Form.Label>
              <Form.Select
                value={formData.type}
                onChange={e => setFormData({ ...formData, type: e.target.value })}
                style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
              >
                <option value="workout">Тренування</option>
                <option value="nutrition">Харчування</option>
                <option value="water">Вода</option>
                <option value="custom">Інше</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#f5f5f5' }}>Назва</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={e => setFormData({ ...formData, title: e.target.value })}
                placeholder="Наприклад: Тренування грудей"
                style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#f5f5f5' }}>Повідомлення (опціонально)</Form.Label>
              <Form.Control
                type="text"
                value={formData.message}
                onChange={e => setFormData({ ...formData, message: e.target.value })}
                placeholder="Наприклад: Час для тренування!"
                style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
              />
            </Form.Group>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ color: '#f5f5f5' }}>Час</Form.Label>
                  <Form.Control
                    type="time"
                    value={formData.time}
                    onChange={e => setFormData({ ...formData, time: e.target.value })}
                    style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ color: '#f5f5f5' }}>Таймзона</Form.Label>
                  <Form.Select
                    value={formData.timezone}
                    onChange={e => setFormData({ ...formData, timezone: e.target.value })}
                    style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
                  >
                    {timezoneOptions.map(tz => (
                      <option key={tz} value={tz}>
                        {tz}
                      </option>
                    ))}
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <div className="d-flex justify-content-between align-items-center mt-4 mb-2">
              <h5 style={{ color: '#f5f5f5' }}>Повторення</h5>
              <Button
                variant="outline-warning"
                size="sm"
                onClick={() => setShowAdvanced(prev => !prev)}
              >
                {showAdvanced ? 'Приховати деталі' : 'Детальні налаштування'}
              </Button>
            </div>

            <Row className="g-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ color: '#f5f5f5' }}>Частота</Form.Label>
                  <Form.Select
                    value={formData.repeatFrequency}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        repeatFrequency: e.target.value as RepeatFrequency,
                      }))
                    }
                    style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
                  >
                    <option value="weekly">Щотижня</option>
                    <option value="daily">Щодня</option>
                    <option value="custom">Кожні N днів</option>
                    <option value="once">Одноразово</option>
                  </Form.Select>
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label style={{ color: '#f5f5f5' }}>
                    Інтервал
                    <OverlayTrigger
                      placement="top"
                      overlay={<Tooltip>Кількість днів/тижнів між нагадуваннями</Tooltip>}
                    >
                      <i className="bi bi-info-circle ms-1" />
                    </OverlayTrigger>
                  </Form.Label>
                  <Form.Control
                    type="number"
                    min={1}
                    max={30}
                    value={formData.repeatInterval}
                    disabled={formData.repeatFrequency === 'once' || formData.repeatFrequency === 'weekly'}
                    onChange={e =>
                      setFormData(prev => ({
                        ...prev,
                        repeatInterval: Number(e.target.value),
                      }))
                    }
                    style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
                  />
                </Form.Group>
              </Col>
            </Row>

            {formData.repeatFrequency === 'weekly' && (
              <Form.Group className="my-3">
                <Form.Label style={{ color: '#f5f5f5' }}>Дні тижня</Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {dayLabels.map((label, index) => (
                    <Button
                      key={label}
                      variant={formData.daysOfWeek.includes(index) ? 'warning' : 'outline-warning'}
                      onClick={() => toggleDay(index)}
                      style={{
                        borderColor: '#d4af37',
                        color: formData.daysOfWeek.includes(index) ? '#000' : '#d4af37',
                        background: formData.daysOfWeek.includes(index) ? '#d4af37' : 'transparent',
                      }}
                    >
                      {label}
                    </Button>
                  ))}
                </div>
              </Form.Group>
            )}

            {showAdvanced && (
              <>
                <Row className="g-3 mb-3">
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label style={{ color: '#f5f5f5' }}>Дата початку</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.startDate}
                        onChange={e => setFormData({ ...formData, startDate: e.target.value })}
                        style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={6}>
                    <Form.Group>
                      <Form.Label style={{ color: '#f5f5f5' }}>Дата завершення (опціонально)</Form.Label>
                      <Form.Control
                        type="date"
                        value={formData.repeatEndsAt}
                        onChange={e => setFormData({ ...formData, repeatEndsAt: e.target.value })}
                        style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
                      />
                    </Form.Group>
                  </Col>
                </Row>

                <Form.Group className="mb-3">
                  <Form.Label style={{ color: '#f5f5f5' }}>Канал сповіщень</Form.Label>
                  <Form.Select
                    value={formData.notificationChannel}
                    onChange={e =>
                      setFormData({
                        ...formData,
                        notificationChannel: e.target.value as 'browser' | 'push' | 'email',
                      })
                    }
                    style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
                  >
                    <option value="browser">Браузер</option>
                    <option value="push" disabled>
                      Push (скоро)
                    </option>
                    <option value="email" disabled>
                      Email (скоро)
                    </option>
                  </Form.Select>
                </Form.Group>

                <Card className="bg-dark border-warning">
                  <Card.Body>
                    <h6 className="text-warning mb-2">Попередній перегляд</h6>
                    <p className="text-light mb-1">
                      <strong>Частота:</strong>{' '}
                      {formatFrequencyLabel(formData.repeatFrequency, formData.repeatInterval, formData.daysOfWeek)}
                    </p>
                    <p className="text-light mb-1">
                      <strong>Початок:</strong> {formData.startDate || 'сьогодні'}
                    </p>
                    <p className="text-light mb-1">
                      <strong>Завершення:</strong>{' '}
                      {formData.repeatEndsAt || 'без завершення'}
                    </p>
                    <p className="text-light mb-0">
                      <strong>Таймзона:</strong> {formData.timezone}
                    </p>
                  </Card.Body>
                </Card>
              </>
            )}

            <Form.Check
              className="mt-4"
              type="switch"
              label="Увімкнути нагадування"
              checked={formData.enabled}
              onChange={e => setFormData({ ...formData, enabled: e.target.checked })}
              style={{ color: '#f5f5f5' }}
            />
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ background: '#1a1a1a', borderColor: '#d4af37' }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Скасувати
          </Button>
          <Button onClick={handleSave} style={{ background: '#d4af37', border: 'none' }}>
            Зберегти
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

