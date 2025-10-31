'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import BootstrapClient from '../../components/BootstrapClient';
import GymPostersBackground from '../../components/GymPostersBackground';
import GymLogo from '../../components/GymLogo';

interface Exercise {
  id: string;
  name: string;
  nameUk?: string;
  type: string;
}

export default function NewWorkoutPage() {
  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [workoutData, setWorkoutData] = useState({
    date: new Date().toISOString().split('T')[0],
    duration: '',
    rating: '',
    notes: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExercises();
  }, []);

  const fetchExercises = async () => {
    try {
      const res = await fetch('http://localhost:5000/api/exercises');
      const data = await res.json();
      setExercises(data.exercises || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const addExercise = (exercise: Exercise) => {
    setSelectedExercises([...selectedExercises, {
      exerciseId: exercise.id,
      exercise: exercise,
      sets: '',
      reps: '',
      weight: '',
      order: selectedExercises.length
    }]);
  };

  const removeExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const updateExercise = (index: number, field: string, value: string) => {
    const updated = [...selectedExercises];
    updated[index] = { ...updated[index], [field]: value };
    setSelectedExercises(updated);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const workout = {
        ...workoutData,
        exercises: selectedExercises.map((ex, idx) => ({
          exerciseId: ex.exerciseId,
          sets: ex.sets ? parseInt(ex.sets) : null,
          reps: ex.reps ? parseInt(ex.reps) : null,
          weight: ex.weight ? parseFloat(ex.weight) : null,
          order: idx
        }))
      };

      const res = await fetch('http://localhost:5000/api/workouts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(workout)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Помилка збереження тренування');
        return;
      }

      window.location.href = '/workouts';
    } catch (err) {
      setError('Помилка підключення до сервера');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BootstrapClient />
      <div className="min-h-screen bg-dark">
        {/* Background Grid */}
        <div className="position-fixed w-100 h-100" style={{ backgroundImage: 'repeating-linear-gradient(0deg, rgba(212,175,55,0.03) 0px, rgba(212,175,55,0.03) 1px, transparent 1px, transparent 50px), repeating-linear-gradient(90deg, rgba(212,175,55,0.03) 0px, rgba(212,175,55,0.03) 1px, transparent 1px, transparent 50px)', opacity: 0.4, pointerEvents: 'none', zIndex: 0 }}></div>
        
        {/* Gym Posters Background */}
        <GymPostersBackground />
        
        {/* Navigation */}
        <nav className="navbar">
          <Container>
            <div className="d-flex justify-content-between align-items-center py-3 w-100">
              <a href="/dashboard" className="fw-bold fs-4 text-decoration-none d-flex align-items-center gap-2">
                <GymLogo />
                <span className="d-none d-md-inline" style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '2px', fontSize: '1.8rem', color: '#d4af37' }}>КИШЕНЬКОВИЙ</span>
                <span className="d-none d-lg-inline" style={{ fontFamily: 'var(--font-oswald)', letterSpacing: '2px', fontSize: '1.8rem', color: '#f5f5f5' }}>ТРЕНЕР</span>
              </a>
              <div className="d-flex align-items-center gap-3" style={{ marginLeft: 'auto' }}>
                <a href="/workouts" className="nav-link d-flex align-items-center">
                  <i className="bi bi-arrow-left me-2"></i>
                  <span>Назад</span>
                </a>
              </div>
            </div>
          </Container>
        </nav>

        <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
          <div className="mb-4">
            <h1 className="mb-2">Новий тренування</h1>
            <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>Записати нове тренування</p>
          </div>

          {error && (
            <div className="alert alert-danger" role="alert">
              {error}
            </div>
          )}

          <Form onSubmit={handleSubmit}>
            <Card className="card-hover-lift mb-4">
              <Card.Body>
                <Row className="g-3">
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Дата</Form.Label>
                      <Form.Control
                        type="date"
                        value={workoutData.date}
                        onChange={(e) => setWorkoutData({ ...workoutData, date: e.target.value })}
                        required
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Тривалість (хв)</Form.Label>
                      <Form.Control
                        type="number"
                        value={workoutData.duration}
                        onChange={(e) => setWorkoutData({ ...workoutData, duration: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Оцінка (1-5)</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max="5"
                        value={workoutData.rating}
                        onChange={(e) => setWorkoutData({ ...workoutData, rating: e.target.value })}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold">Нотатки</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={workoutData.notes}
                        onChange={(e) => setWorkoutData({ ...workoutData, notes: e.target.value })}
                        placeholder="Запишіть свої спостереження..."
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Exercises */}
            <Card className="card-hover-lift mb-4">
              <Card.Body>
                <h5 className="mb-4">Вправи</h5>
                
                <Form.Select
                  className="mb-4"
                  onChange={(e) => {
                    const exercise = exercises.find(ex => ex.id === e.target.value);
                    if (exercise) addExercise(exercise);
                  }}
                >
                  <option value="">+ Додати вправу</option>
                  {exercises.map(ex => (
                    <option key={ex.id} value={ex.id}>
                      {ex.nameUk || ex.name} ({ex.type})
                    </option>
                  ))}
                </Form.Select>

                {selectedExercises.length > 0 && (
                  <div className="space-y-3">
                    {selectedExercises.map((ex, idx) => (
                      <Card key={idx} className="mb-3">
                        <Card.Body>
                          <div className="d-flex justify-content-between align-items-center mb-3">
                            <h6 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', fontSize: '1.1rem' }} className="mb-0">
                              {ex.exercise.nameUk || ex.exercise.name}
                            </h6>
                            <Button
                              variant="link"
                              size="sm"
                              className="text-danger"
                              onClick={() => removeExercise(idx)}
                            >
                              <i className="bi bi-trash"></i>
                            </Button>
                          </div>
                          <Row className="g-2">
                            <Col md={4}>
                              <Form.Control
                                type="number"
                                placeholder="Підходи"
                                value={ex.sets}
                                onChange={(e) => updateExercise(idx, 'sets', e.target.value)}
                              />
                            </Col>
                            <Col md={4}>
                              <Form.Control
                                type="number"
                                placeholder="Повторення"
                                value={ex.reps}
                                onChange={(e) => updateExercise(idx, 'reps', e.target.value)}
                              />
                            </Col>
                            <Col md={4}>
                              <Form.Control
                                type="number"
                                placeholder="Вага (кг)"
                                value={ex.weight}
                                onChange={(e) => updateExercise(idx, 'weight', e.target.value)}
                              />
                            </Col>
                          </Row>
                        </Card.Body>
                      </Card>
                    ))}
                  </div>
                )}
              </Card.Body>
            </Card>

            <div className="d-flex gap-3">
              <Button type="submit" variant="primary" size="lg" disabled={loading}>
                {loading ? <Spinner size="sm" /> : 'Зберегти тренування'}
              </Button>
              <Button variant="outline-secondary" size="lg" href="/workouts">
                Скасувати
              </Button>
            </div>
          </Form>
        </Container>
      </div>
    </>
  );
}

