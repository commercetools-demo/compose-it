import React from 'react';
import { useDeploymentContext } from '../../../../providers/deployment';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import { useHistory } from 'react-router';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
type Props = {
  parentUrl: string;
};

const Deploy = ({ parentUrl }: Props) => {
  const showSuccessNotification = useShowNotification();

  const {
    selectedDeployment,
    selectedApp,
    selectedConnector,
    selectedOrganization,
    onStartDeployment,
  } = useDeploymentContext();

  const handleStartDeployment = async () => {
    onStartDeployment();
    showSuccessNotification({
      domain: DOMAINS.SIDE,
      kind: NOTIFICATION_KINDS_SIDE.info,
      text: 'Deployment started, go to deployment logs to see status',
    });
  };

  const { goBack } = useHistory();

  if (!selectedDeployment) {
    return null;
  }

  return (
    <Spacings.Stack scale="l">
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
          label="Go back and edit"
          onClick={() => {
            goBack();
          }}
        />
        <PrimaryButton
          label="Start deployment"
          onClick={handleStartDeployment}
        />
      </Spacings.Inline>
    </Spacings.Stack>
  );
};

export default Deploy;
