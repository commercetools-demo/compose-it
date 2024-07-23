import { ComponentConfig } from './general';
import { componentLibrary } from '.';
import { get } from 'lodash';

const ComponentWrapper = ({
  component,
  children,
}: {
  component: ComponentConfig;
  children: React.ReactNode;
}) => {
  const Component = componentLibrary[component.type];
  const datasource = {} as any;

  if (component.config?.propsBindings) {
    Object.keys(component.config.propsBindings).forEach((key) => {
      const binding = component.config.propsBindings[key];
      if (binding.type === 'datasource') {
        const value = get(datasource, binding.value);
        if (value) {
          component.props[key] = value;
        }
      } else {
        const value = binding.value;
        if (value) {
          component.props[key] = value;
        }
      }
    });
  }

  return component.props?.children ? (
    <Component {...component.props}>{children}</Component>
  ) : (
    <Component {...component.props} />
  );
};

export default ComponentWrapper;
