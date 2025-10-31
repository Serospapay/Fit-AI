'use client';

import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';

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
      <div className="min-h-screen bg-light">
        {/* Navigation */}
        <nav className="bg-white shadow-sm border-bottom">
          <Container>
            <div className="d-flex justify-content-between align-items-center py-3">
              <a href="/dashboard" className="fw-bold fs-4 text-gradient text-decoration-none">
                Кишеньковий тренер
              </a>
              <div className="d-flex align-items-center gap-3">
                <a href="/dashboard" className="text-decoration-none text-dark">Dashboard</a>
                <a href="/exercises" className="text-decoration-none text-dark">Вправи</a>
                <a href="/workouts" className="text-decoration-none text-dark">Тренування</a>
                <a href="/calculators" className="text-decoration-none fw-bold">Калькулятори</a>
              </div>
            </div>
          </Container>
        </nav>

        <Container className="py-5">
          <div className="text-center mb-5">
            <h1 className="display-4 fw-bold mb-3">Калькулятори</h1>
            <p className="lead text-muted">Розрахуйте ваші фізіологічні показники</p>
          </div>

          <Row className="justify-content-center">
            <Col lg={8}>
              <Card className="border-0 shadow-sm mb-4">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-4">Фізіологічні показники</h5>
                  
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
                    <Card className="border-0 text-white bg-gradient" style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}>
                      <Card.Body className="text-center p-4">
                        <div className="display-4 mb-2">🔥</div>
                        <h5 className="fw-bold mb-2">BMR</h5>
                        <div className="display-5 fw-bold mb-1">{results.bmr}</div>
                        <small className="opacity-90">ккал/день</small>
                        <p className="small mt-3 mb-0 opacity-75">Базальний метаболізм</p>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={4}>
                    <Card className="border-0 text-white bg-gradient" style={{ background: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)' }}>
                      <Card.Body className="text-center p-4">
                        <div className="display-4 mb-2">⚡</div>
                        <h5 className="fw-bold mb-2">TDEE</h5>
                        <div className="display-5 fw-bold mb-1">{results.tdee}</div>
                        <small className="opacity-90">ккал/день</small>
                        <p className="small mt-3 mb-0 opacity-75">Денні витрати енергії</p>
                      </Card.Body>
                    </Card>
                  </Col>

                  <Col md={4}>
                    <Card className="border-0 text-white bg-gradient" style={{ background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)' }}>
                      <Card.Body className="text-center p-4">
                        <div className="display-4 mb-2">📊</div>
                        <h5 className="fw-bold mb-2">ІМТ</h5>
                        <div className="display-5 fw-bold mb-1">{results.bmi.value}</div>
                        <small className="opacity-90">{results.bmi.category}</small>
                        <p className="small mt-3 mb-0 opacity-75">Індекс маси тіла</p>
                      </Card.Body>
                    </Card>
                  </Col>
                </Row>
              )}

              <Card className="border-0 shadow-sm">
                <Card.Body className="p-4">
                  <h5 className="fw-bold mb-3">💡 Примітки</h5>
                  <ul className="mb-0 small text-muted">
                    <li><strong>BMR</strong> - це мінімальна кількість калорій, яка потрібна вашому організму для підтримки життєво важливих функцій в стані спокою.</li>
                    <li><strong>TDEE</strong> - це загальна кількість калорій, які ви спалюєте за день, враховуючи вашу активність.</li>
                    <li><strong>ІМТ</strong> - індекс маси тіла допомагає оцінити чи ваші вага та зріст знаходяться в здоровому діапазоні.</li>
                  </ul>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

