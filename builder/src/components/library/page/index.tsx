import React from 'react';
import styled from 'styled-components';
import { ComponentConfig, GridPosition } from '../general';

const Grid = styled.div`
  display: grid;
  grid-template-columns: repeat(12, 1fr);
  gap: 16px;
`;

const GridItem = styled.div<GridPosition>`
  grid-column: ${props => props.column} / span ${props => props.width};
  grid-row: ${props => props.row} / span ${props => props.height};
`;

interface PageProps {
  children: React.ReactNode[];
  layout: ComponentConfig['props']['layout'];
}

const Page: React.FC<PageProps> = ({ children, layout }) => {
  return (
    <Grid>
      {React.Children.map(children, (child, index) => {
        const childConfig = layout[index] as GridPosition;
        return (
          <GridItem key={index} {...childConfig}>
            {child}
          </GridItem>
        );
      })}
    </Grid>
  );
};

export default Page;