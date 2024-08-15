import React, { useState } from 'react';
import Spacings from '@commercetools-uikit/spacings';
import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import RouteList from './route-list';
import { PageConfig } from '../library/general';
import NewRouteForm from './new-route';
import { useAppContext } from '../../providers/app';
import { useBuilderStateContext } from '../../providers/process';
import IconButton from '@commercetools-uikit/icon-button';
import { NestedViewIcon } from '@commercetools-uikit/icons';

const RoutingListButton: React.FC = () => {
  const {
    addPage,
    updatePage,
    savePage,
    appConfig: { pages },
  } = useAppContext();
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

  const handleCloseEdit = () => {
    setSelectedPage(undefined);
    editDrawerState.closeModal();
  };

  const handleCloseList = () => {
    setSelectedPage(undefined);
    listDrawerState.closeModal();
  };

  const handleOpenEdit = (page?: PageConfig) => {
    console.log('page', page);

    if (page) {
      setSelectedPage(page);
    }
    editDrawerState.openModal();
  };

  return (
    <Spacings.Inline>
      <IconButton
        label="Routing"
        onClick={() => listDrawerState.openModal()}
        icon={<NestedViewIcon />}
      ></IconButton>
      <Drawer
        title="Manage routing"
        isOpen={listDrawerState.isModalOpen}
        onClose={handleCloseList}
        hideControls
        size={20}
      >
        <RouteList
          onClose={handleCloseList}
          onEditPage={handleOpenEdit}
          onSave={savePage}
        />
      </Drawer>

      {editDrawerState.isModalOpen && (
        <NewRouteForm
          hasMorePages={pages?.length > 0}
          page={selectedPage}
          onSubmit={handlePageAction}
          isOpen={editDrawerState.isModalOpen}
          onClose={handleCloseEdit}
        />
      )}
    </Spacings.Inline>
  );
};

export default RoutingListButton;
