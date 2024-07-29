import { useState, useEffect } from 'react';
import { PageConfig } from '../../library/general';

export const useGridDimensions = (page: PageConfig) => {
  const [gridDimensions, setGridDimensions] = useState({
    columns: page.layout.columns,
    rows: 10,
  });

  const updateGridDimensions = () => {
    let maxColumn = page.layout.columns;
    let maxRow = 10;

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

  useEffect(() => {
    updateGridDimensions();
  }, [page.components]);

  return { gridDimensions, updateGridDimensions };
};
