'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Card, Spinner } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import GymPostersBackground from '../components/GymPostersBackground';
import GymLogo from '../components/GymLogo';

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

export default function ExercisesPage() {
  const router = useRouter();
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    type: '',
    muscleGroup: '',
    equipment: '',
    difficulty: '',
    search: ''
  });
  const [options, setOptions] = useState<any>(null);

  useEffect(() => {
    fetchOptions();
    fetchExercises();
  }, []);

  useEffect(() => {
    fetchExercises();
  }, [filters]);

  const fetchOptions = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/exercises/options');
      const data = await res.json();
      setOptions(data);
    } catch (error) {
      console.error('Error fetching options:', error);
    }
  };

  const fetchExercises = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (filters.type) params.append('type', filters.type);
      if (filters.muscleGroup) params.append('muscleGroup', filters.muscleGroup);
      if (filters.equipment) params.append('equipment', filters.equipment);
      if (filters.difficulty) params.append('difficulty', filters.difficulty);
      if (filters.search) params.append('search', filters.search);

      const res = await fetch(`http://localhost:5000/api/exercises?${params.toString()}`);
      const data = await res.json();
      setExercises(data.exercises || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
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
          <div className="mb-4">
            <h1 className="mb-2">База вправ</h1>
            <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>Виберіть вправи для свого тренування</p>
          </div>

          {/* Filters */}
          <Card className="card-hover-lift mb-4">
            <Card.Body>
              <Row className="g-3">
                <Col md={12}>
                  <Form.Control
                    type="text"
                    placeholder="Пошук вправ..."
                    value={filters.search}
                    onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                  />
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filters.type}
                    onChange={(e) => setFilters({ ...filters, type: e.target.value })}
                  >
                    <option value="">Всі типи</option>
                    {options?.types?.map((type: string) => (
                      <option key={type} value={type}>{type}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filters.muscleGroup}
                    onChange={(e) => setFilters({ ...filters, muscleGroup: e.target.value })}
                  >
                    <option value="">Всі групи м'язів</option>
                    {options?.muscleGroups?.map((group: string) => (
                      <option key={group} value={group}>{group}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filters.equipment}
                    onChange={(e) => setFilters({ ...filters, equipment: e.target.value })}
                  >
                    <option value="">Всі пристрої</option>
                    {options?.equipments?.map((eq: string) => (
                      <option key={eq} value={eq}>{eq}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filters.difficulty}
                    onChange={(e) => setFilters({ ...filters, difficulty: e.target.value })}
                  >
                    <option value="">Будь-який рівень</option>
                    {options?.difficulties?.map((diff: string) => (
                      <option key={diff} value={diff}>{diff}</option>
                    ))}
                  </Form.Select>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          {/* Exercises Grid */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : exercises.length > 0 ? (
            <Row className="g-3">
                {exercises.map((exercise) => (
                  <Col key={exercise.id} md={6} lg={4}>
                    <Card className="card-hover-lift h-100" style={{ cursor: 'pointer' }} onClick={() => router.push(`/exercises/${exercise.id}`)}>
                      <Card.Body className="p-3">
                        <div className="d-flex align-items-start gap-2 mb-2">
                          <div className="flex-grow-1">
                            <h6 className="mb-1" style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontSize: '1.1rem', lineHeight: '1.3' }}>
                              {exercise.nameUk || exercise.name}
                            </h6>
                            <div className="d-flex flex-wrap gap-1 mb-2">
                              {exercise.type && (
                                <span className="badge bg-primary" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>{exercise.type}</span>
                              )}
                              {exercise.muscleGroup && (
                                <span className="badge bg-info" style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>{exercise.muscleGroup}</span>
                              )}
                              <span className={`badge bg-${getDifficultyColor(exercise.difficulty)}`} style={{ fontSize: '0.7rem', padding: '0.25rem 0.5rem' }}>
                                {exercise.difficulty}
                              </span>
                            </div>
                          </div>
                          {(exercise.imageUrl || exercise.videoUrl) && (
                            <div>
                              {exercise.imageUrl && (
                                <i className="bi bi-camera-fill me-1" style={{ color: '#d4af37' }}></i>
                              )}
                              {exercise.videoUrl && (
                                <i className="bi bi-play-circle-fill" style={{ color: '#d4af37' }}></i>
                              )}
                            </div>
                          )}
                        </div>
                        {exercise.descriptionUk && (
                          <p className="small mb-2" style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.85rem', lineHeight: '1.5', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {exercise.descriptionUk}
                          </p>
                        )}
                        {exercise.caloriesPerMin && (
                          <div className="small" style={{ color: '#d4af37', fontFamily: 'var(--font-roboto-condensed)' }}>
                            <i className="bi bi-fire me-1"></i>{exercise.caloriesPerMin} ккал/хв
                          </div>
                        )}
                      </Card.Body>
                    </Card>
                  </Col>
                ))}
            </Row>
          ) : (
            <Card>
              <Card.Body className="text-center py-5">
                <i className="bi bi-search display-1 mb-3" style={{ color: '#d4af37' }}></i>
                <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Вправи не знайдено</p>
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
      </div>
    </>
  );
}

