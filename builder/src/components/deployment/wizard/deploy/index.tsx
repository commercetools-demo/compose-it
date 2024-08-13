import React from 'react';
import { useDeploymentContext } from '../../../../providers/deployment';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { useHistory } from 'react-router';
type Props = {
  parentUrl: string;
};

const Deploy = ({ parentUrl }: Props) => {
  const {
    selectedDeployment,
    selectedApp,
    selectedConnector,
    selectedOrganization,
    
  } = useDeploymentContext();

  const {goBack} = useHistory();

  console.log('selectedDeployment', selectedDeployment);
  
  return (
    <Spacings.Stack scale='l'>
      <Text.Headline as="h2">Review and Start deployment</Text.Headline>
      <Spacings.Inline>
        <Text.Body isBold>Organization</Text.Body>
        <Text.Body>{selectedOrganization}</Text.Body>
      </Spacings.Inline>
      <Spacings.Inline>
        <Text.Body isBold>Custom app</Text.Body>
        <Text.Body>{selectedApp?.name}</Text.Body>
      </Spacings.Inline>
      <Spacings.Inline>
        <Text.Body isBold>Connector</Text.Body>
        <Text.Body>{selectedConnector?.name}</Text.Body>
      </Spacings.Inline>
      <Spacings.Inline>
        <Text.Body isBold>Deployment key</Text.Body>
        <Text.Body>{selectedDeployment?.key}</Text.Body>
      </Spacings.Inline>
    <Spacings.Inline>
      <SecondaryButton
      label='Go back and edit'
      onClick={() => {
        goBack();
      }}
      />
      <PrimaryButton
      label='Start deployment'
      onClick={() => {
        goBack();
      }}
      />
      </Spacings.Inline>
    </Spacings.Stack>
  );
};

export default Deploy;
