'use client';

import { useState, useEffect } from 'react';
import { Container, Navbar, Nav, NavDropdown, Badge } from 'react-bootstrap';
import GymLogo from './GymLogo';
import { api } from '../lib/api';

export default function ModernNavbar() {
  const [expanded, setExpanded] = useState(false);
  const [pathname, setPathname] = useState('/dashboard');
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      setPathname(window.location.pathname);
      
      // Перевірити чи користувач авторизований
      const token = localStorage.getItem('token');
      if (token) {
        fetchUnreadCount();
      }
    }
  }, []);

  const fetchUnreadCount = async () => {
    try {
      const data = await api.getUnreadRecommendationsCount();
      setUnreadCount(data.count || 0);
    } catch (error) {
      // Ігноруємо помилки (можливо користувач не авторизований)
    }
  };

  const navItems = [
    { href: '/dashboard', label: 'Панель', icon: 'bi-speedometer2' },
    { href: '/workouts', label: 'Тренування', icon: 'bi-calendar-check' },
    { href: '/nutrition', label: 'Харчування', icon: 'bi-apple' },
    { href: '/calculators', label: 'Калькулятори', icon: 'bi-calculator' },
    { href: '/goals', label: 'Цілі', icon: 'bi-bullseye' },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <Navbar 
      expand="lg" 
      className="modern-navbar"
      variant="dark"
      expanded={expanded}
      onToggle={setExpanded}
      style={{
        background: 'linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%)',
        borderBottom: '1px solid rgba(212, 175, 55, 0.2)',
        padding: '0.75rem 0',
        boxShadow: '0 2px 10px rgba(0, 0, 0, 0.3)',
        position: 'sticky',
        top: 0,
        zIndex: 1000,
        backdropFilter: 'blur(10px)',
      }}
    >
      <Container>
        <Navbar.Brand 
          href="/dashboard" 
          className="d-flex align-items-center gap-2 brand-link"
          style={{
            fontFamily: 'var(--font-oswald)',
            fontSize: '1.5rem',
            fontWeight: 700,
            letterSpacing: '1px',
            color: '#fff',
            textDecoration: 'none',
          }}
        >
          <GymLogo />
          <span className="d-none d-sm-inline">
            <span style={{ color: '#d4af37' }}>КИШЕНЬКОВИЙ</span>
            <span className="d-none d-md-inline" style={{ color: '#fff', marginLeft: '0.5rem' }}>ТРЕНЕР</span>
          </span>
        </Navbar.Brand>

        <Navbar.Toggle 
          aria-controls="basic-navbar-nav"
          style={{
            border: '1px solid rgba(212, 175, 55, 0.3)',
            borderRadius: '4px',
          }}
        >
          <span className="navbar-toggler-icon"></span>
        </Navbar.Toggle>

        <Navbar.Collapse id="basic-navbar-nav">
          <Nav className="ms-auto align-items-center" style={{ gap: '0.5rem' }}>
            {navItems.map((item) => (
              <Nav.Link
                key={item.href}
                href={item.href}
                className={`nav-link-modern ${isActive(item.href) ? 'active' : ''}`}
                style={{
                  color: isActive(item.href) ? '#d4af37' : '#ccc',
                  fontWeight: isActive(item.href) ? 600 : 400,
                  padding: '0.5rem 1rem',
                  borderRadius: '6px',
                  transition: 'all 0.2s ease',
                  fontSize: '0.95rem',
                  border: isActive(item.href) ? '1px solid rgba(212, 175, 55, 0.3)' : '1px solid transparent',
                  background: isActive(item.href) ? 'rgba(212, 175, 55, 0.1)' : 'transparent',
                }}
                onMouseEnter={(e) => {
                  if (!isActive(item.href)) {
                    e.currentTarget.style.color = '#d4af37';
                    e.currentTarget.style.background = 'rgba(212, 175, 55, 0.05)';
                  }
                }}
                onMouseLeave={(e) => {
                  if (!isActive(item.href)) {
                    e.currentTarget.style.color = '#e0e0e0';
                    e.currentTarget.style.background = 'transparent';
                  }
                }}
              >
                <i className={`bi ${item.icon} me-2`}></i>
                <span>{item.label}</span>
              </Nav.Link>
            ))}

            <NavDropdown
              title={
                <span className="d-flex align-items-center">
                  <i className="bi bi-bell me-2"></i>
                  <span>Рекомендації</span>
                  {unreadCount > 0 && (
                    <Badge bg="warning" className="ms-2" style={{ fontSize: '0.7rem' }}>
                      {unreadCount}
                    </Badge>
                  )}
                </span>
              }
              id="recommendations-dropdown"
              className="nav-dropdown-modern"
              style={{
                color: '#ccc',
                fontSize: '0.95rem',
              }}
            >
              <NavDropdown.Item href="/recommendations">
                <i className="bi bi-list-ul me-2"></i>
                Всі рекомендації
                {unreadCount > 0 && (
                  <Badge bg="warning" className="ms-2">{unreadCount}</Badge>
                )}
              </NavDropdown.Item>
            </NavDropdown>

            <NavDropdown
              title={
                <span>
                  <i className="bi bi-person-circle me-2"></i>
                  <span>Профіль</span>
                </span>
              }
              id="profile-dropdown"
              className="nav-dropdown-modern"
              style={{
                color: '#ccc',
                fontSize: '0.95rem',
              }}
            >
              <NavDropdown.Item href="/profile">
                <i className="bi bi-person me-2"></i>
                Мій профіль
              </NavDropdown.Item>
              <NavDropdown.Item href="/reminders">
                <i className="bi bi-bell-fill me-2"></i>
                Нагадування
              </NavDropdown.Item>
              <NavDropdown.Divider />
              <NavDropdown.Item href="/about">
                <i className="bi bi-info-circle me-2"></i>
                Про проект
              </NavDropdown.Item>
            </NavDropdown>
          </Nav>
        </Navbar.Collapse>
      </Container>

      <style jsx>{`
        .modern-navbar .navbar-nav .nav-link-modern:hover {
          color: #d4af37 !important;
        }

        .modern-navbar .navbar-nav .nav-link-modern.active {
          color: #d4af37 !important;
        }

        .modern-navbar :global(.dropdown-menu) {
          background: linear-gradient(135deg, #1a1a1a 0%, #0d0d0d 100%);
          border: 1px solid rgba(212, 175, 55, 0.2);
          border-radius: 8px;
          padding: 0.5rem 0;
          margin-top: 0.5rem;
          box-shadow: 0 4px 20px rgba(0, 0, 0, 0.5);
        }

        .modern-navbar :global(.dropdown-item) {
          color: #ccc;
          padding: 0.6rem 1.5rem;
          transition: all 0.2s ease;
        }

        .modern-navbar :global(.dropdown-item:hover) {
          background: rgba(212, 175, 55, 0.1);
          color: #d4af37;
        }

        .modern-navbar :global(.dropdown-divider) {
          border-color: rgba(212, 175, 55, 0.2);
          margin: 0.5rem 0;
        }

        .modern-navbar :global(.navbar-toggler) {
          padding: 0.25rem 0.75rem;
        }

        .modern-navbar :global(.navbar-toggler:focus) {
          box-shadow: 0 0 0 0.1rem rgba(212, 175, 55, 0.3);
        }

        @media (max-width: 991px) {
          .modern-navbar :global(.navbar-collapse) {
            margin-top: 1rem;
            padding-top: 1rem;
            border-top: 1px solid rgba(212, 175, 55, 0.2);
          }

          .modern-navbar :global(.nav-link-modern) {
            padding: 0.75rem 1rem;
            margin: 0.25rem 0;
          }

          .modern-navbar :global(.dropdown-menu) {
            margin-left: 1rem;
            margin-top: 0.5rem;
          }
        }
      `}</style>
    </Navbar>
  );
}

