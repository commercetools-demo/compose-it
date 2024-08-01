import { componentLibrary } from '.';
import { PropsBindingState } from './general';

const getPropDataType = (propName: string, propValue: unknown) => {
  if (propName.startsWith('on')) {
    return 'event';
  } else if (
    propName.startsWith('is') ||
    propName.startsWith('has') ||
    propName.startsWith('disable')
  ) {
    return 'boolean';
  } else {
    return typeof propValue;
  }
};

export const getComponentProps = (
  componentType: string
): Record<string, unknown> => {
  const Component = componentLibrary[componentType];
  const propNames = Object.keys(Component.propTypes || {});
  const defaultProps = Component.defaultProps || {};

  const props = propNames.reduce((acc, propName) => {
    acc[propName] = defaultProps[propName] || '';
    return acc;
  }, {} as Record<string, string | number | unknown[] | boolean>);

  switch (componentType) {
    // case 'Page':
    //   return {
    //     layout: {},
    //     children: {},
    //   };
    case 'DataTable':
      props.rows = [];
      props.columns = [];
      break;
    default:
  }

  return props;
};

export const getComponentBindings = (
  componentType: string
): Record<string, PropsBindingState> => {
  const Component = componentLibrary[componentType];
  const propNames = Object.keys(Component.propTypes || {});
  const defaultProps = Component.defaultProps || {};

  const bindings = propNames.reduce((acc, propName) => {
    acc[propName] = {
      value: defaultProps[propName] || '',
      dataType: getPropDataType(propName, defaultProps[propName]),
      type: 'property',
    };
    return acc;
  }, {} as Record<string, PropsBindingState>);
  switch (componentType) {
    // case 'Page':
    //   return {
    //     layout: {
    //       type: 'property',
    //       dataType: 'object',
    //       value: {}
    //     },
    //     children: {
    //       type: 'property',
    //       dataType: 'array',
    //       value: []
    //     },
    //   };
    case 'DataTable':
      bindings.rows = {
        type: 'property',
        dataType: 'array',
        value: [],
      };

      bindings.columns = {
        type: 'property',
        dataType: 'array',
        value: [],
      };
      break;
    default:
  }
  return bindings;
};
