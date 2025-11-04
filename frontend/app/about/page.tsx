'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import GymPostersBackground from '../components/GymPostersBackground';
import GymLogo from '../components/GymLogo';
import { api } from '../lib/api';

export default function AboutPage() {
  const [stats, setStats] = useState<any>(null);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const data = await api.getExerciseOptions();
      setStats(data);
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  return (
    <>
      <BootstrapClient />
      <div className="min-h-screen bg-dark d-flex flex-column">
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
                <a href="/dashboard" className="nav-link d-flex align-items-center">
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
                <a href="/about" className="nav-link fw-bold d-flex align-items-center">
                  <i className="bi bi-info-circle me-2"></i>
                  <span>Про проект</span>
                </a>
              </div>
            </div>
          </Container>
        </nav>

        <main className="flex-grow-1" style={{ position: 'relative' }}>
          <Container className="py-5" style={{ position: 'relative', zIndex: 1, maxWidth: '1200px' }}>
            {/* Hero */}
            <div className="text-center mb-5">
              <h1 style={{ fontFamily: 'var(--font-bebas)', fontSize: '4rem', color: '#d4af37', marginBottom: '1rem' }}>
                ПРО ПРОЕКТ
              </h1>
              <p className="lead" style={{ color: '#aaa', fontFamily: 'var(--font-oswald)', fontSize: '1.3rem' }}>
                Ваш персональний фітнес-помічник нового покоління
              </p>
            </div>

            {/* Statistics */}
            {stats && (
              <Row className="g-4 mb-5">
                <Col md={4}>
                  <Card className="card-hover-lift text-center h-100" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                    <Card.Body className="p-4">
                      <div className="display-3 mb-3" style={{ color: '#d4af37' }}>
                        <i className="bi bi-dumbbell"></i>
                      </div>
                      <h2 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '0.5rem' }}>
                        {stats.totalExercises || '700+'}
                      </h2>
                      <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)' }}>
                        Вправ у базі даних
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="card-hover-lift text-center h-100" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                    <Card.Body className="p-4">
                      <div className="display-3 mb-3" style={{ color: '#d4af37' }}>
                        <i className="bi bi-list-check"></i>
                      </div>
                      <h2 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '0.5rem' }}>
                        {stats.types?.length || '4'}
                      </h2>
                      <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)' }}>
                        Типів тренувань
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
                <Col md={4}>
                  <Card className="card-hover-lift text-center h-100" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                    <Card.Body className="p-4">
                      <div className="display-3 mb-3" style={{ color: '#d4af37' }}>
                        <i className="bi bi-collection"></i>
                      </div>
                      <h2 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '0.5rem' }}>
                        {stats.muscleGroups?.length || '7'}
                      </h2>
                      <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)' }}>
                        Груп м'язів
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            )}

            {/* Features */}
            <Row className="mb-5">
              <Col>
                <h2 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '2rem', textAlign: 'center', fontSize: '2.5rem' }}>
                  Ключові можливості
                </h2>
              </Col>
            </Row>

            <Row className="g-4 mb-5">
              <Col md={6}>
                <Card className="card-hover-lift h-100" style={{ borderLeft: '4px solid #d4af37' }}>
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-start gap-3">
                      <div className="fs-2" style={{ color: '#d4af37' }}>
                        <i className="bi bi-database"></i>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>
                          Велика база вправ
                        </h4>
                        <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.7' }}>
                          Інтеграція з <strong>Wger API</strong> забезпечує доступ до <strong>700+ вправ</strong> з офіційної бази даних. 
                          Кожна вправа містить детальні інструкції, фото, відео, поради та застереження.
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="card-hover-lift h-100" style={{ borderLeft: '4px solid #d4af37' }}>
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-start gap-3">
                      <div className="fs-2" style={{ color: '#d4af37' }}>
                        <i className="bi bi-funnel"></i>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>
                          Інтелектуальний пошук
                        </h4>
                        <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.7' }}>
                          Потужна система фільтрації за типом, групою м'язів, інвентарем, рівнем складності, 
                          місцем виконання та метою. Знаходьте ідеальні вправи за секунди.
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="card-hover-lift h-100" style={{ borderLeft: '4px solid #d4af37' }}>
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-start gap-3">
                      <div className="fs-2" style={{ color: '#d4af37' }}>
                        <i className="bi bi-journal-text"></i>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>
                          Програми тренувань
                        </h4>
                        <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.7' }}>
                          Автоматичне створення персоналізованих програм на основі ваших цілей, рівня підготовки 
                          та кількості тренувань на тиждень. Розділення по днях для оптимального навантаження.
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>

              <Col md={6}>
                <Card className="card-hover-lift h-100" style={{ borderLeft: '4px solid #d4af37' }}>
                  <Card.Body className="p-4">
                    <div className="d-flex align-items-start gap-3">
                      <div className="fs-2" style={{ color: '#d4af37' }}>
                        <i className="bi bi-graph-up"></i>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>
                          Детальна статистика
                        </h4>
                        <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.7' }}>
                          Візуалізація прогресу через графіки, порівняння з попередніми періодами, 
                          система досягнень та ачивок для мотивації.
                        </p>
                      </div>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Technologies */}
            <Row className="mb-5">
              <Col>
                <h2 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '2rem', textAlign: 'center', fontSize: '2.5rem' }}>
                  Технології
                </h2>
              </Col>
            </Row>

            <Row className="g-3 mb-5">
              {[
                { icon: 'bi-braces', name: 'Next.js 14', desc: 'Frontend фреймворк' },
                { icon: 'bi-cpu', name: 'Express.js', desc: 'Backend API' },
                { icon: 'bi-database', name: 'PostgreSQL', desc: 'База даних' },
                { icon: 'bi-code-slash', name: 'Prisma ORM', desc: 'Управління даними' },
                { icon: 'bi-cloud-download', name: 'Wger API', desc: 'База вправ' },
                { icon: 'bi-palette', name: 'Bootstrap 5', desc: 'UI дизайн' }
              ].map((tech, idx) => (
                <Col key={idx} md={4} sm={6}>
                  <Card className="card-hover-lift h-100 text-center" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                    <Card.Body className="p-3">
                      <div className="fs-3 mb-2" style={{ color: '#d4af37' }}>
                        <i className={`bi ${tech.icon}`}></i>
                      </div>
                      <h6 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37' }}>{tech.name}</h6>
                      <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>{tech.desc}</small>
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>

            {/* Data Sources */}
            <Row className="mb-5">
              <Col>
                <Card className="card-hover-lift" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
                  <Card.Body className="p-4">
                    <h3 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1.5rem', textAlign: 'center' }}>
                      Джерела даних
                    </h3>
                    <Row className="g-4">
                      <Col md={6}>
                        <div className="d-flex align-items-start gap-3">
                          <div className="fs-3" style={{ color: '#d4af37' }}>
                            <i className="bi bi-cloud-arrow-down"></i>
                          </div>
                          <div>
                            <h5 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '0.5rem' }}>
                              Wger.de API
                            </h5>
                            <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.7' }}>
                              Відкритий джерела даних про вправи з офіційної бази Workout Manager. 
                              Автоматична синхронізація забезпечує актуальність контенту.
                            </p>
                            <Badge style={{ background: '#198754', color: 'white' }}>Офіційне API</Badge>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex align-items-start gap-3">
                          <div className="fs-3" style={{ color: '#d4af37' }}>
                            <i className="bi bi-check-circle"></i>
                          </div>
                          <div>
                            <h5 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '0.5rem' }}>
                              Верифіковані дані
                            </h5>
                            <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.7' }}>
                              Всі вправи проходять мапування та валідацію для забезпечення якості 
                              контенту та коректної української локалізації.
                            </p>
                            <Badge style={{ background: '#0d6efd', color: 'white' }}>Перевірено</Badge>
                          </div>
                        </div>
                      </Col>
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Project Info */}
            <Row>
              <Col>
                <Card className="card-hover-lift">
                  <Card.Body className="p-4">
                    <h3 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1.5rem', textAlign: 'center' }}>
                      Про проект
                    </h3>
                    <div style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.8', maxWidth: '800px', margin: '0 auto' }}>
                      <p className="mb-3">
                        <strong>"Кишеньковий тренер"</strong> - це дипломна робота, присвячена дослідженню 
                        можливостей інтеграції штучного інтелекту та сучасних веб-технологій у сферу фітнесу 
                        та здорового способу життя.
                      </p>
                      <p className="mb-3">
                        Проект реалізує комплексний підхід до управління тренуваннями, включаючи автоматичне 
                        створення програм, відстеження прогресу та персоналізовані рекомендації.
                      </p>
                      <p className="mb-0">
                        Усі дані користувачів зберігаються локально. Проект має освітній характер та 
                        демонструє можливості сучасних технологій у fitness-індустрії.
                      </p>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            </Row>
          </Container>
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 py-3" style={{ position: 'relative', zIndex: 100, borderTop: '2px solid rgba(212, 175, 55, 0.2)' }}>
          <Container>
            <div className="text-center" style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.85rem' }}>
              © 2024 Кишеньковий тренер. Освітній проект
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
}

