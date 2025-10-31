'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Button, Card, Spinner } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';

interface Stats {
  totalWorkouts: number;
  avgDuration: number;
  avgRating: number;
  mostExercised: any[];
}

export default function DashboardPage() {
  const router = useRouter();
  const [user, setUser] = useState<any>(null);
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const userStr = localStorage.getItem('user');
    const token = localStorage.getItem('token');
    
    if (userStr) {
      setUser(JSON.parse(userStr));
      if (token) {
        fetchDashboardData(token);
      }
    } else {
      router.push('/login');
    }
  }, []);

  const fetchDashboardData = async (token: string) => {
    try {
      const res = await fetch('http://localhost:5000/api/workouts/stats', {
        headers: { 'Authorization': `Bearer ${token}` }
      });

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

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    router.push('/');
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
                <span className="text-muted">|</span>
                <span className="text-muted">{user?.name || user?.email}</span>
                <Button 
                  variant="outline-secondary" 
                  size="sm"
                  onClick={handleLogout}
                >
                  Вийти
                </Button>
              </div>
            </div>
          </Container>
        </nav>

        <Container className="py-5">
          <div className="mb-4">
            <h1 className="display-4 fw-bold mb-2">Dashboard</h1>
            <p className="lead text-muted">Ваш щоденний огляд</p>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : stats ? (
            <>
              {/* Stats Cards */}
              <Row className="g-4 mb-5">
                <Col md={3}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="text-center">
                      <div className="display-4 fw-bold text-primary mb-2">{stats.totalWorkouts || 0}</div>
                      <div className="text-muted">Тренувань</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="text-center">
                      <div className="display-4 fw-bold text-success mb-2">{Math.round(stats.avgDuration || 0)}</div>
                      <div className="text-muted">Хвилин в середньому</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="text-center">
                      <div className="display-4 fw-bold text-warning mb-2">{stats.avgRating?.toFixed(1) || '0'}</div>
                      <div className="text-muted">Оцінка</div>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={3}>
                  <Card className="border-0 shadow-sm h-100">
                    <Card.Body className="text-center">
                      <div className="display-4 fw-bold text-info mb-2">{stats.mostExercised?.length || 0}</div>
                      <div className="text-muted">Вправ</div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>

              {/* Quick Actions */}
              <Row className="g-4">
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100 text-center">
                    <Card.Body className="p-4">
                      <div className="display-1 mb-3">➕</div>
                      <h5 className="fw-bold mb-3">Додати тренування</h5>
                      <p className="text-muted mb-3">Записати нове тренування</p>
                      <Button variant="primary" className="w-100" href="/workouts/new">
                        Додати
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100 text-center">
                    <Card.Body className="p-4">
                      <div className="display-1 mb-3">💪</div>
                      <h5 className="fw-bold mb-3">Перегляд вправ</h5>
                      <p className="text-muted mb-3">Бібліотека вправ</p>
                      <Button variant="outline-primary" className="w-100" href="/exercises">
                        Переглянути
                      </Button>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="border-0 shadow-sm h-100 text-center">
                    <Card.Body className="p-4">
                      <div className="display-1 mb-3">📊</div>
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
                <div className="display-1 mb-4">👋</div>
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

