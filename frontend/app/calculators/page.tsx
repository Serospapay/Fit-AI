'use client';

import { useState } from 'react';
import { Container, Row, Col, Form, Button, Card, Badge, Alert } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import GymPostersBackground from '../components/GymPostersBackground';
import ModernNavbar from '../components/ModernNavbar';

interface BMIResult {
  value: string;
  category: string;
}

interface WHRResult {
  value: string;
  category: string;
}

interface CalorieTargets {
  maintain: number;
  loss: number;
  gain: number;
}

interface MacroBreakdown {
  calorieTarget: number;
  ratio: {
    protein: number;
    carbs: number;
    fat: number;
  };
  grams: {
    protein: number;
    carbs: number;
    fat: number;
  };
}

interface HeartRateZone {
  label: string;
  range: string;
}

interface HeartRateResult {
  max: number;
  zones: HeartRateZone[];
}

interface CalculatorResults {
  bmr: number;
  tdee: number;
  bmi: BMIResult;
  whr: WHRResult | null;
  calorieTargets: CalorieTargets;
  macroBreakdown: MacroBreakdown;
  heartRate: HeartRateResult | null;
  waterIntake: number | null;
}

export default function CalculatorsPage() {
  const [formData, setFormData] = useState({
    age: '',
    gender: 'male',
    weight: '',
    height: '',
    waist: '',
    hip: '',
    activityLevel: 'moderate',
    goal: 'maintain'
  });
  const [results, setResults] = useState<CalculatorResults | null>(null);
  const [error, setError] = useState<string | null>(null);

  const activityMultipliers = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    active: 1.725,
    very_active: 1.9
  };

  const macroRatios = {
    loss: { protein: 0.35, carbs: 0.4, fat: 0.25 },
    maintain: { protein: 0.3, carbs: 0.45, fat: 0.25 },
    gain: { protein: 0.25, carbs: 0.5, fat: 0.25 }
  } as const;

  const calculateBMR = () => {
    const weight = parseFloat(formData.weight);
    const height = parseFloat(formData.height);
    const age = parseFloat(formData.age);

    if (!weight || !height || !age) return null;
    if (weight <= 0 || weight > 500 || height <= 0 || height > 300 || age <= 0 || age > 150) return null;

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
    if (weight <= 0 || weight > 500 || height <= 0 || height > 300) return null;

    const heightInMeters = height / 100;
    const bmi = weight / (heightInMeters * heightInMeters);
    
    let category = '';
    if (bmi < 18.5) category = 'Нестача ваги';
    else if (bmi < 25) category = 'Норма';
    else if (bmi < 30) category = 'Надмірна вага';
    else category = 'Ожиріння';

    return { value: bmi.toFixed(1), category };
  };

  const calculateWHR = (): WHRResult | null => {
    const waist = parseFloat(formData.waist);
    const hip = parseFloat(formData.hip);

    if (!waist || !hip) return null;
    if (waist <= 0 || waist > 200 || hip <= 0 || hip > 200) return null;

    const ratio = waist / hip;
    let category = '';

    if (formData.gender === 'male') {
      if (ratio <= 0.95) category = 'Низький ризик';
      else if (ratio <= 1) category = 'Середній ризик';
      else category = 'Високий ризик';
    } else {
      if (ratio <= 0.8) category = 'Низький ризик';
      else if (ratio <= 0.85) category = 'Середній ризик';
      else category = 'Високий ризик';
    }

    return { value: ratio.toFixed(2), category };
  };

  const calculateCalorieTargets = (tdee: number): CalorieTargets => {
    const maintain = Math.round(tdee);
    const loss = Math.max(Math.round(tdee - 500), 1200);
    const gain = Math.round(tdee + 300);
    return { maintain, loss, gain };
  };

  const calculateMacroBreakdown = (targets: CalorieTargets): MacroBreakdown => {
    const ratio = macroRatios[formData.goal as keyof typeof macroRatios];
    const targetCalories = formData.goal === 'loss' ? targets.loss : formData.goal === 'gain' ? targets.gain : targets.maintain;

    return {
      calorieTarget: targetCalories,
      ratio,
      grams: {
        protein: Math.round((targetCalories * ratio.protein) / 4),
        carbs: Math.round((targetCalories * ratio.carbs) / 4),
        fat: Math.round((targetCalories * ratio.fat) / 9)
      }
    };
  };

  const calculateHeartRate = (): HeartRateResult | null => {
    const age = parseFloat(formData.age);
    if (!age) return null;

    const max = Math.round(220 - age);
    const zones: HeartRateZone[] = [
      { label: 'Розминка', range: `${Math.round(max * 0.5)}–${Math.round(max * 0.6)} уд/хв` },
      { label: 'Жироспалення', range: `${Math.round(max * 0.6)}–${Math.round(max * 0.7)} уд/хв` },
      { label: 'Аеробна витривалість', range: `${Math.round(max * 0.7)}–${Math.round(max * 0.8)} уд/хв` },
      { label: 'Анаеробна зона', range: `${Math.round(max * 0.8)}–${Math.round(max * 0.9)} уд/хв` },
      { label: 'Максимальні зусилля', range: `${Math.round(max * 0.9)}–${max} уд/хв` }
    ];

    return { max, zones };
  };

  const calculateWaterIntake = (): number | null => {
    const weight = parseFloat(formData.weight);
    if (!weight) return null;
    if (weight <= 0 || weight > 500) return null;

    let liters = weight * 0.035;
    const activityExtras: Record<string, number> = {
      sedentary: 0,
      light: 0.35,
      moderate: 0.7,
      active: 1,
      very_active: 1.3
    };

    liters += activityExtras[formData.activityLevel as keyof typeof activityExtras] || 0;

    return parseFloat(liters.toFixed(2));
  };

  const handleCalculate = () => {
    setError(null);
    
    const bmr = calculateBMR();
    const bmi = calculateBMI();
    
    if (!bmr || !bmi) {
      setError('Будь ласка, заповніть всі обов\'язкові поля: вік, стать, вага та зріст.');
      setResults(null);
      return;
    }

    const tdee = calculateTDEE(bmr);
    const calorieTargets = calculateCalorieTargets(tdee);
    const macroBreakdown = calculateMacroBreakdown(calorieTargets);
    const whr = calculateWHR();
    const heartRate = calculateHeartRate();
    const waterIntake = calculateWaterIntake();

    setResults({
      bmr,
      tdee,
      bmi,
      whr,
      calorieTargets,
      macroBreakdown,
      heartRate,
      waterIntake
    });
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setResults(null);
    setError(null);
  };

  return (
    <>
      <BootstrapClient />
      <div className="min-h-screen bg-dark d-flex flex-column">
        {/* Gym Posters Background */}
        <GymPostersBackground />
        
        {/* Modern Navigation */}
        <ModernNavbar />

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
                  <h5 className="mb-4" style={{ color: '#ffffff', fontWeight: 700 }}>Фізіологічні показники</h5>
                  
                  <Row className="g-3">
                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Вік (років)</Form.Label>
                        <Form.Control
                          type="number"
                          name="age"
                          value={formData.age}
                          onChange={handleChange}
                          min="1"
                          max="150"
                          step="1"
                          style={{ color: '#ffffff', fontWeight: 500 }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Стать</Form.Label>
                        <Form.Select
                          name="gender"
                          value={formData.gender}
                          onChange={handleChange}
                          style={{ color: '#ffffff', fontWeight: 500 }}
                        >
                          <option value="male" style={{ background: '#1a1a1a', color: '#ffffff' }}>Чоловік</option>
                          <option value="female" style={{ background: '#1a1a1a', color: '#ffffff' }}>Жінка</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Вага (кг)</Form.Label>
                        <Form.Control
                          type="number"
                          name="weight"
                          value={formData.weight}
                          onChange={handleChange}
                          min="1"
                          max="500"
                          step="0.1"
                          style={{ color: '#ffffff', fontWeight: 500 }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Зріст (см)</Form.Label>
                        <Form.Control
                          type="number"
                          name="height"
                          value={formData.height}
                          onChange={handleChange}
                          min="50"
                          max="300"
                          step="0.1"
                          style={{ color: '#ffffff', fontWeight: 500 }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Обхват талії (см)</Form.Label>
                        <Form.Control
                          type="number"
                          name="waist"
                          value={formData.waist}
                          onChange={handleChange}
                          min="1"
                          max="200"
                          step="0.1"
                          style={{ color: '#ffffff', fontWeight: 500 }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={6}>
                      <Form.Group>
                        <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Обхват стегон (см)</Form.Label>
                        <Form.Control
                          type="number"
                          name="hip"
                          value={formData.hip}
                          onChange={handleChange}
                          min="1"
                          max="200"
                          step="0.1"
                          style={{ color: '#ffffff', fontWeight: 500 }}
                        />
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Рівень активності</Form.Label>
                        <Form.Select
                          name="activityLevel"
                          value={formData.activityLevel}
                          onChange={handleChange}
                          style={{ color: '#ffffff', fontWeight: 500 }}
                        >
                          <option value="sedentary" style={{ background: '#1a1a1a', color: '#ffffff' }}>Сидячий (мало або без фізичних навантажень)</option>
                          <option value="light" style={{ background: '#1a1a1a', color: '#ffffff' }}>Легка активність (1-3 дні на тиждень)</option>
                          <option value="moderate" style={{ background: '#1a1a1a', color: '#ffffff' }}>Помірна активність (3-5 днів на тиждень)</option>
                          <option value="active" style={{ background: '#1a1a1a', color: '#ffffff' }}>Висока активність (6-7 днів на тиждень)</option>
                          <option value="very_active" style={{ background: '#1a1a1a', color: '#ffffff' }}>Дуже висока активність (2 рази на день)</option>
                        </Form.Select>
                      </Form.Group>
                    </Col>

                    <Col md={12}>
                      <Form.Group>
                        <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Мета</Form.Label>
                        <Form.Select
                          name="goal"
                          value={formData.goal}
                          onChange={handleChange}
                          style={{ color: '#ffffff', fontWeight: 500 }}
                        >
                          <option value="maintain" style={{ background: '#1a1a1a', color: '#ffffff' }}>Підтримка ваги</option>
                          <option value="loss" style={{ background: '#1a1a1a', color: '#ffffff' }}>Схуднення</option>
                          <option value="gain" style={{ background: '#1a1a1a', color: '#ffffff' }}>Набір м'язів</option>
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

              {error && (
                <Alert variant="danger" className="mt-4">
                  <i className="bi bi-exclamation-triangle me-2"></i>
                  {error}
                </Alert>
              )}

              {results && (
                <>
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

                  {(results.whr || results.heartRate || results.waterIntake) && (
                    <Row className="g-4 mb-4">
                      {results.whr && (
                        <Col md={4}>
                          <Card className="card-hover-lift" style={{ borderTop: '4px solid #6f42c1' }}>
                            <Card.Body className="text-center p-4">
                              <div className="display-1 mb-2" style={{ color: '#6f42c1' }}>
                                <i className="bi bi-rulers"></i>
                              </div>
                              <h5 className="mb-2">WHR</h5>
                              <div className="gold-number mb-2" style={{ fontSize: '3.5rem' }}>{results.whr.value}</div>
                              <Badge bg={results.whr.category.includes('Високий') ? 'danger' : results.whr.category.includes('Середній') ? 'warning' : 'success'}>
                                {results.whr.category}
                              </Badge>
                            </Card.Body>
                          </Card>
                        </Col>
                      )}

                      {results.heartRate && (
                        <Col md={4}>
                          <Card className="card-hover-lift" style={{ borderTop: '4px solid #0d6efd' }}>
                            <Card.Body className="p-4">
                              <div className="d-flex justify-content-between align-items-center mb-2">
                                <h5 className="mb-0">Макс. пульс</h5>
                                <i className="bi bi-activity" style={{ color: '#0d6efd', fontSize: '1.8rem' }}></i>
                              </div>
                              <div className="gold-number mb-2" style={{ fontSize: '3rem', color: '#0d6efd' }}>{results.heartRate.max}</div>
                              <small className="d-block mb-3" style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>уд/хв</small>
                              <ul className="list-unstyled small mb-0" style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)' }}>
                                {results.heartRate.zones.map((zone) => (
                                  <li key={zone.label} className="d-flex justify-content-between">
                                    <span>{zone.label}</span>
                                    <span>{zone.range}</span>
                                  </li>
                                ))}
                              </ul>
                            </Card.Body>
                          </Card>
                        </Col>
                      )}

                      {results.waterIntake !== null && (
                        <Col md={4}>
                          <Card className="card-hover-lift" style={{ borderTop: '4px solid #20c997' }}>
                            <Card.Body className="text-center p-4">
                              <div className="display-1 mb-2" style={{ color: '#20c997' }}>
                                <i className="bi bi-droplet-half"></i>
                              </div>
                              <h5 className="mb-2">Вода на день</h5>
                              <div className="gold-number mb-2" style={{ fontSize: '3.5rem', color: '#20c997' }}>{results.waterIntake.toFixed(2)} л</div>
                              <p className="small mb-0" style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Включає поправку на активність</p>
                            </Card.Body>
                          </Card>
                        </Col>
                      )}
                    </Row>
                  )}

                  <Row className="g-4 mb-4">
                    <Col md={6}>
                      <Card className="card-hover-lift h-100">
                        <Card.Body className="p-4">
                          <h5 className="mb-3">
                            <i className="bi bi-speedometer me-2" style={{ color: '#d4af37' }}></i>
                            Калорійність раціону
                          </h5>
                          <div className="d-flex flex-column gap-2">
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Підтримка ваги</span>
                              <Badge bg="primary">{results.calorieTargets.maintain} ккал</Badge>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Схуднення (~–500 ккал)</span>
                              <Badge bg="warning" text="dark">{results.calorieTargets.loss} ккал</Badge>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Набір м'язів (+300 ккал)</span>
                              <Badge bg="success">{results.calorieTargets.gain} ккал</Badge>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>

                    <Col md={6}>
                      <Card className="card-hover-lift h-100">
                        <Card.Body className="p-4">
                          <h5 className="mb-3">
                            <i className="bi bi-nut me-2" style={{ color: '#d4af37' }}></i>
                            Співвідношення БЖУ
                          </h5>
                          <p className="small" style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>
                            Ціль: {formData.goal === 'loss' ? 'Схуднення' : formData.goal === 'gain' ? "Набір м'язів" : 'Підтримка ваги'} • {results.macroBreakdown.calorieTarget} ккал/день
                          </p>
                          <div className="d-flex flex-column gap-2" style={{ fontFamily: 'var(--font-roboto-condensed)' }}>
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Білки ({Math.round(results.macroBreakdown.ratio.protein * 100)}%)</span>
                              <Badge bg="info" text="dark">{results.macroBreakdown.grams.protein} г</Badge>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Вуглеводи ({Math.round(results.macroBreakdown.ratio.carbs * 100)}%)</span>
                              <Badge bg="secondary">{results.macroBreakdown.grams.carbs} г</Badge>
                            </div>
                            <div className="d-flex justify-content-between align-items-center">
                              <span>Жири ({Math.round(results.macroBreakdown.ratio.fat * 100)}%)</span>
                              <Badge bg="dark">{results.macroBreakdown.grams.fat} г</Badge>
                            </div>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  </Row>
                </>
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
                    <li><strong style={{ color: '#d4af37' }}>WHR</strong> - співвідношення талії до стегон допомагає оцінити розподіл жиру та серцево-судинні ризики.</li>
                    <li><strong style={{ color: '#d4af37' }}>Максимальний пульс</strong> - розраховується як 220 - вік та визначає тренувальні зони.</li>
                    <li><strong style={{ color: '#d4af37' }}>Вода</strong> - базова формула 35 мл/кг + поправка на ваш рівень активності.</li>
                    <li><strong style={{ color: '#d4af37' }}>БЖУ</strong> - рекомендації формуються автоматично залежно від обраної мети.</li>
                  </ul>
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
              © 2024 Кишеньковий тренер
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
}

