import { useModalState } from '@commercetools-frontend/application-components';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import { FlyingComponentsResponse } from '../../../types/datasource';
import { useState } from 'react';
import FlyingComponentList from './component-list';
import FlyingComponentForm from './component-form';
import { useBuilderStateContext } from '../../../providers/process';
import { useFlyingComponents } from '../../../hooks/use-flying-components';
import { useRuntimeComponents } from './hooks/use-runtime-components';

const FlyingComponents = () => {
  const { updateFlyingComponent } = useFlyingComponents();
  const { serializeComponent } = useRuntimeComponents();
  const { refreshData } = useBuilderStateContext();
  const [selectedComponent, setSelectedComponent] =
    useState<FlyingComponentsResponse>();
  const drawerState = useModalState();

  const handleSelectComponent = (component: FlyingComponentsResponse) => {
    setSelectedComponent(component);
    drawerState.openModal();
  };

  const handleCloseModal = () => {
    setSelectedComponent(undefined);
    drawerState.closeModal();
  };
  const handleUpdateComponent = async (component: FlyingComponentsResponse) => {
    if (!component.value) return;

    let serializedComponent;

    try {
      serializedComponent = await serializeComponent(
        component.value.code,
        component.key
      );
    } catch (error) {
      throw error;
    }

    const resultCreation = await updateFlyingComponent(component.key, {
      code: component.value.code,
      props: {},
      propsBindings: {},
      serializedCode: serializedComponent!,
    });
    if (!!resultCreation) {
      refreshData?.();
      drawerState.closeModal();
    }
  };

  return (
    <>
      <Spacings.Stack scale="xl">
        <Spacings.Stack scale="l">
          <Spacings.Inline justifyContent="space-between">
            <Text.Subheadline as="h4">
              List of Flying components
            </Text.Subheadline>
            <PrimaryButton
              iconLeft={<PlusBoldIcon />}
              label="Add new flying component"
              onClick={drawerState.openModal}
            />
          </Spacings.Inline>
          <FlyingComponentList onSelectComponent={handleSelectComponent} />
        </Spacings.Stack>
      </Spacings.Stack>

      {drawerState.isModalOpen && (
        <FlyingComponentForm
          selectedComponent={selectedComponent}
          onSubmit={handleUpdateComponent}
          onCancel={handleCloseModal}
        />
      )}
    </>
  );
};

export default FlyingComponents;
