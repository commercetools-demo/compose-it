import React from 'react';
import { ComponentConfig } from 'src/types/component';
import { GridPosition } from 'src/types/grid';
// import styled from 'styled-components';

// const Grid = styled.div`
//   display: grid;
//   grid-template-columns: repeat(12, 1fr);
//   gap: 16px;
// `;

// const GridItem = styled.div<GridPosition>`
//   grid-column: ${props => props.column} / span ${props => props.width};
//   grid-row: ${props => props.row} / span ${props => props.height};
// `;

interface PageProps {
  children: React.ReactNode[];
  layout: ComponentConfig['props']['layout'];
}

const Page: React.FC<PageProps> = ({ children, layout }) => {
  return (
    <div>
      {React.Children.map(children, (child, index) => {
        const childConfig = layout[index] as GridPosition;
        return (
          <div key={index} {...childConfig}>
            {child}
          </div>
        );
      })}
    </div>
  );
};

export default Page;