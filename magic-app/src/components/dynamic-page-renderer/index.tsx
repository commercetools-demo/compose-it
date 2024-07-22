import React from 'react';
import { componentLibrary } from '@shared/components/library';
import { DynamicPageRendererProps } from './types';


const DynamicPageRenderer: React.FC<DynamicPageRendererProps> = ({ pageConfig }) => {
  const renderComponent = (config: ComponentConfig): React.ReactNode => {
    const Component = componentLibrary[config.type];
    
    if (!Component) {
      console.warn(`Component type "${config.type}" not found in library`);
      return null;
    }

    const props = {
      ...config.props,
      key: config.id,
    };

    if ('children' in config) {
      return (
        <Component {...props}>
          {config.children.map(renderComponent)}
        </Component>
      );
    }

    return <Component {...props} />;
  };

  return (
    <div className="dynamic-page">
      {pageConfig.components.map(renderComponent)}
    </div>
  );
};

export default DynamicPageRenderer;