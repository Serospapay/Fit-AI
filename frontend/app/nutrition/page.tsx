'use client';

import { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Spinner, Badge, Alert } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import GymPostersBackground from '../components/GymPostersBackground';
import ModernNavbar from '../components/ModernNavbar';
import { api } from '../lib/api';

interface NutritionLog {
  id: string;
  date: string;
  mealType: string;
  items: any[];
  totals?: any;
}

export default function NutritionPage() {
  const [logs, setLogs] = useState<NutritionLog[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.getNutritionLogs();
      setLogs(data.logs || []);
    } catch (error: unknown) {
      console.error('Error fetching nutrition logs:', error);
      setError((error as Error).message || 'Помилка завантаження записів харчування');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Видалити цей запис?')) return;

    try {
      await api.deleteNutritionLog(id);
      setLogs(logs.filter(l => l.id !== id));
      setError(null);
    } catch (error: unknown) {
      console.error('Error deleting nutrition log:', error);
      setError((error as Error).message || 'Помилка видалення запису');
    }
  };

  const getMealTypeLabel = (type: string) => {
    const labels: { [key: string]: string } = {
      breakfast: 'Сніданок',
      lunch: 'Обід',
      dinner: 'Вечеря',
      snack: 'Перекус'
    };
    return labels[type] || type;
  };

  const getMealTypeColor = (type: string) => {
    const colors: { [key: string]: string } = {
      breakfast: 'warning',
      lunch: 'primary',
      dinner: 'info',
      snack: 'secondary'
    };
    return colors[type] || 'secondary';
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
          <div className="d-flex justify-content-between align-items-center mb-4 flex-wrap gap-3">
            <div>
              <h1 className="mb-2">Мій харчування</h1>
              <p className="lead" style={{ color: '#d4af37', fontFamily: 'var(--font-oswald)' }}>Історія вашого харчування</p>
            </div>
            <div className="d-flex gap-2 flex-wrap">
              <Button 
                variant="outline-warning" 
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/export/nutrition/excel`;
                  const response = await fetch(url, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                  const blob = await response.blob();
                  const downloadUrl = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = downloadUrl;
                  link.download = `kharchuvannya_${new Date().toISOString().split('T')[0]}.xlsx`;
                  link.click();
                }}
              >
                <i className="bi bi-file-earmark-spreadsheet me-2"></i>
                Excel
              </Button>
              <Button 
                variant="outline-danger" 
                onClick={async () => {
                  const token = localStorage.getItem('token');
                  const url = `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}/api/export/nutrition/pdf`;
                  const response = await fetch(url, {
                    headers: {
                      'Authorization': `Bearer ${token}`
                    }
                  });
                  const blob = await response.blob();
                  const downloadUrl = window.URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.href = downloadUrl;
                  link.download = `kharchuvannya_${new Date().toISOString().split('T')[0]}.pdf`;
                  link.click();
                }}
              >
                <i className="bi bi-file-pdf me-2"></i>
                PDF
              </Button>
              <Button variant="primary" href="/nutrition/new" style={{ background: '#d4af37', border: 'none' }}>
                <i className="bi bi-plus-circle me-2"></i>
                Додати запис
              </Button>
            </div>
          </div>

          {error && (
            <Alert variant="danger" dismissible onClose={() => setError(null)}>
              {error}
            </Alert>
          )}

          {loading ? (
            <div className="text-center py-5">
              <Spinner animation="border" variant="primary" />
            </div>
          ) : logs.length === 0 ? (
            <Card className="card-hover-lift">
              <Card.Body className="text-center py-5">
                <div className="display-1 mb-4">
                  <i className="bi bi-apple text-muted"></i>
                </div>
                <h3 className="mb-3">Поки що немає записів</h3>
                <p style={{ color: '#888', fontFamily: 'var(--font-roboto-condensed)' }} className="mb-4">
                  Почніть відстежувати своє харчування
                </p>
                <Button variant="primary" size="lg" href="/nutrition/new">
                  Додати перший запис
                </Button>
              </Card.Body>
            </Card>
          ) : (
            <Row className="g-4">
              {logs.map((log) => (
                <Col key={log.id} md={6} lg={4}>
                  <Card className="card-hover-lift h-100">
                    <Card.Body className="p-4">
                      <div className="d-flex justify-content-between align-items-start mb-3">
                        <div>
                          <h5 className="fw-bold mb-2">
                            {new Date(log.date).toLocaleDateString('uk-UA', {
                              year: 'numeric',
                              month: 'long',
                              day: 'numeric'
                            })}
                          </h5>
                          <Badge bg={getMealTypeColor(log.mealType)}>
                            {getMealTypeLabel(log.mealType)}
                          </Badge>
                        </div>
                        <Button
                          variant="link"
                          size="sm"
                          className="text-danger"
                          onClick={() => handleDelete(log.id)}
                        >
                          <i className="bi bi-trash"></i>
                        </Button>
                      </div>

                      {log.items && log.items.length > 0 && (
                        <div className="mb-3">
                          <h6 className="fw-bold mb-2">Продукти ({log.items.length}):</h6>
                          <div className="small">
                            {log.items.slice(0, 3).map((item: any, idx: number) => (
                              <div key={idx} className="mb-1">
                                • {item.nameUk || item.name} - {item.amount}г
                              </div>
                            ))}
                            {log.items.length > 3 && (
                              <div className="text-muted">+ ще {log.items.length - 3} продуктів</div>
                            )}
                          </div>
                        </div>
                      )}

                      {log.totals && (
                        <div className="border-top pt-3">
                          <div className="d-flex justify-content-between mb-1">
                            <small style={{ color: '#888' }}>Калорії:</small>
                            <small className="fw-bold">{Math.round(log.totals.calories)} ккал</small>
                          </div>
                          <div className="d-flex justify-content-between mb-1">
                            <small style={{ color: '#888' }}>Білки:</small>
                            <small className="fw-bold">{Math.round(log.totals.protein)} г</small>
                          </div>
                          <div className="d-flex justify-content-between mb-1">
                            <small style={{ color: '#888' }}>Вуглеводи:</small>
                            <small className="fw-bold">{Math.round(log.totals.carbs)} г</small>
                          </div>
                          <div className="d-flex justify-content-between">
                            <small style={{ color: '#888' }}>Жири:</small>
                            <small className="fw-bold">{Math.round(log.totals.fat)} г</small>
                          </div>
                        </div>
                      )}
                    </Card.Body>
                  </Card>
                </Col>
              ))}
            </Row>
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



