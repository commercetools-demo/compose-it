import {
  useModalState,
} from '@commercetools-frontend/application-components';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import {
  ComponentPropResponse,
} from '../../../types/datasource';
import { useState } from 'react';
import ComponentList from './component-list';
import ComponentPropEditForm from './component-prop-edit-form';
import { useComponentProps } from '../../../hooks/use-components';
import { useBuilderStateContext } from '../../../providers/process';

const Components = () => {
  const { updateComponentProp } = useComponentProps();
  const { refreshData } = useBuilderStateContext();
  const [selectedComponent, setSelectedComponent] =
    useState<ComponentPropResponse>();
  const drawerState = useModalState();

  const handleSelectComponent = (component: ComponentPropResponse) => {
    setSelectedComponent(component);
    drawerState.openModal();
  };

  const handleUpdateComponent = async (component: ComponentPropResponse) => {
    if (!selectedComponent || !component.value) return;

    const result = await updateComponentProp(
      selectedComponent.key,
      component.value
    );
    if (!!result) {
      refreshData?.();
      drawerState.closeModal();
    }
  };

  return (
    <>
      <Spacings.Stack scale="xl">
        <Spacings.Stack scale="l">
          <Spacings.Inline justifyContent="space-between">
            <Text.Subheadline as="h4">List of components</Text.Subheadline>
            <PrimaryButton
              iconLeft={<PlusBoldIcon />}
              label="Add new component"
              onClick={drawerState.openModal}
            />
          </Spacings.Inline>
          <ComponentList onSelectComponent={handleSelectComponent} />
        </Spacings.Stack>
      </Spacings.Stack>

      {drawerState.isModalOpen && (
        <ComponentPropEditForm
          selectedComponent={selectedComponent}
          onSubmit={handleUpdateComponent}
          onCancel={drawerState.closeModal}
        />
      )}
    </>
  );
};

export default Components;
