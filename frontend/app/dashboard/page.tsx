'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Button, Card, Spinner, Badge } from 'react-bootstrap';
import { LineChart, Line, AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import BootstrapClient from '../components/BootstrapClient';
import GymPostersBackground from '../components/GymPostersBackground';
import GymLogo from '../components/GymLogo';
import { api } from '../lib/api';

interface Stats {
  totalWorkouts: number;
  avgDuration: number;
  avgRating: number;
  mostExercised: any[];
  weekWorkouts: number;
  weekAvgDuration: number;
  prevWeekWorkouts?: number;
  prevWeekAvgDuration?: number;
  monthWorkouts: number;
  monthAvgDuration: number;
  prevMonthWorkouts?: number;
  prevMonthAvgDuration?: number;
  workoutStreak: number;
  exerciseTypeStats: { [key: string]: number };
  recentWorkouts: any[];
  workoutsPerWeek?: { [key: string]: number };
  achievements?: Achievement[];
  weeklyChartData?: any[];
}

interface Achievement {
  id: string;
  name: string;
  nameUk: string;
  description: string;
  descriptionUk: string;
  icon: string;
  unlocked: boolean;
  unlockedAt?: string;
}

export default function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const statsData = await api.getWorkoutStats(30);
      setStats(statsData as Stats);
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
      <div className="min-h-screen bg-dark d-flex flex-column">
        {/* Gym Posters Background */}
        <GymPostersBackground />
        
        {/* Navigation */}
        <nav className="navbar flex-shrink-0">
          <Container>
            <div className="d-flex justify-content-between align-items-center py-3 w-100">
              <a href="/dashboard" className="fw-bold fs-4 text-decoration-none d-flex align-items-center gap-2">
                <GymLogo />
                <span className="d-none d-md-inline" style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '2px', fontSize: '1.8rem', color: '#d4af37' }}>КИШЕНЬКОВИЙ</span>
                <span className="d-none d-lg-inline" style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '2px', fontSize: '1.8rem', color: '#f5f5f5' }}>ТРЕНЕР</span>
              </a>
              <div className="d-flex align-items-center gap-4" style={{ marginLeft: 'auto' }}>
                <a href="/dashboard" className="nav-link fw-bold d-flex align-items-center">
                  <i className="bi bi-speedometer2 me-2"></i>
                  <span>Панель</span>
                </a>
                <a href="/workouts" className="nav-link d-flex align-items-center">
                  <i className="bi bi-calendar-check me-2"></i>
                  <span>Тренування</span>
                </a>
                <a href="/nutrition" className="nav-link d-flex align-items-center">
                  <i className="bi bi-apple me-2"></i>
                  <span>Щоденник харчування</span>
                </a>
                <a href="/calculators" className="nav-link d-flex align-items-center">
                  <i className="bi bi-calculator me-2"></i>
                  <span>Калькулятори</span>
                </a>
                <a href="/profile" className="nav-link d-flex align-items-center">
                  <i className="bi bi-person-circle me-2"></i>
                  <span>Профіль</span>
                </a>
                <a href="/about" className="nav-link d-flex align-items-center">
                  <i className="bi bi-info-circle me-2"></i>
                  <span>Про проект</span>
                </a>
              </div>
            </div>
          </Container>
        </nav>

        <main className="flex-grow-1" style={{ position: 'relative' }}>
        <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
          <div className="mb-4">
            <h1 className="mb-2">Панель керування</h1>
            <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>Ваш щоденний огляд та прогрес</p>
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
                    <Card className="card-hover-lift h-100">
                      <Card.Body className="text-center p-4">
                        <div className="gold-number animate-pulse">{stats.totalWorkouts || 0}</div>
                        <div className="fw-semibold" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)', fontSize: '1.1rem' }}>Всього тренувань</div>
                        <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>За 30 днів</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3} sm={6}>
                    <Card className="card-hover-lift h-100">
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
                    <Card className="card-hover-lift h-100">
                      <Card.Body className="text-center p-4">
                        <div className="gold-number">
                          {stats.avgRating?.toFixed(1) || '0'}
                        </div>
                        <div className="fw-semibold" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)', fontSize: '1.1rem' }}>Середня оцінка</div>
                        <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>З 5.0</small>
                      </Card.Body>
                    </Card>
                  </Col>
                  <Col md={3} sm={6}>
                    <Card className="card-hover-lift h-100">
                      <Card.Body className="text-center p-4">
                        <div className="gold-number">
                          {Math.round(stats.avgDuration || 0)}
                        </div>
                        <div className="fw-semibold" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)', fontSize: '1.1rem' }}>Хвилин в середньому</div>
                        <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>На тренування</small>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

              {/* Weekly and Monthly Comparison */}
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
                          <div className="d-flex align-items-center gap-2">
                            <Badge bg="primary" className="fs-4 px-3 py-2">{stats.weekWorkouts || 0}</Badge>
                            {stats.prevWeekWorkouts !== undefined && (
                              <small style={{ color: stats.weekWorkouts >= stats.prevWeekWorkouts ? '#198754' : '#dc3545', fontFamily: 'var(--font-oswald)', fontWeight: 600 }}>
                                {stats.weekWorkouts >= stats.prevWeekWorkouts ? '↑' : '↓'} {Math.abs((stats.weekWorkouts || 0) - (stats.prevWeekWorkouts || 0))}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)', fontWeight: 600 }}>Середня тривалість:</span>
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold" style={{ color: '#d4af37', fontSize: '1.2rem' }}>{Math.round(stats.weekAvgDuration || 0)} хв</span>
                            {stats.prevWeekAvgDuration !== undefined && (
                              <small style={{ color: stats.weekAvgDuration >= stats.prevWeekAvgDuration ? '#198754' : '#dc3545', fontFamily: 'var(--font-oswald)', fontWeight: 600 }}>
                                {stats.weekAvgDuration >= stats.prevWeekAvgDuration ? '↑' : '↓'} {Math.abs(Math.round((stats.weekAvgDuration || 0) - (stats.prevWeekAvgDuration || 0)))}
                              </small>
                            )}
                          </div>
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
                          <div className="d-flex align-items-center gap-2">
                            <Badge bg="warning" className="fs-4 px-3 py-2">{stats.monthWorkouts || 0}</Badge>
                            {stats.prevMonthWorkouts !== undefined && (
                              <small style={{ color: stats.monthWorkouts >= stats.prevMonthWorkouts ? '#198754' : '#dc3545', fontFamily: 'var(--font-oswald)', fontWeight: 600 }}>
                                {stats.monthWorkouts >= stats.prevMonthWorkouts ? '↑' : '↓'} {Math.abs((stats.monthWorkouts || 0) - (stats.prevMonthWorkouts || 0))}
                              </small>
                            )}
                          </div>
                        </div>
                        <div className="d-flex justify-content-between align-items-center">
                          <span style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)', fontWeight: 600 }}>Середня тривалість:</span>
                          <div className="d-flex align-items-center gap-2">
                            <span className="fw-bold" style={{ color: '#d4af37', fontSize: '1.2rem' }}>{Math.round(stats.monthAvgDuration || 0)} хв</span>
                            {stats.prevMonthAvgDuration !== undefined && (
                              <small style={{ color: stats.monthAvgDuration >= stats.prevMonthAvgDuration ? '#198754' : '#dc3545', fontFamily: 'var(--font-oswald)', fontWeight: 600 }}>
                                {stats.monthAvgDuration >= stats.prevMonthAvgDuration ? '↑' : '↓'} {Math.abs(Math.round((stats.monthAvgDuration || 0) - (stats.prevMonthAvgDuration || 0)))}
                              </small>
                            )}
                          </div>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>

              {/* Most Exercised & Exercise Types */}
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

              {/* Weekly Progress Chart */}
              {stats.weeklyChartData && stats.weeklyChartData.length > 0 && (
                <Card className="card-hover-lift mb-4">
                  <Card.Body>
                    <h5 className="mb-3">
                      <i className="bi bi-graph-up me-2" style={{ color: '#d4af37' }}></i>
                      Прогрес за тижні
                    </h5>
                    <ResponsiveContainer width="100%" height={250}>
                      <AreaChart data={stats.weeklyChartData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#444" />
                        <XAxis 
                          dataKey="week" 
                          stroke="#d4af37"
                          style={{ fontFamily: 'var(--font-roboto-condensed)' }}
                        />
                        <YAxis 
                          stroke="#d4af37"
                          style={{ fontFamily: 'var(--font-roboto-condensed)' }}
                        />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: 'rgba(20, 20, 20, 0.95)', 
                            border: '1px solid #d4af37',
                            borderRadius: '8px'
                          }}
                          labelStyle={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}
                        />
                        <Area 
                          type="monotone" 
                          dataKey="workouts" 
                          stroke="#d4af37" 
                          fill="#d4af37" 
                          fillOpacity={0.3}
                        />
                      </AreaChart>
                    </ResponsiveContainer>
                  </Card.Body>
                </Card>
              )}

              {/* Achievements */}
              {stats.achievements && stats.achievements.length > 0 && (
                <Card className="card-hover-lift mb-4">
                  <Card.Body>
                    <h5 className="mb-3">
                      <i className="bi bi-trophy-fill me-2" style={{ color: '#d4af37' }}></i>
                      Досягнення
                    </h5>
                    <div className="row g-2">
                      {stats.achievements.map((achievement: Achievement) => (
                        <Col key={achievement.id} md={4} sm={6}>
                          <div 
                            className="p-3 rounded"
                            style={{ 
                              background: achievement.unlocked 
                                ? 'rgba(212, 175, 55, 0.15)' 
                                : 'rgba(128, 128, 128, 0.1)',
                              border: achievement.unlocked 
                                ? '2px solid #d4af37' 
                                : '2px solid #444',
                              opacity: achievement.unlocked ? 1 : 0.5,
                              transition: 'all 0.3s'
                            }}
                          >
                            <div className="d-flex align-items-center gap-2 mb-1">
                              <span style={{ fontSize: '1.5rem', filter: achievement.unlocked ? 'none' : 'grayscale(100%)' }}>
                                {achievement.icon}
                              </span>
                              <h6 className="mb-0" style={{ 
                                fontFamily: 'var(--font-oswald)', 
                                color: achievement.unlocked ? '#d4af37' : '#666'
                              }}>
                                {achievement.unlocked ? achievement.nameUk : '???'}
                              </h6>
                            </div>
                            <small style={{ 
                              color: achievement.unlocked ? '#aaa' : '#666',
                              fontFamily: 'var(--font-roboto-condensed)'
                            }}>
                              {achievement.unlocked ? achievement.descriptionUk : 'Ще не розблоковано'}
                            </small>
                          </div>
                        </Col>
                      ))}
                    </div>
                  </Card.Body>
                </Card>
              )}

              {/* Recent Activity */}
              {stats.recentWorkouts && stats.recentWorkouts.length > 0 && (
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
              )}

                             {/* Quick Actions */}
               <Row className="g-3">
                   <Col md={4}>
                     <Card className="card-hover-lift">
                       <Card.Body className="p-4 text-center">
                         <div className="display-1 mb-3" style={{ color: '#d4af37' }}>
                           <i className="bi bi-plus-circle-fill"></i>
                         </div>
                         <h5 className="mb-3">Додати тренування</h5>
                         <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }} className="mb-3">Записати нове тренування</p>
                         <Button variant="outline-primary" className="w-100" href="/workouts/new">
                           Додати
                         </Button>
                       </Card.Body>
                     </Card>
                   </Col>
                   <Col md={4}>
                     <Card className="card-hover-lift">
                       <Card.Body className="p-4 text-center">
                         <div className="display-1 mb-3" style={{ color: '#d4af37' }}>
                           <i className="bi bi-apple"></i>
                         </div>
                         <h5 className="mb-3">Додати їжу</h5>
                         <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }} className="mb-3">Записати прийом їжі</p>
                         <Button variant="outline-primary" className="w-100" href="/nutrition/new">
                           Додати
                         </Button>
                       </Card.Body>
                     </Card>
                   </Col>
                   <Col md={4}>
                     <Card className="card-hover-lift">
                       <Card.Body className="p-4 text-center">
                         <div className="display-1 mb-3" style={{ color: '#d4af37' }}>
                           <i className="bi bi-calculator-fill"></i>
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
