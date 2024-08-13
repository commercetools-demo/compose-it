import React from 'react';
import Spacings from '@commercetools-uikit/spacings';
import FlatButton from '@commercetools-uikit/flat-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Text from '@commercetools-uikit/text';
import { PlusThinIcon } from '@commercetools-uikit/icons';
import { useModalState } from '@commercetools-frontend/application-components';
import NewDeploymentWizard from './wizard/new-deployment-wizard';
import { useAppContext } from '../../providers/app';

const NewDeployment = () => {
  const { appGeneralInfo } = useAppContext();
  const pageModalState = useModalState();

  return (
    <div>
      <PrimaryButton
        iconLeft={<PlusThinIcon />}
        label={`Deploy "${appGeneralInfo?.name}" app`}
        onClick={pageModalState.openModal}
      />
      {pageModalState.isModalOpen && (
        <NewDeploymentWizard onClose={pageModalState.closeModal} />
      )}
    </div>
  );
};

export default NewDeployment;
