import React from 'react';
import { DynamicPageRendererProps } from './types';
import ComponentRenderer from './component-renderer';

const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({
  pageConfig,
  parentUrl,
}) => {
  return (
    <div
      className="dynamic-page"
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${pageConfig.layout.columns}, 1fr)`,
        gap: '4px',
        position: 'relative',
      }}
    >
      {pageConfig.components.map((component) => (
        <ComponentRenderer
          key={component.id}
          component={component}
          parentUrl={parentUrl}
        />
      ))}
    </div>
  );
};

export default DynamicPageRenderer;
