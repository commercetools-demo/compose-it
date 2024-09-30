import { useHistory, useRouteMatch } from 'react-router';
import { usePageWrapper } from '../../../providers/page-wrapper';
import { PropsBindingState } from '../general';
import { get } from 'lodash';
import { combineBaseAndSubpath } from '../../../utils/url-utils';
import * as syncActions from '@commercetools/sync-actions';
import { useAppConfig } from '../../../providers/app-config';

export const usePropsBinding = () => {
  const { datasources, fetcher, cachedData } = usePageWrapper();
  const { actions: graphQLActions } = useAppConfig();

  const { push } = useHistory();
  const match = useRouteMatch();

  const getEventProp = (
    key: string,
    propsBindings?: Record<string, PropsBindingState>
  ) => {
    const eventBinding = propsBindings?.[key];

    if (
      eventBinding?.type === 'property' &&
      eventBinding.dataType === 'event'
    ) {
      let action = null;
      try {
        action = JSON.parse(eventBinding.value as string);
      } catch (error) {
        console.warn('Error parsing event action:', error);
      }

      if (!action) {
        return null;
      }

      if (action.type === 'route') {
        return (row: Record<string, unknown>) => {
          const url = combineBaseAndSubpath(match.url, action.value, {
            ...(row as Record<string, string>),
            ...cachedData,
          });

          push(url);
        };
      } else if (Object.keys(syncActions).includes(action.type)) {
        return async (initialData: any, values: any) => {
          const syncAction = syncActions[action.type]();
          const syncActionUpdates = syncAction.buildActions(
            values,
            initialData
          );
          if (!Array.isArray(syncActionUpdates) || !syncActionUpdates?.length) {
            return;
          }

          const graphQLAction = graphQLActions.find(
            (item) => item.key === action.value
          );

          if (graphQLAction?.value?.mutation) {
            return fetcher({
              query: graphQLAction.value.mutation,
              variables: {
                actions: syncActionUpdates.map((syncActionUpdate) => {
                  const { action, ...rest } = syncActionUpdate;
                  return {
                    [action]: rest,
                  };
                }),
                id: initialData.id,
                version: initialData.version,
              },
            });
          }
        };
      } else {
        return () => {};
      }
    }
    return null;
  };

  const setPropsBinding = (
    propsBindings: Record<string, PropsBindingState>
  ) => {
    const props: Record<string, unknown> = {};
    if (propsBindings) {
      Object.keys(propsBindings).forEach((key) => {
        const binding = propsBindings[key];
        if (binding.type === 'datasource') {
          const value = get(datasources, binding.value);

          if (value) {
            props[key] = value;
          }
        } else if (
          binding.type === 'property' &&
          binding.dataType === 'event'
        ) {
          props[key] = getEventProp(key, propsBindings);
        } else {
          const value = binding.value;
          if (value) {
            props[key] = value;
          }
        }
      });
    }

    return props;
  };

  const removeEmptyProps = (props: Record<string, unknown>) => {
    Object.keys(props).forEach((key) => {
      if (props[key] === '') {
        delete props[key];
      }
    });
    return props;
  };
  return { setPropsBinding, removeEmptyProps };
};
