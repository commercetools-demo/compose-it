import React from 'react';
import { componentLibrary } from '../library';
import Text from '@commercetools-uikit/text';
import styled from 'styled-components';

const ComponentItem = styled.div`
  padding: 2px 4px;
  cursor: grab;
  border: 1px solid #ccc;
  border-radius: 4px;
  margin: 4px 2px;
  &:hover {
    background-color: #f0f0f0;
  }
  &:active {
    cursor: grabbing;
  }
`;
const ComponentPalette: React.FC = () => {
  const handleDragStart = (
    e: React.DragEvent<HTMLDivElement>,
    componentType: string
  ) => {
    e.dataTransfer.setData('componentType', componentType);
  };

  return (
    <div className="component-palette">
      <Text.Subheadline as="h4">
        Drag & Drop components to page
      </Text.Subheadline>
      {Object.keys(componentLibrary).map((type) => (
        <ComponentItem
          key={type}
          draggable
          onDragStart={(e) => handleDragStart(e, type)}
          className="component-item"
        >
          {type}
        </ComponentItem>
      ))}
    </div>
  );
};

export default ComponentPalette;
