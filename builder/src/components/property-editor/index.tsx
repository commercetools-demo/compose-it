import React, { useMemo } from 'react';
import { ComponentConfig, PageConfig } from '../library/general';

import { PropertyItem } from './property-item';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';

interface PropertyEditorProps {
  component: ComponentConfig | PageConfig;
  onUpdateComponent: (updatedComponent: ComponentConfig | PageConfig) => void;
}

const PropertyEditor: React.FC<PropertyEditorProps> = ({
  component,
  onUpdateComponent,
}) => {
  const mostUsedComponentProps = useMemo(() => {
    return Object.entries(component.props || {})
      .filter((a) => {
        const aKey = a[0];
        const aSort = component.config?.propsBindings?.[aKey]?.sortOrder || 0;
        return aSort > 0.7;
      })
      .sort((a, b) => {
        const aKey = a[0];
        const bKey = b[0];
        const aSort = component.config?.propsBindings?.[aKey]?.sortOrder || 0;
        const bSort = component.config?.propsBindings?.[bKey]?.sortOrder || 0;
        return bSort - aSort;
      });
  }, [component.props]);
  const leastUsedComponentProps = useMemo(() => {
    return Object.entries(component.props || {})
      .filter((a) => {
        const aKey = a[0];
        const aSort = component.config?.propsBindings?.[aKey]?.sortOrder || 0;
        return aSort <= 0.7;
      })
      .sort((a, b) => {
        const aKey = a[0];
        const bKey = b[0];
        const aSort = component.config?.propsBindings?.[aKey]?.sortOrder || 0;
        const bSort = component.config?.propsBindings?.[bKey]?.sortOrder || 0;
        return bSort - aSort;
      });
  }, [component.props]);

  return (
    <div className="property-editor">
      <h3>Properties: {component.type}</h3>
      {'gridWidth' in component.layout && 'gridHeight' in component.layout && (
        <p>
          {component.layout.gridWidth} x {component.layout.gridHeight}
        </p>
      )}

      {mostUsedComponentProps.map(([key]) => (
        <PropertyItem
          key={key}
          propertyKey={key}
          component={component}
          onUpdateComponent={onUpdateComponent}
        />
      ))}
      <CollapsiblePanel
        isDefaultClosed
        header={`Other properties (${leastUsedComponentProps.length})`}
      >
        {leastUsedComponentProps.map(([key]) => (
          <PropertyItem
            key={key}
            propertyKey={key}
            component={component}
            onUpdateComponent={onUpdateComponent}
          />
        ))}
      </CollapsiblePanel>
    </div>
  );
};

export default PropertyEditor;
