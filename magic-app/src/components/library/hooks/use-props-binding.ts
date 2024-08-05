import { usePageWrapper } from '../../../providers/page-wrapper';
import { PropsBindingState } from '../general';
import { get } from 'lodash';

export const usePropsBinding = () => {
  const { datasources } = usePageWrapper();

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
