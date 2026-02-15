'use client';

import { Component, ReactNode } from 'react';
import { Container, Button } from 'react-bootstrap';
import GymPostersBackground from './GymPostersBackground';
import ModernNavbar from './ModernNavbar';

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export default class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-dark d-flex flex-column">
          <GymPostersBackground />
          <ModernNavbar />
          <main className="flex-grow-1 d-flex align-items-center app-main">
            <Container className="text-center py-5">
              <div className="auth-card error-boundary-card p-4 p-md-5 mx-auto">
                <h1 className="display-6 mb-3">Щось пішло не так</h1>
                <p className="text-muted mb-4">
                  Виникла непередбачена помилка. Спробуйте оновити сторінку.
                </p>
                <div className="d-flex gap-2 justify-content-center flex-wrap">
                  <Button
                    variant="outline-warning"
                    href="/dashboard"
                  >
                    На панель
                  </Button>
                  <Button
                    variant="primary"
                    onClick={() => window.location.reload()}
                  >
                    Оновити сторінку
                  </Button>
                </div>
              </div>
            </Container>
          </main>
        </div>
      );
    }
    return this.props.children;
  }
}
