import React, { useState } from 'react';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';
import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import RouteList from './route-list';
import { PageConfig } from '../library/general';
import NewRouteForm from './new-route';
import { useAppContext } from '../../providers/app';

const RoutingListButton: React.FC = () => {
  const { addPage, updatePage, savePage } = useAppContext();
  const [selectedPage, setSelectedPage] = useState<PageConfig>();
  const listDrawerState = useModalState();
  const editDrawerState = useModalState();

  const handleAddPage = (pageConfig: PageConfig) => {
    if (pageConfig) {
      addPage(pageConfig);
    }
  };

  const updateCurrentPage = (pageId: string, pageConfig: PageConfig) => {
    if (pageId && pageConfig) {
      updatePage({ ...pageConfig, id: pageId });
    }
  };

  const handlePageAction = async (pageConfig: PageConfig): Promise<void> => {
    if (selectedPage) {
      updateCurrentPage(selectedPage.id, pageConfig);
    } else {
      handleAddPage(pageConfig);
    }
    // await savePage();
    setSelectedPage(undefined);
    editDrawerState.closeModal();
  };

  const handleOpenEdit = (page?: PageConfig) => {
    if (page) {
      setSelectedPage(page);
      editDrawerState.openModal();
    } else {
      setSelectedPage(undefined);
      editDrawerState.openModal();
    }
  };

  return (
    <Spacings.Inline>
      <PrimaryButton
        label="Routing"
        onClick={() => listDrawerState.openModal()}
      ></PrimaryButton>
      <Drawer
        title="Manage routing"
        isOpen={listDrawerState.isModalOpen}
        onClose={listDrawerState.closeModal}
        hideControls
        size={20}
      >
        <RouteList
          onClose={listDrawerState.closeModal}
          onEditPage={handleOpenEdit}
          onSave={savePage}
        />
      </Drawer>
      <Drawer
        title={!!selectedPage ? `Edit Page ${selectedPage.route}` : 'Add Page'}
        isOpen={editDrawerState.isModalOpen}
        onClose={editDrawerState.closeModal}
        size={10}
        hideControls
      >
        <NewRouteForm page={selectedPage} onSubmit={handlePageAction} />
      </Drawer>
    </Spacings.Inline>
  );
};

export default RoutingListButton;
