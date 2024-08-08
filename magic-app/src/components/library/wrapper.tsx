import { ComponentConfig, PageConfig } from './general';
import { componentLibrary } from '.';
import { fixUpRoutingProps } from './utils';
import { useMemo } from 'react';
import { usePropsBinding } from './hooks/use-props-binding';
import styled from 'styled-components';

const ErrorDiv = styled.div`
  color: red;
`;

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
  console.log('component', Component);

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

  if (!Component) {
    return <ErrorDiv>component not implemented {component.type}</ErrorDiv>;
  }

  return (
    <div style={style}>
      {component.props?.children &&
      !Array.isArray(component.props?.children) ? (
        <Component {...component.props}>{component.props?.children}</Component>
      ) : children &&
        Array.isArray(component.props?.children) &&
        component.props.children.every((child) => !!child) ? (
        <Component {...component.props}>{children}</Component>
      ) : (
        <Component {...component.props} />
      )}
    </div>
  );
};

export default ComponentWrapper;
