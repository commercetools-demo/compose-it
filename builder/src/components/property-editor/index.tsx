import React from 'react';
import { ComponentConfig } from '../library/general';

interface PropertyEditorProps {
  component: ComponentConfig;
  onUpdateComponent: (updatedComponent: ComponentConfig) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  onUpdateComponent,
}) => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handlePropertyChange = (key: string, value: any) => {
    const updatedProps = { ...component.props, [key]: value };
    onUpdateComponent({ ...component, props: updatedProps });
  };

  return (
    <div className="property-editor">
      <h3>Properties: {component.type}</h3>
      {Object.entries(component.props).map(([key, value]) => (
        <div key={key}>
          <label>{key}:</label>
          <input
            type="text"
            value={value}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
          />
        </div>
      ))}
    </div>
  );
};

export default PropertyEditor;
