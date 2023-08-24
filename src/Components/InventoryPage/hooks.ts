import { buildAditionalFields, buildFilterString, buildPerPagePageString, buildSortString } from './helpers';
import { fetchSystems, fetchSystemsTags } from '../../api';

export const useGetEntities = (onComplete: (result, filtersString) => void, { selectedIds }: { selectedIds?: number[] } = {}) => {
  return async (_items, config) => {
    const { page, per_page: perPage, orderBy, orderDirection, filters } = config;

    const sortString = buildSortString(orderBy, orderDirection);
    const filtersString = buildFilterString(filters);
    const perPageString = buildPerPagePageString(perPage, page);
    const aditionalFieldsString = buildAditionalFields(['operating_system', 'system_update_method']);
    const finalFilterSortString = `?${perPageString}${sortString}${filtersString}${aditionalFieldsString}`;

    const fetchedEntities = await fetchSystems(finalFilterSortString);
    const fetchedTags = await fetchSystemsTags(
      fetchedEntities.results.map((entity) => entity.id),
      `?per_page=${perPage}${sortString}`
    );

    fetchedEntities.results.forEach((entity) => {
      entity.tags = fetchedTags?.results[entity.id] || [];
    });

    const { results, total } = fetchedEntities || {};

    onComplete && onComplete(fetchedEntities, filtersString);

    return {
      results: results.map((entity) => ({
        ...entity,
        selected: (selectedIds || []).map((id) => id).includes(entity.id),
      })),
      page,
      perPage,
      orderBy,
      orderDirection,
      total: total,
    };
  };
};
