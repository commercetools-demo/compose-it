import React, { useEffect, useMemo, useRef, useState } from 'react';
import ComponentPalette from '../component-palette';
import PropertyEditor from '../property-editor';
import { ComponentConfig, PageConfig } from '../library/general';
import { getComponentProps } from '../library/utils';
import ComponentWrapper from '../library/wrapper';
import { useComponentConfig } from './hooks/use-component-config';
import { calculateNewSize } from './utils';

interface PageBuilderProps {
  page: PageConfig;
  onUpdatePage: (updatedPage: PageConfig) => void;
}

const PageBuilder: React.FC<PageBuilderProps> = ({ page, onUpdatePage }) => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentConfig>();
  const [resizing, setResizing] = useState<{
    id: string;
    direction: string;
  } | null>(null);
  const [dragging, setDragging] = useState<string | null>(null);
  const [gridDimensions, setGridDimensions] = useState({
    columns: page.layout.columns,
    rows: 10,
  });

  const gridRef = useRef<HTMLDivElement>(null);

  const {
    addComponentToTarget,
    removeComponentById,
    updateComponentInComponents,
    findComponentById,
  } = useComponentConfig();

  const handleComponentUpdate = (updatedComponent: ComponentConfig) => {
    const updatedComponents = updateComponentInComponents(
      page.components,
      updatedComponent
    );
    onUpdatePage({ ...page, components: updatedComponents });
  };

  const handleDrop = (
    e: React.DragEvent<HTMLDivElement>,
    targetId: string | null,
    column: number,
    row: number
  ) => {
    e.preventDefault();
    const componentType = e.dataTransfer.getData('componentType');
    const sourceComponentId = e.dataTransfer.getData('componentId');

    const newComponent: ComponentConfig = {
      type: componentType,
      id: Date.now().toString(),
      layout: {
        gridColumn: column,
        gridRow: row,
        gridWidth: 1,
        gridHeight: 1,
      },
      config: {
        propsBindings: {},
      },
      props: {
        ...getComponentProps(componentType),
      },
    };
    let updatedComponents = [...page.components, newComponent];
    if (sourceComponentId) {
      // Moving an existing component
      updatedComponents = removeComponentById(
        page.components,
        sourceComponentId
      );
    } else {
      // Adding a new component
      updatedComponents = [...page.components];
    }

    if (targetId) {
      // Dropping into another component
      updatedComponents = addComponentToTarget(
        updatedComponents,
        targetId,
        newComponent
      );
    } else {
      // Dropping directly onto the grid
      updatedComponents.push(newComponent);
    }

    onUpdatePage({ ...page, components: updatedComponents });
  };

  const startResize = (
    e: React.MouseEvent,
    componentId: string,
    direction: string
  ) => {
    e.stopPropagation();
    setResizing({ id: componentId, direction });
  };

  const startDrag = (
    e: React.DragEvent,
    componentId: string,
    componentType: string
  ) => {
    if (!resizing) {
      setDragging(componentId);
      e.dataTransfer.setData('componentId', componentId);
      e.dataTransfer.setData('componentType', componentType);
    } else {
      e.preventDefault(); // Prevent drag if we're resizing
    }
  };

  const handleResize = (e: React.MouseEvent) => {
    if (!resizing || !gridRef.current) return;

    const component = page.components.find((c) => c.id === resizing.id);
    if (!component) return;

    const gridRect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const cellWidth = gridRect.width / page.layout.columns;
    const cellHeight = cellWidth; // Assuming square cells

    let newWidth = component.layout.gridWidth;
    let newHeight = component.layout.gridHeight;
    let newColumn = component.layout.gridColumn;
    let newRow = component.layout.gridRow;

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
          component.layout.gridColumn + component.layout.gridWidth - newLeft;
        if (newWidth > 0) {
          component.layout.gridColumn = newLeft;
        }
        break;
      case 'top':
        const newTop = Math.round((e.clientY - gridRect.top) / cellHeight) + 1;
        newHeight =
          component.layout.gridRow + component.layout.gridHeight - newTop;
        if (newHeight > 0) {
          component.layout.gridRow = newTop;
        }
        break;
    }
    const updatedComponent = {
      ...component,
      layout: {
        ...component.layout,
        gridWidth: Math.max(1, newWidth),
        gridHeight: Math.max(1, newHeight),
      },
    };

    handleComponentUpdate(updatedComponent);
  };
  const stopResize = () => {
    setResizing(null);
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
          ? { ...c, layout: { ...c.layout, gridColumn: column, gridRow: row } }
          : c
      );
      onUpdatePage({ ...page, components: updatedComponents });
    } else if (componentType) {
      // Adding a new component
      handleDrop(e, null, column, row);
    }
  };

  const updateGridDimensions = () => {
    let maxColumn = page.layout.columns;
    let maxRow = 10; // Starting with a minimum of 10 rows

    page.components.forEach((component) => {
      const rightEdge =
        component.layout.gridColumn + component.layout.gridWidth - 1;
      const bottomEdge =
        component.layout.gridRow + component.layout.gridHeight - 1;

      maxColumn = Math.max(maxColumn, rightEdge);
      maxRow = Math.max(maxRow, bottomEdge);
    });

    setGridDimensions({ columns: maxColumn, rows: maxRow });
  };

  const availableCells = useMemo(
    () =>
      gridDimensions.columns * gridDimensions.rows -
      page.components.reduce(
        (acc, c) => acc + c.layout.gridWidth * c.layout.gridHeight,
        0
      ),
    [gridDimensions]
  );

  const renderComponent = (component: ComponentConfig) => {
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

    const resizeHandleStyle = {
      position: 'absolute' as 'absolute',
      width: '10px',
      height: '10px',
      backgroundColor: '#4CAF50',
      zIndex: 10,
    };

    return (
      <div
        key={component.id}
        style={style}
        onClick={(e) => {
          e.stopPropagation();
          setSelectedComponent(component);
        }}
        draggable={!resizing}
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
        onMouseDown={() => setDragging(null)}
      >
        <ComponentWrapper component={component}>
          {component.props.children &&
            Array.isArray(component.props.children) &&
            component.props.children.map(renderComponent)}
          {component.props.children &&
            !Array.isArray(component.props.children) &&
            renderComponent(component.props.children)}
        </ComponentWrapper>

        {component.id === selectedComponent?.id && (
          <>
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
          </>
        )}
      </div>
    );
  };

  useEffect(() => {
    updateGridDimensions();
    setSelectedComponent(
      findComponentById(page.components, selectedComponent?.id)
    );
  }, [page.components]);

  return (
    <div className="page-builder">
      <ComponentPalette />
      <div
        className="grid-layout"
        ref={gridRef}
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${gridDimensions.columns}, 1fr)`,
          gridTemplateRows: `repeat(${gridDimensions.rows}, 1fr)`,
          gap: '4px',
          position: 'relative',
          minHeight: `${gridDimensions.rows * 50}px`, // Assuming each cell is at
        }}
        onMouseMove={handleResize}
        onMouseUp={stopResize}
        onMouseLeave={stopResize}
      >
        {Array.from({ length: availableCells }).map((_, index) => {
          const column = (index % gridDimensions.columns) + 1;
          const row = Math.floor(index / gridDimensions.columns) + 1;
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
      {!!selectedComponent && (
        <PropertyEditor
          component={selectedComponent}
          onUpdateComponent={handleComponentUpdate}
        />
      )}
    </div>
  );
};

export default PageBuilder;
