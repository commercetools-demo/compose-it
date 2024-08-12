import React from 'react';
import Spacings from '@commercetools-uikit/spacings';
import FlatButton from '@commercetools-uikit/flat-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Text from '@commercetools-uikit/text';
import {
  GroupAddIcon,
  RefreshIcon,
  RevertIcon,
} from '@commercetools-uikit/icons';
import {
  InfoModalPage,
  useModalState,
} from '@commercetools-frontend/application-components';
import DeploymentWrapper from './deployment-wrapper';
import NewDeploymentWizard from './new-deployment-wizard';

type Props = {}

const NewDeployment = (props: Props) => {
  const pageModalState = useModalState();

  return (
    <div>
    <PrimaryButton
      iconLeft={<GroupAddIcon />}
      label="New Deployment"
      onClick={pageModalState.openModal}
    />
    {pageModalState.isModalOpen && <NewDeploymentWizard onClose={pageModalState.closeModal}/>}
  </div>
  )
}

export default NewDeployment