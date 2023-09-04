import { useRbac } from '../Hooks';
import { PERMISSIONS } from '../constants';
import { renderHook } from '@testing-library/react-hooks';

jest.mock('@redhat-cloud-services/frontend-components/useChrome', () => ({
  __esModule: true,
  default: () => ({
    getUserPermissions: () => Promise.resolve([{ permission: 'inventory:hosts:read' }, { permission: 'blob:*' }, { permission: 'test:read' }]),
  }),
}));

describe('useRbac', () => {
  it('should return correct values', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useRbac([PERMISSIONS.readHosts], 'inventory'));
    expect(result.current).toEqual([[[]], true]);
    await waitForNextUpdate();
    expect(result.current).toEqual([[true], false]);
  });

  it('should work using wildcard * (all) permission', async () => {
    const { result: result1, waitForNextUpdate: wait1 } = renderHook(() => useRbac(['blob:read'], 'inventory'));
    expect(result1.current).toEqual([[[]], true]);
    await wait1();
    expect(result1.current).toEqual([[true], false]);

    const { result: result2, waitForNextUpdate: wait2 } = renderHook(() => useRbac(['test:*']));
    expect(result2.current).toEqual([[[]], true]);
    await wait2();
    expect(result2.current).toEqual([[true], false]);
  });
});
