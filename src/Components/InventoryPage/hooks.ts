import { buildFilterSortString } from './helpers';
import { fetchSystems } from '../../api';

export const useGetEntities = (onComplete: (result) => void, { selectedIds }: { selectedIds?: string[] } = {}) => {
  return async (_items, config) => {
    const { page, per_page: perPage, orderBy, orderDirection, filters } = config;
    const limit = perPage;
    const offset = page * perPage - perPage;
    const filterSortString = buildFilterSortString(limit, offset, orderBy, orderDirection, filters);
    const fetchedEntities = await fetchSystems(filterSortString);

    const {
      data,
      meta: { count },
    } = fetchedEntities || {};

    onComplete && onComplete(fetchedEntities);

    return {
      results: data.map((entity) => ({
        ...entity,
        selected: (selectedIds || []).map((id) => id).includes(entity.id),
      })),
      page,
      perPage,
      orderBy,
      orderDirection,
      total: count,
    };
  };
};
