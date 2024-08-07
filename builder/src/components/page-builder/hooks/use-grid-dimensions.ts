import { useState, useEffect, useMemo } from 'react';
import { PageConfig } from '../../library/general';

export const useGridDimensions = (page: PageConfig) => {
  const [gridDimensions, setGridDimensions] = useState({
    columns: page.layout.columns,
    rows: 10,
  });

  const updateGridDimensions = () => {
    let maxColumn = page.layout.columns;
    let maxRow = 10;

    page.components?.forEach((component) => {
      const rightEdge =
        component.layout.gridColumn + component.layout.gridWidth - 1;
      const bottomEdge =
        component.layout.gridRow + component.layout.gridHeight - 1;

      maxColumn = Math.max(maxColumn, rightEdge);
      maxRow = Math.max(maxRow, bottomEdge);
    });

    setGridDimensions({ columns: maxColumn, rows: maxRow });
  };

  const gridOccupancy = useMemo(() => {
    const grid = Array(gridDimensions.rows)
      .fill(null)
      .map(() => Array(gridDimensions.columns).fill(false));

    page.components?.forEach((component) => {
      for (
        let row = component.layout.gridRow;
        row < component.layout.gridRow + component.layout.gridHeight;
        row++
      ) {
        for (
          let col = component.layout.gridColumn;
          col < component.layout.gridColumn + component.layout.gridWidth;
          col++
        ) {
          if (
            row - 1 < gridDimensions.rows &&
            col - 1 < gridDimensions.columns
          ) {
            grid[row - 1][col - 1] = true;
          }
        }
      }
    });

    return grid;
  }, [page.components, gridDimensions]);

  useEffect(() => {
    updateGridDimensions();
  }, [page.components]);

  return { gridDimensions, gridOccupancy, updateGridDimensions };
};
