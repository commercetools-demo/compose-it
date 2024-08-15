import React, { useEffect, useState } from 'react';
import { ComponentConfig, PageConfig } from '../library/general';
import GridLayout from './grid-layout';
import { useGridDimensions } from './hooks/use-grid-dimensions';
import { useComponentConfig } from './hooks/use-component-config';
import styled from 'styled-components';
import TabbedSidebar from './tabbed-sidebar';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';

interface PageBuilderProps {
  page: PageConfig;
  onUpdatePage: (updatedPage: PageConfig) => void;
}

const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
`;
const StyledDiv = styled.div`
  display: grid;
  grid-template-columns: 1fr 300px;
`;

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
      <Spacings.Stack scale="xs">
        <Text.Subheadline as="h4">{`Editing Route: ${
          !!page.route ? page.route : '/'
        }`}</Text.Subheadline>
      </Spacings.Stack>
      <StyledDiv>
        <GridLayout
          page={page}
          gridDimensions={gridDimensions}
          onUpdatePage={onUpdatePage}
          selectedComponent={selectedComponent}
          setSelectedComponent={setSelectedComponent}
          addComponentToTarget={addComponentToTarget}
          removeComponentById={removeComponentById}
        />
        <TabbedSidebar
          component={selectedComponent}
          onUpdateComponent={handleComponentUpdate}
          onDeleteComponent={handleComponentDelete}
        />
      </StyledDiv>
    </div>
  );
};

export default PageBuilder;
