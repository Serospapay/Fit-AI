'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Spinner, Modal } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';

interface Workout {
  id: string;
  date: string;
  duration?: number;
  rating?: number;
  notes?: string;
  exercises: any[];
}

export default function WorkoutsPage() {
  const router = useRouter();
  const [workouts, setWorkouts] = useState<Workout[]>([]);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    const tokenFromStorage = localStorage.getItem('token');
    if (!tokenFromStorage) {
      router.push('/login');
      return;
    }
    setToken(tokenFromStorage);
    fetchWorkouts(tokenFromStorage);
  }, []);

  const fetchWorkouts = async (authToken: string) => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/workouts', {
        headers: { 'Authorization': `Bearer ${authToken}` }
      });

      if (res.status === 401) {
        localStorage.removeItem('token');
        router.push('/login');
        return;
      }

      const data = await res.json();
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
      const res = await fetch(`http://localhost:5000/api/workouts/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });

      if (res.ok) {
        setWorkouts(workouts.filter(w => w.id !== id));
      }
    } catch (error) {
      console.error('Error deleting workout:', error);
    }
  };

  return (
    <>
      <BootstrapClient />
      <div className="min-h-screen bg-light">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-bottom">
          <Container>
            <div className="d-flex justify-content-between align-items-center py-3">
              <a href="/dashboard" className="fw-bold fs-4 text-gradient text-decoration-none">
                💪 Кишеньковий тренер
              </a>
              <div className="d-flex align-items-center gap-3">
                <a href="/dashboard" className="text-decoration-none text-dark">Dashboard</a>
                <a href="/exercises" className="text-decoration-none text-dark">Вправи</a>
                <a href="/workouts" className="text-decoration-none fw-bold">Тренування</a>
                <a href="/calculators" className="text-decoration-none text-dark">Калькулятори</a>
              </div>
            </div>
          </Container>
        </nav>

        <Container className="py-5">
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="display-4 fw-bold mb-2">Мої тренування</h1>
              <p className="lead text-muted">Історія ваших тренувань</p>
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
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <div className="display-1 mb-3">📝</div>
                <h4 className="fw-bold mb-3">Немає тренувань</h4>
                <p className="text-muted mb-4">Додайте перше тренування для відстеження прогресу</p>
                <Button variant="primary" href="/workouts/new">
                  Додати тренування
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-4">
              {workouts.map((workout) => (
                <Col key={workout.id} md={6} lg={4}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
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
      </div>
    </>
  );
}

