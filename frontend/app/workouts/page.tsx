'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Modal, Alert } from 'react-bootstrap';
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
  exercises: any[];
}

export default function WorkoutsPage() {
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchWorkouts();
  }, []);

  const fetchWorkouts = async () => {
    setLoading(true);
    try {
      const data = await api.getWorkouts();
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

  return (
    <>
      <BootstrapClient />
      <div className="min-h-screen bg-dark d-flex flex-column">
        {/* Gym Posters Background */}
        <GymPostersBackground />
        
        {/* Modern Navigation */}
        <ModernNavbar />

        <main className="flex-grow-1" style={{ position: 'relative' }}>
        <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="mb-2">Мої тренування</h1>
              <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>Історія ваших тренувань</p>
            </div>
            <Button variant="primary" href="/workouts/new">
              <i className="bi bi-plus-circle me-2"></i>
              Додати тренування
            </Button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : workouts.length === 0 ? (
            <Card>
              <Card.Body className="text-center py-5">
                <div className="display-1 mb-3">
                  <i className="bi bi-calendar-x text-gold"></i>
                </div>
                <h4 className="mb-3">Немає тренувань</h4>
                <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }} className="mb-4">Додайте перше тренування для відстеження прогресу</p>
                <Button variant="primary" href="/workouts/new">
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
                          <h5 className="fw-bold mb-2">
                            {new Date(workout.date).toLocaleDateString('uk-UA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h5>
                          <div className="d-flex gap-3 text-muted small">
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
                          <h6 className="fw-bold mb-2">Вправи ({workout.exercises.length}):</h6>
                          <div className="small">
                            {workout.exercises.slice(0, 3).map((we: any, idx: number) => (
                              <div key={idx} className="mb-1">
                                • {we.exercise.nameUk || we.exercise.name}
                                {we.sets && we.reps && ` - ${we.sets}x${we.reps}`}
                                {we.weight && ` @ ${we.weight}кг`}
                              </div>
                            ))}
                            {workout.exercises.length > 3 && (
                              <div className="text-muted">+ ще {workout.exercises.length - 3} вправи</div>
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
        </Container>
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 py-3" style={{ position: 'relative', zIndex: 100, borderTop: '2px solid rgba(212, 175, 55, 0.2)' }}>
          <Container>
            <div className="text-center" style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.85rem' }}>
              © 2024 Кишеньковий тренер
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
}

