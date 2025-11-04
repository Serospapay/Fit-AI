'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Form, Modal, ProgressBar, Badge, Spinner } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import GymPostersBackground from '../components/GymPostersBackground';
import ModernNavbar from '../components/ModernNavbar';
import { api } from '../lib/api';

interface Goal {
  id: string;
  title: string;
  description?: string;
  category: string;
  targetValue?: number;
  currentValue?: number;
  unit?: string;
  startDate: string;
  targetDate?: string;
  status: string;
}

export default function GoalsPage() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: 'custom',
    targetValue: '',
    unit: '',
    targetDate: '',
  });

  useEffect(() => {
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const data = await api.getGoals();
      setGoals(data.goals || []);
    } catch (error) {
      console.error('Error fetching goals:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = () => {
    setEditingGoal(null);
    setFormData({
      title: '',
      description: '',
      category: 'custom',
      targetValue: '',
      unit: '',
      targetDate: '',
    });
    setShowModal(true);
  };

  const handleEdit = (goal: Goal) => {
    setEditingGoal(goal);
    setFormData({
      title: goal.title,
      description: goal.description || '',
      category: goal.category,
      targetValue: goal.targetValue?.toString() || '',
      unit: goal.unit || '',
      targetDate: goal.targetDate ? new Date(goal.targetDate).toISOString().split('T')[0] : '',
    });
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const data = {
        ...formData,
        targetValue: formData.targetValue ? parseFloat(formData.targetValue) : null,
        targetDate: formData.targetDate || null,
      };

      if (editingGoal) {
        await api.updateGoal(editingGoal.id, data);
      } else {
        await api.createGoal(data);
      }

      setShowModal(false);
      fetchGoals();
    } catch (error) {
      console.error('Error saving goal:', error);
      alert('Помилка збереження цілі');
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Ви впевнені, що хочете видалити цю ціль?')) return;

    try {
      await api.deleteGoal(id);
      fetchGoals();
    } catch (error) {
      console.error('Error deleting goal:', error);
      alert('Помилка видалення цілі');
    }
  };

  const getProgress = (goal: Goal) => {
    if (!goal.targetValue || !goal.currentValue) return 0;
    return Math.min((goal.currentValue / goal.targetValue) * 100, 100);
  };

  const getCategoryLabel = (category: string) => {
    const labels: Record<string, string> = {
      weight: 'Вага',
      strength: 'Сила',
      endurance: 'Витривалість',
      nutrition: 'Харчування',
      custom: 'Інше',
    };
    return labels[category] || category;
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, string> = {
      active: 'primary',
      completed: 'success',
      paused: 'warning',
      cancelled: 'secondary',
    };
    return variants[status] || 'secondary';
  };

  const getStatusLabel = (status: string) => {
    const labels: Record<string, string> = {
      active: 'Активна',
      completed: 'Виконана',
      paused: 'Призупинена',
      cancelled: 'Скасована',
    };
    return labels[status] || status;
  };

  const activeGoals = goals.filter(g => g.status === 'active');
  const completedGoals = goals.filter(g => g.status === 'completed');

  return (
    <>
      <BootstrapClient />
      <div className="min-h-screen bg-dark d-flex flex-column">
        <GymPostersBackground />
        <ModernNavbar />

        <main className="flex-grow-1" style={{ position: 'relative' }}>
          <Container className="py-5" style={{ position: 'relative', zIndex: 1 }}>
            <div className="d-flex justify-content-between align-items-center mb-4">
              <div>
                <h1 className="mb-2">Мої цілі</h1>
                <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>
                  Відстежуйте свій прогрес та досягайте результатів
                </p>
              </div>
              <Button onClick={handleCreate} style={{ background: '#d4af37', border: 'none' }}>
                <i className="bi bi-plus-circle me-2"></i>
                Додати ціль
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <>
                {/* Активні цілі */}
                {activeGoals.length > 0 && (
                  <div className="mb-5">
                    <h3 className="mb-3" style={{ color: '#d4af37' }}>Активні цілі</h3>
                    <Row className="g-4">
                      {activeGoals.map((goal) => (
                        <Col md={6} key={goal.id}>
                          <Card className="card-hover-lift h-100">
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-3">
                                <div className="flex-grow-1">
                                  <h5 className="mb-2" style={{ color: '#d4af37' }}>{goal.title}</h5>
                                  {goal.description && (
                                    <p className="text-muted small mb-2">{goal.description}</p>
                                  )}
                                  <Badge bg={getStatusBadge(goal.status)} className="me-2">
                                    {getStatusLabel(goal.status)}
                                  </Badge>
                                  <Badge bg="secondary">{getCategoryLabel(goal.category)}</Badge>
                                </div>
                                <div className="d-flex gap-2">
                                  <Button
                                    variant="outline-warning"
                                    size="sm"
                                    onClick={() => handleEdit(goal)}
                                  >
                                    <i className="bi bi-pencil"></i>
                                  </Button>
                                  <Button
                                    variant="outline-danger"
                                    size="sm"
                                    onClick={() => handleDelete(goal.id)}
                                  >
                                    <i className="bi bi-trash"></i>
                                  </Button>
                                </div>
                              </div>

                              {goal.targetValue && goal.currentValue !== undefined && (
                                <>
                                  <div className="d-flex justify-content-between mb-2">
                                    <span style={{ color: '#888', fontSize: '0.9rem' }}>
                                      {goal.currentValue} {goal.unit || ''} / {goal.targetValue} {goal.unit || ''}
                                    </span>
                                    <span style={{ color: '#d4af37', fontWeight: 'bold' }}>
                                      {Math.round(getProgress(goal))}%
                                    </span>
                                  </div>
                                  <ProgressBar
                                    now={getProgress(goal)}
                                    variant="warning"
                                    style={{ height: '10px' }}
                                  />
                                </>
                              )}

                              {goal.targetDate && (
                                <p className="mt-3 mb-0 small text-muted">
                                  <i className="bi bi-calendar me-1"></i>
                                  Цільова дата: {new Date(goal.targetDate).toLocaleDateString('uk-UA')}
                                </p>
                              )}
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* Виконані цілі */}
                {completedGoals.length > 0 && (
                  <div>
                    <h3 className="mb-3" style={{ color: '#d4af37' }}>Виконані цілі</h3>
                    <Row className="g-4">
                      {completedGoals.map((goal) => (
                        <Col md={6} key={goal.id}>
                          <Card className="card-hover-lift h-100" style={{ opacity: 0.8 }}>
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start">
                                <div>
                                  <h5 className="mb-2" style={{ color: '#d4af37' }}>{goal.title}</h5>
                                  <Badge bg="success">Виконана</Badge>
                                </div>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(goal.id)}
                                >
                                  <i className="bi bi-trash"></i>
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {goals.length === 0 && (
                  <Card className="text-center py-5">
                    <Card.Body>
                      <i className="bi bi-bullseye" style={{ fontSize: '4rem', color: '#888' }}></i>
                      <h4 className="mt-3 mb-3" style={{ color: '#d4af37' }}>Ще немає цілей</h4>
                      <p className="text-muted mb-4">Створіть свою першу ціль для відстеження прогресу!</p>
                      <Button onClick={handleCreate} style={{ background: '#d4af37', border: 'none' }}>
                        <i className="bi bi-plus-circle me-2"></i>
                        Додати ціль
                      </Button>
                    </Card.Body>
                  </Card>
                )}
              </>
            )}
          </Container>
        </main>
      </div>

      {/* Модальне вікно для створення/редагування */}
      <Modal show={showModal} onHide={() => setShowModal(false)} centered>
        <Modal.Header closeButton style={{ background: '#1a1a1a', borderColor: '#d4af37' }}>
          <Modal.Title style={{ color: '#d4af37' }}>
            {editingGoal ? 'Редагувати ціль' : 'Нова ціль'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body style={{ background: '#1a1a1a' }}>
          <Form>
            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#f5f5f5' }}>Назва цілі</Form.Label>
              <Form.Control
                type="text"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#f5f5f5' }}>Опис</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#f5f5f5' }}>Категорія</Form.Label>
              <Form.Select
                value={formData.category}
                onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
              >
                <option value="weight">Вага</option>
                <option value="strength">Сила</option>
                <option value="endurance">Витривалість</option>
                <option value="nutrition">Харчування</option>
                <option value="custom">Інше</option>
              </Form.Select>
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#f5f5f5' }}>Цільова величина</Form.Label>
              <Form.Control
                type="number"
                value={formData.targetValue}
                onChange={(e) => setFormData({ ...formData, targetValue: e.target.value })}
                placeholder="100"
                style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#f5f5f5' }}>Одиниця виміру</Form.Label>
              <Form.Control
                type="text"
                value={formData.unit}
                onChange={(e) => setFormData({ ...formData, unit: e.target.value })}
                placeholder="кг, км, дні..."
                style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
              />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Label style={{ color: '#f5f5f5' }}>Цільова дата</Form.Label>
              <Form.Control
                type="date"
                value={formData.targetDate}
                onChange={(e) => setFormData({ ...formData, targetDate: e.target.value })}
                style={{ background: '#0d0d0d', color: '#f5f5f5', borderColor: '#333' }}
              />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer style={{ background: '#1a1a1a', borderColor: '#d4af37' }}>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Скасувати
          </Button>
          <Button onClick={handleSave} style={{ background: '#d4af37', border: 'none' }}>
            Зберегти
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
}

