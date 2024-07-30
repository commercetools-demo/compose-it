import React from 'react';
import { ComponentConfig } from '../library/general';

import { PropertyItem } from './property-item';

interface PropertyEditorProps {
  component: ComponentConfig;
  onUpdateComponent: (updatedComponent: ComponentConfig) => void;
  onDeleteComponent: (component: ComponentConfig) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  onUpdateComponent,
  onDeleteComponent,
}) => {
  return (
    <div className="property-editor">
      <h3>Properties: {component.type}</h3>
      {component.layout.gridWidth} x {component.layout.gridHeight}
      {Object.entries(component.props).map(([key]) => (
        <PropertyItem
          key={key}
          propertyKey={key}
          component={component}
          onUpdateComponent={onUpdateComponent}
        />
      ))}
      <button onClick={() => onDeleteComponent(component)} type="button">
        DELETE
      </button>
    </div>
  );
};

export default PropertyEditor;
