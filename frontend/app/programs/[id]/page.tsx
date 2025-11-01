'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import BootstrapClient from '../../components/BootstrapClient';
import GymPostersBackground from '../../components/GymPostersBackground';
import GymLogo from '../../components/GymLogo';

interface Exercise {
  id: string;
  name: string;
  nameUk?: string;
  description?: string;
  descriptionUk?: string;
  type: string;
  muscleGroup?: string;
  equipment?: string;
  difficulty: string;
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

export default function ProgramDetailPage() {
  const params = useParams();
  const router = useRouter();
  const programId = params.id as string;
  
  const [program, setProgram] = useState<Program | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (programId) {
      fetchProgram();
    }
  }, [programId]);

  const fetchProgram = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/programs/${programId}`);
      if (res.ok) {
        const data = await res.json();
        setProgram(data);
      } else {
        console.error('Program not found');
      }
    } catch (error) {
      console.error('Error fetching program:', error);
    } finally {
      setLoading(false);
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
    const days = ['Неділя', 'Понеділок', 'Вівторок', 'Середа', 'Четвер', 'П\'ятниця', 'Субота'];
    return days[day - 1] || '';
  };

  const getMuscleGroupLabelUk = (muscleGroup: string) => {
    const groups: { [key: string]: string } = {
      chest: 'Грудні',
      back: 'Спина',
      legs: 'Ноги',
      arms: 'Руки',
      shoulders: 'Плечі',
      core: 'Прес',
      full_body: 'Все тіло'
    };
    return groups[muscleGroup] || muscleGroup;
  };

  // Group exercises by day
  const exercisesByDay: { [key: number]: ProgramExercise[] } = {};
  if (program) {
    program.exercises.forEach(ex => {
      if (!exercisesByDay[ex.day]) {
        exercisesByDay[ex.day] = [];
      }
      exercisesByDay[ex.day].push(ex);
    });
  }

  if (loading) {
    return (
      <>
        <BootstrapClient />
        <div className="min-h-screen bg-dark d-flex align-items-center justify-content-center">
          <Spinner animation="border" variant="primary" />
        </div>
      </>
    );
  }

  if (!program) {
    return (
      <>
        <BootstrapClient />
        <div className="min-h-screen bg-dark d-flex align-items-center justify-content-center">
          <Card>
            <Card.Body className="text-center py-5">
              <i className="bi bi-exclamation-triangle display-1 mb-3" style={{ color: '#d4af37' }}></i>
              <h3>Програму не знайдено</h3>
              <Button variant="outline-primary" onClick={() => router.push('/programs')}>
                Повернутися до програм
              </Button>
            </Card.Body>
          </Card>
        </div>
      </>
    );
  }

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
              </div>
            </div>
          </Container>
        </nav>

        <main className="flex-grow-1" style={{ position: 'relative' }}>
          <Container className="py-5" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px' }}>
            {/* Back Button */}
            <Button 
              variant="link" 
              className="p-0 mb-3" 
              onClick={() => router.push('/programs')}
              style={{ color: '#d4af37', textDecoration: 'none' }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              <span>Назад до програм</span>
            </Button>

            {/* Program Header */}
            <Card className="card-hover-lift mb-4">
              <Card.Body className="p-4">
                <Row className="align-items-center">
                  <Col md={8}>
                    <h1 className="mb-2" style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.5rem', color: '#d4af37' }}>
                      {program.nameUk || program.name}
                    </h1>
                    {program.descriptionUk && (
                      <p className="lead mb-3" style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', fontSize: '1.1rem' }}>
                        {program.descriptionUk}
                      </p>
                    )}
                    <div className="d-flex flex-wrap gap-2">
                      <Badge bg={getDifficultyColor(program.difficulty)} className="px-3 py-2" style={{ fontSize: '0.95rem' }}>
                        {getDifficultyLabelUk(program.difficulty)}
                      </Badge>
                      <Badge className="px-3 py-2" style={{ fontSize: '0.95rem', background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37', border: '1px solid #d4af37' }}>
                        {getGoalLabelUk(program.goal)}
                      </Badge>
                      {program.duration && (
                        <Badge className="px-3 py-2" style={{ fontSize: '0.95rem', background: 'rgba(13, 110, 253, 0.2)', color: '#0d6efd', border: '1px solid #0d6efd' }}>
                          <i className="bi bi-calendar me-1"></i>
                          {Math.ceil(program.duration / 7)} тижні
                        </Badge>
                      )}
                      <Badge className="px-3 py-2" style={{ fontSize: '0.95rem', background: 'rgba(25, 135, 84, 0.2)', color: '#198754', border: '1px solid #198754' }}>
                        <i className="bi bi-list-ul me-1"></i>
                        {program.exercises.length} вправ
                      </Badge>
                      {program.isDefault && (
                        <Badge bg="primary" className="px-3 py-2" style={{ fontSize: '0.95rem' }}>
                          <i className="bi bi-star-fill me-1"></i>
                          За замовчуванням
                        </Badge>
                      )}
                    </div>
                  </Col>
                  <Col md={4} className="text-end">
                    <Button variant="outline-primary" size="lg" style={{ fontFamily: 'var(--font-oswald)', fontSize: '1rem', fontWeight: 600 }}>
                      <i className="bi bi-play-circle me-2"></i>
                      Почати програму
                    </Button>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Weekly Schedule */}
            <div className="mb-4">
              <h3 className="mb-3" style={{ fontFamily: 'var(--font-bebas)', fontSize: '2rem', color: '#d4af37' }}>
                Розклад на тиждень
              </h3>
              <Row className="g-3">
                {Object.entries(exercisesByDay).map(([day, exercises]) => (
                  <Col md={6} lg={4} key={day}>
                    <Card className="card-hover-lift h-100" style={{ borderLeft: '4px solid #d4af37' }}>
                      <Card.Body className="p-3">
                        <h5 className="mb-3 d-flex align-items-center" style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', fontSize: '1.2rem', fontWeight: 600 }}>
                          <i className="bi bi-calendar-day me-2"></i>
                          {getWeekDayLabel(parseInt(day))}
                        </h5>
                        <div className="d-flex flex-column gap-2">
                          {exercises.map((programEx, idx) => (
                            <div 
                              key={programEx.id} 
                              className="p-2 rounded" 
                              style={{ 
                                background: 'rgba(212, 175, 55, 0.05)', 
                                cursor: 'pointer',
                                transition: 'all 0.2s'
                              }}
                              onMouseEnter={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.1)'; }}
                              onMouseLeave={(e) => { e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)'; }}
                              onClick={() => router.push(`/exercises/${programEx.exerciseId}`)}
                            >
                              <div className="d-flex justify-content-between align-items-start mb-1">
                                <span style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontWeight: 600, fontSize: '0.95rem' }}>
                                  {idx + 1}. {programEx.exercise.nameUk || programEx.exercise.name}
                                </span>
                                <Badge style={{ fontSize: '0.7rem', background: 'rgba(13, 110, 253, 0.2)', color: '#0d6efd', border: '1px solid #0d6efd' }}>
                                  {programEx.exercise.muscleGroup ? getMuscleGroupLabelUk(programEx.exercise.muscleGroup) : 'Всі групи'}
                                </Badge>
                              </div>
                              <div className="small text-muted" style={{ fontFamily: 'var(--font-roboto-condensed)' }}>
                                {programEx.sets && programEx.reps && (
                                  <span>{programEx.sets} підх × {programEx.reps} повт</span>
                                )}
                                {programEx.duration && (
                                  <span>{programEx.duration} хв</span>
                                )}
                                {programEx.rest && (
                                  <span> • Відпочинок: {programEx.rest}с</span>
                                )}
                              </div>
                              {programEx.notes && (
                                <div className="small mt-1" style={{ color: '#d4af37', fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.85rem' }}>
                                  <i className="bi bi-info-circle me-1"></i>
                                  {programEx.notes}
                                </div>
                              )}
                            </div>
                          ))}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Exercise List */}
            <Card className="card-hover-lift">
              <Card.Body className="p-4">
                <h4 className="mb-3" style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', fontSize: '1.3rem', fontWeight: 600 }}>
                  <i className="bi bi-list-ol me-2"></i>
                  Всі вправи програми
                </h4>
                <div className="table-responsive">
                  <table className="table table-dark table-hover" style={{ fontFamily: 'var(--font-roboto-condensed)' }}>
                    <thead style={{ borderBottom: '2px solid #d4af37' }}>
                      <tr>
                        <th style={{ color: '#d4af37' }}>#</th>
                        <th style={{ color: '#d4af37' }}>Вправа</th>
                        <th style={{ color: '#d4af37' }}>Група м'язів</th>
                        <th style={{ color: '#d4af37' }}>Підх</th>
                        <th style={{ color: '#d4af37' }}>Повт</th>
                        <th style={{ color: '#d4af37' }}>Трив</th>
                        <th style={{ color: '#d4af37' }}>Відп</th>
                      </tr>
                    </thead>
                    <tbody>
                      {program.exercises.map((programEx, idx) => (
                        <tr 
                          key={programEx.id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => router.push(`/exercises/${programEx.exerciseId}`)}
                        >
                          <td>{idx + 1}</td>
                          <td className="fw-semibold">
                            {programEx.exercise.nameUk || programEx.exercise.name}
                            {programEx.notes && (
                              <div className="small text-muted">
                                <i className="bi bi-info-circle me-1"></i>
                                {programEx.notes}
                              </div>
                            )}
                          </td>
                          <td>
                            {programEx.exercise.muscleGroup ? (
                              <Badge style={{ fontSize: '0.75rem', background: 'rgba(13, 110, 253, 0.2)', color: '#0d6efd', border: '1px solid #0d6efd' }}>
                                {getMuscleGroupLabelUk(programEx.exercise.muscleGroup)}
                              </Badge>
                            ) : (
                              <span className="text-muted">-</span>
                            )}
                          </td>
                          <td>{programEx.sets || '-'}</td>
                          <td>{programEx.reps || '-'}</td>
                          <td>{programEx.duration ? `${programEx.duration} хв` : '-'}</td>
                          <td>{programEx.rest ? `${programEx.rest}с` : '-'}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card.Body>
            </Card>
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

