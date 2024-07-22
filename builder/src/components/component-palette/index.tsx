import React from 'react';
import {componentLibrary} from '../library'

export const getComponentProps = (componentType: string) => {
    switch (componentType) {
      case 'Text.Headline':
        return {children: ''}
      case 'Button':
        return { text: 'Click Me' };
      case 'Card':
        return { type: 'flet', children: '' };
      case 'Page':
        return { layout: {}, children: '' };
      default:
        return {};
    }
}

const ComponentPalette: React.FC = () => {
  const handleDragStart = (e: React.DragEvent<HTMLDivElement>, componentType: string) => {
    e.dataTransfer.setData('componentType', componentType);
  };

  return (
    <div className="component-palette">
      <h3>Components</h3>
      {Object.keys(componentLibrary).map(type => (
        <div
          key={type}
          draggable
          onDragStart={(e) => handleDragStart(e, type)}
          className="component-item"
        >
          {type}
        </div>
      ))}
    </div>
  );
};

export default ComponentPalette;