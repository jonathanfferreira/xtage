import { describe, it, expect } from 'vitest';
import { useProfileStore } from '../profile-store';

describe('useProfileStore', () => {
  it('should have initial activeProfile as bailarino', () => {
    const store = useProfileStore.getState();
    expect(store.activeProfile).toBe('bailarino');
  });

  it('should update activeProfile when setActiveProfile is called', () => {
    useProfileStore.getState().setActiveProfile('diretor');
    const store = useProfileStore.getState();
    expect(store.activeProfile).toBe('diretor');
  });
});
