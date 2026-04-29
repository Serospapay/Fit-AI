'use client';

import { useEffect } from 'react';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import BootstrapClient from './components/BootstrapClient';
import GymPostersBackground from './components/GymPostersBackground';
import ModernNavbar from './components/ModernNavbar';

export default function Home() {
  useEffect(() => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('token') : null;
    if (token) {
      window.location.href = '/dashboard';
    }
  }, []);

  return (
    <>
      <BootstrapClient />
      <div className="min-h-screen bg-dark d-flex flex-column">
        <GymPostersBackground />
        <ModernNavbar />

        <main className="flex-grow-1" style={{ position: 'relative' }}>
          {/* Hero */}
          <section className="py-5" style={{ position: 'relative', zIndex: 1 }}>
            <Container className="py-5">
              <Row className="align-items-center g-5">
                <Col lg={6}>
                  <h1
                    style={{
                      fontFamily: 'var(--font-bebas)',
                      fontSize: 'clamp(2.5rem, 5vw, 4rem)',
                      color: '#d4af37',
                      letterSpacing: '8px',
                      marginBottom: '1.5rem',
                    }}
                  >
                    ВАШ ПЕРСОНАЛЬНИЙ<br />
                    <span style={{ color: '#f5f5f5' }}>ФІТНЕС-ПОМІЧНИК</span><br />
                    У КИШЕНІ
                  </h1>
                  <p
                    className="lead mb-4"
                    style={{
                      color: '#e0e0e0',
                      fontFamily: 'var(--font-roboto-condensed)',
                      fontSize: '1.15rem',
                      lineHeight: 1.7,
                    }}
                  >
                    Відстежуйте тренування, харчування та прогрес. Отримуйте персоналізовані рекомендації
                    та досягайте своїх цілей завдяки AI-технологіям
                  </p>
                  <div className="d-flex flex-column flex-md-row gap-3">
                    <Button
                      size="lg"
                      href="/register"
                      style={{ background: '#d4af37', border: 'none', color: '#0d0d0d', fontWeight: 600 }}
                    >
                      <i className="bi bi-rocket-takeoff me-2"></i>
                      Створити профіль
                    </Button>
                    <Button
                      size="lg"
                      variant="outline-warning"
                      href="#features"
                      style={{ borderColor: '#d4af37', color: '#d4af37', fontWeight: 600 }}
                    >
                      <i className="bi bi-info-circle me-2"></i>
                      Дізнатися більше
                    </Button>
                  </div>
                </Col>
                <Col lg={6}>
                  <Card className="card-hover-lift" style={{ background: 'rgba(26, 26, 26, 0.9)', borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                    <Card.Body className="p-4">
                      <div className="d-flex flex-column gap-3">
                        <div className="d-flex justify-content-between align-items-center p-3 rounded" style={{ background: 'rgba(212, 175, 55, 0.1)' }}>
                          <div>
                            <h6 className="mb-1" style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37' }}>
                              Сьогоднішнє тренування
                            </h6>
                            <small style={{ color: '#aaa' }}>Силова програма</small>
                          </div>
                          <i className="bi bi-check-circle-fill text-success fs-3"></i>
                        </div>
                        <div className="d-flex justify-content-between p-3 rounded" style={{ background: 'rgba(212, 175, 55, 0.05)' }}>
                          <span style={{ color: '#e0e0e0' }}>Прогрес цього тижня</span>
                          <span style={{ color: '#d4af37', fontWeight: 700 }}>85%</span>
                        </div>
                        <div className="progress" style={{ height: '10px' }}>
                          <div className="progress-bar" style={{ width: '85%', background: '#d4af37' }}></div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Container>
          </section>

          {/* Features */}
          <section id="features" className="py-5" style={{ position: 'relative', zIndex: 1 }}>
            <Container className="py-5">
              <div className="text-center mb-5">
                <h2 style={{ fontFamily: 'var(--font-bebas)', color: '#d4af37', marginBottom: '1rem', fontSize: '3rem' }}>
                  ВСЕ В ОДНОМУ ДОДАТКУ
                </h2>
                <p style={{ color: '#aaa', fontFamily: 'var(--font-oswald)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                  Комплексний підхід до здоров&apos;я, фітнесу та харчування
                </p>
              </div>

              <Row className="g-4">
                {[
                  { icon: 'bi-dumbbell', title: 'Бібліотека вправ', desc: 'Велика база вправ з детальними інструкціями, фото та рекомендаціями для різних рівнів підготовки' },
                  { icon: 'bi-calendar-check', title: 'Щоденник тренувань', desc: 'Записуйте кожне тренування з підходами, повтореннями та вагою. Відстежуйте прогрес у реальному часі' },
                  { icon: 'bi-apple', title: 'Відстеження харчування', desc: 'Контролюйте калорії, БЖУ та споживання води. Аналізуйте харчові звички та отримуйте рекомендації' },
                  { icon: 'bi-calculator', title: 'Корисні калькулятори', desc: 'Розраховуйте ІМТ, BMR, TDEE та інші показники для кращого розуміння свого організму' },
                  { icon: 'bi-graph-up-arrow', title: 'Детальна статистика', desc: 'Візуалізуйте свій прогрес за допомогою графіків та звітів. Аналізуйте тенденції та коригуйте підхід' },
                  { icon: 'bi-cpu', title: 'AI-рекомендації', desc: 'Персоналізовані програми тренувань та поради на основі ваших цілей, прогресу та уподобань' },
                ].map((item, idx) => (
                  <Col md={4} key={idx}>
                    <Card className="card-hover-lift h-100 text-center" style={{ background: 'rgba(212, 175, 55, 0.05)', borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                      <Card.Body className="p-4">
                        <div
                          className="mx-auto mb-3 d-flex align-items-center justify-content-center rounded-circle"
                          style={{ width: '80px', height: '80px', background: 'rgba(212, 175, 55, 0.15)' }}
                        >
                          <i className={`bi ${item.icon}`} style={{ fontSize: '2rem', color: '#d4af37' }}></i>
                        </div>
                        <h4 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>{item.title}</h4>
                        <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', marginBottom: 0 }}>{item.desc}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>

          {/* How It Works */}
          <section id="how-it-works" className="py-5" style={{ position: 'relative', zIndex: 1, background: 'rgba(0,0,0,0.2)' }}>
            <Container className="py-5">
              <div className="text-center mb-5">
                <h2 style={{ fontFamily: 'var(--font-bebas)', color: '#d4af37', marginBottom: '1rem', fontSize: '3rem' }}>
                  ЯК ЦЕ ПРАЦЮЄ
                </h2>
                <p style={{ color: '#aaa', fontFamily: 'var(--font-oswald)', fontSize: '1.2rem', maxWidth: '600px', margin: '0 auto' }}>
                  Простий процес для досягнення ваших цілей
                </p>
              </div>

              <Row className="g-4">
                {[
                  { num: '1', title: 'Створіть профіль', desc: 'Вкажіть свої параметри, цілі та рівень підготовки. Чим більше деталей, тим точніші рекомендації' },
                  { num: '2', title: 'Працюйте над собою', desc: 'Відстежуйте тренування, харчування та показники здоров\'я. Заповнюйте щоденник регулярно' },
                  { num: '3', title: 'Аналізуйте та росте', desc: 'Переглядайте статистику, отримуйте AI-поради та коригуйте свій підхід для максимального результату' },
                ].map((item) => (
                  <Col md={4} key={item.num}>
                    <div className="text-center">
                      <div
                        className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle"
                        style={{ width: '100px', height: '100px', background: 'rgba(212, 175, 55, 0.2)', border: '3px solid #d4af37', color: '#d4af37', fontFamily: 'var(--font-bebas)', fontSize: '2.5rem' }}
                      >
                        {item.num}
                      </div>
                      <h4 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>{item.title}</h4>
                      <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)' }}>{item.desc}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            </Container>
          </section>

          {/* Calculators Preview */}
          <section id="calculators-preview" className="py-5" style={{ position: 'relative', zIndex: 1 }}>
            <Container className="py-5">
              <div className="text-center mb-5">
                <h2 style={{ fontFamily: 'var(--font-bebas)', color: '#d4af37', marginBottom: '1rem', fontSize: '3rem' }}>
                  КОРИСНІ КАЛЬКУЛЯТОРИ
                </h2>
                <p style={{ color: '#aaa', fontFamily: 'var(--font-oswald)', fontSize: '1.2rem' }}>
                  Розраховуйте важливі показники здоров&apos;я
                </p>
              </div>

              <Row className="g-4">
                {[
                  { icon: 'bi-heart-pulse-fill', color: '#dc3545', title: 'ІМТ', desc: 'Індекс маси тіла допомагає оцінити, чи ваші вага та зріст знаходяться в здоровому діапазоні' },
                  { icon: 'bi-fire', color: '#d4af37', title: 'BMR', desc: 'Базальна швидкість метаболізму - мінімальна кількість калорій для підтримки життєвих функцій' },
                  { icon: 'bi-lightning-fill', color: '#17a2b8', title: 'TDEE', desc: 'Загальна денна витрата енергії з урахуванням вашого рівня фізичної активності' },
                ].map((item, idx) => (
                  <Col md={4} key={idx}>
                    <Card className="card-hover-lift h-100 text-center" style={{ background: 'rgba(26, 26, 26, 0.8)', borderColor: 'rgba(212, 175, 55, 0.3)' }}>
                      <Card.Body className="p-4">
                        <i className={`bi ${item.icon} mb-3`} style={{ fontSize: '3rem', color: item.color }}></i>
                        <h5 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>{item.title}</h5>
                        <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', marginBottom: 0 }}>{item.desc}</p>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>

              <div className="text-center mt-5">
                <Button href="/calculators" style={{ background: '#d4af37', border: 'none', color: '#0d0d0d', fontWeight: 600 }}>
                  <i className="bi bi-calculator me-2"></i>
                  Перейти до калькуляторів
                </Button>
              </div>
            </Container>
          </section>

          {/* CTA */}
          <section className="py-5" style={{ position: 'relative', zIndex: 1, background: 'rgba(212, 175, 55, 0.1)', borderTop: '2px solid rgba(212, 175, 55, 0.3)' }}>
            <Container className="py-5 text-center">
              <h2 style={{ fontFamily: 'var(--font-bebas)', color: '#d4af37', marginBottom: '1.5rem', fontSize: '3rem' }}>
                ПОЧНІТЬ СВІЙ ШЛЯХ СЬОГОДНІ
              </h2>
              <p style={{ color: '#e0e0e0', fontFamily: 'var(--font-oswald)', fontSize: '1.2rem', marginBottom: '2rem' }}>
                Безкоштовна реєстрація • Персоналізовані рекомендації • Прогрес у реальному часі
              </p>
              <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
                <Button size="lg" href="/register" style={{ background: '#d4af37', border: 'none', color: '#0d0d0d', fontWeight: 600 }}>
                  Створити профіль
                </Button>
                <Button size="lg" variant="outline-warning" href="/login" style={{ borderColor: '#d4af37', color: '#d4af37', fontWeight: 600 }}>
                  У мене вже є профіль
                </Button>
              </div>
            </Container>
          </section>

          {/* Footer */}
          <footer className="py-5" style={{ background: '#0d0d0d', borderTop: '2px solid rgba(212, 175, 55, 0.3)', position: 'relative', zIndex: 1 }}>
            <Container>
              <Row>
                <Col md={4} className="mb-4">
                  <h5 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>Кишеньковий тренер</h5>
                  <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)' }}>
                    Ваш надійний партнер на шляху до здорового способу життя.
                    Відстежуйте, аналізуйте та досягайте своїх цілей
                  </p>
                </Col>
                <Col md={2} className="mb-4">
                  <h6 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>Можливості</h6>
                  <ul className="list-unstyled">
                    <li><a href="#features" style={{ color: '#aaa' }}>Вправи</a></li>
                    <li><a href="#calculators-preview" style={{ color: '#aaa' }}>Калькулятори</a></li>
                    <li><a href="/about" style={{ color: '#aaa' }}>Про проект</a></li>
                  </ul>
                </Col>
                <Col md={2} className="mb-4">
                  <h6 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>Додаток</h6>
                  <ul className="list-unstyled">
                    <li><a href="#how-it-works" style={{ color: '#aaa' }}>Як це працює</a></li>
                    <li><a href="/calculators" style={{ color: '#aaa' }}>Калькулятори</a></li>
                  </ul>
                </Col>
                <Col md={4} className="mb-4">
                  <h6 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', marginBottom: '1rem' }}>Про сервіс</h6>
                  <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.9rem' }}>
                    Персональний фітнес-сервіс для відстеження тренувань, харчування та прогресу.
                    Всі дані зберігаються локально.
                  </p>
                </Col>
              </Row>
              <hr style={{ borderColor: 'rgba(212, 175, 55, 0.2)' }} />
              <div className="text-center">
                <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)', marginBottom: 0 }}>
                  &copy; 2026 Кишеньковий тренер
                </p>
              </div>
            </Container>
          </footer>
        </main>
      </div>
    </>
  );
}
