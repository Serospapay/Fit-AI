'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Badge, Spinner, Alert } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import GymPostersBackground from '../components/GymPostersBackground';
import ModernNavbar from '../components/ModernNavbar';
import { api } from '../lib/api';

interface Recommendation {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: string;
  isRead: boolean;
  createdAt: string;
}

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchRecommendations();
  }, []);

  const fetchRecommendations = async () => {
    try {
      const data = await api.getRecommendations();
      setRecommendations(data.recommendations || []);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerate = async () => {
    setGenerating(true);
    try {
      await api.generateRecommendations();
      await fetchRecommendations();
    } catch (error) {
      console.error('Error generating recommendations:', error);
      alert('Помилка генерації рекомендацій');
    } finally {
      setGenerating(false);
    }
  };

  const handleMarkAsRead = async (id: string) => {
    try {
      await api.markRecommendationAsRead(id);
      await fetchRecommendations();
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleDelete = async (id: string) => {
    try {
      await api.deleteRecommendation(id);
      await fetchRecommendations();
    } catch (error) {
      console.error('Error deleting recommendation:', error);
    }
  };

  const getTypeIcon = (type: string) => {
    const icons: Record<string, string> = {
      workout: 'bi-dumbbell',
      nutrition: 'bi-apple',
      progress: 'bi-graph-up',
      motivation: 'bi-lightbulb',
    };
    return icons[type] || 'bi-info-circle';
  };

  const getTypeColor = (type: string) => {
    const colors: Record<string, string> = {
      workout: 'primary',
      nutrition: 'success',
      progress: 'info',
      motivation: 'warning',
    };
    return colors[type] || 'secondary';
  };

  const getPriorityVariant = (priority: string) => {
    const variants: Record<string, string> = {
      high: 'danger',
      normal: 'warning',
      low: 'info',
    };
    return variants[priority] || 'secondary';
  };

  const unreadCount = recommendations.filter(r => !r.isRead).length;
  const unreadRecommendations = recommendations.filter(r => !r.isRead);
  const readRecommendations = recommendations.filter(r => r.isRead);

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
                <h1 className="mb-2">Рекомендації</h1>
                <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>
                  Персоналізовані поради на основі вашої статистики
                </p>
              </div>
              <Button
                onClick={handleGenerate}
                disabled={generating}
                style={{ background: '#d4af37', border: 'none' }}
              >
                {generating ? (
                  <>
                    <Spinner size="sm" className="me-2" />
                    Генерація...
                  </>
                ) : (
                  <>
                    <i className="bi bi-magic me-2"></i>
                    Згенерувати нові
                  </>
                )}
              </Button>
            </div>

            {loading ? (
              <div className="text-center py-5">
                <Spinner animation="border" variant="primary" />
              </div>
            ) : (
              <>
                {/* Непрочитані рекомендації */}
                {unreadRecommendations.length > 0 && (
                  <div className="mb-5">
                    <div className="d-flex align-items-center gap-2 mb-3">
                      <h3 style={{ color: '#d4af37' }}>Нові рекомендації</h3>
                      <Badge bg="warning">{unreadCount}</Badge>
                    </div>
                    <Row className="g-4">
                      {unreadRecommendations.map((rec) => (
                        <Col md={6} key={rec.id}>
                          <Card className="card-hover-lift h-100" style={{ borderLeft: '4px solid #d4af37' }}>
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center gap-2">
                                  <i className={`bi ${getTypeIcon(rec.type)}`} style={{ fontSize: '1.5rem', color: '#d4af37' }}></i>
                                  <div>
                                    <h5 className="mb-0" style={{ color: '#d4af37' }}>{rec.title}</h5>
                                    <Badge bg={getTypeColor(rec.type)} className="me-2 mt-1">
                                      {rec.type}
                                    </Badge>
                                    <Badge bg={getPriorityVariant(rec.priority)}>
                                      {rec.priority === 'high' ? 'Важливо' : rec.priority === 'normal' ? 'Нормально' : 'Низько'}
                                    </Badge>
                                  </div>
                                </div>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(rec.id)}
                                >
                                  <i className="bi bi-x"></i>
                                </Button>
                              </div>
                              <p className="mt-3 mb-3" style={{ color: '#f5f5f5' }}>{rec.message}</p>
                              <div className="d-flex justify-content-between align-items-center">
                                <small className="text-muted">
                                  {new Date(rec.createdAt).toLocaleDateString('uk-UA', {
                                    day: 'numeric',
                                    month: 'long',
                                    year: 'numeric',
                                  })}
                                </small>
                                <Button
                                  variant="outline-warning"
                                  size="sm"
                                  onClick={() => handleMarkAsRead(rec.id)}
                                >
                                  <i className="bi bi-check2 me-1"></i>
                                  Прочитано
                                </Button>
                              </div>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {/* Прочитані рекомендації */}
                {readRecommendations.length > 0 && (
                  <div>
                    <h3 className="mb-3" style={{ color: '#d4af37' }}>Прочитані рекомендації</h3>
                    <Row className="g-4">
                      {readRecommendations.map((rec) => (
                        <Col md={6} key={rec.id}>
                          <Card className="card-hover-lift h-100" style={{ opacity: 0.7 }}>
                            <Card.Body>
                              <div className="d-flex justify-content-between align-items-start mb-2">
                                <div className="d-flex align-items-center gap-2">
                                  <i className={`bi ${getTypeIcon(rec.type)}`} style={{ fontSize: '1.5rem', color: '#888' }}></i>
                                  <div>
                                    <h5 className="mb-0" style={{ color: '#888' }}>{rec.title}</h5>
                                    <Badge bg="secondary" className="me-2 mt-1">
                                      {rec.type}
                                    </Badge>
                                  </div>
                                </div>
                                <Button
                                  variant="outline-danger"
                                  size="sm"
                                  onClick={() => handleDelete(rec.id)}
                                >
                                  <i className="bi bi-x"></i>
                                </Button>
                              </div>
                              <p className="mt-3 mb-2" style={{ color: '#888' }}>{rec.message}</p>
                              <small className="text-muted">
                                {new Date(rec.createdAt).toLocaleDateString('uk-UA')}
                              </small>
                            </Card.Body>
                          </Card>
                        </Col>
                      ))}
                    </Row>
                  </div>
                )}

                {recommendations.length === 0 && (
                  <Card className="text-center py-5">
                    <Card.Body>
                      <i className="bi bi-lightbulb" style={{ fontSize: '4rem', color: '#888' }}></i>
                      <h4 className="mt-3 mb-3" style={{ color: '#d4af37' }}>Поки немає рекомендацій</h4>
                      <p className="text-muted mb-4">
                        Натисніть "Згенерувати нові", щоб отримати персоналізовані рекомендації на основі вашої статистики!
                      </p>
                      <Button onClick={handleGenerate} disabled={generating} style={{ background: '#d4af37', border: 'none' }}>
                        {generating ? (
                          <>
                            <Spinner size="sm" className="me-2" />
                            Генерація...
                          </>
                        ) : (
                          <>
                            <i className="bi bi-magic me-2"></i>
                            Згенерувати рекомендації
                          </>
                        )}
                      </Button>
                    </Card.Body>
                  </Card>
                )}
              </>
            )}
          </Container>
        </main>
      </div>
    </>
  );
}

