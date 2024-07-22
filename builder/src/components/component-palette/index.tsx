import React from 'react';
import {componentLibrary} from '../library'

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