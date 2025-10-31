'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Badge } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import ParallaxWrapper from '../components/ParallaxWrapper';
import GymPostersBackground from '../components/GymPostersBackground';

interface Stats {
  totalWorkouts: number;
  avgDuration: number;
  avgRating: number;
  mostExercised: any[];
  weekWorkouts: number;
  weekAvgDuration: number;
  monthWorkouts: number;
  monthAvgDuration: number;
  workoutStreak: number;
  exerciseTypeStats: { [key: string]: number };
  recentWorkouts: any[];
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/workouts/stats?days=30');

      if (res.ok) {
        const statsData = await res.json();
        setStats(statsData);
      }
    } catch (error) {
      console.error('Error fetching dashboard:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      strength: 'primary',
      cardio: 'danger',
      flexibility: 'success',
      balance: 'warning'
    };
    return colors[type] || 'secondary';
  };

  const getTypeLabelUk = (type: string) => {
    const labels: { [key: string]: string } = {
      strength: 'Сила',
      cardio: 'Кардіо',
      flexibility: 'Гнучкість',
      balance: 'Баланс'
    };
    return labels[type] || type;
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
            <div className="d-flex justify-content-between align-items-center py-3 flex-wrap">
              <a href="/dashboard" className="fw-bold fs-4 text-gradient text-decoration-none">
                Кишеньковий тренер
              </a>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <a href="/exercises" className="nav-link">
                  <i className="bi bi-dumbbell me-1"></i>
                  Вправи
                </a>
                <a href="/workouts" className="nav-link">
                  <i className="bi bi-calendar-check me-1"></i>
                  Тренування
                </a>
                <a href="/calculators" className="nav-link">
                  <i className="bi bi-calculator me-1"></i>
                  Калькулятори
                </a>
              </div>
            </div>
          </Container>
        </nav>

        <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
          <ParallaxWrapper speed={0.2}>
            <div className="mb-4">
              <h1 className="mb-2">Dashboard</h1>
              <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>Ваш щоденний огляд та прогрес</p>
            </div>
          </ParallaxWrapper>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : stats ? (
            <>
              {/* Stats Overview Cards */}
              <ParallaxWrapper speed={0.1}>
                <Row className="g-4 mb-4">
                  <Col md={3} sm={6}>
                    <Card className="card-hover-lift h-100">
                      <Card.Body className="text-center p-4">
                        <div className="gold-number animate-pulse">{stats.totalWorkouts || 0}</div>
                        <div className="fw-semibold" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)', fontSize: '1.1rem' }}>Всього тренувань</div>
                        <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>За 30 днів</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3} sm={6}>
                    <Card className="card-hover-lift h-100" style={{ borderTop: '4px solid #d4af37' }}>
                      <Card.Body className="text-center p-4">
                        <div className="gold-number animate-gold-glow">
                          {stats.workoutStreak || 0}
                        </div>
                        <div className="fw-semibold" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)', fontSize: '1.1rem' }}>Днів підряд</div>
                        <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Серія</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3} sm={6}>
                    <Card className="card-hover-lift h-100" style={{ borderTop: '4px solid #c0c0c0' }}>
                      <Card.Body className="text-center p-4">
                        <div className="gold-number" style={{ color: '#c0c0c0' }}>
                          {stats.avgRating?.toFixed(1) || '0'}
                        </div>
                        <div className="fw-semibold" style={{ color: '#c0c0c0', fontFamily: 'var(--font-oswald)', fontSize: '1.1rem' }}>Середня оцінка</div>
                        <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>З 5.0</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3} sm={6}>
                    <Card className="card-hover-lift h-100" style={{ borderTop: '4px solid #cd7f32' }}>
                      <Card.Body className="text-center p-4">
                        <div className="gold-number" style={{ color: '#cd7f32' }}>
                          {Math.round(stats.avgDuration || 0)}
                        </div>
                        <div className="fw-semibold" style={{ color: '#cd7f32', fontFamily: 'var(--font-oswald)', fontSize: '1.1rem' }}>Хвилин в середньому</div>
                        <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>На тренування</small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </ParallaxWrapper>

              {/* Weekly and Monthly Comparison */}
              <ParallaxWrapper speed={0.15}>
                <Row className="g-4 mb-4">
                  <Col md={6}>
                    <Card className="card-hover-lift h-100">
                      <Card.Body className="p-4">
                        <h5 className="mb-3">
                          <i className="bi bi-calendar-week me-2" style={{ color: '#d4af37' }}></i>
                          Статистика за тиждень
                        </h5>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)', fontWeight: 600 }}>Тренувань:</span>
                          <Badge bg="primary" className="fs-4 px-3 py-2">{stats.weekWorkouts || 0}</Badge>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)', fontWeight: 600 }}>Середня тривалість:</span>
                          <span className="fw-bold" style={{ color: '#d4af37', fontSize: '1.2rem' }}>{Math.round(stats.weekAvgDuration || 0)} хв</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={6}>
                    <Card className="card-hover-lift h-100">
                      <Card.Body className="p-4">
                        <h5 className="mb-3">
                          <i className="bi bi-calendar-month me-2" style={{ color: '#d4af37' }}></i>
                          Статистика за місяць
                        </h5>
                        <div className="d-flex justify-content-between align-items-center mb-3">
                          <span style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)', fontWeight: 600 }}>Тренувань:</span>
                          <Badge bg="warning" className="fs-4 px-3 py-2">{stats.monthWorkouts || 0}</Badge>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)', fontWeight: 600 }}>Середня тривалість:</span>
                          <span className="fw-bold" style={{ color: '#d4af37', fontSize: '1.2rem' }}>{Math.round(stats.monthAvgDuration || 0)} хв</span>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </ParallaxWrapper>

              {/* Most Exercised & Exercise Types */}
              <ParallaxWrapper speed={0.12}>
                <Row className="g-4 mb-4">
                  <Col lg={6}>
                    <Card className="card-hover-lift h-100">
                      <Card.Body>
                        <h5 className="mb-3">
                          <i className="bi bi-trophy me-2" style={{ color: '#d4af37' }}></i>
                          Найчастіші вправи
                        </h5>
                        {stats.mostExercised && stats.mostExercised.length > 0 ? (
                          <div className="list-group list-group-flush">
                            {stats.mostExercised.map((ex, idx) => (
                              <div key={idx} className="list-group-item px-0 d-flex justify-content-between align-items-center border-bottom border-secondary">
                                <div style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5' }}>
                                  <Badge bg="primary" className="me-2">#{idx + 1}</Badge>
                                  {ex.exerciseNameUk || ex.exerciseName}
                                </div>
                                <Badge bg="warning">{ex.count}x</Badge>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Додайте тренування для відображення статистики</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col lg={6}>
                    <Card className="card-hover-lift h-100">
                      <Card.Body>
                        <h5 className="mb-3">
                          <i className="bi bi-pie-chart me-2" style={{ color: '#d4af37' }}></i>
                          Розподіл за типами
                        </h5>
                        {stats.exerciseTypeStats && Object.keys(stats.exerciseTypeStats).length > 0 ? (
                          <div>
                            {Object.entries(stats.exerciseTypeStats).map(([type, count]: [string, any]) => (
                              <div key={type} className="mb-2">
                                <div className="d-flex justify-content-between mb-1">
                                  <span style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5' }}>{getTypeLabelUk(type)}</span>
                                  <Badge bg={getTypeColor(type)}>{count}</Badge>
                                </div>
                                <div className="progress">
                                  <div 
                                    className={`bg-${getTypeColor(type)}`}
                                    style={{ 
                                      width: `${(count / Object.values(stats.exerciseTypeStats).reduce((a: any, b: any) => a + b, 0)) * 100}%` 
                                    }}
                                  ></div>
                                </div>
                              </div>
                            ))}
                          </div>
                        ) : (
                          <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Після додавання вправ відобразиться статистика</p>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </ParallaxWrapper>

              {/* Recent Activity */}
              {stats.recentWorkouts && stats.recentWorkouts.length > 0 && (
                <ParallaxWrapper speed={0.12}>
                  <Card className="card-hover-lift mb-4">
                    <Card.Body>
                      <h5 className="mb-3">
                        <i className="bi bi-clock-history me-2" style={{ color: '#d4af37' }}></i>
                        Останні тренування
                      </h5>
                      <div className="row g-3">
                        {stats.recentWorkouts.map((workout, idx) => (
                          <Col key={idx} md={4} sm={6}>
                            <div className="card p-3">
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>
                                  {new Date(workout.date).toLocaleDateString('uk-UA')}
                                </small>
                                {workout.rating && (
                                  <Badge bg="warning">{workout.rating}</Badge>
                                )}
                              </div>
                              {workout.duration && (
                                <div style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>
                                  <i className="bi bi-clock me-1" style={{ color: '#d4af37' }}></i>
                                  {workout.duration} хв
                                </div>
                              )}
                            </div>
                          </Col>
                        ))}
                      </div>
                    </Card.Body>
                  </Card>
                </ParallaxWrapper>
              )}

              {/* Quick Actions */}
              <ParallaxWrapper speed={0.15}>
                <Row className="g-4">
                  <Col md={4}>
                    <Card className="card-hover-lift">
                      <Card.Body className="p-4 text-center">
                        <div className="display-1 mb-3 muscle-icon" style={{ color: '#d4af37' }}>
                          ➕
                        </div>
                        <h5 className="mb-3">Додати тренування</h5>
                        <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }} className="mb-3">Записати нове тренування</p>
                        <Button variant="primary" className="w-100" href="/workouts/new">
                          Додати
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="card-hover-lift">
                      <Card.Body className="p-4 text-center">
                        <div className="display-1 mb-3 muscle-icon" style={{ color: '#c0c0c0' }}>
                          💪
                        </div>
                        <h5 className="mb-3">Перегляд вправ</h5>
                        <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }} className="mb-3">Бібліотека вправ</p>
                        <Button variant="outline-secondary" className="w-100" href="/exercises">
                          Переглянути
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={4}>
                    <Card className="card-hover-lift">
                      <Card.Body className="p-4 text-center">
                        <div className="display-1 mb-3 muscle-icon" style={{ color: '#cd7f32' }}>
                          📊
                        </div>
                        <h5 className="mb-3">Калькулятори</h5>
                        <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }} className="mb-3">Розрахувати показники</p>
                        <Button variant="outline-primary" className="w-100" href="/calculators">
                          Розрахувати
                        </Button>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              </ParallaxWrapper>
            </>
          ) : (
            <Card>
              <Card.Body className="text-center py-5">
                <div className="display-1 mb-4">
                  <i className="bi bi-trophy text-gold animate-lifting"></i>
                </div>
                <h3 className="mb-3">Вітаємо!</h3>
                <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }} className="mb-4">Додайте перше тренування та почніть відстежувати свій прогрес</p>
                <Button variant="primary" size="lg" href="/workouts/new">
                  Додати перше тренування
                </Button>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>
    </>
  );
}
