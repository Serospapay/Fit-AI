'use client';

import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import GymPostersBackground from '../components/GymPostersBackground';
import GymLogo from '../components/GymLogo';

export default function CalculatorsPage() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    activityLevel: 'moderate'
  });
  const [results, setResults] = useState<any>(null);

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const calculateBMR = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);

    if (!weight || !height || !age) return null;

    // Mifflin-St Jeor Formula
    const bmr = formData.gender === 'male'
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;

    return Math.round(bmr);
  };

  const calculateTDEE = (bmr: number) => {
    const multiplier = activityMultipliers[formData.activityLevel as keyof typeof activityMultipliers];
    return Math.round(bmr * multiplier);
  };

  const calculateBMI = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);

    if (!weight || !height) return null;

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    let category = '';
    if (bmi < 18.5) category = 'Нестача ваги';
    else if (bmi < 25) category = 'Норма';
    else if (bmi < 30) category = 'Надмірна вага';
    else category = 'Ожиріння';

    return { value: bmi.toFixed(1), category };
  };

  const handleCalculate = () => {
    const bmr = calculateBMR();
    const bmi = calculateBMI();
    
    if (!bmr || !bmi) {
      alert('Заповніть всі поля');
      return;
    }

    const tdee = calculateTDEE(bmr);
    setResults({ bmr, tdee, bmi });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setResults(null);
  };

  return (
    <>
      <BootstrapClient />
      <div className="min-h-screen bg-dark d-flex flex-column">
        {/* Background Grid */}
        <div className="position-fixed w-100 h-100" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(212,175,55,0.03) 0px, rgba(212,175,55,0.03) 1px, transparent 1px, transparent 50px), repeating-linear-gradient(90deg, rgba(212,175,55,0.03) 0px, rgba(212,175,55,0.03) 1px, transparent 1px, transparent 50px)', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }}></div>
        
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
                <a href="/dashboard" className="nav-link d-flex align-items-center">
                  <i className="bi bi-speedometer2 me-2"></i>
                  <span>Dashboard</span>
                </a>
                <a href="/exercises" className="nav-link d-flex align-items-center">
                  <i className="bi bi-dumbbell me-2"></i>
                  <span>Вправи</span>
                </a>
                <a href="/workouts" className="nav-link d-flex align-items-center">
                  <i className="bi bi-calendar-check me-2"></i>
                  <span>Тренування</span>
                </a>
                <a href="/calculators" className="nav-link fw-bold d-flex align-items-center">
                  <i className="bi bi-calculator me-2"></i>
                  <span>Калькулятори</span>
                </a>
              </div>
            </div>
          </Container>
        </nav>

        <main className="flex-grow-1" style={{ position: 'relative' }}>
        <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
          <div className="text-center mb-5">
            <h1 className="mb-3">Калькулятори</h1>
            <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>Розрахуйте ваші фізіологічні показники</p>
          </div>

          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="card-hover-lift mb-4">
                <Card.Body className="p-4">
                  <h5 className="mb-4">Фізіологічні показники</h5>
                  
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Вік (років)</Form.Label>
                        <Form.Control
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Стать</Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                        >
                          <option value="male">Чоловік</option>
                          <option value="female">Жінка</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Вага (кг)</Form.Label>
                        <Form.Control
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Зріст (см)</Form.Label>
                        <Form.Control
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold">Рівень активності</Form.Label>
                        <Form.Select
                          name="activityLevel"
                          value={formData.activityLevel}
                          onChange={handleChange}
                        >
                          <option value="sedentary">Сидячий (мало або без фізичних навантажень)</option>
                          <option value="light">Легка активність (1-3 дні на тиждень)</option>
                          <option value="moderate">Помірна активність (3-5 днів на тиждень)</option>
                          <option value="active">Висока активність (6-7 днів на тиждень)</option>
                          <option value="very_active">Дуже висока активність (2 рази на день)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>
                  </Row>

                  <Button
                    variant="primary"
                    size="lg"
                    className="w-100 mt-4"
                    onClick={handleCalculate}
                  >
                    Розрахувати
                  </Button>
                </Card.Body>
              </Card>

              {results && (
                <Row className="g-4 mb-4">
                  <Col md={4}>
                    <Card className="card-hover-lift" style={{ borderTop: '4px solid #d4af37' }}>
                      <Card.Body className="text-center p-4">
                        <div className="display-1 mb-2" style={{ color: '#d4af37' }}>
                          <i className="bi bi-fire"></i>
                        </div>
                        <h5 className="mb-2">BMR</h5>
                        <div className="gold-number mb-1" style={{ fontSize: '4rem' }}>{results.bmr}</div>
                        <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>ккал/день</small>
                        <p className="small mt-3 mb-0" style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Базальний метаболізм</p>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={4}>
                    <Card className="card-hover-lift" style={{ borderTop: '4px solid #c0c0c0' }}>
                      <Card.Body className="text-center p-4">
                        <div className="display-1 mb-2" style={{ color: '#c0c0c0' }}>
                          <i className="bi bi-lightning-charge-fill"></i>
                        </div>
                        <h5 className="mb-2">TDEE</h5>
                        <div className="gold-number mb-1" style={{ fontSize: '4rem', color: '#c0c0c0' }}>{results.tdee}</div>
                        <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>ккал/день</small>
                        <p className="small mt-3 mb-0" style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Денні витрати енергії</p>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={4}>
                    <Card className="card-hover-lift" style={{ borderTop: '4px solid #cd7f32' }}>
                      <Card.Body className="text-center p-4">
                        <div className="display-1 mb-2" style={{ color: '#cd7f32' }}>
                          <i className="bi bi-bar-chart-fill"></i>
                        </div>
                        <h5 className="mb-2">ІМТ</h5>
                        <div className="gold-number mb-1" style={{ fontSize: '4rem', color: '#cd7f32' }}>{results.bmi.value}</div>
                        <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>{results.bmi.category}</small>
                        <p className="small mt-3 mb-0" style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Індекс маси тіла</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              <Card className="card-hover-lift">
                <Card.Body className="p-4">
                  <h5 className="mb-3">
                    <i className="bi bi-info-circle me-2" style={{ color: '#d4af37' }}></i>
                    Примітки
                  </h5>
                  <ul className="mb-0" style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>
                    <li><strong style={{ color: '#d4af37' }}>BMR</strong> - це мінімальна кількість калорій, яка потрібна вашому організму для підтримки життєво важливих функцій в стані спокою.</li>
                    <li><strong style={{ color: '#d4af37' }}>TDEE</strong> - це загальна кількість калорій, які ви спалюєте за день, враховуючи вашу активність.</li>
                    <li><strong style={{ color: '#d4af37' }}>ІМТ</strong> - індекс маси тіла допомагає оцінити чи ваші вага та зріст знаходяться в здоровому діапазоні.</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
        </main>

        {/* Footer */}
        <footer className="flex-shrink-0 py-3" style={{ position: 'relative', zIndex: 1, borderTop: '2px solid rgba(212, 175, 55, 0.2)' }}>
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

