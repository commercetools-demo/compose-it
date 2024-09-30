import React from 'react';
import { ComponentConfig } from '../library/general';
import ComponentWrapper from '../library/wrapper';

interface ComponentRendererProps {
  component: ComponentConfig;
  parentUrl?: string;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  parentUrl,
}) => {
  if (!component) return null;
  if (typeof component === 'string') return component;

  return (
    <ComponentWrapper component={component} parentUrl={parentUrl}>
      {component.props.children &&
        Array.isArray(component.props.children) &&
        component.props.children.map((child) => (
          <ComponentRenderer
            key={child.id}
            component={child}
            parentUrl={parentUrl}
          />
        ))}
      {component.props.children && !Array.isArray(component.props.children) && (
        <ComponentRenderer
          component={component.props.children}
          parentUrl={parentUrl}
        />
      )}
    </ComponentWrapper>
  );
};

export default ComponentRenderer;
