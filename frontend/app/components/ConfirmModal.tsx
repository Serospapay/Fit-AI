'use client';

import { Modal, Button } from 'react-bootstrap';

interface ConfirmModalProps {
  show: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  variant?: 'danger' | 'warning' | 'primary';
  onConfirm: () => void | Promise<void>;
  onCancel: () => void;
  loading?: boolean;
}

export default function ConfirmModal({
  show,
  title,
  message,
  confirmLabel = 'Підтвердити',
  variant = 'danger',
  onConfirm,
  onCancel,
  loading = false,
}: ConfirmModalProps) {
  const handleConfirm = async () => {
    await onConfirm();
  };

  return (
    <Modal show={show} onHide={onCancel} centered>
      <Modal.Header closeButton style={{ background: '#1a1a1a', borderColor: '#d4af37' }}>
        <Modal.Title style={{ color: '#d4af37' }}>{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body style={{ background: '#1a1a1a', color: '#f5f5f5' }}>
        {message}
      </Modal.Body>
      <Modal.Footer style={{ background: '#1a1a1a', borderColor: '#d4af37' }}>
        <Button variant="secondary" onClick={onCancel} disabled={loading}>
          Скасувати
        </Button>
        <Button
          variant={variant}
          onClick={handleConfirm}
          disabled={loading}
          style={variant === 'danger' ? {} : { background: '#d4af37', border: 'none' }}
        >
          {loading ? '...' : confirmLabel}
        </Button>
      </Modal.Footer>
    </Modal>
  );
}
