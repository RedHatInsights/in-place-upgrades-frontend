import { inventoryFetchSystems, inventoryFetchSystemsByIds, inventoryFetchSystemsTags, recommendationsAffectedSystems } from '../../api';
import { buildAditionalFields, buildFilterString, buildPerPagePageString, buildSortString } from './Helpers';
import { FetchedEntities } from './types';

export const useGetEntities = (
  onComplete: (result, filtersString) => void,
  {
    rule,
    selectedIds,
  }: {
    rule?: string;
    selectedIds?: string[];
  } = {}
) => {
  return async (_items, config) => {
    const { page, per_page: perPage, orderBy, orderDirection, filters } = config;

    const sortString = buildSortString(orderBy, orderDirection);
    const filtersString = buildFilterString(filters);
    const perPageString = buildPerPagePageString(perPage, page);
    const aditionalFieldsString = buildAditionalFields(['operating_system', 'system_update_method']);
    const finalFilterSortString = `?${perPageString}${sortString}${filtersString}${aditionalFieldsString}`;

    let fetchedEntities = {} as FetchedEntities;
    if (rule) {
      const affectedSystems = await recommendationsAffectedSystems(rule, finalFilterSortString);
      const affectedSystemsIds = affectedSystems?.data?.map((system) => system.system_uuid) || [];
      fetchedEntities = await inventoryFetchSystemsByIds(affectedSystemsIds, `?${aditionalFieldsString}`);
    } else {
      fetchedEntities = await inventoryFetchSystems(finalFilterSortString);
    }

    const ids = fetchedEntities?.results?.map((entity) => entity.id) || [];
    const fetchedTags = ids.length > 0 ? await inventoryFetchSystemsTags(ids, `?per_page=${perPage}${sortString}`) : null;

    const { results, total } = fetchedEntities || {};

    onComplete && onComplete(fetchedEntities, filtersString);

    return {
      results:
        results?.map((entity) => ({
          ...entity,
          selected: (selectedIds || []).map((id) => id).includes(entity.id),
          tags: fetchedTags?.results[entity.id] || [],
        })) || [],
      page,
      perPage,
      orderBy,
      orderDirection,
      total: total,
    };
  };
};
