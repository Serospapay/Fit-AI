'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Container, Row, Col, Form, Button, Card } from 'react-bootstrap';
import BootstrapClient from '../components/BootstrapClient';

export default function RegisterPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const res = await fetch('http://localhost:5000/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error || 'Помилка реєстрації');
        return;
      }

      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      router.push('/dashboard');
      router.refresh();
    } catch (err) {
      setError('Помилка підключення до сервера');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <BootstrapClient />
      <div className="min-h-screen d-flex align-items-center bg-light">
        <Container>
          <Row className="justify-content-center">
            <Col md={6} lg={5}>
              <Card className="border-0 shadow-lg">
                <Card.Body className="p-5">
                  <div className="text-center mb-4">
                    <h2 className="fw-bold mb-2">Створити профіль</h2>
                    <p className="text-muted">Розпочніть свій шлях до здорового способу життя</p>
                  </div>

                  {error && (
                    <div className="alert alert-danger" role="alert">
                      {error}
                    </div>
                  )}

                  <Form onSubmit={handleRegister}>
                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Ім'я</Form.Label>
                      <Form.Control
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Ваше ім'я"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-3">
                      <Form.Label className="fw-semibold">Email</Form.Label>
                      <Form.Control
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="your@email.com"
                        required
                      />
                    </Form.Group>

                    <Form.Group className="mb-4">
                      <Form.Label className="fw-semibold">Пароль</Form.Label>
                      <Form.Control
                        type="password"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        placeholder="Мінімум 6 символів"
                        minLength={6}
                        required
                      />
                    </Form.Group>

                    <Button 
                      type="submit" 
                      disabled={loading} 
                      className="w-100 bg-gradient-primary border-0 rounded-pill py-3 fw-bold"
                    >
                      {loading ? 'Створення профілю...' : 'Зареєструватися'}
                    </Button>
                  </Form>

                  <div className="text-center mt-4">
                    <p className="text-muted mb-0">
                      Вже маєте профіль?{' '}
                      <a href="/login" className="text-decoration-none fw-bold">
                        Увійти
                      </a>
                    </p>
                  </div>
                </Card.Body>
              </Card>

              <div className="text-center mt-4">
                <a href="/" className="text-decoration-none">
                  <i className="bi bi-arrow-left me-2"></i>
                  Повернутися на головну
                </a>
              </div>
            </Col>
          </Row>
        </Container>
      </div>
    </>
  );
}

