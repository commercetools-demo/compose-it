import React, { useState } from 'react';
import { DeployedStatus } from '../../../../hooks/use-deployment/types/deployment';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { CheckActiveIcon } from '@commercetools-uikit/icons';
type Props = {
  deployedStatus: DeployedStatus;
};

const DeployedStatusActions = ({ deployedStatus }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  if (deployedStatus?.app?.url !== deployedStatus?.applications?.[0]?.url) {
    return <PrimaryButton label="Fix url" size="10" onClick={() => {}} />;
  }

  return <CheckActiveIcon />;
};

export default DeployedStatusActions;
