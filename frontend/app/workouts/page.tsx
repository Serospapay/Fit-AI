'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge, Tabs, Tab } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import GymPostersBackground from '../components/GymPostersBackground';
import ModernNavbar from '../components/ModernNavbar';
import { api } from '../lib/api';

interface Workout {
  id: string;
  date: string;
  duration?: number;
  rating?: number;
  notes?: string;
  status?: string;
  exercises: any[];
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('list');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [calendarWorkouts, setCalendarWorkouts] = useState<Record<string, Workout[]>>({});

  useEffect(() => {
    fetchWorkouts();
  }, []);

  useEffect(() => {
    // Групуємо тренування по датах для календаря
    const grouped: Record<string, Workout[]> = {};
    workouts.forEach(workout => {
      const dateKey = new Date(workout.date).toISOString().split('T')[0];
      if (!grouped[dateKey]) {
        grouped[dateKey] = [];
      }
      grouped[dateKey].push(workout);
    });
    setCalendarWorkouts(grouped);
  }, [workouts]);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const data = await api.getWorkouts({ limit: '100' });
      setWorkouts(data.workouts || []);
    } catch (error) {
      console.error('Error fetching workouts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити це тренування?')) return;

    try {
      await api.deleteWorkout(id);
      setWorkouts(workouts.filter(w => w.id !== id));
    } catch (error) {
      console.error('Error deleting workout:', error);
      alert('Не вдалося видалити тренування');
    }
  };

  // Генерація календаря
  const generateCalendar = () => {
    const year = selectedDate.getFullYear();
    const month = selectedDate.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const calendar = [];
    const daysOfWeek = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];

    // Заголовки днів тижня
    calendar.push(
      <Row key="header" className="mb-2">
        {daysOfWeek.map((day, idx) => (
          <Col key={idx} className="text-center" style={{ color: '#d4af37', fontWeight: 'bold' }}>
            {day}
          </Col>
        ))}
      </Row>
    );

    // Дні місяця
    let day = 1;
    for (let i = 0; i < 6; i++) {
      const week = [];
      for (let j = 0; j < 7; j++) {
        if (i === 0 && j < startingDayOfWeek) {
          week.push(<Col key={`empty-${j}`}></Col>);
        } else if (day > daysInMonth) {
          week.push(<Col key={`empty-${j}`}></Col>);
        } else {
          const dateKey = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
          const dayWorkouts = calendarWorkouts[dateKey] || [];
          const isToday = dateKey === new Date().toISOString().split('T')[0];
          
          week.push(
            <Col 
              key={day} 
              className="p-2 border rounded"
              style={{ 
                minHeight: '80px',
                background: isToday ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                borderColor: isToday ? '#d4af37' : 'rgba(255, 255, 255, 0.1)',
                cursor: 'pointer'
              }}
              onClick={() => {
                if (dayWorkouts.length > 0) {
                  setSelectedDate(new Date(year, month, day));
                }
              }}
            >
              <div className="d-flex justify-content-between align-items-start mb-1">
                <span style={{ color: isToday ? '#d4af37' : '#f5f5f5', fontWeight: isToday ? 'bold' : 'normal' }}>
                  {day}
                </span>
                {dayWorkouts.length > 0 && (
                  <Badge bg="warning" style={{ fontSize: '0.7rem' }}>
                    {dayWorkouts.length}
                  </Badge>
                )}
              </div>
              <div className="d-flex flex-column gap-1">
                {dayWorkouts.slice(0, 2).map((w) => (
                  <small 
                    key={w.id}
                    className="text-truncate"
                    style={{ 
                      fontSize: '0.7rem',
                      color: w.status === 'completed' ? '#28a745' : w.status === 'planned' ? '#ffc107' : '#888'
                    }}
                    title={w.exercises.length + ' вправ'}
                  >
                    {w.exercises.length} вправ
                  </small>
                ))}
              </div>
            </Col>
          );
          day++;
        }
      }
      calendar.push(<Row key={i}>{week}</Row>);
    }

    return calendar;
  };

  const navigateMonth = (direction: number) => {
    setSelectedDate(new Date(selectedDate.getFullYear(), selectedDate.getMonth() + direction, 1));
  };

  const getWorkoutsForDate = (date: Date) => {
    const dateKey = date.toISOString().split('T')[0];
    return calendarWorkouts[dateKey] || [];
  };

  return (
    <>
      <BootstrapClient />
      <div className="min-h-screen bg-dark d-flex flex-column">
        <GymPostersBackground />
        <ModernNavbar />

        <main className="flex-grow-1" style={{ position: 'relative' }}>
          <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
            <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
              <div>
                <h1 className="mb-2">Мої тренування</h1>
                <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>Історія ваших тренувань</p>
              </div>
              <div className="d-flex gap-2 flex-wrap">
                <Button 
                  variant="outline-warning" 
                  onClick={async () => {
                    const token = localStorage.getItem('token');
                    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/export/workouts/excel`;
                    const response = await fetch(url, {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });
                    const blob = await response.blob();
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `trenuvannya_${new Date().toISOString().split('T')[0]}.xlsx`;
                    link.click();
                  }}
                >
                  <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                  Excel
                </Button>
                <Button 
                  variant="outline-danger" 
                  onClick={async () => {
                    const token = localStorage.getItem('token');
                    const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/export/workouts/pdf`;
                    const response = await fetch(url, {
                      headers: {
                        'Authorization': `Bearer ${token}`
                      }
                    });
                    const blob = await response.blob();
                    const downloadUrl = window.URL.createObjectURL(blob);
                    const link = document.createElement('a');
                    link.href = downloadUrl;
                    link.download = `trenuvannya_${new Date().toISOString().split('T')[0]}.pdf`;
                    link.click();
                  }}
                >
                  <i className="bi bi-file-pdf me-2"></i>
                  PDF
                </Button>
                <Button variant="primary" href="/workouts/new" style={{ background: '#d4af37', border: 'none' }}>
                  <i className="bi bi-plus-circle me-2"></i>
                  Додати тренування
                </Button>
              </div>
            </div>

            <Tabs activeKey={activeTab} onSelect={(k) => setActiveTab(k || 'list')} className="mb-4">
              <Tab eventKey="list" title={<><i className="bi bi-list-ul me-2"></i>Список</>}>
                {loading ? (
                  <div className="text-center py-5">
                    <Spinner animation="border" variant="primary" />
                  </div>
                ) : workouts.length === 0 ? (
                  <Card>
                    <Card.Body className="text-center py-5">
                      <div className="display-1 mb-3">
                        <i className="bi bi-calendar-x" style={{ color: '#d4af37' }}></i>
                      </div>
                      <h4 className="mb-3" style={{ color: '#d4af37' }}>Немає тренувань</h4>
                      <p style={{ color: '#e0e0e0', fontFamily: 'var(--font-roboto-condensed)', fontWeight: 500 }} className="mb-4">Додайте перше тренування для відстеження прогресу</p>
                      <Button variant="primary" href="/workouts/new" style={{ background: '#d4af37', border: 'none' }}>
                        Додати тренування
                      </Button>
                    </Card.Body>
                  </Card>
                ) : (
                  <Row className="g-4">
                    {workouts.map((workout) => (
                      <Col key={workout.id} md={6} lg={4}>
                        <Card className="card-hover-lift h-100">
                          <Card.Body className="p-4">
                            <div className="d-flex justify-content-between align-items-start mb-3">
                              <div>
                                <h5 className="fw-bold mb-2" style={{ color: '#d4af37' }}>
                                  {new Date(workout.date).toLocaleDateString('uk-UA', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric'
                                  })}
                                </h5>
                                {workout.status && (
                                  <Badge bg={workout.status === 'completed' ? 'success' : workout.status === 'planned' ? 'warning' : 'secondary'} className="me-2">
                                    {workout.status === 'completed' ? 'Виконано' : workout.status === 'planned' ? 'Заплановано' : 'Скасовано'}
                                  </Badge>
                                )}
                                <div className="d-flex gap-3 text-muted small mt-2">
                                  {workout.duration && (
                                    <span><i className="bi bi-clock me-1"></i>{workout.duration} хв</span>
                                  )}
                                  {workout.rating && (
                                    <span><i className="bi bi-star-fill text-warning me-1"></i>{workout.rating}/5</span>
                                  )}
                                </div>
                              </div>
                              <Button
                                variant="link"
                                size="sm"
                                className="text-danger"
                                onClick={() => handleDelete(workout.id)}
                              >
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>

                            {workout.exercises && workout.exercises.length > 0 && (
                              <div className="mb-3">
                                <h6 className="fw-bold mb-2" style={{ color: '#f5f5f5' }}>Вправи ({workout.exercises.length}):</h6>
                                <div className="small">
                                  {workout.exercises.slice(0, 3).map((we: any, idx: number) => (
                                    <div key={idx} className="mb-1" style={{ color: '#f5f5f5', fontWeight: 500 }}>
                                      • {we.exercise?.nameUk || we.exercise?.name || we.customName || 'Вправа'}
                                      {we.sets && we.reps && ` - ${we.sets}x${we.reps}`}
                                      {we.weight && ` @ ${we.weight}кг`}
                                    </div>
                                  ))}
                                  {workout.exercises.length > 3 && (
                                    <div className="text-muted">+ ще {workout.exercises.length - 3} вправ</div>
                                  )}
                                </div>
                              </div>
                            )}

                            {workout.notes && (
                              <div className="text-muted small border-top pt-3">
                                <i className="bi bi-chat-left-text me-2"></i>
                                {workout.notes}
                              </div>
                            )}
                          </Card.Body>
                        </Card>
                      </Col>
                    ))}
                  </Row>
                )}
              </Tab>

              <Tab eventKey="calendar" title={<><i className="bi bi-calendar3 me-2"></i>Календар</>}>
                <Card className="card-hover-lift">
                  <Card.Body>
                    <div className="d-flex justify-content-between align-items-center mb-4">
                      <h4 className="mb-0" style={{ color: '#d4af37' }}>
                        {selectedDate.toLocaleDateString('uk-UA', { month: 'long', year: 'numeric' })}
                      </h4>
                      <div className="d-flex gap-2">
                        <Button variant="outline-warning" size="sm" onClick={() => navigateMonth(-1)}>
                          <i className="bi bi-chevron-left"></i>
                        </Button>
                        <Button variant="outline-warning" size="sm" onClick={() => setSelectedDate(new Date())}>
                          Сьогодні
                        </Button>
                        <Button variant="outline-warning" size="sm" onClick={() => navigateMonth(1)}>
                          <i className="bi bi-chevron-right"></i>
                        </Button>
                      </div>
                    </div>
                    
                    <div className="calendar-container">
                      {generateCalendar()}
                    </div>

                    {getWorkoutsForDate(selectedDate).length > 0 && (
                      <div className="mt-4">
                        <h5 className="mb-3" style={{ color: '#d4af37' }}>
                          Тренування на {selectedDate.toLocaleDateString('uk-UA', { day: 'numeric', month: 'long' })}
                        </h5>
                        <Row className="g-3">
                          {getWorkoutsForDate(selectedDate).map((workout) => (
                            <Col md={6} key={workout.id}>
                              <Card style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                                <Card.Body>
                                  <div className="d-flex justify-content-between align-items-start">
                                    <div className="flex-grow-1">
                                      <div className="d-flex gap-2 align-items-center mb-2">
                                        {workout.status && (
                                          <Badge bg={workout.status === 'completed' ? 'success' : workout.status === 'planned' ? 'warning' : 'secondary'}>
                                            {workout.status === 'completed' ? 'Виконано' : workout.status === 'planned' ? 'Заплановано' : 'Скасовано'}
                                          </Badge>
                                        )}
                                        {workout.duration && (
                                          <small className="text-muted">
                                            <i className="bi bi-clock me-1"></i>{workout.duration} хв
                                          </small>
                                        )}
                                      </div>
                                      {workout.exercises && workout.exercises.length > 0 && (
                                        <small className="text-muted">
                                          {workout.exercises.length} вправ
                                        </small>
                                      )}
                                    </div>
                                    <Button
                                      variant="link"
                                      size="sm"
                                      className="text-danger"
                                      onClick={() => handleDelete(workout.id)}
                                    >
                                      <i className="bi bi-trash"></i>
                                    </Button>
                                  </div>
                                </Card.Body>
                              </Card>
                            </Col>
                          ))}
                        </Row>
                      </div>
                    )}
                  </Card.Body>
                </Card>
              </Tab>
            </Tabs>
          </Container>
        </main>

        <footer className="flex-shrink-0 py-3" style={{ position: 'relative', zIndex: 100, borderTop: '2px solid rgba(212, 175, 55, 0.2)' }}>
          <Container>
            <div className="text-center" style={{ color: '#e0e0e0', fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.85rem', fontWeight: 500 }}>
              © 2024 Кишеньковий тренер
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
}
