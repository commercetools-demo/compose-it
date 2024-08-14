import React, { useState } from 'react';
import { DeployedStatus } from '../../../../hooks/use-deployment/types/deployment';
import PrimaryButton from '@commercetools-uikit/primary-button';
import { CheckActiveIcon, RefreshIcon } from '@commercetools-uikit/icons';
import { useDeployment } from '../../../../hooks/use-deployment';
import { CustomAppDraft } from '../../../../hooks/use-deployment/types/app';
import { RotatingIcon } from '../../../app/app-toolbar';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import styled from 'styled-components';
import Spacings from '@commercetools-uikit/spacings';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
type Props = {
  deployedStatus: DeployedStatus;
  onUpdate: () => Promise<void>;
};

const GreenIcon = styled.div`
  fill: green;
`;

const DeployedStatusActions = ({ deployedStatus, onUpdate }: Props) => {
  const context = useApplicationContext((context) => context);
  const showSuccessNotification = useShowNotification();
  const {
    updateCustomApp,
    changeCustomAppStatus,
    installCustomApp,
    updateDeploymentStatus,
    uninstallCustomApp,
  } = useDeployment();
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
          organizationId: deployedStatus?.statusValue?.organizationId,
        },
      });
      await onUpdate();
      setIsLoading(false);
    }
  };

  const handlePrivateUse = async () => {
    if (deployedStatus?.app) {
      setIsLoading(true);
      await changeCustomAppStatus({
        variables: {
          status: 'PRIVATE_USAGE',
          applicationId: deployedStatus?.app?.id,
          organizationId: deployedStatus?.statusValue?.organizationId,
        },
      });
      await onUpdate();

      setIsLoading(false);
    }
  };

  const handleInstallation = async () => {
    setIsLoading(true);
    const result = await installCustomApp({
      variables: {
        projectKeys: [context.project?.key],
        applicationId: deployedStatus?.app?.id,
        organizationId: deployedStatus?.statusValue?.organizationId,
      },
    });
    console.log('result', result);
    updateDeploymentStatus(
      deployedStatus.id,
      result?.data?.installCustomApplication?.id as string
    );
    await onUpdate();
    showSuccessNotification({
      domain: DOMAINS.SIDE,
      kind: NOTIFICATION_KINDS_SIDE.success,
      text: 'Application installed successfully, reload the page to see changes',
    });
    setIsLoading(false);
  };

  const handleUninstallation = async () => {
    setIsLoading(true);
    const result = await uninstallCustomApp({
      variables: {
        installedApplicationId:
          deployedStatus?.statusValue?.customAppInstallationId,
        organizationId: deployedStatus?.statusValue?.organizationId,
      },
    }).catch((e) => console.log(e));
    console.log('result', result);
    updateDeploymentStatus(deployedStatus.id, '');
    await onUpdate();

    setIsLoading(false);
  };

  if (deployedStatus?.status === 'Deploying') {
    return (
      <PrimaryButton
        label="Deploying..."
        isDisabled
        size="10"
        onClick={() => {}}
        iconLeft={
          <RotatingIcon>
            <RefreshIcon />
          </RotatingIcon>
        }
      />
    );
  }

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

  if (deployedStatus?.app?.status === 'DRAFT') {
    return (
      <PrimaryButton
        label="Publish for private use"
        size="10"
        onClick={handlePrivateUse}
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

  if (!deployedStatus?.statusValue?.customAppInstallationId) {
    return (
      <PrimaryButton
        label="Install in this project"
        size="10"
        onClick={handleInstallation}
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

  return (
    <Spacings.Inline scale="xl" alignItems="center">
      <GreenIcon>
        <CheckActiveIcon />
      </GreenIcon>
      <PrimaryButton
        label="Uninstall"
        tone="critical"
        size="10"
        onClick={handleUninstallation}
        iconLeft={
          isLoading ? (
            <RotatingIcon>
              <RefreshIcon />
            </RotatingIcon>
          ) : null
        }
      />
    </Spacings.Inline>
  );
};

export default DeployedStatusActions;
