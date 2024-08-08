import { RefObject, useState } from 'react';
import { ComponentConfig, PageConfig } from '../../library/general';
import { calculateNewSize } from '../utils';
import { useComponentConfig } from './use-component-config';
import { useBuilderStateContext } from '../../../providers/process';

export const useResizeAndDrag = (
  page: PageConfig,
  onUpdatePage: (updatedPage: PageConfig) => void,
  gridRef: RefObject<HTMLDivElement>
) => {
  const [resizing, setResizing] = useState<{
    id: string;
    direction: string;
  } | null>(null);

  const [dragPosition, setDragPosition] = useState<{
    column: number;
    row: number;
  } | null>(null);

  const { getComponentProps } = useBuilderStateContext();

  const { removeComponentById, addComponentToTarget } = useComponentConfig();

  const handleResize = (e: React.MouseEvent) => {
    if (!resizing || !gridRef.current) return;

    const component = page.components?.find((c) => c.id === resizing.id);
    if (!component) return;

    const gridRect = gridRef.current.getBoundingClientRect();
    const cellWidth = gridRect.width / page.layout.columns;
    const cellHeight = cellWidth;

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
          newColumn = newLeft;
        }
        break;
      case 'top':
        const newTop = Math.round((e.clientY - gridRect.top) / cellHeight) + 1;
        newHeight =
          component.layout.gridRow + component.layout.gridHeight - newTop;
        if (newHeight > 0) {
          newRow = newTop;
        }
        break;
    }

    const updatedComponent = {
      ...component,
      layout: {
        gridColumn: newColumn,
        gridRow: newRow,
        gridWidth: Math.max(1, newWidth),
        gridHeight: Math.max(1, newHeight),
      },
    };

    const updatedPage = {
      ...page,
      components: page.components?.map((c) =>
        c.id === component.id ? updatedComponent : c
      ),
    };

    onUpdatePage(updatedPage);
  };

  const stopResize = () => {
    setResizing(null);
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
      // setDragging(componentId);
      e.dataTransfer.setData('componentId', componentId);
      e.dataTransfer.setData('componentType', componentType);
    } else {
      e.preventDefault(); // Prevent drag if we're resizing
    }
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

    const componentProps = getComponentProps(componentType);

    const props = componentProps?.props || {};
    const propsBindings = componentProps?.propsBindings || {};

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
        propsBindings: propsBindings,
      },
      props,
    };
    let updatedComponents = [...(page.components || []), newComponent];
    if (sourceComponentId) {
      // Moving an existing component
      updatedComponents = removeComponentById(
        page.components || [],
        sourceComponentId
      );
    } else {
      // Adding a new component
      updatedComponents = [...(page.components || [])];
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
  const handleDragLeave = () => {
    setDragPosition(null);
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
      const updatedComponents = page.components?.map((c) =>
        c.id === componentId
          ? { ...c, layout: { ...c.layout, gridColumn: column, gridRow: row } }
          : c
      );
      onUpdatePage({ ...page, components: updatedComponents });
    } else if (componentType) {
      // Adding a new component
      handleDrop(e, null, column, row);
    }
    handleDragLeave();
  };

  const handleDragOver = (
    e: React.DragEvent<HTMLDivElement>,
    column: number,
    row: number
  ) => {
    e.preventDefault();
    setDragPosition({ column, row });
  };

  return {
    handleResize,
    stopResize,
    startResize,
    startDrag,
    handleCellDrop,
    handleDrop,
    handleDragOver,
    handleDragLeave,
    dragPosition,
  };
};
