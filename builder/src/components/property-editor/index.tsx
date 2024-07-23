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
    const updatedConfig = {
      ...(component.config || {}),
      propsBindings: {
        ...(component.config?.propsBindings || {}),
        [key]: {
          ...(component.config?.propsBindings?.[key] || { type: 'property' }),
          value,
        },
      },
    };

    onUpdateComponent({ ...component, config: updatedConfig });
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const handleTypeChange = (key: string, type: any) => {
    const updatedConfig = {
      ...(component.config || {}),
      propsBindings: {
        ...(component.config?.propsBindings || {}),
        [key]: {
          ...(component.config?.propsBindings?.[key] || { value: '' }),
          type,
        },
      },
    };

    onUpdateComponent({ ...component, config: updatedConfig });
  };

  return (
    <div className="property-editor">
      <h3>Properties: {component.type}</h3>
      {Object.entries(component.props).map(([key]) => (
        <div key={key}>
          <label>{key}:</label>
          <input
            type="text"
            value={component.config?.propsBindings?.[key]?.value}
            onChange={(e) => handlePropertyChange(key, e.target.value)}
          />
          <label htmlFor={`use-datasource-${key}`}>use datasource:</label>
          <input
            type="checkbox"
            checked={
              component.config?.propsBindings?.[key]?.type === 'datasource'
            }
            id={`use-datasource-${key}`}
            onChange={(e) =>
              handleTypeChange(
                key,
                e.target.checked ? 'datasource' : 'property'
              )
            }
          />
        </div>
      ))}
    </div>
  );
};

export default PropertyEditor;
