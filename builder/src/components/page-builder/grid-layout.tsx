import React, { useRef } from 'react';
import { ComponentConfig, PageConfig } from '../library/general';
import ComponentRenderer from './component-renderer';
import { useResizeAndDrag } from './hooks/use-resize-and-drag';
import { useGridDimensions } from './hooks/use-grid-dimensions';
import ContextMenu from './context-menu';
import { useContextMenu } from '../../providers/context-menu';

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
    handleDragLeave,
    handleDragOver,
    dragPosition,
  } = useResizeAndDrag(page, onUpdatePage, gridRef);
  const { gridOccupancy } = useGridDimensions(page);
  const { handleContextMenu } = useContextMenu();

  const renderEmptyCells = () => {
    const cells = [];
    for (let row = 0; row < gridDimensions.rows; row++) {
      for (let col = 0; col < gridDimensions.columns; col++) {
        if (!gridOccupancy[row][col]) {
          const isHighlighted =
            dragPosition?.column === col + 1 && dragPosition?.row === row + 1;
          cells.push(
            <div
              key={`empty-${row}-${col}`}
              className={`grid-cell ${isHighlighted ? 'highlighted' : ''}`}
              style={{
                gridColumn: col + 1,
                gridRow: row + 1,
                border: '1px dashed #ccc',
                minHeight: '50px',
                backgroundColor: isHighlighted
                  ? 'rgba(0, 123, 255, 0.2)'
                  : 'transparent',
              }}
              onDragOver={(e) => handleDragOver(e, col + 1, row + 1)}
              onDragLeave={handleDragLeave}
              onDrop={(e) => handleCellDrop(e, col + 1, row + 1)}
              onContextMenu={(e) =>
                handleContextMenu(e, 'cell', undefined, col + 1, row + 1)
              }
            />
          );
        }
      }
    }
    return cells;
  };

  return (
    <>
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
        {renderEmptyCells()}
        {page.components?.map((component) => (
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
      <ContextMenu />
    </>
  );
};

export default GridLayout;
