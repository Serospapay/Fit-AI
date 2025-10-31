'use client';

import { useEffect, useState } from 'react';
import { Container, Navbar, Nav, Button, Row, Col } from 'react-bootstrap';
import BootstrapClient from './components/BootstrapClient';

export default function Home() {
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Redirect to dashboard
  useEffect(() => {
    window.location.href = '/dashboard';
  }, []);

  return (
    <>
      <BootstrapClient />
      {/* Navigation */}
      <Navbar 
        expand="lg" 
        fixed="top" 
        className={`px-4 py-3 transition-all ${isScrolled ? 'bg-white shadow-lg' : 'bg-transparent'}`}
        style={{ transition: 'all 0.3s ease' }}
      >
        <Container>
          <Navbar.Brand href="#" className="fw-bold fs-3 text-gradient">
            💪 Кишеньковий тренер
          </Navbar.Brand>
          <Navbar.Toggle aria-controls="basic-navbar-nav" />
          <Navbar.Collapse id="basic-navbar-nav">
            <Nav className="ms-auto align-items-center gap-3">
              <Nav.Link href="#features" className="fw-semibold">Можливості</Nav.Link>
              <Nav.Link href="#how-it-works" className="fw-semibold">Як це працює</Nav.Link>
              <Nav.Link href="#calculators" className="fw-semibold">Калькулятори</Nav.Link>
              <Button 
                variant="outline-primary" 
                className="rounded-pill px-4 fw-semibold ms-2"
                href="/login"
              >
                Увійти
              </Button>
              <Button 
                className="bg-gradient-primary border-0 rounded-pill px-4 fw-semibold ms-2"
                href="/register"
              >
                Почати безкоштовно
              </Button>
            </Nav>
          </Navbar.Collapse>
        </Container>
      </Navbar>

      {/* Hero Section */}
      <section 
        className="vh-100 d-flex align-items-center position-relative overflow-hidden"
        style={{ 
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          marginTop: '76px'
        }}
      >
        <div className="position-absolute top-0 start-0 w-100 h-100" style={{ opacity: 0.1 }}>
          <div style={{ position: 'absolute', width: '500px', height: '500px', borderRadius: '50%', background: 'white', top: '-250px', left: '-250px' }}></div>
          <div style={{ position: 'absolute', width: '400px', height: '400px', borderRadius: '50%', background: 'white', bottom: '-200px', right: '-200px' }}></div>
        </div>
        
        <Container className="position-relative animate-fade-in-up">
          <Row className="align-items-center g-5">
            <Col lg={6}>
              <div className="text-white">
                <h1 className="display-1 fw-bold mb-4" style={{ fontSize: 'clamp(2.5rem, 5vw, 4rem)' }}>
                  Ваш персональний<br />
                  <span className="text-warning">фітнес-помічник</span><br />
                  у кишені
                </h1>
                <p className="lead mb-4" style={{ fontSize: '1.25rem', opacity: 0.95 }}>
                  Відстежуйте тренування, харчування та прогрес. Отримуйте персоналізовані рекомендації 
                  та досягайте своїх цілей завдяки AI-технологіям
                </p>
                <div className="d-flex flex-column flex-md-row gap-3">
                  <Button 
                    size="lg" 
                    className="bg-white text-primary border-0 rounded-pill px-5 py-3 fw-bold"
                    href="/register"
                  >
                    <i className="bi bi-rocket-takeoff me-2"></i>
                    Створити профіль
                  </Button>
                  <Button 
                    size="lg" 
                    variant="outline-light" 
                    className="rounded-pill px-5 py-3 fw-bold"
                    href="#features"
                  >
                    <i className="bi bi-info-circle me-2"></i>
                    Дізнатися більше
                  </Button>
                </div>
              </div>
            </Col>
            <Col lg={6}>
              <div className="text-center animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
                <div 
                  className="mx-auto shadow-soft rounded-4 overflow-hidden bg-white p-4"
                  style={{ maxWidth: '500px' }}
                >
                  <div className="d-flex flex-column gap-3">
                    <div className="d-flex justify-content-between align-items-center p-3 bg-light rounded">
                      <div>
                        <h6 className="mb-1 fw-bold">Сьогоднішнє тренування</h6>
                        <small className="text-muted">Силова програма</small>
                      </div>
                      <i className="bi bi-check-circle-fill text-success fs-3"></i>
                    </div>
                    <div className="d-flex justify-content-between p-3 bg-light rounded">
                      <span>Прогрес цього тижня</span>
                      <span className="fw-bold">85%</span>
                    </div>
                    <div className="progress" style={{ height: '8px' }}>
                      <div className="progress-bar bg-gradient-primary" style={{ width: '85%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Features Section */}
      <section id="features" className="py-5">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold mb-3">Все в одному додатку</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Комплексний підхід до здоров'я, фітнесу та харчування
            </p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <div className="text-center p-4 h-100">
                <div 
                  className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-light"
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className="bi bi-dumbbell text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <h4 className="fw-bold mb-3">Бібліотека вправ</h4>
                <p className="text-muted">
                  Велика база вправ з детальними інструкціями, фото та рекомендаціями 
                  для різних рівнів підготовки
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="text-center p-4 h-100">
                <div 
                  className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-light"
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className="bi bi-calendar-check text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <h4 className="fw-bold mb-3">Щоденник тренувань</h4>
                <p className="text-muted">
                  Записуйте кожне тренування з підходами, повтореннями та вагою. 
                  Відстежуйте прогрес у реальному часі
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="text-center p-4 h-100">
                <div 
                  className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-light"
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className="bi bi-apple text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <h4 className="fw-bold mb-3">Відстеження харчування</h4>
                <p className="text-muted">
                  Контролюйте калорії, БЖУ та споживання води. Аналізуйте харчові звички 
                  та отримуйте рекомендації
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="text-center p-4 h-100">
                <div 
                  className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-light"
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className="bi bi-calculator text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <h4 className="fw-bold mb-3">Корисні калькулятори</h4>
                <p className="text-muted">
                  Розраховуйте ІМТ, BMR, TDEE та інші показники для кращого розуміння 
                  свого організму
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="text-center p-4 h-100">
                <div 
                  className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-light"
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className="bi bi-graph-up-arrow text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <h4 className="fw-bold mb-3">Детальна статистика</h4>
                <p className="text-muted">
                  Візуалізуйте свій прогрес за допомогою графіків та звітів. 
                  Аналізуйте тенденції та коригуйте підхід
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="text-center p-4 h-100">
                <div 
                  className="mx-auto mb-4 d-flex align-items-center justify-content-center rounded-circle bg-light"
                  style={{ width: '80px', height: '80px' }}
                >
                  <i className="bi bi-cpu text-primary" style={{ fontSize: '2rem' }}></i>
                </div>
                <h4 className="fw-bold mb-3">AI-рекомендації</h4>
                <p className="text-muted">
                  Персоналізовані програми тренувань та поради на основі ваших цілей, 
                  прогресу та уподобань
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-5 bg-light">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold mb-3">Як це працює</h2>
            <p className="lead text-muted mx-auto" style={{ maxWidth: '600px' }}>
              Простий процес для досягнення ваших цілей
            </p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <div className="text-center">
                <div className="position-relative mb-4">
                  <div 
                    className="mx-auto d-flex align-items-center justify-content-center rounded-circle bg-gradient-primary text-white"
                    style={{ width: '100px', height: '100px' }}
                  >
                    <span className="fs-1 fw-bold">1</span>
                  </div>
                  <div 
                    className="position-absolute top-50 start-100 translate-middle d-none d-md-block"
                    style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, #6366f1, #ec4899)' }}
                  ></div>
                </div>
                <h4 className="fw-bold mb-3">Створіть профіль</h4>
                <p className="text-muted">
                  Вкажіть свої параметри, цілі та рівень підготовки. 
                  Чим більше деталей, тим точніші рекомендації
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="text-center">
                <div className="position-relative mb-4">
                  <div 
                    className="mx-auto d-flex align-items-center justify-content-center rounded-circle bg-gradient-primary text-white"
                    style={{ width: '100px', height: '100px' }}
                  >
                    <span className="fs-1 fw-bold">2</span>
                  </div>
                  <div 
                    className="position-absolute top-50 start-100 translate-middle d-none d-md-block"
                    style={{ width: '100px', height: '3px', background: 'linear-gradient(90deg, #6366f1, #ec4899)' }}
                  ></div>
                </div>
                <h4 className="fw-bold mb-3">Працюйте над собою</h4>
                <p className="text-muted">
                  Відстежуйте тренування, харчування та показники здоров'я. 
                  Заповнюйте щоденник регулярно
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="text-center">
                <div className="position-relative mb-4">
                  <div 
                    className="mx-auto d-flex align-items-center justify-content-center rounded-circle bg-gradient-primary text-white"
                    style={{ width: '100px', height: '100px' }}
                  >
                    <span className="fs-1 fw-bold">3</span>
                  </div>
                </div>
                <h4 className="fw-bold mb-3">Аналізуйте та росте</h4>
                <p className="text-muted">
                  Переглядайте статистику, отримуйте AI-поради та 
                  коригуйте свій підхід для максимального результату
                </p>
              </div>
            </Col>
          </Row>
        </Container>
      </section>

      {/* Calculators Preview */}
      <section id="calculators" className="py-5">
        <Container className="py-5">
          <div className="text-center mb-5">
            <h2 className="display-4 fw-bold mb-3">Корисні калькулятори</h2>
            <p className="lead text-muted">Розраховуйте важливі показники здоров'я</p>
          </div>

          <Row className="g-4">
            <Col md={4}>
              <div className="p-4 h-100 border rounded-4 text-center shadow-sm">
                <i className="bi bi-heart-pulse-fill text-danger mb-3" style={{ fontSize: '3rem' }}></i>
                <h5 className="fw-bold mb-3">ІМТ</h5>
                <p className="text-muted">
                  Індекс маси тіла допомагає оцінити, чи ваші вага та зріст 
                  знаходяться в здоровому діапазоні
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="p-4 h-100 border rounded-4 text-center shadow-sm">
                <i className="bi bi-fire text-warning mb-3" style={{ fontSize: '3rem' }}></i>
                <h5 className="fw-bold mb-3">BMR</h5>
                <p className="text-muted">
                  Базальна швидкість метаболізму - мінімальна кількість калорій, 
                  яка потрібна для підтримки життєвих функцій
                </p>
              </div>
            </Col>

            <Col md={4}>
              <div className="p-4 h-100 border rounded-4 text-center shadow-sm">
                <i className="bi bi-lightning-fill text-info mb-3" style={{ fontSize: '3rem' }}></i>
                <h5 className="fw-bold mb-3">TDEE</h5>
                <p className="text-muted">
                  Загальна денна витрата енергії з урахуванням вашого рівня фізичної активності
                </p>
              </div>
            </Col>
          </Row>

          <div className="text-center mt-5">
            <Button 
              className="bg-gradient-primary border-0 rounded-pill px-5 py-3 fw-bold"
              href="#signup"
            >
              <i className="bi bi-calculator me-2"></i>
              Перейти до калькуляторів
            </Button>
          </div>
        </Container>
      </section>

      {/* CTA Section */}
      <section className="py-5 bg-gradient-primary text-white">
        <Container className="py-5 text-center">
          <h2 className="display-4 fw-bold mb-4">Почніть свій шлях сьогодні</h2>
          <p className="lead mb-4 opacity-90">
            Безкоштовна реєстрація • Персоналізовані рекомендації • Прогрес у реальному часі
          </p>
          <div className="d-flex flex-column flex-md-row gap-3 justify-content-center">
            <Button 
              size="lg" 
              className="bg-white text-primary border-0 rounded-pill px-5 py-3 fw-bold"
              href="/register"
            >
              Створити профіль
            </Button>
            <Button 
              size="lg" 
              variant="outline-light" 
              className="rounded-pill px-5 py-3 fw-bold"
              href="/login"
            >
              У мене вже є профіль
            </Button>
          </div>
        </Container>
      </section>

      {/* Footer */}
      <footer className="py-5 bg-dark text-light">
        <Container>
          <Row>
            <Col md={4} className="mb-4">
              <h5 className="fw-bold mb-3">💪 Кишеньковий тренер</h5>
              <p className="text-muted">
                Ваш надійний партнер на шляху до здорового способу життя. 
                Відстежуйте, аналізуйте та досягайте своїх цілей
              </p>
            </Col>
            <Col md={2} className="mb-4">
              <h6 className="fw-bold mb-3">Можливості</h6>
              <ul className="list-unstyled">
                <li><a href="#features" className="text-muted">Вправи</a></li>
                <li><a href="#calculators" className="text-muted">Калькулятори</a></li>
                <li><a href="#" className="text-muted">Статистика</a></li>
              </ul>
            </Col>
            <Col md={2} className="mb-4">
              <h6 className="fw-bold mb-3">Додаток</h6>
              <ul className="list-unstyled">
                <li><a href="#how-it-works" className="text-muted">Як це працює</a></li>
                <li><a href="#" className="text-muted">FAQ</a></li>
                <li><a href="#" className="text-muted">Підтримка</a></li>
              </ul>
            </Col>
            <Col md={4} className="mb-4">
              <h6 className="fw-bold mb-3">Про проект</h6>
              <p className="text-muted">
                Освітній проект для дослідження використання AI у фітнесі та здоровому способі життя. 
                Всі дані зберігаються локально.
              </p>
            </Col>
          </Row>
          <hr className="my-4" style={{ borderColor: 'rgba(255,255,255,0.1)' }} />
          <div className="text-center text-muted">
            <p>&copy; 2024 Кишеньковий тренер. Освітній проект</p>
          </div>
        </Container>
      </footer>
    </>
  );
}
