import React from 'react';
import { ComponentConfig, PageConfig } from '../../types/generated/general';
import ComponentPalette, { getComponentProps } from '../component-palette';
import PropertyEditor from '../property-editor';
import { componentLibrary } from '../library';

interface PageBuilderProps {
  page: PageConfig;
  onUpdatePage: (updatedPage: PageConfig) => void;
}

const PageBuilder: React.FC<PageBuilderProps> = ({ page, onUpdatePage }) => {
  const [selectedComponentId, setSelectedComponentId] = React.useState<string | null>(null);

  const handleDrop = (e: React.DragEvent<HTMLDivElement>, column: number, row: number) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    const newComponent: ComponentConfig = {
      type: componentType,
      id: Date.now().toString(),
      props: {
        gridColumn: column,
        gridRow: row,
        gridWidth: 1,
        gridHeight: 1,
        ...getComponentProps(componentType),
      },
    };
    const updatedComponents = [...page.components, newComponent];
    onUpdatePage({ ...page, components: updatedComponents });
  };

  const handleComponentUpdate = (updatedComponent: ComponentConfig) => {
    const updatedComponents = page.components.map(c => 
      c.id === updatedComponent.id ? updatedComponent : c
    );
    onUpdatePage({ ...page, components: updatedComponents });
  };

  const selectedComponent = page.components.find(c => c.id === selectedComponentId);

  const renderComponent = (component: ComponentConfig) => {
    const style = {
      gridColumn: `${component.props.gridColumn} / span ${component.props.gridWidth}`,
      gridRow: `${component.props.gridRow} / span ${component.props.gridHeight}`,
      border: '1px solid #ccc',
      padding: '8px',
      backgroundColor: component.id === selectedComponentId ? '#e0e0e0' : 'white',
    };

    const Component = componentLibrary[component.type];

    return (
      <div
        key={component.id}
        style={style}
        onClick={() => setSelectedComponentId(component.id)}
        draggable
        onDragStart={(e) => {
          e.dataTransfer.setData('componentId', component.id);
        }}
      >
        <Component {...component.props} />
        {/* In a full implementation, you would render the actual component here */}
        
      </div>
    );
  };

  const handleCellDrop = (e: React.DragEvent<HTMLDivElement>, column: number, row: number) => {
    e.preventDefault();
    const componentId = e.dataTransfer.getData('componentId');
    const componentType = e.dataTransfer.getData('componentType');

    if (componentId) {
      // Moving an existing component
      const updatedComponents = page.components.map(c =>
        c.id === componentId ? { ...c, props: { ...c.props, gridColumn: column, gridRow: row } } : c
      );
      onUpdatePage({ ...page, components: updatedComponents });
    } else if (componentType) {
      // Adding a new component
      handleDrop(e, column, row);
    }
  };

  return (
    <div className="page-builder">
      <ComponentPalette />
      <div 
        className="grid-layout" 
        style={{ 
          display: 'grid', 
          gridTemplateColumns: `repeat(${page.layout.columns}, 1fr)`,
          gap: '4px',
          position: 'relative',
        }}
      >
        {Array.from({ length: page.layout.columns * 10 }).map((_, index) => {
          const column = (index % page.layout.columns) + 1;
          const row = Math.floor(index / page.layout.columns) + 1;
          return (
            <div
              key={index}
              className="grid-cell"
              style={{
                border: '1px dashed #ccc',
                minHeight: '50px',
              }}
              onDragOver={(e) => e.preventDefault()}
              onDrop={(e) => handleCellDrop(e, column, row)}
            />
          );
        })}
        {page.components.map(renderComponent)}
      </div>
      {selectedComponent && (
        <PropertyEditor
          component={selectedComponent}
          onUpdateComponent={handleComponentUpdate}
        />
      )}
    </div>
  );
};

export default PageBuilder;