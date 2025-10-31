'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Badge } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';

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
      <div className="min-h-screen bg-light">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-bottom">
          <Container>
            <div className="d-flex justify-content-between align-items-center py-3 flex-wrap">
              <a href="/dashboard" className="fw-bold fs-4 text-gradient text-decoration-none">
                Кишеньковий тренер
              </a>
              <div className="d-flex align-items-center gap-3 flex-wrap">
                <a href="/exercises" className="text-decoration-none text-dark">
                  <i className="bi bi-dumbbell me-1"></i>
                  Вправи
                </a>
                <a href="/workouts" className="text-decoration-none text-dark">
                  <i className="bi bi-calendar-check me-1"></i>
                  Тренування
                </a>
                <a href="/calculators" className="text-decoration-none text-dark">
                  <i className="bi bi-calculator me-1"></i>
                  Калькулятори
                </a>
              </div>
            </div>
          </Container>
        </nav>

        <Container className="py-5">
          <div className="mb-4">
            <h1 className="display-4 fw-bold mb-2">Dashboard</h1>
            <p className="lead text-muted">Ваш щоденний огляд та прогрес</p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : stats ? (
            <>
              {/* Stats Overview Cards */}
              <Row className="g-4 mb-4">
                <Col md={3} sm={6}>
                  <Card className="border-0 shadow-sm h-100 card-hover-lift">
                    <Card.Body className="text-center p-4">
                      <div className="display-4 fw-bold text-primary mb-2">{stats.totalWorkouts || 0}</div>
                      <div className="text-muted fw-semibold">Всього тренувань</div>
                      <small className="text-muted">За 30 днів</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6}>
                  <Card className="border-0 shadow-sm h-100 card-hover-lift" style={{ borderTop: '3px solid #10b981' }}>
                    <Card.Body className="text-center p-4">
                      <div className="display-4 fw-bold text-success mb-2">
                        {stats.workoutStreak || 0}
                      </div>
                      <div className="text-muted fw-semibold">Днів підряд</div>
                      <small className="text-muted">Серія</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6}>
                  <Card className="border-0 shadow-sm h-100 card-hover-lift" style={{ borderTop: '3px solid #f59e0b' }}>
                    <Card.Body className="text-center p-4">
                      <div className="display-4 fw-bold text-warning mb-2">
                        {stats.avgRating?.toFixed(1) || '0'}
                      </div>
                      <div className="text-muted fw-semibold">Середня оцінка</div>
                      <small className="text-muted">З 5.0</small>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3} sm={6}>
                  <Card className="border-0 shadow-sm h-100 card-hover-lift" style={{ borderTop: '3px solid #06b6d4' }}>
                    <Card.Body className="text-center p-4">
                      <div className="display-4 fw-bold text-info mb-2">
                        {Math.round(stats.avgDuration || 0)}
                      </div>
                      <div className="text-muted fw-semibold">Хвилин в середньому</div>
                      <small className="text-muted">На тренування</small>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Weekly and Monthly Comparison */}
              <Row className="g-4 mb-4">
                <Col md={6}>
                  <Card className="border-0 shadow-sm h-100 card-hover-lift">
                    <Card.Body className="p-4">
                      <h5 className="fw-bold mb-3">
                        <i className="bi bi-calendar-week me-2 text-primary"></i>
                        Статистика за тиждень
                      </h5>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted fw-semibold">Тренувань:</span>
                        <Badge bg="primary" className="fs-6 px-3 py-2">{stats.weekWorkouts || 0}</Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted fw-semibold">Середня тривалість:</span>
                        <span className="fw-bold text-primary">{Math.round(stats.weekAvgDuration || 0)} хв</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={6}>
                  <Card className="border-0 shadow-sm h-100 card-hover-lift">
                    <Card.Body className="p-4">
                      <h5 className="fw-bold mb-3">
                        <i className="bi bi-calendar-month me-2 text-success"></i>
                        Статистика за місяць
                      </h5>
                      <div className="d-flex justify-content-between align-items-center mb-3">
                        <span className="text-muted fw-semibold">Тренувань:</span>
                        <Badge bg="success" className="fs-6 px-3 py-2">{stats.monthWorkouts || 0}</Badge>
                      </div>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="text-muted fw-semibold">Середня тривалість:</span>
                        <span className="fw-bold text-success">{Math.round(stats.monthAvgDuration || 0)} хв</span>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Most Exercised & Exercise Types */}
              <Row className="g-4 mb-4">
                <Col lg={6}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <h5 className="fw-bold mb-3">
                        <i className="bi bi-trophy me-2"></i>
                        Найчастіші вправи
                      </h5>
                      {stats.mostExercised && stats.mostExercised.length > 0 ? (
                        <div className="list-group list-group-flush">
                          {stats.mostExercised.map((ex, idx) => (
                            <div key={idx} className="list-group-item px-0 d-flex justify-content-between align-items-center">
                              <div>
                                <Badge bg="primary" className="me-2">#{idx + 1}</Badge>
                                {ex.exerciseNameUk || ex.exerciseName}
                              </div>
                              <Badge bg="secondary">{ex.count}x</Badge>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <p className="text-muted">Додайте тренування для відображення статистики</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
                <Col lg={6}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body>
                      <h5 className="fw-bold mb-3">
                        <i className="bi bi-pie-chart me-2"></i>
                        Розподіл за типами
                      </h5>
                      {stats.exerciseTypeStats && Object.keys(stats.exerciseTypeStats).length > 0 ? (
                        <div>
                          {Object.entries(stats.exerciseTypeStats).map(([type, count]: [string, any]) => (
                            <div key={type} className="mb-2">
                              <div className="d-flex justify-content-between mb-1">
                                <span>{getTypeLabelUk(type)}</span>
                                <Badge bg={getTypeColor(type)}>{count}</Badge>
                              </div>
                              <div className="progress" style={{ height: '8px' }}>
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
                        <p className="text-muted">Після додавання вправ відобразиться статистика</p>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Recent Activity */}
              {stats.recentWorkouts && stats.recentWorkouts.length > 0 && (
                <Card className="border-0 shadow-sm mb-4">
                  <Card.Body>
                    <h5 className="fw-bold mb-3">
                      <i className="bi bi-clock-history me-2"></i>
                      Останні тренування
                    </h5>
                    <div className="row g-3">
                      {stats.recentWorkouts.map((workout, idx) => (
                        <Col key={idx} md={4} sm={6}>
                          <div className="border rounded p-3">
                            <div className="d-flex justify-content-between align-items-start mb-2">
                              <small className="text-muted">
                                {new Date(workout.date).toLocaleDateString('uk-UA')}
                              </small>
                              {workout.rating && (
                                <Badge bg="warning">{workout.rating}</Badge>
                              )}
                            </div>
                            {workout.duration && (
                              <div className="text-muted">
                                <i className="bi bi-clock me-1"></i>
                                {workout.duration} хв
                              </div>
                            )}
                          </div>
                        </Col>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Quick Actions */}
              <Row className="g-4">
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100 text-center card-hover-lift">
                    <Card.Body className="p-4">
                      <div className="display-3 mb-3">
                        <i className="bi bi-plus-circle-fill text-primary"></i>
                      </div>
                      <h5 className="fw-bold mb-3">Додати тренування</h5>
                      <p className="text-muted mb-3">Записати нове тренування</p>
                      <Button variant="primary" className="w-100" href="/workouts/new">
                        Додати
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100 text-center card-hover-lift">
                    <Card.Body className="p-4">
                      <div className="display-3 mb-3">
                        <i className="bi bi-dumbbell-fill text-secondary"></i>
                      </div>
                      <h5 className="fw-bold mb-3">Перегляд вправ</h5>
                      <p className="text-muted mb-3">Бібліотека вправ</p>
                      <Button variant="outline-primary" className="w-100" href="/exercises">
                        Переглянути
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100 text-center card-hover-lift">
                    <Card.Body className="p-4">
                      <div className="display-3 mb-3">
                        <i className="bi bi-calculator-fill text-info"></i>
                      </div>
                      <h5 className="fw-bold mb-3">Калькулятори</h5>
                      <p className="text-muted mb-3">Розрахувати показники</p>
                      <Button variant="outline-primary" className="w-100" href="/calculators">
                        Розрахувати
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </>
          ) : (
            <Card className="border-0 shadow-sm">
              <Card.Body className="text-center py-5">
                <div className="display-3 mb-4">
                  <i className="bi bi-emoji-smile text-primary"></i>
                </div>
                <h3 className="fw-bold mb-3">Вітаємо!</h3>
                <p className="text-muted mb-4">Додайте перше тренування та почніть відстежувати свій прогрес</p>
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
