import React from 'react';
import { ComponentConfig } from '../library/general';
import ComponentWrapper from '../library/wrapper';
import ResizeHandle from './resize-handle';

interface ComponentRendererProps {
  component: ComponentConfig;
  selectedComponent: ComponentConfig | undefined;
  setSelectedComponent: (component: ComponentConfig) => void;
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    targetId: string | null,
    column: number,
    row: number
  ) => void;
  startDrag: (
    e: React.DragEvent,
    componentId: string,
    componentType: string
  ) => void;
  startResize: (
    e: React.MouseEvent,
    componentId: string,
    direction: string
  ) => void;
}

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  selectedComponent,
  setSelectedComponent,
  handleDrop,
  startDrag,
  startResize,
}) => {
  if (!component) return null;
  if (typeof component === 'string') return component;
  const style = {
    gridColumn: `${component.layout.gridColumn} / span ${component.layout.gridWidth}`,
    gridRow: `${component.layout.gridRow} / span ${component.layout.gridHeight}`,
    border: '1px solid #ccc',
    padding: '8px',
    backgroundColor:
      component.id === selectedComponent?.id ? '#e0e0e0' : 'white',
    position: 'relative' as 'relative',
  };

  return (
    <div
      style={style}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedComponent(component);
      }}
      draggable={true}
      onDragStart={(e) => startDrag(e, component.id, component.type)}
      onDragOver={(e) => e.preventDefault()}
      onDrop={(e) =>
        handleDrop(
          e,
          component.id,
          component.layout.gridColumn,
          component.layout.gridRow
        )
      }
    >
      <ComponentWrapper component={component}>
        {component.props.children &&
          Array.isArray(component.props.children) &&
          component.props.children.map((child) => (
            <ComponentRenderer
              key={child.id}
              component={child}
              selectedComponent={selectedComponent}
              setSelectedComponent={setSelectedComponent}
              handleDrop={handleDrop}
              startDrag={startDrag}
              startResize={startResize}
            />
          ))}
        {component.props.children &&
          !Array.isArray(component.props.children) && (
            <ComponentRenderer
              component={component.props.children}
              selectedComponent={selectedComponent}
              setSelectedComponent={setSelectedComponent}
              handleDrop={handleDrop}
              startDrag={startDrag}
              startResize={startResize}
            />
          )}
      </ComponentWrapper>

      {component.id === selectedComponent?.id && (
        <>
          <ResizeHandle
            direction="left"
            onMouseDown={(e) => startResize(e, component.id, 'left')}
          />
          <ResizeHandle
            direction="right"
            onMouseDown={(e) => startResize(e, component.id, 'right')}
          />
          <ResizeHandle
            direction="top"
            onMouseDown={(e) => startResize(e, component.id, 'top')}
          />
          <ResizeHandle
            direction="bottom"
            onMouseDown={(e) => startResize(e, component.id, 'bottom')}
          />
        </>
      )}
    </div>
  );
};

export default ComponentRenderer;
