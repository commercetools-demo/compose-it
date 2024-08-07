import { useHistory, useRouteMatch } from 'react-router';
import { usePageWrapper } from '../../../providers/page-wrapper';
import { PropsBindingState } from '../general';
import { get } from 'lodash';
import { joinUrls, replacePathParam } from '../../../utils/url-utils';

export const usePropsBinding = () => {
  const { datasources } = usePageWrapper();
  const { push } = useHistory();
  const match = useRouteMatch();

  const handleEvent = (
    propsBindings: Record<string, PropsBindingState>,
    eventName: string,
    row: Record<string, unknown>
  ) => {
    const eventBinding = propsBindings?.[eventName];
    if (
      eventBinding?.type === 'property' &&
      eventBinding.dataType === 'event'
    ) {
      try {
        const action = JSON.parse((eventBinding.value as string) || '{}');
        if (action.type === 'route') {
          push(
            joinUrls(
              match.url,
              replacePathParam(action.value, row as Record<string, string>)
            )
          );
        } else if (action.type === 'custom') {
          // Handle custom action here
          console.log('Custom action:', action.value);
        }
      } catch (error) {
        console.error('Error parsing event action:', error);
      }
    }
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
          props[key] = (row: Record<string, unknown>) =>
            handleEvent(propsBindings, key, row);
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
