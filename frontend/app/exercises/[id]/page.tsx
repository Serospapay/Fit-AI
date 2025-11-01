'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Row, Col, Card, Button, Badge, Spinner } from 'react-bootstrap';
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
  instructions?: string;
  instructionsUk?: string;
  tips?: string;
  tipsUk?: string;
  warnings?: string;
  warningsUk?: string;
  imageUrl?: string;
  videoUrl?: string;
  caloriesPerMin?: number;
}

export default function ExerciseDetailPage() {
  const params = useParams();
  const router = useRouter();
  const exerciseId = params.id as string;
  
  const [exercise, setExercise] = useState<Exercise | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (exerciseId) {
      fetchExercise();
    }
  }, [exerciseId]);

  const fetchExercise = async () => {
    setLoading(true);
    try {
      const res = await fetch(`http://localhost:5000/api/exercises/${exerciseId}`);
      if (res.ok) {
        const data = await res.json();
        setExercise(data);
      }
    } catch (error) {
      console.error('Error fetching exercise:', error);
    } finally {
      setLoading(false);
    }
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

  const getTypeLabelUk = (type: string) => {
    const types: { [key: string]: string } = {
      strength: 'Сила',
      cardio: 'Кардіо',
      flexibility: 'Гнучкість',
      balance: 'Баланс'
    };
    return types[type] || type;
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

  if (!exercise) {
    return (
      <>
        <BootstrapClient />
        <div className="min-h-screen bg-dark d-flex align-items-center justify-content-center">
          <Card>
            <Card.Body className="text-center py-5">
              <i className="bi bi-exclamation-triangle display-1 mb-3" style={{ color: '#d4af37' }}></i>
              <h3>Вправу не знайдено</h3>
              <Button variant="outline-primary" onClick={() => router.push('/exercises')}>
                Повернутися до вправ
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
                <a href="/exercises" className="nav-link fw-bold d-flex align-items-center">
                  <i className="bi bi-dumbbell me-2"></i>
                  <span>Вправи</span>
                </a>
                <a href="/workouts" className="nav-link d-flex align-items-center">
                  <i className="bi bi-calendar-check me-2"></i>
                  <span>Тренування</span>
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
          <Container className="py-4" style={{ position: 'relative', zIndex: 1, maxWidth: '1400px' }}>
            {/* Back Button */}
            <Button 
              variant="link" 
              className="p-0 mb-3" 
              onClick={() => router.push('/exercises')}
              style={{ color: '#d4af37', textDecoration: 'none' }}
            >
              <i className="bi bi-arrow-left me-2"></i>
              <span>Назад до вправ</span>
            </Button>

            <Row className="g-4">
              {/* Left: Media */}
              <Col lg={8}>
                {exercise.videoUrl ? (
                  <div className="ratio ratio-16x9 mb-3" style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                    <iframe
                      src={exercise.videoUrl.replace('/watch?v=', '/embed/')}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      title={exercise.nameUk || exercise.name}
                      style={{ border: 'none' }}
                    ></iframe>
                  </div>
                ) : exercise.imageUrl ? (
                  <div className="mb-3" style={{ borderRadius: '8px', overflow: 'hidden', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                    <img 
                      src={exercise.imageUrl} 
                      alt={exercise.nameUk || exercise.name}
                      className="w-100"
                      style={{ display: 'block' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '';
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                ) : (
                  <div className="mb-3 d-flex align-items-center justify-content-center rounded" style={{ minHeight: '300px', background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.05))', boxShadow: '0 4px 12px rgba(0,0,0,0.3)' }}>
                    <i className="bi bi-image" style={{ color: '#d4af37', opacity: 0.3, fontSize: '4rem' }}></i>
                  </div>
                )}
              </Col>

              {/* Right: Info */}
              <Col lg={4}>
                <div className="d-flex flex-column gap-3">
                  {/* Title */}
                  <div>
                    <div className="d-flex align-items-center gap-2 mb-2">
                      <h1 className="mb-0" style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.2rem', color: '#d4af37' }}>
                        {exercise.nameUk || exercise.name}
                      </h1>
                    </div>
                    <Badge bg={getDifficultyColor(exercise.difficulty)} className="mb-2">
                      {getDifficultyLabelUk(exercise.difficulty)}
                    </Badge>
                    {exercise.descriptionUk && (
                      <p style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.95rem', lineHeight: '1.6', marginBottom: 0 }}>
                        {exercise.descriptionUk}
                      </p>
                    )}
                  </div>

                  {/* Quick Info */}
                  <Card className="flex-grow-1">
                    <Card.Body className="p-3">
                      <Row className="g-3">
                        <Col xs={6}>
                          <div className="text-center">
                            <i className="bi bi-tag fs-4 mb-1 d-block" style={{ color: '#d4af37' }}></i>
                            <div className="small text-muted mb-1">Тип</div>
                            <div style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontWeight: 600, fontSize: '0.9rem' }}>
                              {getTypeLabelUk(exercise.type)}
                            </div>
                          </div>
                        </Col>
                        {exercise.muscleGroup && (
                          <Col xs={6}>
                            <div className="text-center">
                              <i className="bi bi-controller fs-4 mb-1 d-block" style={{ color: '#d4af37' }}></i>
                              <div className="small text-muted mb-1">Група м'язів</div>
                              <div style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontWeight: 600, fontSize: '0.9rem' }}>
                                {getMuscleGroupLabelUk(exercise.muscleGroup)}
                              </div>
                            </div>
                          </Col>
                        )}
                        {exercise.equipment && (
                          <Col xs={6}>
                            <div className="text-center">
                              <i className="bi bi-tools fs-4 mb-1 d-block" style={{ color: '#d4af37' }}></i>
                              <div className="small text-muted mb-1">Інвентар</div>
                              <div style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontWeight: 600, fontSize: '0.9rem' }}>
                                {exercise.equipment === 'bodyweight' ? 'Власна вага' :
                                 exercise.equipment === 'dumbbells' ? 'Гантелі' :
                                 exercise.equipment === 'barbell' ? 'Штанга' :
                                 exercise.equipment === 'machine' ? 'Тренажер' :
                                 'Немає'}
                              </div>
                            </div>
                          </Col>
                        )}
                        {exercise.caloriesPerMin && (
                          <Col xs={6}>
                            <div className="text-center">
                              <i className="bi bi-fire fs-4 mb-1 d-block" style={{ color: '#d4af37' }}></i>
                              <div className="small text-muted mb-1">Калорії</div>
                              <div style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontWeight: 600, fontSize: '0.9rem' }}>
                                {exercise.caloriesPerMin} / хв
                              </div>
                            </div>
                          </Col>
                        )}
                      </Row>
                    </Card.Body>
                  </Card>
                </div>
              </Col>
            </Row>

            {/* Instructions, Tips, Warnings */}
            {(exercise.instructionsUk || exercise.tipsUk || exercise.warningsUk) && (
              <Row className="g-3 mt-2">
                {exercise.instructionsUk && (
                  <Col md={4}>
                    <Card className="h-100" style={{ borderTop: '4px solid #d4af37' }}>
                      <Card.Body className="p-4">
                        <h5 className="mb-3" style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', fontSize: '1.1rem' }}>
                          <i className="bi bi-list-ol me-2"></i>Інструкції
                        </h5>
                        <p style={{ color: '#e0e0e0', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.8', whiteSpace: 'pre-line', marginBottom: 0 }}>
                          {exercise.instructionsUk}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                )}

                {exercise.tipsUk && (
                  <Col md={4}>
                    <Card className="h-100" style={{ borderTop: '4px solid #d4af37' }}>
                      <Card.Body className="p-4">
                        <h5 className="mb-3" style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', fontSize: '1.1rem' }}>
                          <i className="bi bi-lightbulb me-2"></i>Поради
                        </h5>
                        <p style={{ color: '#e0e0e0', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.8', whiteSpace: 'pre-line', marginBottom: 0 }}>
                          {exercise.tipsUk}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                )}

                {exercise.warningsUk && (
                  <Col md={4}>
                    <Card className="h-100" style={{ borderTop: '4px solid #dc3545' }}>
                      <Card.Body className="p-4">
                        <h5 className="mb-3" style={{ fontFamily: 'var(--font-oswald)', color: '#dc3545', fontSize: '1.1rem' }}>
                          <i className="bi bi-exclamation-triangle me-2"></i>Застереження
                        </h5>
                        <p style={{ color: '#e0e0e0', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.8', whiteSpace: 'pre-line', marginBottom: 0 }}>
                          {exercise.warningsUk}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                )}
              </Row>
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
      </div>
    </>
  );
}
