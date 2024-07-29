import React, { useRef } from 'react';
import { ComponentConfig, PageConfig } from '../library/general';
import ComponentRenderer from './component-renderer';
import { useResizeAndDrag } from './hooks/use-resize-and-drag';

interface GridLayoutProps {
  page: PageConfig;
  gridDimensions: { columns: number; rows: number };
  onUpdatePage: (updatedPage: PageConfig) => void;
  selectedComponent: ComponentConfig | undefined;
  setSelectedComponent: (component: ComponentConfig | undefined) => void;
  addComponentToTarget: (
    components: ComponentConfig[],
    targetId: string,
    newComponent: ComponentConfig
  ) => ComponentConfig[];
  removeComponentById: (
    components: ComponentConfig[],
    id: string
  ) => ComponentConfig[];
}

const GridLayout: React.FC<GridLayoutProps> = ({
  page,
  gridDimensions,
  onUpdatePage,
  selectedComponent,
  setSelectedComponent,
}) => {
  const gridRef = useRef<HTMLDivElement>(null);
  const {
    handleResize,
    handleDrop,
    handleCellDrop,
    startResize,
    stopResize,
    startDrag,
  } = useResizeAndDrag(page, onUpdatePage, gridRef);

  const availableCells =
    gridDimensions.columns * gridDimensions.rows -
    page.components.reduce(
      (acc, c) => acc + c.layout.gridWidth * c.layout.gridHeight,
      0
    );

  return (
    <div
      className="grid-layout"
      ref={gridRef}
      style={{
        display: 'grid',
        gridTemplateColumns: `repeat(${gridDimensions.columns}, 1fr)`,
        gridTemplateRows: `repeat(${gridDimensions.rows}, 1fr)`,
        gap: '4px',
        position: 'relative',
        minHeight: `${gridDimensions.rows * 50}px`,
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
      {page.components.map((component) => (
        <ComponentRenderer
          key={component.id}
          component={component}
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
          handleDrop={handleDrop}
          startDrag={startDrag}
          startResize={startResize}
        />
      ))}
    </div>
  );
};

export default GridLayout;
