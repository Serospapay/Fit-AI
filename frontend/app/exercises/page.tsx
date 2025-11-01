'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Card, Spinner, Pagination } from 'react-bootstrap';
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
  location?: string;
  goal?: string;
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
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [filters, setFilters] = useState({
    type: '',
    muscleGroup: '',
    equipment: '',
    difficulty: '',
    location: '',
    goal: '',
    search: ''
  });
  const [options, setOptions] = useState<any>(null);

  useEffect(() => {
    fetchOptions();
  }, []);

  useEffect(() => {
    setCurrentPage(1);
    fetchExercises();
  }, [filters]);

  useEffect(() => {
    fetchExercises();
  }, [currentPage]);

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
      if (filters.location) params.append('location', filters.location);
      if (filters.goal) params.append('goal', filters.goal);
      if (filters.search) params.append('search', filters.search);
      params.append('page', currentPage.toString());
      params.append('limit', '20');

      const res = await fetch(`http://localhost:5000/api/exercises?${params.toString()}`);
      const data = await res.json();
      setExercises(data.exercises || []);
      setTotalPages(data.pagination?.pages || 1);
      setTotal(data.pagination?.total || 0);
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

  const getEquipmentLabelUk = (equipment: string) => {
    const equipments: { [key: string]: string } = {
      bodyweight: 'Власна вага',
      dumbbells: 'Гантелі',
      barbell: 'Штанга',
      machine: 'Тренажер',
      none: 'Без інвентаря'
    };
    return equipments[equipment] || equipment;
  };

  const getLocationLabelUk = (location: string) => {
    const locations: { [key: string]: string } = {
      home: 'Дома',
      gym: 'В залі',
      outdoor: 'На вулиці'
    };
    return locations[location] || location;
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
                <a href="/programs" className="nav-link d-flex align-items-center">
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
          <div className="mb-4">
            <h1 className="mb-2" style={{ fontFamily: 'var(--font-bebas)', fontSize: '3rem', color: '#d4af37' }}>База вправ</h1>
            <p className="lead mb-0" style={{ color: '#aaa', fontFamily: 'var(--font-oswald)', fontSize: '1.2rem' }}>
              Виберіть вправи для свого тренування
              {total > 0 && (
                <span className="ms-3" style={{ color: '#d4af37', fontSize: '1rem' }}>
                  ({total} вправ)
                </span>
              )}
            </p>
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
                      <option key={type} value={type}>{getTypeLabelUk(type)}</option>
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
                      <option key={group} value={group}>{getMuscleGroupLabelUk(group)}</option>
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
                      <option key={eq} value={eq}>{getEquipmentLabelUk(eq)}</option>
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
                      <option key={diff} value={diff}>{getDifficultyLabelUk(diff)}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filters.location}
                    onChange={(e) => setFilters({ ...filters, location: e.target.value })}
                  >
                    <option value="">Всі місця</option>
                    {options?.locations?.map((loc: string) => (
                      <option key={loc} value={loc}>{getLocationLabelUk(loc)}</option>
                    ))}
                  </Form.Select>
                </Col>
                <Col md={3}>
                  <Form.Select
                    value={filters.goal}
                    onChange={(e) => setFilters({ ...filters, goal: e.target.value })}
                  >
                    <option value="">Всі цілі</option>
                    {options?.goals?.map((g: string) => (
                      <option key={g} value={g}>{getGoalLabelUk(g)}</option>
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
                    <Card className="card-hover-lift h-100" style={{ cursor: 'pointer', transition: 'all 0.3s ease' }} onClick={() => router.push(`/exercises/${exercise.id}`)}>
                      <Card.Body className="p-4">
                        <div className="d-flex align-items-start gap-3 mb-3">
                          <div className="flex-grow-1">
                            <h5 className="mb-2" style={{ fontFamily: 'var(--font-oswald)', color: '#f5f5f5', fontSize: '1.15rem', lineHeight: '1.3', fontWeight: 600 }}>
                              {exercise.nameUk || exercise.name}
                            </h5>
                            <div className="d-flex flex-wrap gap-2 mb-2">
                              {exercise.type && (
                                <span className="badge" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', background: 'rgba(212, 175, 55, 0.2)', color: '#d4af37', border: '1px solid #d4af37' }}>
                                  {getTypeLabelUk(exercise.type)}
                                </span>
                              )}
                              {exercise.muscleGroup && (
                                <span className="badge" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', background: 'rgba(13, 110, 253, 0.2)', color: '#0d6efd', border: '1px solid #0d6efd' }}>
                                  {getMuscleGroupLabelUk(exercise.muscleGroup)}
                                </span>
                              )}
                              {exercise.location && (
                                <span className="badge" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', background: 'rgba(25, 135, 84, 0.2)', color: '#198754', border: '1px solid #198754' }}>
                                  {getLocationLabelUk(exercise.location)}
                                </span>
                              )}
                              {exercise.goal && (
                                <span className="badge" style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem', background: 'rgba(255, 193, 7, 0.2)', color: '#ffc107', border: '1px solid #ffc107' }}>
                                  {getGoalLabelUk(exercise.goal)}
                                </span>
                              )}
                              <span className={`badge bg-${getDifficultyColor(exercise.difficulty)}`} style={{ fontSize: '0.7rem', padding: '0.3rem 0.6rem' }}>
                                {getDifficultyLabelUk(exercise.difficulty)}
                              </span>
                            </div>
                          </div>
                          {(exercise.imageUrl || exercise.videoUrl) && (
                            <div className="d-flex gap-1">
                              {exercise.imageUrl && (
                                <i className="bi bi-camera-fill" style={{ color: '#d4af37', fontSize: '1.1rem' }}></i>
                              )}
                              {exercise.videoUrl && (
                                <i className="bi bi-play-circle-fill" style={{ color: '#d4af37', fontSize: '1.1rem' }}></i>
                              )}
                            </div>
                          )}
                        </div>
                        {exercise.descriptionUk && (
                          <p className="small mb-3" style={{ color: '#aaa', fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.9rem', lineHeight: '1.6', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                            {exercise.descriptionUk}
                          </p>
                        )}
                        {exercise.caloriesPerMin && (
                          <div className="small d-flex align-items-center" style={{ color: '#d4af37', fontFamily: 'var(--font-roboto-condensed)', fontWeight: 600 }}>
                            <i className="bi bi-fire me-1"></i>
                            <span>{exercise.caloriesPerMin} ккал/хв</span>
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

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-4">
              <Pagination>
                <Pagination.First onClick={() => setCurrentPage(1)} disabled={currentPage === 1} />
                <Pagination.Prev onClick={() => setCurrentPage(Math.max(1, currentPage - 1))} disabled={currentPage === 1} />
                {[...Array(totalPages)].map((_, i) => {
                  const page = i + 1;
                  if (page === 1 || page === totalPages || (page >= currentPage - 2 && page <= currentPage + 2)) {
                    return (
                      <Pagination.Item
                        key={page}
                        active={page === currentPage}
                        onClick={() => setCurrentPage(page)}
                      >
                        {page}
                      </Pagination.Item>
                    );
                  } else if (page === currentPage - 3 || page === currentPage + 3) {
                    return <Pagination.Ellipsis key={page} />;
                  }
                  return null;
                })}
                <Pagination.Next onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))} disabled={currentPage === totalPages} />
                <Pagination.Last onClick={() => setCurrentPage(totalPages)} disabled={currentPage === totalPages} />
              </Pagination>
            </div>
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

