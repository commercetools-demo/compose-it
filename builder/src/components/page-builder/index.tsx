import React, { useRef, useState } from 'react';
import ComponentPalette from '../component-palette';
import PropertyEditor from '../property-editor';
import { ComponentConfig, PageConfig } from '../library/general';
import { componentLibrary } from '../library';
import { getComponentProps } from '../library/utils';

interface PageBuilderProps {
  page: PageConfig;
  onUpdatePage: (updatedPage: PageConfig) => void;
}

const PageBuilder: React.FC<PageBuilderProps> = ({ page, onUpdatePage }) => {
  const [selectedComponentId, setSelectedComponentId] = React.useState<
    string | null
  >(null);
  const [resizing, setResizing] = useState<{
    id: string;
    direction: string;
  } | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const gridRef = useRef<HTMLDivElement>(null);

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    column: number,
    row: number
  ) => {
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
    const updatedComponents = page.components.map((c) =>
      c.id === updatedComponent.id ? updatedComponent : c
    );
    onUpdatePage({ ...page, components: updatedComponents });
  };

  const selectedComponent = page.components.find(
    (c) => c.id === selectedComponentId
  );

  const startResize = (
    e: React.MouseEvent,
    componentId: string,
    direction: string
  ) => {
    e.stopPropagation();
    e.preventDefault(); // Prevent drag start
    setResizing({ id: componentId, direction });
  };

  const startDrag = (e: React.DragEvent, componentId: string) => {
    if (!resizing) {
      setDragging(componentId);
      e.dataTransfer.setData('componentId', componentId);
    } else {
      e.preventDefault(); // Prevent drag if we're resizing
    }
  };
  const calculateNewSize = (current: number, start: number, size: number) => {
    return Math.max(1, Math.round((current - start) / size));
  };

  const handleResize = (e: React.MouseEvent) => {
    if (!resizing || !gridRef.current) return;

    const component = page.components.find((c) => c.id === resizing.id);
    if (!component) return;

    const gridRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cellWidth = gridRect.width / page.layout.columns;
    const cellHeight = cellWidth; // Assuming square cells

    let newWidth = component.props.gridWidth;
    let newHeight = component.props.gridHeight;
    let newColumn = component.props.gridColumn;
    let newRow = component.props.gridRow;

    switch (resizing.direction) {
      case 'right':
        newWidth = calculateNewSize(
          e.clientX,
          gridRect.left + (newColumn - 1) * cellWidth,
          cellWidth
        );
        break;
      case 'bottom':
        newHeight = calculateNewSize(
          e.clientY,
          gridRect.top + (newRow - 1) * cellHeight,
          cellHeight
        );
        break;
      case 'left':
        const newLeft = Math.round((e.clientX - gridRect.left) / cellWidth) + 1;
        newWidth =
          component.props.gridColumn + component.props.gridWidth - newLeft;
        if (newWidth > 0) {
          component.props.gridColumn = newLeft;
        }
        break;
      case 'top':
        const newTop = Math.round((e.clientY - gridRect.top) / cellHeight) + 1;
        newHeight =
          component.props.gridRow + component.props.gridHeight - newTop;
        if (newHeight > 0) {
          component.props.gridRow = newTop;
        }
        break;
    }
    const updatedComponent = {
      ...component,
      props: {
        ...component.props,
        gridWidth: Math.max(1, newWidth),
        gridHeight: Math.max(1, newHeight),
      },
    };

    handleComponentUpdate(updatedComponent);
  };
  const stopResize = () => {
    setResizing(null);
  };

  const renderComponent = (component: ComponentConfig) => {
    const style = {
      gridColumn: `${component.props.gridColumn} / span ${component.props.gridWidth}`,
      gridRow: `${component.props.gridRow} / span ${component.props.gridHeight}`,
      border: '1px solid #ccc',
      padding: '8px',
      backgroundColor:
        component.id === selectedComponentId ? '#e0e0e0' : 'white',
      position: 'relative' as 'relative',
    };

    const resizeHandleStyle = {
      position: 'absolute' as 'absolute',
      width: '10px',
      height: '10px',
      backgroundColor: '#4CAF50',
      zIndex: 10,
    };

    const Component = componentLibrary[component.type];

    return (
      <div
        key={component.id}
        style={style}
        onClick={() => setSelectedComponentId(component.id)}
        draggable={!resizing}
        onDragStart={(e) => startDrag(e, component.id)}
        onMouseDown={() => setDragging(null)}
      >
        <Component {...component.props} />

        <div
          style={{
            ...resizeHandleStyle,
            top: '50%',
            left: 0,
            transform: 'translateY(-50%)',
            cursor: 'w-resize',
          }}
          onMouseDown={(e) => startResize(e, component.id, 'left')}
        />
        <div
          style={{
            ...resizeHandleStyle,
            top: '50%',
            right: 0,
            transform: 'translateY(-50%)',
            cursor: 'e-resize',
          }}
          onMouseDown={(e) => startResize(e, component.id, 'right')}
        />
        <div
          style={{
            ...resizeHandleStyle,
            top: 0,
            left: '50%',
            transform: 'translateX(-50%)',
            cursor: 'n-resize',
          }}
          onMouseDown={(e) => startResize(e, component.id, 'top')}
        />
        {/* In a full implementation, you would render the actual component here */}
      </div>
    );
  };

  const handleCellDrop = (
    e: React.DragEvent<HTMLDivElement>,
    column: number,
    row: number
  ) => {
    e.preventDefault();
    const componentId = e.dataTransfer.getData('componentId');
    const componentType = e.dataTransfer.getData('componentType');

    if (componentId) {
      // Moving an existing component
      const updatedComponents = page.components.map((c) =>
        c.id === componentId
          ? { ...c, props: { ...c.props, gridColumn: column, gridRow: row } }
          : c
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
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${page.layout.columns}, 1fr)`,
          gap: '4px',
          position: 'relative',
        }}
        onMouseMove={handleResize}
        onMouseUp={stopResize}
        onMouseLeave={stopResize}
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
