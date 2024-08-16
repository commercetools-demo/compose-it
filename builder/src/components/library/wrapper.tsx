import { ComponentConfig } from './general';
import { get } from 'lodash';
import { useBuilderStateContext } from '../../providers/process';
import ErrorBoundary from '../error-boundary';

const ComponentWrapper = ({
  component,
  children,
}: {
  component: ComponentConfig;
  children: React.ReactNode;
}) => {
  const { componentLibrary } = useBuilderStateContext();
  const Component = componentLibrary[component.type];
  const datasource = {};

  if (component.config?.propsBindings) {
    Object.keys(component.config.propsBindings).forEach((key) => {
      const binding = component.config.propsBindings[key];
      if (binding.type === 'datasource') {
        const value = get(datasource, binding.value);
        // value will be empty always
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
    <ErrorBoundary>
      <Component {...component.props}>{children}</Component>
    </ErrorBoundary>
  ) : (
    <ErrorBoundary>
      <Component {...component.props} />
    </ErrorBoundary>
  );
};

export default ComponentWrapper;
