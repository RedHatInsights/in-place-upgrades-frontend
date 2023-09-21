import { renderHook, waitFor } from '@testing-library/react';

import { PERMISSIONS } from '../constants';
import { useRbac } from '../hooks';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: () => ({
    getUserPermissions: () => Promise.resolve([{ permission: 'inventory:hosts:read' }, { permission: 'blob:*' }, { permission: 'test:read' }]),
  }),
}));

describe('useRbac', () => {
  it('should return correct values', async () => {
    const { result } = renderHook(() => useRbac([PERMISSIONS.readHosts], 'inventory'));

    expect(result.current).toEqual([[[]], true]);
    await waitFor(() => expect(result.current).toEqual([[true], false]));
  });

  it('should work using wildcard * (all) permission', async () => {
    const { result: result1 } = renderHook(() => useRbac(['blob:read'], 'inventory'));
    expect(result1.current).toEqual([[[]], true]);
    await waitFor(() => expect(result1.current).toEqual([[true], false]));

    const { result: result2 } = renderHook(() => useRbac(['test:*']));
    expect(result2.current).toEqual([[[]], true]);
    await waitFor(() => expect(result2.current).toEqual([[true], false]));
  });
});
