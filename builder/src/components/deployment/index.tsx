import React from 'react';
import Spacings from '@commercetools-uikit/spacings';
import FlatButton from '@commercetools-uikit/flat-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Text from '@commercetools-uikit/text';
import {
  ExportIcon,
  RefreshIcon,
  RevertIcon,
} from '@commercetools-uikit/icons';
import {
  InfoModalPage,
  useModalState,
} from '@commercetools-frontend/application-components';
import DeploymentWrapper from './deployment-wrapper';

const Deployment = () => {
  const pageModalState = useModalState();

  return (
    <div>
      <FlatButton
        icon={<ExportIcon />}
        label="Export"
        onClick={pageModalState.openModal}
      />
      {pageModalState.isModalOpen && <DeploymentWrapper onClose={pageModalState.closeModal}/>}
    </div>
  );
};

export default Deployment;
