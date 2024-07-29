import React from 'react';
import { DynamicPageRendererProps } from './types';
import ComponentRenderer from './component-renderer';

const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({
  pageConfig,
}) => {
  return (
    <div className="dynamic-page">
      {pageConfig.components.map((component) => (
        <ComponentRenderer key={component.id} component={component} />
      ))}
    </div>
  );
};

export default DynamicPageRenderer;
