import { ComponentConfig, PageConfig } from './general';
import { componentLibrary } from '.';
import { fixUpRoutingProps } from './utils';
import { useMemo } from 'react';
import { usePropsBinding } from './hooks/use-props-binding';

const ComponentWrapper = ({
  component,
  children,
  parentUrl,
}: {
  component: ComponentConfig | PageConfig;
  children: React.ReactNode;
  parentUrl?: string;
}) => {
  const Component = componentLibrary[component.type];

  const { setPropsBinding } = usePropsBinding();

  ////// TODO: datatable rows: set to results > how to get columns?

  if (component.config?.propsBindings) {
    const props = setPropsBinding(component.config.propsBindings);

    if (props) {
      component.props = {
        ...component.props,
        ...props,
      };
    }
  }

  component = fixUpRoutingProps(component, parentUrl);

  const style = useMemo(() => {
    if ('gridColumn' in component.layout) {
      return {
        gridColumn: `${component.layout.gridColumn} / span ${component.layout.gridWidth}`,
        gridRow: `${component.layout.gridRow} / span ${component.layout.gridHeight}`,
      };
    } else {
      return {};
    }
  }, [component]);

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
