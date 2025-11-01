'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Badge, Spinner, Modal, Form } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import GymPostersBackground from '../components/GymPostersBackground';
import GymLogo from '../components/GymLogo';

interface Exercise {
  id: string;
  name: string;
  nameUk?: string;
}

interface ProgramExercise {
  id: string;
  exerciseId: string;
  day: number;
  week?: number;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  rest?: number;
  order: number;
  notes?: string;
  exercise: Exercise;
}

interface Program {
  id: string;
  name: string;
  nameUk?: string;
  description?: string;
  descriptionUk?: string;
  goal: string;
  difficulty: string;
  duration?: number;
  isDefault: boolean;
  exercises: ProgramExercise[];
}

export default function ProgramsPage() {
  const router = useRouter();
  const [programs, setPrograms] = useState<Program[]>([]);
  const [loading, setLoading] = useState(true);
  const [showGenerateModal, setShowGenerateModal] = useState(false);
  const [generating, setGenerating] = useState(false);
  
  // Generate form state
  const [generateForm, setGenerateForm] = useState({
    goal: '',
    difficulty: '',
    duration: '4',
    daysPerWeek: '3',
    equipment: [] as string[],
    location: [] as string[],
    muscleGroups: [] as string[]
  });

  useEffect(() => {
    fetchPrograms();
  }, []);

  const fetchPrograms = async () => {
    setLoading(true);
    try {
      const res = await fetch('http://localhost:5000/api/programs');
      const data = await res.json();
      setPrograms(data.programs || []);
    } catch (error) {
      console.error('Error fetching programs:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateProgram = async () => {
    setGenerating(true);
    try {
      const res = await fetch('http://localhost:5000/api/programs/generate', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          goal: generateForm.goal,
          difficulty: generateForm.difficulty,
          duration: parseInt(generateForm.duration),
          daysPerWeek: parseInt(generateForm.daysPerWeek),
          equipment: generateForm.equipment,
          location: generateForm.location,
          muscleGroups: generateForm.muscleGroups
        })
      });

      if (res.ok) {
        const program = await res.json();
        setShowGenerateModal(false);
        router.push(`/programs/${program.id}`);
      } else {
        alert('Помилка створення програми');
      }
    } catch (error) {
      console.error('Error generating program:', error);
      alert('Помилка створення програми');
    } finally {
      setGenerating(false);
    }
  };

  const getGoalLabelUk = (goal: string) => {
    const goals: { [key: string]: string } = {
      lose_weight: 'Схуднення',
      gain_muscle: 'Набір маси',
      maintain: 'Підтримка',
      endurance: 'Витривалість',
      definition: 'Рельєф'
    };
    return goals[goal] || goal;
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'success';
      case 'intermediate': return 'warning';
      case 'advanced': return 'danger';
      default: return 'secondary';
    }
  };

  const getDifficultyLabelUk = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'Початковий';
      case 'intermediate': return 'Середній';
      case 'advanced': return 'Продвинутий';
      default: return difficulty;
    }
  };

  const getWeekDayLabel = (day: number) => {
    const days = ['Нд', 'Пн', 'Вт', 'Ср', 'Чт', 'Пт', 'Сб'];
    return days[day - 1] || '';
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
                <a href="/exercises" className="nav-link d-flex align-items-center">
                  <i className="bi bi-dumbbell me-2"></i>
                  <span>Вправи</span>
                </a>
                <a href="/workouts" className="nav-link d-flex align-items-center">
                  <i className="bi bi-calendar-check me-2"></i>
                  <span>Тренування</span>
                </a>
                <a href="/programs" className="nav-link fw-bold d-flex align-items-center">
                  <i className="bi bi-journal-text me-2"></i>
                  <span>Програми</span>
                </a>
                <a href="/calculators" className="nav-link d-flex align-items-center">
                  <i className="bi bi-calculator me-2"></i>
                  <span>Калькулятори</span>
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
          <Container className="py-5" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px' }}>
            {/* Header */}
            <div className="mb-4 d-flex justify-content-between align-items-center">
              <div>
                <h1 className="mb-2" style={{ fontFamily: 'var(--font-bebas)', fontSize: '3rem', color: '#d4af37' }}>Програми тренувань</h1>
                <p className="lead mb-0" style={{ color: '#aaa', fontFamily: 'var(--font-oswald)', fontSize: '1.2rem' }}>
                  Готові програми та персоналізовані тренування
                </p>
              </div>
              <Button 
                variant="outline-primary" 
                onClick={() => setShowGenerateModal(true)}
                style={{ fontFamily: 'var(--font-oswald)', fontSize: '1rem', fontWeight: 600 }}
              >
                <i className="bi bi-magic me-2"></i>
                Створити програму
              </Button>
            </div>

            {/* Programs Grid */}
            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : programs.length > 0 ? (
              <Row className="g-4">
                {programs.map((program) => (
                  <Col key={program.id} lg={6}>
                    <Card className="card-hover-lift h-100" style={{ cursor: 'pointer' }} onClick={() => router.push(`/programs/${program.id}`)}>
                      <Card.Body className="p-4">
                        <div className="d-flex justify-content-between align-items-start mb-3">
                          <div className="flex-grow-1">
                            <h4 className="mb-2" style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontSize: '1.3rem', fontWeight: 600 }}>
                              {program.nameUk || program.name}
                            </h4>
                            {program.descriptionUk && (
                              <p className="text-muted mb-3" style={{ fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                                {program.descriptionUk}
                              </p>
                            )}
                          </div>
                          {program.isDefault && (
                            <Badge bg="primary" style={{ fontSize: '0.75rem' }}>
                              <i className="bi bi-star-fill me-1"></i>
                              За замовчуванням
                            </Badge>
                          )}
                        </div>

                        <div className="d-flex flex-wrap gap-2 mb-3">
                          <Badge bg={getDifficultyColor(program.difficulty)} style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem' }}>
                            {getDifficultyLabelUk(program.difficulty)}
                          </Badge>
                          <Badge style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37', border: '1px solid #d4af37' }}>
                            {getGoalLabelUk(program.goal)}
                          </Badge>
                          {program.duration && (
                            <Badge style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: 'rgba(13, 110, 253, 0.2)', color: '#0d6efd', border: '1px solid #0d6efd' }}>
                              <i className="bi bi-calendar me-1"></i>
                              {Math.ceil(program.duration / 7)} тижні
                            </Badge>
                          )}
                          <Badge style={{ fontSize: '0.85rem', padding: '0.4rem 0.8rem', background: 'rgba(25, 135, 84, 0.2)', color: '#198754', border: '1px solid #198754' }}>
                            <i className="bi bi-list-ul me-1"></i>
                            {program.exercises.length} вправ
                          </Badge>
                        </div>

                        <div className="d-flex align-items-center justify-content-between">
                          <div className="small text-muted" style={{ fontFamily: 'var(--font-roboto-condensed)' }}>
                            {uniqueDaysCount(program.exercises)} днів тренувань
                          </div>
                          <Button variant="link" className="p-0" style={{ color: '#d4af37', textDecoration: 'none' }}>
                            Детальніше <i className="bi bi-arrow-right ms-1"></i>
                          </Button>
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            ) : (
              <Card className="card-hover-lift">
                <Card.Body className="p-5 text-center">
                  <i className="bi bi-journal-x display-1 mb-3" style={{ color: '#d4af37' }}></i>
                  <h4 className="mb-3">Програм поки немає</h4>
                  <p className="text-muted mb-4">Створіть першу програму за допомогою інтелектуального підбору</p>
                  <Button variant="outline-primary" onClick={() => setShowGenerateModal(true)}>
                    <i className="bi bi-magic me-2"></i>
                    Створити програму
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

        {/* Generate Modal */}
        <Modal show={showGenerateModal} onHide={() => setShowGenerateModal(false)} centered size="lg" contentClassName="bg-dark">
          <Modal.Header closeButton className="border-secondary" style={{ background: 'rgba(20, 20, 20, 0.9)' }}>
            <Modal.Title style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', fontSize: '1.5rem', fontWeight: 600 }}>
              <i className="bi bi-magic me-2"></i>
              Створити персональну програму
            </Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ background: 'rgba(20, 20, 20, 0.9)' }}>
            <Form>
              <Row className="g-3">
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)', fontWeight: 600 }}>
                      Мета тренування *
                    </Form.Label>
                    <Form.Select
                      value={generateForm.goal}
                      onChange={(e) => setGenerateForm({ ...generateForm, goal: e.target.value })}
                      required
                    >
                      <option value="">Оберіть мету</option>
                      <option value="lose_weight">Схуднення</option>
                      <option value="gain_muscle">Набір маси</option>
                      <option value="maintain">Підтримка</option>
                      <option value="endurance">Витривалість</option>
                      <option value="definition">Рельєф</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)', fontWeight: 600 }}>
                      Рівень складності *
                    </Form.Label>
                    <Form.Select
                      value={generateForm.difficulty}
                      onChange={(e) => setGenerateForm({ ...generateForm, difficulty: e.target.value })}
                      required
                    >
                      <option value="">Оберіть рівень</option>
                      <option value="beginner">Початковий</option>
                      <option value="intermediate">Середній</option>
                      <option value="advanced">Продвинутий</option>
                    </Form.Select>
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)', fontWeight: 600 }}>
                      Тривалість (тижні)
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="1"
                      max="12"
                      value={generateForm.duration}
                      onChange={(e) => setGenerateForm({ ...generateForm, duration: e.target.value })}
                    />
                  </Form.Group>
                </Col>
                <Col md={6}>
                  <Form.Group>
                    <Form.Label style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)', fontWeight: 600 }}>
                      Тренувань на тиждень
                    </Form.Label>
                    <Form.Control
                      type="number"
                      min="2"
                      max="6"
                      value={generateForm.daysPerWeek}
                      onChange={(e) => setGenerateForm({ ...generateForm, daysPerWeek: e.target.value })}
                    />
                  </Form.Group>
                </Col>
              </Row>

              <div className="mt-3">
                <Form.Label style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)', fontWeight: 600 }}>
                  Доступне обладнання
                </Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {['bodyweight', 'dumbbells', 'barbell', 'machine', 'none'].map((eq) => (
                    <Form.Check
                      key={eq}
                      type="checkbox"
                      id={`eq-${eq}`}
                      label={getEquipmentLabelUk(eq)}
                      checked={generateForm.equipment.includes(eq)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGenerateForm({
                            ...generateForm,
                            equipment: [...generateForm.equipment, eq]
                          });
                        } else {
                          setGenerateForm({
                            ...generateForm,
                            equipment: generateForm.equipment.filter(i => i !== eq)
                          });
                        }
                      }}
                      style={{ color: '#e0e0e0', fontFamily: 'var(--font-roboto-condensed)' }}
                    />
                  ))}
                </div>
              </div>

              <div className="mt-3">
                <Form.Label style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)', fontWeight: 600 }}>
                  Місце тренування
                </Form.Label>
                <div className="d-flex flex-wrap gap-2">
                  {['home', 'gym', 'outdoor'].map((loc) => (
                    <Form.Check
                      key={loc}
                      type="checkbox"
                      id={`loc-${loc}`}
                      label={getLocationLabelUk(loc)}
                      checked={generateForm.location.includes(loc)}
                      onChange={(e) => {
                        if (e.target.checked) {
                          setGenerateForm({
                            ...generateForm,
                            location: [...generateForm.location, loc]
                          });
                        } else {
                          setGenerateForm({
                            ...generateForm,
                            location: generateForm.location.filter(i => i !== loc)
                          });
                        }
                      }}
                      style={{ color: '#e0e0e0', fontFamily: 'var(--font-roboto-condensed)' }}
                    />
                  ))}
                </div>
              </div>
            </Form>
          </Modal.Body>
          <Modal.Footer className="border-secondary" style={{ background: 'rgba(20, 20, 20, 0.9)' }}>
            <Button variant="secondary" onClick={() => setShowGenerateModal(false)}>
              Скасувати
            </Button>
            <Button 
              variant="outline-primary" 
              onClick={handleGenerateProgram}
              disabled={generating || !generateForm.goal || !generateForm.difficulty}
            >
              {generating ? (
                <>
                  <Spinner size="sm" className="me-2" />
                  Створення...
                </>
              ) : (
                <>
                  <i className="bi bi-magic me-2"></i>
                  Створити
                </>
              )}
            </Button>
          </Modal.Footer>
        </Modal>
      </div>
    </>
  );
}

function uniqueDaysCount(exercises: ProgramExercise[]): number {
  const uniqueDays = new Set(exercises.map(ex => ex.day));
  return uniqueDays.size;
}

function getEquipmentLabelUk(equipment: string): string {
  const equipments: { [key: string]: string } = {
    bodyweight: 'Власна вага',
    dumbbells: 'Гантелі',
    barbell: 'Штанга',
    machine: 'Тренажер',
    none: 'Без інвентаря'
  };
  return equipments[equipment] || equipment;
}

function getLocationLabelUk(location: string): string {
  const locations: { [key: string]: string } = {
    home: 'Дома',
    gym: 'В залі',
    outdoor: 'На вулиці'
  };
  return locations[location] || location;
}

