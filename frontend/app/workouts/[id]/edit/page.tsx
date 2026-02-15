'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Button, Card, Spinner } from 'react-bootstrap';
import BootstrapClient from '../../../components/BootstrapClient';
import GymPostersBackground from '../../../components/GymPostersBackground';
import ModernNavbar from '../../../components/ModernNavbar';
import { api } from '../../../lib/api';

interface Exercise {
  id: string;
  name: string;
}

export default function EditWorkoutPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [exercises, setExercises] = useState<Exercise[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<{ exerciseId: string; exercise: { id: string; name: string }; customName: string; sets: string; reps: string; weight: string; order: number }[]>([]);
  const [previousWorkoutData, setPreviousWorkoutData] = useState<{ exerciseId: string; sets?: number; reps?: number; weight?: number } | null>(null);
  const [workoutData, setWorkoutData] = useState({
    date: '',
    duration: '',
    rating: '',
    notes: ''
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchExercises();
    fetchWorkout();
  }, [id]); // eslint-disable-line react-hooks/exhaustive-deps

  const fetchExercises = async () => {
    try {
      const data = await api.getExercises() as { exercises?: { id: string; name: string }[] };
      setExercises(data?.exercises ?? []);
    } catch (err) {
      console.error('Error fetching exercises:', err);
    }
  };

  const fetchWorkout = async () => {
    setLoading(true);
    setError('');
    try {
      const workout = await api.getWorkout(id) as { date: string; duration?: number; rating?: number; notes?: string; exercises?: { exerciseId: string; exercise?: { id: string; name: string }; customName?: string; sets?: number; reps?: number; weight?: number }[] };
      setWorkoutData({
        date: new Date(workout.date).toISOString().split('T')[0],
        duration: workout.duration?.toString() || '',
        rating: workout.rating?.toString() || '',
        notes: workout.notes || ''
      });
      const exs = workout.exercises || [];
      setSelectedExercises(exs.map((we: { exerciseId: string; exercise?: { id: string; name: string }; customName?: string; sets?: number; reps?: number; weight?: number }, idx: number) => ({
        exerciseId: we.exerciseId,
        exercise: we.exercise || { id: we.exerciseId, name: we.customName || 'Вправа' },
        customName: we.customName || '',
        sets: we.sets?.toString() || '',
        reps: we.reps?.toString() || '',
        weight: we.weight?.toString() || '',
        order: idx
      })));
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка завантаження тренування');
    } finally {
      setLoading(false);
    }
  };

  const fetchPreviousWorkout = async (exerciseId: string) => {
    try {
      const workouts = await api.getWorkouts({ limit: '10' }) as { workouts?: { exercises?: { exerciseId?: string; sets?: number; reps?: number; weight?: number }[] }[] };
      const allExercises = workouts?.workouts?.flatMap((w) => w.exercises ?? []) ?? [];
      const previousExercise = allExercises.find((e: { exerciseId?: string }) => e.exerciseId === exerciseId);
      if (previousExercise && previousExercise.exerciseId) {
        setPreviousWorkoutData({
          exerciseId: previousExercise.exerciseId,
          sets: previousExercise.sets,
          reps: previousExercise.reps,
          weight: previousExercise.weight
        });
      }
    } catch (err) {
      console.error('Error fetching previous workout:', err);
    }
  };

  const addExercise = (exercise: Exercise) => {
    setSelectedExercises([...selectedExercises, {
      exerciseId: exercise.id,
      exercise,
      customName: '',
      sets: '',
      reps: '',
      weight: '',
      order: selectedExercises.length
    }]);
    fetchPreviousWorkout(exercise.id);
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
    setSaving(true);
    setError('');
    try {
      await api.updateWorkout(id, {
        ...workoutData,
        duration: workoutData.duration ? parseInt(workoutData.duration) : null,
        rating: workoutData.rating ? parseInt(workoutData.rating) : null,
        exercises: selectedExercises.map((ex, idx) => ({
          exerciseId: ex.exerciseId,
          customName: ex.customName || null,
          sets: ex.sets ? parseInt(ex.sets) : null,
          reps: ex.reps ? parseInt(ex.reps) : null,
          weight: ex.weight ? parseFloat(ex.weight) : null,
          order: idx
        }))
      });
      router.push('/workouts');
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Помилка збереження тренування');
    } finally {
      setSaving(false);
    }
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

  return (
    <>
      <BootstrapClient />
      <div className="min-h-screen bg-dark d-flex flex-column">
        <GymPostersBackground />
        <ModernNavbar />

        <main className="flex-grow-1" style={{ position: 'relative' }}>
          <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
            <div className="mb-4">
              <h1 className="mb-2">Редагувати тренування</h1>
              <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>
                Змінити дані тренування
              </p>
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
                    aria-label="Виберіть вправу"
                    title="Виберіть вправу"
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
                              <div className="flex-grow-1">
                                <h6 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', fontSize: '1.1rem' }} className="mb-0">
                                  {ex.exercise?.name || 'Вправа'}
                                </h6>
                                {previousWorkoutData && previousWorkoutData.exerciseId === ex.exerciseId && (
                                  <small className="text-info" style={{ fontSize: '0.85rem' }}>
                                    <i className="bi bi-info-circle me-1"></i>
                                    Останній раз: {previousWorkoutData.sets}x{previousWorkoutData.reps} з {previousWorkoutData.weight}кг
                                  </small>
                                )}
                              </div>
                              <Button variant="link" size="sm" className="text-danger" onClick={() => removeExercise(idx)}>
                                <i className="bi bi-trash"></i>
                              </Button>
                            </div>
                            <Form.Group className="mb-3">
                              <Form.Label className="small" style={{ color: '#ffffff', fontWeight: 600 }}>Користувацька назва (необов&apos;язково)</Form.Label>
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
                <Button type="submit" variant="primary" size="lg" disabled={saving}>
                  {saving ? <Spinner size="sm" /> : 'Зберегти зміни'}
                </Button>
                <Button variant="outline-secondary" size="lg" onClick={() => router.push('/workouts')}>
                  Скасувати
                </Button>
              </div>
            </Form>
          </Container>
        </main>

        <footer className="flex-shrink-0 py-3" style={{ position: 'relative', zIndex: 100, borderTop: '2px solid rgba(212, 175, 55, 0.2)' }}>
          <Container>
            <div className="text-center" style={{ color: '#e0e0e0', fontFamily: 'var(--font-roboto-condensed)', fontSize: '0.85rem', fontWeight: 500 }}>
              © 2024 Кишеньковий тренер
            </div>
          </Container>
        </footer>
      </div>
    </>
  );
}
