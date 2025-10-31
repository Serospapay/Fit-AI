'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Card, Spinner } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import ParallaxWrapper from '../components/ParallaxWrapper';

interface Exercise {
  id: string;
  name: string;
  nameUk?: string;
  description?: string;
  type: string;
  muscleGroup?: string;
  equipment?: string;
  difficulty: string;
  caloriesPerMin?: number;
}

export default function ExercisesPage() {
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
      <div className="min-h-screen" style={{ background: 'linear-gradient(180deg, #0a0a0f 0%, #1a1a2e 50%, #0a0a0f 100%)', position: 'relative' }}>
        {/* Background Grid */}
        <div className="position-fixed w-100 h-100" style={{ backgroundImage: 'linear-gradient(cyan 1px, transparent 1px), linear-gradient(90deg, cyan 1px, transparent 1px)', backgroundSize: '50px 50px', opacity: 0.05, pointerEvents: 'none', zIndex: 0 }}></div>
        
        {/* Navigation */}
        <nav style={{ position: 'sticky', top: 0, zIndex: 1000, background: 'rgba(10, 10, 15, 0.9)', borderBottom: '3px solid #00d4ff', backdropFilter: 'blur(10px)' }}>
          <Container>
            <div className="d-flex justify-content-between align-items-center py-3">
              <a href="/dashboard" className="fw-bold fs-4 text-gradient text-decoration-none animate-glow">
                Кишеньковий тренер
              </a>
              <div className="d-flex align-items-center gap-3">
                <a href="/dashboard" className="text-decoration-none nav-link" style={{ color: '#00d4ff' }}>Dashboard</a>
                <a href="/exercises" className="text-decoration-none nav-link fw-bold animate-neon-blink" style={{ color: '#ff00aa' }}>Вправи</a>
                <a href="/workouts" className="text-decoration-none nav-link" style={{ color: '#00d4ff' }}>Тренування</a>
                <a href="/calculators" className="text-decoration-none nav-link" style={{ color: '#00d4ff' }}>Калькулятори</a>
              </div>
            </div>
          </Container>
        </nav>

        <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
          <ParallaxWrapper speed={0.2}>
            <div className="mb-4">
              <h1 className="display-4 fw-bold mb-2 text-retro-pink">База вправ</h1>
              <p className="lead" style={{ color: '#00d4ff' }}>Виберіть вправи для свого тренування</p>
            </div>
          </ParallaxWrapper>

          {/* Filters */}
          <ParallaxWrapper speed={0.15}>
            <Card className="mb-4">
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
          </ParallaxWrapper>

          {/* Exercises Grid */}
          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : exercises.length > 0 ? (
            <ParallaxWrapper speed={0.1}>
              <Row className="g-4">
                {exercises.map((exercise) => (
                  <Col key={exercise.id} md={6} lg={4}>
                    <Card className="card-hover-lift h-100">
                      <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <h5 className="fw-bold mb-0">{exercise.nameUk || exercise.name}</h5>
                        <span className={`badge bg-${getDifficultyColor(exercise.difficulty)} px-3 py-2`}>
                          {exercise.difficulty}
                        </span>
                      </div>
                      
                      <p className="text-muted small mb-3">
                        {exercise.descriptionUk || exercise.description}
                      </p>
                      
                      <div className="d-flex flex-wrap gap-2 mb-3">
                        {exercise.type && (
                          <span className="badge bg-primary">{exercise.type}</span>
                        )}
                        {exercise.muscleGroup && (
                          <span className="badge bg-info">{exercise.muscleGroup}</span>
                        )}
                        {exercise.equipment && (
                          <span className="badge bg-secondary">{exercise.equipment}</span>
                        )}
                      </div>

                      {exercise.caloriesPerMin && (
                        <div className="text-muted small">
                          <i className="bi bi-fire me-1"></i>
                          {exercise.caloriesPerMin} ккал/хв
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
            </ParallaxWrapper>
          ) : (
            <Card>
              <Card.Body className="text-center py-5">
                <i className="bi bi-search display-4 text-retro-blue mb-3"></i>
                <p style={{ color: '#888' }}>Вправи не знайдено</p>
              </Card.Body>
            </Card>
          )}
        </Container>
      </div>
    </>
  );
}

