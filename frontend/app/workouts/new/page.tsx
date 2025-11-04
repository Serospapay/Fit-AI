'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import BootstrapClient from '../../components/BootstrapClient';
import GymPostersBackground from '../../components/GymPostersBackground';
import ModernNavbar from '../../components/ModernNavbar';
import { api } from '../../lib/api';

interface Exercise {
  id: string;
  name: string;
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
      const data = await api.getExercises();
      setExercises(data.exercises || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const addExercise = (exercise: Exercise) => {
    setSelectedExercises([...selectedExercises, {
      exerciseId: exercise.id,
      exercise: exercise,
      customName: '',
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
          customName: ex.customName || null,
          sets: ex.sets ? parseInt(ex.sets) : null,
          reps: ex.reps ? parseInt(ex.reps) : null,
          weight: ex.weight ? parseFloat(ex.weight) : null,
          order: idx
        }))
      };

      await api.createWorkout(workout);
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
      <div className="min-h-screen bg-dark d-flex flex-column">
        {/* Gym Posters Background */}
        <GymPostersBackground />
        
        {/* Modern Navigation */}
        <ModernNavbar />

        <main className="flex-grow-1" style={{ position: 'relative' }}>
        <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
          <div className="mb-4">
            <h1 className="mb-2">Нове тренування</h1>
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
                      <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Дата</Form.Label>
                      <Form.Control
                        type="date"
                        value={workoutData.date}
                        onChange={(e) => setWorkoutData({ ...workoutData, date: e.target.value })}
                        required
                        style={{ color: '#ffffff', fontWeight: 500 }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Тривалість (хв)</Form.Label>
                      <Form.Control
                        type="number"
                        value={workoutData.duration}
                        onChange={(e) => setWorkoutData({ ...workoutData, duration: e.target.value })}
                        style={{ color: '#ffffff', fontWeight: 500 }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={4}>
                    <Form.Group>
                      <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Оцінка (1-5)</Form.Label>
                      <Form.Control
                        type="number"
                        min="1"
                        max="5"
                        value={workoutData.rating}
                        onChange={(e) => setWorkoutData({ ...workoutData, rating: e.target.value })}
                        style={{ color: '#ffffff', fontWeight: 500 }}
                      />
                    </Form.Group>
                  </Col>
                  <Col md={12}>
                    <Form.Group>
                      <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Нотатки</Form.Label>
                      <Form.Control
                        as="textarea"
                        rows={3}
                        value={workoutData.notes}
                        onChange={(e) => setWorkoutData({ ...workoutData, notes: e.target.value })}
                        placeholder="Запишіть свої спостереження..."
                        style={{ color: '#ffffff', fontWeight: 500 }}
                      />
                    </Form.Group>
                  </Col>
                </Row>
              </Card.Body>
            </Card>

            {/* Exercises */}
            <Card className="card-hover-lift mb-4">
              <Card.Body>
                <h5 className="mb-4" style={{ color: '#ffffff', fontWeight: 700 }}>Вправи</h5>
                
                <Form.Select
                  className="mb-4"
                  onChange={(e) => {
                    const exercise = exercises.find(ex => ex.id === e.target.value);
                    if (exercise) addExercise(exercise);
                  }}
                  style={{ color: '#ffffff', fontWeight: 500 }}
                >
                  <option value="" style={{ background: '#1a1a1a', color: '#ffffff' }}>+ Додати вправу</option>
                  {exercises.map(ex => (
                    <option key={ex.id} value={ex.id} style={{ background: '#1a1a1a', color: '#ffffff' }}>
                      {ex.name}
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
                              {ex.exercise.name}
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
                          <Form.Group className="mb-3">
                            <Form.Label className="small" style={{ color: '#ffffff', fontWeight: 600 }}>Користувацька назва (необов'язково)</Form.Label>
                            <Form.Control
                              type="text"
                              placeholder="Залиште порожнім для використання стандартної назви"
                              value={ex.customName || ''}
                              onChange={(e) => updateExercise(idx, 'customName', e.target.value)}
                              style={{ color: '#ffffff', fontWeight: 500 }}
                            />
                          </Form.Group>
                          <Row className="g-2">
                            <Col md={4}>
                              <Form.Control
                                type="number"
                                placeholder="Підходи"
                                value={ex.sets}
                                onChange={(e) => updateExercise(idx, 'sets', e.target.value)}
                                style={{ color: '#ffffff', fontWeight: 500 }}
                              />
                            </Col>
                            <Col md={4}>
                              <Form.Control
                                type="number"
                                placeholder="Повторення"
                                value={ex.reps}
                                onChange={(e) => updateExercise(idx, 'reps', e.target.value)}
                                style={{ color: '#ffffff', fontWeight: 500 }}
                              />
                            </Col>
                            <Col md={4}>
                              <Form.Control
                                type="number"
                                placeholder="Вага (кг)"
                                value={ex.weight}
                                onChange={(e) => updateExercise(idx, 'weight', e.target.value)}
                                style={{ color: '#ffffff', fontWeight: 500 }}
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

