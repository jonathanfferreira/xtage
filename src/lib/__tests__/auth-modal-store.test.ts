import { describe, it, expect } from 'vitest';
import { useAuthModal } from '../auth-modal-store';

describe('useAuthModal', () => {
  it('should have initial state as closed and view as login', () => {
    const store = useAuthModal.getState();
    expect(store.isOpen).toBe(false);
    expect(store.view).toBe('login');
  });

  it('should open modal with default login view', () => {
    useAuthModal.getState().open();
    const store = useAuthModal.getState();
    expect(store.isOpen).toBe(true);
    expect(store.view).toBe('login');
  });

  it('should close modal', () => {
    useAuthModal.getState().close();
    const store = useAuthModal.getState();
    expect(store.isOpen).toBe(false);
  });

  it('should open modal with register view', () => {
    useAuthModal.getState().open('register');
    const store = useAuthModal.getState();
    expect(store.isOpen).toBe(true);
    expect(store.view).toBe('register');
  });
});
