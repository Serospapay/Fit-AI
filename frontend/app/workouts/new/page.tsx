'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Modal } from 'react-bootstrap';
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
  const [templates, setTemplates] = useState<any[]>([]);
  const [selectedExercises, setSelectedExercises] = useState<any[]>([]);
  const [showTemplateModal, setShowTemplateModal] = useState(false);
  const [showSaveTemplateModal, setShowSaveTemplateModal] = useState(false);
  const [previousWorkoutData, setPreviousWorkoutData] = useState<any>(null);
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
    fetchTemplates();
  }, []);

  const fetchExercises = async () => {
    try {
      const data = await api.getExercises();
      setExercises(data.exercises || []);
    } catch (error) {
      console.error('Error fetching exercises:', error);
    }
  };

  const fetchTemplates = async () => {
    try {
      const data = await api.getWorkoutTemplates();
      setTemplates(data.templates || []);
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const loadTemplate = (template: any) => {
    const templateExercises = Array.isArray(template.exercises) ? template.exercises : [];
    setSelectedExercises(templateExercises.map((ex: any, idx: number) => ({
      exerciseId: ex.exerciseId,
      exercise: exercises.find(e => e.id === ex.exerciseId) || { id: ex.exerciseId, name: ex.customName || 'Вправа' },
      customName: ex.customName || '',
      sets: ex.sets?.toString() || '',
      reps: ex.reps?.toString() || '',
      weight: ex.weight?.toString() || '',
      order: idx
    })));
    setShowTemplateModal(false);
  };

  const saveAsTemplate = async () => {
    const templateName = prompt('Введіть назву шаблону:');
    if (!templateName) return;

    try {
      await api.createWorkoutTemplate({
        name: templateName,
        description: '',
        type: null,
        exercises: selectedExercises.map(ex => ({
          exerciseId: ex.exerciseId,
          customName: ex.customName || null,
          sets: ex.sets ? parseInt(ex.sets) : null,
          reps: ex.reps ? parseInt(ex.reps) : null,
          weight: ex.weight ? parseFloat(ex.weight) : null,
        }))
      });
      setShowSaveTemplateModal(false);
      fetchTemplates();
      alert('Шаблон збережено!');
    } catch (error) {
      console.error('Error saving template:', error);
      alert('Помилка збереження шаблону');
    }
  };

  const fetchPreviousWorkout = async (exerciseId: string) => {
    try {
      const workouts = await api.getWorkouts({ limit: '10' });
      const allExercises = workouts.workouts?.flatMap((w: any) => w.exercises || []) || [];
      const previousExercise = allExercises.find((e: any) => e.exerciseId === exerciseId);
      if (previousExercise) {
        setPreviousWorkoutData(previousExercise);
      }
    } catch (error) {
      console.error('Error fetching previous workout:', error);
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
          <div className="d-flex justify-content-between align-items-center mb-4">
            <div>
              <h1 className="mb-2">Нове тренування</h1>
              <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>Записати нове тренування</p>
            </div>
            <div className="d-flex gap-2">
              {templates.length > 0 && (
                <Button
                  variant="outline-warning"
                  onClick={() => setShowTemplateModal(true)}
                >
                  <i className="bi bi-file-earmark-text me-2"></i>
                  Завантажити шаблон
                </Button>
              )}
              {selectedExercises.length > 0 && (
                <Button
                  variant="outline-info"
                  onClick={() => setShowSaveTemplateModal(true)}
                >
                  <i className="bi bi-save me-2"></i>
                  Зберегти як шаблон
                </Button>
              )}
            </div>
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
                            <div className="flex-grow-1">
                              <h6 style={{ fontFamily: 'var(--font-oswald)', color: '#d4af37', fontSize: '1.1rem' }} className="mb-0">
                                {ex.exercise.name}
                              </h6>
                              {previousWorkoutData && previousWorkoutData.exerciseId === ex.exerciseId && (
                                <small className="text-info" style={{ fontSize: '0.85rem' }}>
                                  <i className="bi bi-info-circle me-1"></i>
                                  Останній раз: {previousWorkoutData.sets}x{previousWorkoutData.reps} з {previousWorkoutData.weight}кг
                                </small>
                              )}
                            </div>
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

        {/* Модальне вікно для завантаження шаблону */}
        <Modal show={showTemplateModal} onHide={() => setShowTemplateModal(false)} centered>
          <Modal.Header closeButton style={{ background: '#1a1a1a', borderColor: '#d4af37' }}>
            <Modal.Title style={{ color: '#d4af37' }}>Завантажити шаблон</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ background: '#1a1a1a' }}>
            {templates.length === 0 ? (
              <p className="text-muted">У вас немає збережених шаблонів</p>
            ) : (
              <div className="d-flex flex-column gap-2">
                {templates.map((template) => (
                  <Button
                    key={template.id}
                    variant="outline-warning"
                    onClick={() => loadTemplate(template)}
                    className="text-start"
                  >
                    <i className="bi bi-file-earmark-text me-2"></i>
                    {template.name}
                  </Button>
                ))}
              </div>
            )}
          </Modal.Body>
          <Modal.Footer style={{ background: '#1a1a1a', borderColor: '#d4af37' }}>
            <Button variant="secondary" onClick={() => setShowTemplateModal(false)}>
              Скасувати
            </Button>
          </Modal.Footer>
        </Modal>

        {/* Модальне вікно для збереження шаблону */}
        <Modal show={showSaveTemplateModal} onHide={() => setShowSaveTemplateModal(false)} centered>
          <Modal.Header closeButton style={{ background: '#1a1a1a', borderColor: '#d4af37' }}>
            <Modal.Title style={{ color: '#d4af37' }}>Зберегти як шаблон</Modal.Title>
          </Modal.Header>
          <Modal.Body style={{ background: '#1a1a1a' }}>
            <p className="text-muted">Ви впевнені, що хочете зберегти поточне тренування як шаблон?</p>
            <p className="small text-muted">
              Буде збережено {selectedExercises.length} вправ
            </p>
          </Modal.Body>
          <Modal.Footer style={{ background: '#1a1a1a', borderColor: '#d4af37' }}>
            <Button variant="secondary" onClick={() => setShowSaveTemplateModal(false)}>
              Скасувати
            </Button>
            <Button onClick={saveAsTemplate} style={{ background: '#d4af37', border: 'none' }}>
              Зберегти
            </Button>
          </Modal.Footer>
        </Modal>

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

