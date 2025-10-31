'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Modal } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import ParallaxWrapper from '../components/ParallaxWrapper';
import GymPostersBackground from '../components/GymPostersBackground';
import GymLogo from '../components/GymLogo';

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
      const res = await fetch('http://localhost:5000/api/workouts');
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
        method: 'DELETE'
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
      <div className="min-h-screen bg-dark">
        {/* Background Grid */}
        <div className="position-fixed w-100 h-100" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(212,175,55,0.03) 0px, rgba(212,175,55,0.03) 1px, transparent 1px, transparent 50px), repeating-linear-gradient(90deg, rgba(212,175,55,0.03) 0px, rgba(212,175,55,0.03) 1px, transparent 1px, transparent 50px)', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }}></div>
        
        {/* Gym Posters Background */}
        <GymPostersBackground />
        
        {/* Navigation */}
        <nav className="navbar">
          <Container>
            <div className="d-flex justify-content-between align-items-center py-3">
              <a href="/dashboard" className="fw-bold fs-4 text-decoration-none d-flex align-items-center gap-2">
                <GymLogo />
                <span className="d-none d-md-inline" style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '2px', fontSize: '1.8rem', color: '#d4af37' }}>КИШЕНЬКОВИЙ</span>
                <span className="d-none d-lg-inline" style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '2px', fontSize: '1.8rem', color: '#f5f5f5' }}>ТРЕНЕР</span>
              </a>
              <div className="d-flex align-items-center gap-4 flex-wrap">
                <a href="/dashboard" className="nav-link d-flex align-items-center">
                  <i className="bi bi-speedometer2 me-2"></i>
                  <span>Dashboard</span>
                </a>
                <a href="/exercises" className="nav-link d-flex align-items-center">
                  <i className="bi bi-dumbbell me-2"></i>
                  <span>Вправи</span>
                </a>
                <a href="/workouts" className="nav-link fw-bold d-flex align-items-center">
                  <i className="bi bi-calendar-check me-2"></i>
                  <span>Тренування</span>
                </a>
                <a href="/calculators" className="nav-link d-flex align-items-center">
                  <i className="bi bi-calculator me-2"></i>
                  <span>Калькулятори</span>
                </a>
              </div>
            </div>
          </Container>
        </nav>

        <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
          <ParallaxWrapper speed={0.2}>
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
          </ParallaxWrapper>

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
            <ParallaxWrapper speed={0.1}>
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
            </ParallaxWrapper>
          )}
        </Container>

        {/* Footer */}
        <footer className="mt-5 py-5" style={{ position: 'relative', zIndex: 1, borderTop: '2px solid rgba(212, 175, 55, 0.2)' }}>
          <Container>
            <Row className="g-4">
              <Col md={4}>
                <div className="d-flex align-items-center mb-3">
                  <GymLogo />
                  <span className="ms-2" style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '3px', fontSize: '1.5rem', color: '#d4af37' }}>КИШЕНЬКОВИЙ ТРЕНЕР</span>
                </div>
                <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>
                  Персональний фітнес-помічник для відстеження тренувань, аналізу прогресу та досягнення ваших цілей
                </p>
              </Col>
              <Col md={4}>
                <h5 className="mb-3" style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37' }}>Навігація</h5>
                <ul style={{ listStyle: 'none', padding: 0, color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>
                  <li className="mb-2">
                    <a href="/dashboard" style={{ color: '#888', textDecoration: 'none' }}>Dashboard</a>
                  </li>
                  <li className="mb-2">
                    <a href="/exercises" style={{ color: '#888', textDecoration: 'none' }}>База вправ</a>
                  </li>
                  <li className="mb-2">
                    <a href="/workouts" style={{ color: '#888', textDecoration: 'none' }}>Тренування</a>
                  </li>
                  <li className="mb-2">
                    <a href="/calculators" style={{ color: '#888', textDecoration: 'none' }}>Калькулятори</a>
                  </li>
                </ul>
              </Col>
              <Col md={4}>
                <h5 className="mb-3" style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37' }}>Розробка</h5>
                <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.9rem' }}>
                  Освітній проект<br />
                  2024
                </p>
              </Col>
            </Row>
            <hr style={{ borderColor: 'rgba(212, 175, 55, 0.2)', margin: '2rem 0 1rem' }} />
            <div className="text-center" style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.9rem' }}>
              © 2024 Кишеньковий тренер. Всі права захищено.
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
}

