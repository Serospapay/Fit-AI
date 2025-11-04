'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, Badge, Spinner, Alert } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import GymPostersBackground from '../components/GymPostersBackground';
import ModernNavbar from '../components/ModernNavbar';
import { api } from '../lib/api';

interface Reminder {
  id: string;
  type: string;
  title: string;
  message?: string;
  time: string;
  daysOfWeek: number[];
  enabled: boolean;
}

export default function RemindersPage() {
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingReminder, setEditingReminder] = useState<Reminder | null>(null);
  const [formData, setFormData] = useState({
    type: 'workout',
    title: '',
    message: '',
    time: '09:00',
    daysOfWeek: [] as number[],
    enabled: true,
  });

  useEffect(() => {
    fetchReminders();
    requestNotificationPermission();
  }, []);

  const requestNotificationPermission = async () => {
    if ('Notification' in window && Notification.permission === 'default') {
      await Notification.requestPermission();
    }
  };

  const fetchReminders = async () => {
    try {
      const data = await api.getReminders();
      setReminders(data.reminders || []);
    } catch (error) {
      console.error('Error fetching reminders:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingReminder(null);
    setFormData({
      type: 'workout',
      title: '',
      message: '',
      time: '09:00',
      daysOfWeek: [],
      enabled: true,
    });
    setShowModal(true);
  };

  const handleEdit = (reminder: Reminder) => {
    setEditingReminder(reminder);
    setFormData({
      type: reminder.type,
      title: reminder.title,
      message: reminder.message || '',
      time: reminder.time,
      daysOfWeek: reminder.daysOfWeek || [],
      enabled: reminder.enabled,
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        ...formData,
        daysOfWeek: formData.daysOfWeek,
      };

      if (editingReminder) {
        await api.updateReminder(editingReminder.id, data);
      } else {
        await api.createReminder(data);
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
        ...reminder,
        enabled: !reminder.enabled,
      });
      fetchReminders();
    } catch (error) {
      console.error('Error toggling reminder:', error);
    }
  };

  const toggleDay = (day: number) => {
    if (formData.daysOfWeek.includes(day)) {
      setFormData({
        ...formData,
        daysOfWeek: formData.daysOfWeek.filter(d => d !== day),
      });
    } else {
      setFormData({
        ...formData,
        daysOfWeek: [...formData.daysOfWeek, day].sort(),
      });
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

  const getDayLabel = (day: number) => {
    const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return days[day];
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
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="mb-2">Нагадування</h1>
                <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>
                  Налаштуйте нагадування для регулярних тренувань та харчування
                </p>
              </div>
              <Button onClick={handleCreate} style={{ background: '#d4af37', border: 'none' }}>
                <i className="bi bi-plus-circle me-2"></i>
                Додати нагадування
              </Button>
            </div>

            {!('Notification' in window) && (
              <Alert variant="warning" className="mb-4">
                Ваш браузер не підтримує нагадування. Будь ласка, використовуйте сучасний браузер.
              </Alert>
            )}

            {Notification.permission === 'denied' && (
              <Alert variant="danger" className="mb-4">
                Дозвіл на нагадування відхилено. Будь ласка, увімкніть його в налаштуваннях браузера.
              </Alert>
            )}

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <>
                {/* Активні нагадування */}
                {enabledReminders.length > 0 && (
                  <div className="mb-5">
                    <h3 className="mb-3" style={{ color: '#d4af37' }}>Активні нагадування</h3>
                    <Row className="g-4">
                      {enabledReminders.map((reminder) => (
                        <Col md={6} key={reminder.id}>
                          <Card className="card-hover-lift h-100">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="flex-grow-1">
                                  <h5 className="mb-2" style={{ color: '#d4af37' }}>{reminder.title}</h5>
                                  {reminder.message && (
                                    <p className="text-muted small mb-2">{reminder.message}</p>
                                  )}
                                  <Badge bg="primary" className="me-2">{getTypeLabel(reminder.type)}</Badge>
                                  <Badge bg="success">Активне</Badge>
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

                              <div className="mb-2">
                                <strong style={{ color: '#f5f5f5' }}>Час:</strong>{' '}
                                <span style={{ color: '#d4af37' }}>{reminder.time}</span>
                              </div>

                              <div>
                                <strong style={{ color: '#f5f5f5' }}>Дні:</strong>{' '}
                                <div className="d-flex gap-2 mt-2">
                                  {reminder.daysOfWeek.map((day) => (
                                    <Badge key={day} bg="secondary">
                                      {getDayLabel(day)}
                                    </Badge>
                                  ))}
                                </div>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* Неактивні нагадування */}
                {disabledReminders.length > 0 && (
                  <div>
                    <h3 className="mb-3" style={{ color: '#888' }}>Неактивні нагадування</h3>
                    <Row className="g-4">
                      {disabledReminders.map((reminder) => (
                        <Col md={6} key={reminder.id}>
                          <Card className="card-hover-lift h-100" style={{ opacity: 0.7 }}>
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="flex-grow-1">
                                  <h5 className="mb-2" style={{ color: '#888' }}>{reminder.title}</h5>
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
                      <i className="bi bi-bell" style={{ fontSize: '4rem', color: '#888' }}></i>
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

      {/* Модальне вікно */}
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
                onChange={(e) => setFormData({ ...formData, type: e.target.value })}
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
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Наприклад: Тренування грудей"
                style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#f5f5f5' }}>Повідомлення (опціонально)</Form.Label>
              <Form.Control
                type="text"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Наприклад: Час для тренування!"
                style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#f5f5f5' }}>Час</Form.Label>
              <Form.Control
                type="time"
                value={formData.time}
                onChange={(e) => setFormData({ ...formData, time: e.target.value })}
                style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#f5f5f5' }}>Дні тижня</Form.Label>
              <div className="d-flex flex-wrap gap-2">
                {[0, 1, 2, 3, 4, 5, 6].map((day) => (
                  <Button
                    key={day}
                    variant={formData.daysOfWeek.includes(day) ? 'warning' : 'outline-warning'}
                    onClick={() => toggleDay(day)}
                    style={{
                      borderColor: '#d4af37',
                      color: formData.daysOfWeek.includes(day) ? '#000' : '#d4af37',
                      background: formData.daysOfWeek.includes(day) ? '#d4af37' : 'transparent',
                    }}
                  >
                    {getDayLabel(day)}
                  </Button>
                ))}
              </div>
            </Form.Group>

            <Form.Check
              type="switch"
              label="Увімкнути нагадування"
              checked={formData.enabled}
              onChange={(e) => setFormData({ ...formData, enabled: e.target.checked })}
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

