import React, { useEffect, useState } from 'react';
import ComponentPalette from '../component-palette';
import PropertyEditor from '../property-editor';
import { ComponentConfig, PageConfig } from '../library/general';
import GridLayout from './grid-layout';
import { useGridDimensions } from './hooks/use-grid-dimensions';
import { useComponentConfig } from './hooks/use-component-config';

interface PageBuilderProps {
  page: PageConfig;
  onUpdatePage: (updatedPage: PageConfig) => void;
}

const PageBuilder: React.FC<PageBuilderProps> = ({ page, onUpdatePage }) => {
  const [selectedComponent, setSelectedComponent] = useState<ComponentConfig>();
  const { gridDimensions, updateGridDimensions } = useGridDimensions(page);
  const {
    addComponentToTarget,
    removeComponentById,
    updateComponentInComponents,
    findComponentById,
  } = useComponentConfig();

  const handleComponentUpdate = (updatedComponent: ComponentConfig) => {
    const updatedComponents = updateComponentInComponents(
      page.components,
      updatedComponent
    );
    onUpdatePage({ ...page, components: updatedComponents });
  };

  const handleComponentDelete = (component: ComponentConfig) => {
    if (!component?.id) return;
    const updatedComponents = removeComponentById(
      page.components,
      component.id
    );
    onUpdatePage({ ...page, components: updatedComponents });
  };

  useEffect(() => {
    updateGridDimensions();
    const cmp = findComponentById(page.components, selectedComponent?.id);
    setSelectedComponent(cmp);
  }, [page.components]);

  return (
    <div className="page-builder">
      <ComponentPalette />
      <GridLayout
        page={page}
        gridDimensions={gridDimensions}
        onUpdatePage={onUpdatePage}
        selectedComponent={selectedComponent}
        setSelectedComponent={setSelectedComponent}
        addComponentToTarget={addComponentToTarget}
        removeComponentById={removeComponentById}
      />
      {!!selectedComponent && (
        <PropertyEditor
          component={selectedComponent}
          onUpdateComponent={handleComponentUpdate}
          onDeleteComponent={handleComponentDelete}
        />
      )}
    </div>
  );
};

export default PageBuilder;
