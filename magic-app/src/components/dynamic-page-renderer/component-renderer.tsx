import React from 'react';
import { ComponentConfig } from '../library/general';
import ComponentWrapper from '../library/wrapper';

interface ComponentRendererProps {
  component: ComponentConfig;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({ component }) => {
  if (!component) return null;
  if (typeof component === 'string') return component;

  return (
    <ComponentWrapper component={component}>
      {component.props.children &&
        Array.isArray(component.props.children) &&
        component.props.children.map((child) => (
          <ComponentRenderer key={child.id} component={child} />
        ))}
      {component.props.children && !Array.isArray(component.props.children) && (
        <ComponentRenderer component={component.props.children} />
      )}
    </ComponentWrapper>
  );
};

export default ComponentRenderer;
