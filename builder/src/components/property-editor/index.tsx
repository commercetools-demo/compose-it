import React from 'react';
import { ComponentConfig, PageConfig } from '../library/general';

import { PropertyItem } from './property-item';

interface PropertyEditorProps {
  component: ComponentConfig | PageConfig;
  onUpdateComponent: (updatedComponent: ComponentConfig | PageConfig) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  onUpdateComponent,
}) => {
  return (
    <div className="property-editor">
      <h3>Properties: {component.type}</h3>
      {'gridWidth' in component.layout && 'gridHeight' in component.layout && (
        <p>
          {component.layout.gridWidth} x {component.layout.gridHeight}
        </p>
      )}

      {Object.entries(component.props || {}).map(([key]) => (
        <PropertyItem
          key={key}
          propertyKey={key}
          component={component}
          onUpdateComponent={onUpdateComponent}
        />
      ))}
    </div>
  );
};

export default PropertyEditor;
