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
                  <span>Dashboard</span>
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
          <Container className="py-4" style={{ position: 'relative', zIndex: 1, maxWidth: '1200px' }}>
            {/* Header Section */}
            <div className="mb-4">
              <Button 
                variant="link" 
                className="p-0 nav-link d-flex align-items-center mb-3" 
                onClick={() => router.push('/exercises')}
                style={{ color: '#d4af37', textDecoration: 'none' }}
              >
                <i className="bi bi-arrow-left me-2"></i>
                <span>Назад</span>
              </Button>
              
              <div className="d-flex align-items-start gap-3">
                {exercise.imageUrl && (
                  <div style={{ width: '120px', height: '120px', flexShrink: 0, overflow: 'hidden', borderRadius: '8px' }}>
                    <img 
                      src={exercise.imageUrl} 
                      alt={exercise.nameUk || exercise.name}
                      className="w-100 h-100"
                      style={{ objectFit: 'cover' }}
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = '';
                        target.style.display = 'none';
                      }}
                    />
                  </div>
                )}
                <div className="flex-grow-1">
                  <div className="d-flex align-items-center gap-2 mb-2">
                    <h1 className="mb-0" style={{ fontFamily: 'var(--font-bebas)', fontSize: '2.5rem', color: '#d4af37' }}>
                      {exercise.nameUk || exercise.name}
                    </h1>
                    <Badge bg={getDifficultyColor(exercise.difficulty)} className="px-3 py-2">
                      {getDifficultyLabelUk(exercise.difficulty)}
                    </Badge>
                  </div>
                  {exercise.descriptionUk && (
                    <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)', fontSize: '1rem', marginBottom: 0 }}>
                      {exercise.descriptionUk}
                    </p>
                  )}
                </div>
              </div>
            </div>

            {/* Main Content */}
            <Row className="g-4">
              {/* Left Column - Media */}
              <Col lg={7}>
                {exercise.videoUrl && (
                  <Card className="mb-3" style={{ border: '3px solid #d4af37' }}>
                    <Card.Body className="p-0">
                      <div className="ratio ratio-16x9">
                        <iframe
                          src={exercise.videoUrl.replace('/watch?v=', '/embed/')}
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                          title={exercise.nameUk || exercise.name}
                        ></iframe>
                      </div>
                    </Card.Body>
                  </Card>
                )}
              </Col>

              {/* Right Column - Info */}
              <Col lg={5}>
                <Card className="mb-3">
                  <Card.Body className="p-3">
                    <Row className="g-3">
                      <Col xs={6} sm={4}>
                        <div className="text-center">
                          <i className="bi bi-tag fs-3 mb-2 d-block" style={{ color: '#d4af37' }}></i>
                          <div className="small" style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontWeight: 600 }}>
                            {getTypeLabelUk(exercise.type)}
                          </div>
                        </div>
                      </Col>
                      {exercise.muscleGroup && (
                        <Col xs={6} sm={4}>
                          <div className="text-center">
                            <i className="bi bi-controller fs-3 mb-2 d-block" style={{ color: '#d4af37' }}></i>
                            <div className="small" style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontWeight: 600 }}>
                              {getMuscleGroupLabelUk(exercise.muscleGroup)}
                            </div>
                          </div>
                        </Col>
                      )}
                      {exercise.equipment && (
                        <Col xs={6} sm={4}>
                          <div className="text-center">
                            <i className="bi bi-tools fs-3 mb-2 d-block" style={{ color: '#d4af37' }}></i>
                            <div className="small" style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontWeight: 600 }}>
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
                        <Col xs={6} sm={4}>
                          <div className="text-center">
                            <i className="bi bi-fire fs-3 mb-2 d-block" style={{ color: '#d4af37' }}></i>
                            <div className="small" style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontWeight: 600 }}>
                              {exercise.caloriesPerMin} ккал/хв
                            </div>
                          </div>
                        </Col>
                      )}
                    </Row>
                  </Card.Body>
                </Card>
              </Col>
            </Row>

            {/* Instructions, Tips, Warnings */}
            {(exercise.instructionsUk || exercise.tipsUk || exercise.warningsUk) && (
              <Row className="g-3">
                {exercise.instructionsUk && (
                  <Col md={4}>
                    <Card className="h-100" style={{ border: '3px solid #d4af37' }}>
                      <Card.Body className="p-3">
                        <h6 className="mb-2" style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37' }}>
                          <i className="bi bi-list-ol me-2"></i>Інструкції
                        </h6>
                        <p className="small mb-0" style={{ color: '#f5f5f5', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                          {exercise.instructionsUk}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                )}

                {exercise.tipsUk && (
                  <Col md={4}>
                    <Card className="h-100">
                      <Card.Body className="p-3">
                        <h6 className="mb-2" style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37' }}>
                          <i className="bi bi-lightbulb me-2"></i>Поради
                        </h6>
                        <p className="small mb-0" style={{ color: '#f5f5f5', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
                          {exercise.tipsUk}
                        </p>
                      </Card.Body>
                    </Card>
                  </Col>
                )}

                {exercise.warningsUk && (
                  <Col md={4}>
                    <Card className="h-100" style={{ border: '3px solid #dc3545' }}>
                      <Card.Body className="p-3">
                        <h6 className="mb-2" style={{ fontFamily: 'var(--font-oswald)', color: '#dc3545' }}>
                          <i className="bi bi-exclamation-triangle me-2"></i>Увага!
                        </h6>
                        <p className="small mb-0" style={{ color: '#f5f5f5', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.6', whiteSpace: 'pre-line' }}>
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
