import React from 'react';
import { ComponentConfig } from '../library/general';
import ComponentWrapper from '../library/wrapper';
import ResizeHandle from './resize-handle';
import { useContextMenu } from '../../providers/context-menu';
import styled from 'styled-components';

interface ComponentRendererProps {
  component: ComponentConfig;
  selectedComponent: ComponentConfig | undefined;
  setSelectedComponent: (component: ComponentConfig) => void;
  handleDrop: (
    e: React.DragEvent<HTMLDivElement>,
    targetId: string | null,
    column: number,
    row: number
  ) => void;
  startDrag: (
    e: React.DragEvent,
    componentId: string,
    componentType: string
  ) => void;
  startResize: (
    e: React.MouseEvent,
    componentId: string,
    direction: string
  ) => void;
}

const StyledComponentContainer: React.FC<
  React.HTMLAttributes<HTMLDivElement> & {
    component: ComponentConfig;
    selectedComponent?: ComponentConfig;
  }
> = styled.div`
  grid-column: ${({ component }) =>
    `${component.layout.gridColumn} / span ${component.layout.gridWidth}`};
  grid-row: ${({ component }) =>
    `${component.layout.gridRow} / span ${component.layout.gridHeight}`};
  border: 1px solid #ccc;
  padding: 8px;
  background-color: ${({ component, selectedComponent }) =>
    component.id === selectedComponent?.id ? '#e0e0e0' : 'white'};
  position: relative;
  transition: background-color 0.3s ease;
  &:hover {
    background-color: ${({ component, selectedComponent }) =>
      component.id === selectedComponent?.id
        ? '#e0e0e0'
        : 'rgba(224, 224, 224, 0.5)'};
  }
  &::before {
    content: '${({ component }) => component.type}';
    position: absolute;
    top: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.7);
    color: white;
    padding: 2px 5px;
    font-size: 12px;
    border-bottom-right-radius: 4px;
    opacity: 0;
    transition: opacity 0.3s ease;
    pointer-events: none;
  }

  &:hover::before {
    opacity: 1;
  }
`;

const ComponentRenderer: React.FC<ComponentRendererProps> = ({
  component,
  selectedComponent,
  setSelectedComponent,
  handleDrop,
  startDrag,
  startResize,
}) => {
  const { handleContextMenu } = useContextMenu();

  const onContextMenu = (e: React.MouseEvent) => {
    handleContextMenu(e, 'component', component.id);
  };

  if (!component) return null;
  if (typeof component === 'string') return component;
  return (
    <StyledComponentContainer
      component={component}
      selectedComponent={selectedComponent}
      onClick={(e) => {
        e.stopPropagation();
        setSelectedComponent(component);
      }}
      draggable={true}
      onDragStart={(e) => startDrag(e, component.id, component.type)}
      onDragOver={(e) => e.preventDefault()}
      onContextMenu={onContextMenu}
      onDrop={(e) =>
        handleDrop(
          e,
          component.id,
          component.layout.gridColumn,
          component.layout.gridRow
        )
      }
    >
      <ComponentWrapper component={component}>
        {component.props.children &&
          Array.isArray(component.props.children) &&
          component.props.children.map((child) => (
            <ComponentRenderer
              key={child.id}
              component={child}
              selectedComponent={selectedComponent}
              setSelectedComponent={setSelectedComponent}
              handleDrop={handleDrop}
              startDrag={startDrag}
              startResize={startResize}
            />
          ))}
        {component.props.children &&
          !Array.isArray(component.props.children) && (
            <ComponentRenderer
              component={component.props.children}
              selectedComponent={selectedComponent}
              setSelectedComponent={setSelectedComponent}
              handleDrop={handleDrop}
              startDrag={startDrag}
              startResize={startResize}
            />
          )}
      </ComponentWrapper>

      {component.id === selectedComponent?.id && (
        <>
          <ResizeHandle
            direction="left"
            onMouseDown={(e) => startResize(e, component.id, 'left')}
          />
          <ResizeHandle
            direction="right"
            onMouseDown={(e) => startResize(e, component.id, 'right')}
          />
          <ResizeHandle
            direction="top"
            onMouseDown={(e) => startResize(e, component.id, 'top')}
          />
          <ResizeHandle
            direction="bottom"
            onMouseDown={(e) => startResize(e, component.id, 'bottom')}
          />
        </>
      )}
    </StyledComponentContainer>
  );
};

export default ComponentRenderer;
