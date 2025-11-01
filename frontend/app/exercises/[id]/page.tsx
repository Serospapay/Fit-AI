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
      } else {
        console.error('Exercise not found');
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
          <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
            {/* Back Button */}
            <div className="mb-4">
              <Button 
                variant="link" 
                className="p-0 nav-link d-flex align-items-center" 
                onClick={() => router.push('/exercises')}
                style={{ color: '#d4af37', textDecoration: 'none' }}
              >
                <i className="bi bi-arrow-left me-2 fs-4"></i>
                <span>Назад до вправ</span>
              </Button>
            </div>

            {/* Main Exercise Content */}
            <Row className="g-4">
              {/* Image and Video Section */}
              <Col lg={6}>
                <Card className="card-hover-lift mb-4">
                  <Card.Body className="p-0">
                    {exercise.imageUrl ? (
                      <div className="position-relative" style={{ width: '100%', paddingBottom: '100%', overflow: 'hidden' }}>
                        <img 
                          src={exercise.imageUrl} 
                          alt={exercise.nameUk || exercise.name}
                          className="position-absolute top-0 start-0 w-100 h-100"
                          style={{ objectFit: 'cover' }}
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    ) : (
                      <div className="d-flex align-items-center justify-content-center" style={{ minHeight: '300px', background: 'linear-gradient(135deg, rgba(212,175,55,0.1), rgba(212,175,55,0.05))' }}>
                        <i className="bi bi-image display-1" style={{ color: '#d4af37', opacity: 0.3 }}></i>
                      </div>
                    )}
                  </Card.Body>
                </Card>

                {exercise.videoUrl && (
                  <Card className="card-hover-lift">
                    <Card.Body className="p-4">
                      <h5 className="mb-3" style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37' }}>
                        <i className="bi bi-play-circle me-2"></i>
                        Відео інструкція
                      </h5>
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

              {/* Details Section */}
              <Col lg={6}>
                <div className="mb-4">
                  <div className="d-flex justify-content-between align-items-start mb-3">
                    <div>
                      <h1 className="mb-2" style={{ fontFamily: 'var(--font-bebas)', fontSize: '3.5rem', color: '#d4af37' }}>
                        {exercise.nameUk || exercise.name}
                      </h1>
                      <Badge bg={getDifficultyColor(exercise.difficulty)} className="px-3 py-2 fs-6">
                        {getDifficultyLabelUk(exercise.difficulty)}
                      </Badge>
                    </div>
                  </div>

                  <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)', fontSize: '1.1rem', lineHeight: '1.8' }}>
                    {exercise.descriptionUk || exercise.description}
                  </p>
                </div>

                {/* Exercise Info Cards */}
                <Row className="g-3 mb-4">
                  <Col md={6}>
                    <Card className="h-100">
                      <Card.Body className="text-center p-3">
                        <i className="bi bi-tag display-4 mb-2" style={{ color: '#d4af37' }}></i>
                        <div style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontWeight: 600 }}>
                          {getTypeLabelUk(exercise.type)}
                        </div>
                      </Card.Body>
                    </Card>
                  </Col>
                  {exercise.muscleGroup && (
                    <Col md={6}>
                      <Card className="h-100">
                        <Card.Body className="text-center p-3">
                          <i className="bi bi-controller display-4 mb-2" style={{ color: '#d4af37' }}></i>
                          <div style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontWeight: 600 }}>
                            {getMuscleGroupLabelUk(exercise.muscleGroup)}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                  {exercise.equipment && (
                    <Col md={6}>
                      <Card className="h-100">
                        <Card.Body className="text-center p-3">
                          <i className="bi bi-tools display-4 mb-2" style={{ color: '#d4af37' }}></i>
                          <div style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontWeight: 600 }}>
                            {exercise.equipment === 'bodyweight' ? 'Власна вага' :
                             exercise.equipment === 'dumbbells' ? 'Гантелі' :
                             exercise.equipment === 'barbell' ? 'Штанга' :
                             exercise.equipment === 'machine' ? 'Тренажер' :
                             'Без інвентаря'}
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                  {exercise.caloriesPerMin && (
                    <Col md={6}>
                      <Card className="h-100">
                        <Card.Body className="text-center p-3">
                          <i className="bi bi-fire display-4 mb-2" style={{ color: '#d4af37' }}></i>
                          <div style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontWeight: 600 }}>
                            {exercise.caloriesPerMin} ккал/хв
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  )}
                </Row>
              </Col>
            </Row>

            {/* Instructions, Tips, and Warnings */}
            <Row className="g-4 mt-3">
              {/* Instructions */}
              {exercise.instructionsUk && (
                <Col md={4}>
                  <Card className="card-hover-lift h-100">
                    <Card.Body className="p-4">
                      <h5 className="mb-3" style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37' }}>
                        <i className="bi bi-list-ol me-2"></i>
                        Інструкції виконання
                      </h5>
                      <p style={{ color: '#f5f5f5', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                        {exercise.instructionsUk}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              )}

              {/* Tips */}
              {exercise.tipsUk && (
                <Col md={4}>
                  <Card className="card-hover-lift h-100">
                    <Card.Body className="p-4">
                      <h5 className="mb-3" style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37' }}>
                        <i className="bi bi-lightbulb me-2"></i>
                        Корисні поради
                      </h5>
                      <p style={{ color: '#f5f5f5', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                        {exercise.tipsUk}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              )}

              {/* Warnings */}
              {exercise.warningsUk && (
                <Col md={4}>
                  <Card className="card-hover-lift h-100">
                    <Card.Body className="p-4">
                      <h5 className="mb-3" style={{ fontFamily: 'var(--font-oswald)', color: '#dc3545' }}>
                        <i className="bi bi-exclamation-triangle me-2"></i>
                        Застереження
                      </h5>
                      <p style={{ color: '#f5f5f5', fontFamily: 'var(--font-roboto-condensed)', lineHeight: '1.8', whiteSpace: 'pre-line' }}>
                        {exercise.warningsUk}
                      </p>
                    </Card.Body>
                  </Card>
                </Col>
              )}
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

