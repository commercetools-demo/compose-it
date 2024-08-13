import React, { useState } from 'react';
import { DeployedStatus } from '../../../../hooks/use-deployment/types/deployment';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { CheckActiveIcon, RefreshIcon } from '@commercetools-uikit/icons';
import { useDeployment } from '../../../../hooks/use-deployment';
import { CustomAppDraft } from '../../../../hooks/use-deployment/types/app';
import { RotatingIcon } from '../../../app/app-toolbar';
type Props = {
  deployedStatus: DeployedStatus;
};

const DeployedStatusActions = ({ deployedStatus }: Props) => {
  const { updateCustomApp } = useDeployment();
  const [isLoading, setIsLoading] = useState(false);

  const handleFixURL = async () => {
    if (deployedStatus?.app) {
      setIsLoading(true);
      await updateCustomApp({
        variables: {
          data: {
            entryPointUriPath: deployedStatus?.app?.entryPointUriPath,
            url: deployedStatus?.applications?.[0]?.url,
            name: deployedStatus?.app?.name,
            description: deployedStatus?.app?.description,
            permissions: deployedStatus?.app?.permissions?.map(
              (permission) => ({
                name: permission?.name,
                oAuthScopes: permission?.oAuthScopes,
              })
            ),
            mainMenuLink: {
              defaultLabel: deployedStatus?.app?.mainMenuLink?.defaultLabel,
              permissions: deployedStatus?.app?.mainMenuLink?.permissions,
              labelAllLocales: [],
            },
            submenuLinks: [],
            icon: deployedStatus?.app?.icon,
          } as CustomAppDraft,
          applicationId: deployedStatus?.app?.id,
          organizationId: deployedStatus?.organizationId,
        },
      });

      setIsLoading(false);
    }
  };

  if (deployedStatus?.app?.url !== deployedStatus?.applications?.[0]?.url) {
    return (
      <PrimaryButton
        label="Fix url"
        size="10"
        onClick={handleFixURL}
        iconLeft={
          isLoading ? (
            <RotatingIcon>
              <RefreshIcon />
            </RotatingIcon>
          ) : null
        }
      />
    );
  }

  return <CheckActiveIcon />;
};

export default DeployedStatusActions;
