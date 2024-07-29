import { ComponentConfig } from './general';
import { componentLibrary } from '.';
import { get } from 'lodash';
import { useAppConfig } from '../../providers/app-config';

const ComponentWrapper = ({
  component,
  children,
}: {
  component: ComponentConfig;
  children: React.ReactNode;
}) => {
  const Component = componentLibrary[component.type];

  const { datasources } = useAppConfig();

  if (component.config?.propsBindings) {
    Object.keys(component.config.propsBindings).forEach((key) => {
      const binding = component.config.propsBindings[key];
      if (binding.type === 'datasource') {
        const value = get(datasources, binding.value);

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

  const style = {
    gridColumn: `${component.layout.gridColumn} / span ${component.layout.gridWidth}`,
    gridRow: `${component.layout.gridRow} / span ${component.layout.gridHeight}`,
  };

  return (
    <div style={style}>
      {component.props?.children &&
      !Array.isArray(component.props?.children) ? (
        <Component {...component.props}>{component.props?.children}</Component>
      ) : children ? (
        <Component {...component.props}>{children}</Component>
      ) : (
        <Component {...component.props} />
      )}
    </div>
  );
};

export default ComponentWrapper;
