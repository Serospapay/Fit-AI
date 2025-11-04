'use client';

import { useEffect, useState } from 'react';
import { Container, Row, Col, Card, Badge } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import GymPostersBackground from '../components/GymPostersBackground';
import ModernNavbar from '../components/ModernNavbar';
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
        
        {/* Modern Navigation */}
        <ModernNavbar />

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
              <p style={{ color: '#e0e0e0', fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.9rem', fontWeight: 500, marginTop: '1rem' }}>
                Версія 1.0.0 • Останнє оновлення: Листопад 2024
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
                        <i className="bi bi-journal-text"></i>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>
                          Щоденник тренувань
                        </h4>
                        <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.7' }}>
                          Відстежуйте свої тренування з детальною інформацією про вправи, підходи, повторення та вагу. 
                          Зберігайте нотатки та оцінки для аналізу прогресу.
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
                        <i className="bi bi-apple"></i>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>
                          Щоденник харчування
                        </h4>
                        <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.7' }}>
                          Відстежуйте прийоми їжі та автоматично розраховуйте калорії та макроелементи (білки, вуглеводи, жири). 
                          Аналізуйте своє харчування за періоди.
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
                        <i className="bi bi-person-circle"></i>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>
                          Профіль користувача
                        </h4>
                        <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.7' }}>
                          Зберігайте особисті дані: вік, стать, зріст, вагу, рівень активності та цілі. 
                          Дані використовуються для персоналізації розрахунків та рекомендацій.
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
                        <i className="bi bi-calculator"></i>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>
                          Калькулятори
                        </h4>
                        <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.7' }}>
                          Розраховуйте ІМТ, BMR, TDEE, WHR, оптимальну калорійність та співвідношення БЖУ. 
                          Визначайте пульсові зони та необхідну кількість води.
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
                          система досягнень та ачивок для мотивації. Серія днів підряд (streak).
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
                        <i className="bi bi-palette"></i>
                      </div>
                      <div>
                        <h4 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>
                          Сучасний дизайн
                        </h4>
                        <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.7' }}>
                          Адаптивний інтерфейс з темною темою та золотими акцентами. 
                          Оптимізовано для мобільних пристроїв та планшетів. Плавні анімації та сучасна навігація.
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
                { icon: 'bi-code-slash', name: 'Next.js 14', desc: 'React фреймворк з App Router' },
                { icon: 'bi-braces', name: 'TypeScript', desc: 'Типобезпечний JavaScript' },
                { icon: 'bi-cpu', name: 'Express.js', desc: 'Backend API сервер' },
                { icon: 'bi-database', name: 'PostgreSQL', desc: 'Реляційна база даних' },
                { icon: 'bi-diagram-3', name: 'Prisma ORM', desc: 'Управління даними' },
                { icon: 'bi-file-text', name: 'Swagger', desc: 'API документація' },
                { icon: 'bi-palette', name: 'Bootstrap 5', desc: 'UI компоненти' },
                { icon: 'bi-graph-up', name: 'Recharts', desc: 'Візуалізація даних' }
              ].map((tech, idx) => (
                <Col key={idx} md={4} sm={6}>
                  <Card className="card-hover-lift h-100 text-center" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                    <Card.Body className="p-3">
                      <div className="fs-3 mb-2" style={{ color: '#d4af37' }}>
                        <i className={`bi ${tech.icon}`}></i>
                      </div>
                      <h6 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37' }}>{tech.name}</h6>
                      <small style={{ color: '#e0e0e0', fontFamily: 'var(--font-roboto-condensed)', fontWeight: 500 }}>{tech.desc}</small>
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
              Особливості проекту
            </h3>
                    <Row className="g-4">
                      <Col md={6}>
                        <div className="d-flex align-items-start gap-3">
                          <div className="fs-3" style={{ color: '#d4af37' }}>
                            <i className="bi bi-shield-check"></i>
                          </div>
                          <div>
                            <h5 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '0.5rem' }}>
                              Безпека та приватність
                            </h5>
                            <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.7' }}>
                              Всі дані користувачів зберігаються локально в захищеній базі даних. 
                              Використовується JWT аутентифікація для безпечного доступу.
                            </p>
                            <Badge style={{ background: '#198754', color: 'white' }}>Безпечно</Badge>
                          </div>
                        </div>
                      </Col>
                      <Col md={6}>
                        <div className="d-flex align-items-start gap-3">
                          <div className="fs-3" style={{ color: '#d4af37' }}>
                            <i className="bi bi-github"></i>
                          </div>
                          <div>
                            <h5 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '0.5rem' }}>
                              Відкритий код
                            </h5>
                            <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.7' }}>
                              Проект має освітній характер та доступний на GitHub. 
                              Повна документація для розробників включена.
                            </p>
                            <Badge style={{ background: '#0d6efd', color: 'white' }}>Open Source</Badge>
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
                        можливостей інтеграції сучасних веб-технологій у сферу фітнесу та здорового способу життя.
                      </p>
                      <p className="mb-3">
                        Проект реалізує комплексний підхід до управління тренуваннями та харчуванням, включаючи 
                        відстеження прогресу, детальну статистику та персоналізовані розрахунки фізіологічних показників.
                      </p>
                      <p className="mb-3">
                        <strong>Основні можливості:</strong>
                      </p>
                      <ul style={{ paddingLeft: '1.5rem', marginBottom: '1rem' }}>
                        <li>Щоденник тренувань з детальною інформацією про вправи</li>
                        <li>Щоденник харчування з автоматичним розрахунком калорій та БЖУ</li>
                        <li>Комплексні калькулятори фізіологічних показників</li>
                        <li>Візуалізація прогресу через графіки та статистику</li>
                        <li>Система досягнень для мотивації</li>
                        <li>Профіль користувача з особистими даними</li>
                      </ul>
                      <p className="mb-0">
                        Усі дані користувачів зберігаються локально в захищеній базі даних. Проект має освітній характер та 
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
            <div className="text-center" style={{ color: '#e0e0e0', fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.85rem', fontWeight: 500 }}>
              © 2024 Кишеньковий тренер. Освітній проект
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
}

