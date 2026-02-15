'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';
import GymPostersBackground from '../components/GymPostersBackground';
import ModernNavbar from '../components/ModernNavbar';
import { api } from '../lib/api';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  useEffect(() => {
    if (typeof window !== 'undefined' && localStorage.getItem('token')) {
      router.replace('/dashboard');
    }
  }, [router]);
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [errorDetails, setErrorDetails] = useState('');
  const [loading, setLoading] = useState(false);
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setErrorDetails('');

    try {
      const data = await api.login(email.trim().toLowerCase(), password);
      console.log('[LOGIN] Success', { userId: data.user?.id });
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      const e = err as Error & { status?: number; code?: string; raw?: unknown };
      const msg = e.message || 'Помилка підключення до сервера';
      setError(msg);
      if (e.status || e.code) {
        setErrorDetails([e.status && `HTTP ${e.status}`, e.code && `Код: ${e.code}`].filter(Boolean).join(' | '));
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BootstrapClient />
      <div className="min-h-screen bg-dark d-flex flex-column">
        <GymPostersBackground />
        <ModernNavbar />
        <main className="flex-grow-1 d-flex align-items-center app-main">
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Card className="border-0 shadow-lg auth-card">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold mb-2">Увійти</h2>
                    <p className="text-muted">Поверніться до свого профілю</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      <strong>{error}</strong>
                      {errorDetails && (
                        <div className="mt-2 small font-monospace" style={{ wordBreak: 'break-all' }}>
                          {errorDetails}
                        </div>
                      )}
                    </div>
                  )}

                  <Form onSubmit={handleLogin}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Email</Form.Label>
                      <Form.Control
                        type="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        placeholder="your@email.com"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Пароль</Form.Label>
                      <Form.Control
                        type="password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        placeholder="••••••••"
                        required
                      />
                    </Form.Group>

                    <Button
                      type="submit"
                      disabled={loading}
                      className="w-100 bg-gradient-primary border-0 rounded-pill py-3 fw-bold"
                    >
                      {loading ? 'Вхід...' : 'Увійти'}
                    </Button>
                  </Form>

                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      Немає профілю?{' '}
                      <a href="/register" className="text-decoration-none fw-bold">
                        Зареєструватися
                      </a>
                    </p>
                  </div>

                  <div className="mt-4 p-3 rounded" style={{ background: 'rgba(212, 175, 55, 0.1)', border: '1px solid rgba(212, 175, 55, 0.3)' }}>
                    <small className="d-block mb-2 fw-semibold" style={{ color: '#d4af37' }}>
                      Тестові дані для швидкого входу:
                    </small>
                    <div className="small text-muted mb-2">
                      <span className="d-block"><strong>Email:</strong> demo@example.com</span>
                      <span className="d-block"><strong>Пароль:</strong> demo123</span>
                    </div>
                    <Button
                      type="button"
                      variant="outline-warning"
                      size="sm"
                      onClick={() => {
                        setEmail('demo@example.com');
                        setPassword('demo123');
                      }}
                    >
                      Заповнити тестові дані
                    </Button>
                  </div>
                </Card.Body>
              </Card>

              <div className="text-center mt-4">
                <Link href="/" className="text-decoration-none">
                  <i className="bi bi-arrow-left me-2"></i>
                  Повернутися на головну
                </Link>
              </div>
            </Col>
          </Row>
        </Container>
        </main>
      </div>
    </>
  );
}
