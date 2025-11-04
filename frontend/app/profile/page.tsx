'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Form, Button, Card, Spinner, Alert } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import GymPostersBackground from '../components/GymPostersBackground';
import ModernNavbar from '../components/ModernNavbar';
import { api } from '../lib/api';

interface ProfileData {
  id: string;
  email: string;
  name: string | null;
  age: number | null;
  gender: string | null;
  height: number | null;
  weight: number | null;
  activityLevel: string | null;
  goal: string | null;
  createdAt?: string;
  updatedAt?: string;
}

export default function ProfilePage() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    age: '',
    gender: '',
    height: '',
    weight: '',
    activityLevel: '',
    goal: ''
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getProfile();
      setProfile(data);
      setFormData({
        name: data.name || '',
        age: data.age?.toString() || '',
        gender: data.gender || '',
        height: data.height?.toString() || '',
        weight: data.weight?.toString() || '',
        activityLevel: data.activityLevel || '',
        goal: data.goal || ''
      });
    } catch (error: any) {
      console.error('Error fetching profile:', error);
      setError(error.message || 'Помилка завантаження профілю');
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<any>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(null);
    setSuccess(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    setSuccess(false);

    try {
    const updateData: Partial<ProfileData> = {};
    
    if (formData.name !== profile?.name) updateData.name = formData.name || null;
    if (formData.age !== profile?.age?.toString()) {
      updateData.age = formData.age ? parseInt(formData.age) : null;
    }
    if (formData.gender !== profile?.gender) updateData.gender = formData.gender || null;
    if (formData.height !== profile?.height?.toString()) {
      updateData.height = formData.height ? parseFloat(formData.height) : null;
    }
    if (formData.weight !== profile?.weight?.toString()) {
      updateData.weight = formData.weight ? parseFloat(formData.weight) : null;
    }
    if (formData.activityLevel !== profile?.activityLevel) updateData.activityLevel = formData.activityLevel || null;
    if (formData.goal !== profile?.goal) updateData.goal = formData.goal || null;

      const updatedProfile = await api.updateProfile(updateData);
      setProfile(updatedProfile);
      setSuccess(true);
      
      // Оновити дані в localStorage якщо вони там є
      const userStr = localStorage.getItem('user');
      if (userStr) {
        try {
          const user = JSON.parse(userStr);
          const updatedUser = { ...user, ...updatedProfile };
          localStorage.setItem('user', JSON.stringify(updatedUser));
        } catch (e) {
          // Ignore parse errors
        }
      }
    } catch (error: unknown) {
      console.error('Error updating profile:', error);
      setError((error as Error).message || 'Помилка оновлення профілю');
    } finally {
      setSaving(false);
    }
  };

  const getGenderLabel = (gender: string | null) => {
    const labels: { [key: string]: string } = {
      male: 'Чоловік',
      female: 'Жінка',
      other: 'Інше'
    };
    return labels[gender || ''] || 'Не вказано';
  };

  const getActivityLabel = (level: string | null) => {
    const labels: { [key: string]: string } = {
      sedentary: 'Сидячий (мало або без фізичних навантажень)',
      light: 'Легка активність (1-3 дні на тиждень)',
      moderate: 'Помірна активність (3-5 днів на тиждень)',
      active: 'Висока активність (6-7 днів на тиждень)',
      very_active: 'Дуже висока активність (2 рази на день)'
    };
    return labels[level || ''] || 'Не вказано';
  };

  const getGoalLabel = (goal: string | null) => {
    const labels: { [key: string]: string } = {
      lose_weight: 'Схуднути',
      gain_muscle: "Набрати м'язів",
      maintain: 'Підтримувати вагу',
      endurance: 'Розвиток витривалості',
      definition: 'Рельєфність'
    };
    return labels[goal || ''] || 'Не вказано';
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
            <h1 className="mb-2">Мій профіль</h1>
            <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>Управління особистими даними</p>
          </div>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)} className="mb-4">
              {error}
            </Alert>
          )}

          {success && (
            <Alert variant="success" dismissible onClose={() => setSuccess(false)} className="mb-4">
              Профіль успішно оновлено!
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : (
            <Form onSubmit={handleSubmit}>
              <Row className="g-4">
                {/* Основна інформація */}
                <Col lg={8}>
                  <Card className="card-hover-lift mb-4">
                    <Card.Body className="p-4">
                      <h5 className="mb-4" style={{ color: '#ffffff', fontWeight: 700 }}>Особисті дані</h5>
                      
                      <Row className="g-3">
                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Email</Form.Label>
                            <Form.Control
                              type="email"
                              value={profile?.email || ''}
                              disabled
                              style={{ color: '#e0e0e0', fontWeight: 600 }}
                            />
                            <Form.Text className="text-muted">Email не можна змінити</Form.Text>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Ім'я</Form.Label>
                            <Form.Control
                              type="text"
                              name="name"
                              value={formData.name}
                              onChange={handleChange}
                              placeholder="Ваше ім'я"
                              style={{ color: '#ffffff', fontWeight: 500 }}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Вік (років)</Form.Label>
                            <Form.Control
                              type="number"
                              name="age"
                              value={formData.age}
                              onChange={handleChange}
                              min="1"
                              max="150"
                              placeholder="Вкажіть вік"
                              style={{ color: '#ffffff', fontWeight: 500 }}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Стать</Form.Label>
                            <Form.Select
                              name="gender"
                              value={formData.gender}
                              onChange={handleChange}
                              style={{ color: '#ffffff', fontWeight: 500 }}
                            >
                              <option value="" style={{ background: '#1a1a1a', color: '#ffffff' }}>Оберіть стать</option>
                              <option value="male" style={{ background: '#1a1a1a', color: '#ffffff' }}>Чоловік</option>
                              <option value="female" style={{ background: '#1a1a1a', color: '#ffffff' }}>Жінка</option>
                              <option value="other" style={{ background: '#1a1a1a', color: '#ffffff' }}>Інше</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Зріст (см)</Form.Label>
                            <Form.Control
                              type="number"
                              name="height"
                              value={formData.height}
                              onChange={handleChange}
                              min="50"
                              max="300"
                              step="0.1"
                              placeholder="Вкажіть зріст"
                              style={{ color: '#ffffff', fontWeight: 500 }}
                            />
                          </Form.Group>
                        </Col>

                        <Col md={6}>
                          <Form.Group>
                            <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Вага (кг)</Form.Label>
                            <Form.Control
                              type="number"
                              name="weight"
                              value={formData.weight}
                              onChange={handleChange}
                              min="1"
                              max="500"
                              step="0.1"
                              placeholder="Вкажіть вагу"
                              style={{ color: '#ffffff', fontWeight: 500 }}
                            />
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <Card className="card-hover-lift mb-4">
                    <Card.Body className="p-4">
                      <h5 className="mb-4" style={{ color: '#ffffff', fontWeight: 700 }}>Цілі та активність</h5>
                      
                      <Row className="g-3">
                        <Col md={12}>
                          <Form.Group>
                            <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Рівень активності</Form.Label>
                            <Form.Select
                              name="activityLevel"
                              value={formData.activityLevel}
                              onChange={handleChange}
                              style={{ color: '#ffffff', fontWeight: 500 }}
                            >
                              <option value="" style={{ background: '#1a1a1a', color: '#ffffff' }}>Оберіть рівень активності</option>
                              <option value="sedentary" style={{ background: '#1a1a1a', color: '#ffffff' }}>Сидячий (мало або без фізичних навантажень)</option>
                              <option value="light" style={{ background: '#1a1a1a', color: '#ffffff' }}>Легка активність (1-3 дні на тиждень)</option>
                              <option value="moderate" style={{ background: '#1a1a1a', color: '#ffffff' }}>Помірна активність (3-5 днів на тиждень)</option>
                              <option value="active" style={{ background: '#1a1a1a', color: '#ffffff' }}>Висока активність (6-7 днів на тиждень)</option>
                              <option value="very_active" style={{ background: '#1a1a1a', color: '#ffffff' }}>Дуже висока активність (2 рази на день)</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>

                        <Col md={12}>
                          <Form.Group>
                            <Form.Label className="fw-semibold" style={{ color: '#ffffff', fontWeight: 600 }}>Мета</Form.Label>
                            <Form.Select
                              name="goal"
                              value={formData.goal}
                              onChange={handleChange}
                              style={{ color: '#ffffff', fontWeight: 500 }}
                            >
                              <option value="" style={{ background: '#1a1a1a', color: '#ffffff' }}>Оберіть мету</option>
                              <option value="lose_weight" style={{ background: '#1a1a1a', color: '#ffffff' }}>Схуднути</option>
                              <option value="gain_muscle" style={{ background: '#1a1a1a', color: '#ffffff' }}>Набрати м'язів</option>
                              <option value="maintain" style={{ background: '#1a1a1a', color: '#ffffff' }}>Підтримувати вагу</option>
                              <option value="endurance" style={{ background: '#1a1a1a', color: '#ffffff' }}>Розвиток витривалості</option>
                              <option value="definition" style={{ background: '#1a1a1a', color: '#ffffff' }}>Рельєфність</option>
                            </Form.Select>
                          </Form.Group>
                        </Col>
                      </Row>
                    </Card.Body>
                  </Card>

                  <div className="d-flex gap-3">
                    <Button type="submit" variant="primary" size="lg" disabled={saving}>
                      {saving ? (
                        <>
                          <Spinner animation="border" size="sm" className="me-2" />
                          Збереження...
                        </>
                      ) : (
                        <>
                          <i className="bi bi-check-circle me-2"></i>
                          Зберегти зміни
                        </>
                      )}
                    </Button>
                    <Button variant="outline-secondary" size="lg" href="/dashboard">
                      <i className="bi bi-arrow-left me-2"></i>
                      Назад
                    </Button>
                  </div>
                </Col>

                {/* Інформація профілю */}
                <Col lg={4}>
                  <Card className="card-hover-lift">
                    <Card.Body className="p-4">
                      <h5 className="mb-4" style={{ color: '#ffffff', fontWeight: 700 }}>
                        <i className="bi bi-info-circle me-2"></i>
                        Інформація профілю
                      </h5>
                      
                      <div className="d-flex flex-column gap-3">
                        <div>
                          <small style={{ color: '#f5f5f5', fontFamily: 'var(--font-roboto-condensed)', fontWeight: 600 }}>Email:</small>
                          <div style={{ color: '#ffffff', fontWeight: 500 }}>{profile?.email}</div>
                        </div>
                        
                        <div>
                          <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Ім'я:</small>
                          <div style={{ color: '#ffffff', fontWeight: 500 }}>{profile?.name || 'Не вказано'}</div>
                        </div>
                        
                        <div>
                          <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Вік:</small>
                          <div style={{ color: '#ffffff', fontWeight: 500 }}>{profile?.age ? `${profile.age} років` : 'Не вказано'}</div>
                        </div>
                        
                        <div>
                          <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Стать:</small>
                          <div style={{ color: '#ffffff', fontWeight: 500 }}>{getGenderLabel(profile?.gender)}</div>
                        </div>
                        
                        <div>
                          <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Зріст:</small>
                          <div style={{ color: '#ffffff', fontWeight: 500 }}>{profile?.height ? `${profile.height} см` : 'Не вказано'}</div>
                        </div>
                        
                        <div>
                          <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Вага:</small>
                          <div style={{ color: '#ffffff', fontWeight: 500 }}>{profile?.weight ? `${profile.weight} кг` : 'Не вказано'}</div>
                        </div>
                        
                        <div>
                          <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Рівень активності:</small>
                          <div style={{ color: '#ffffff', fontWeight: 500 }}>{getActivityLabel(profile?.activityLevel)}</div>
                        </div>
                        
                        <div>
                          <small style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }}>Мета:</small>
                          <div style={{ color: '#ffffff', fontWeight: 500 }}>{getGoalLabel(profile?.goal)}</div>
                        </div>
                        
                        <div className="border-top pt-3 mt-2">
                          <small style={{ color: '#f5f5f5', fontFamily: 'var(--font-roboto-condensed)', fontWeight: 600 }}>Дата реєстрації:</small>
                          <div style={{ color: '#e0e0e0', fontWeight: 600, fontSize: '0.9rem' }}>
                            {profile?.createdAt ? new Date(profile.createdAt).toLocaleDateString('uk-UA') : 'Не вказано'}
                          </div>
                        </div>
                      </div>
                    </Card.Body>
                  </Card>
                </Col>
              </Row>
            </Form>
          )}
        </Container>
        </main>

        {/* Footer */}
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

