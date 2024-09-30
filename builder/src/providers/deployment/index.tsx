import React, {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from 'react';
import { User } from '../../hooks/use-deployment/types/user';
import {
  CustomAppDraft,
  MyCustomApplication,
} from '../../hooks/use-deployment/types/app';
import { Organization } from '../../hooks/use-deployment/types/organization';
import { useDeployment } from '../../hooks/use-deployment';
import { convertToRouteNames } from './utils';
import {
  ConnectorDraft,
  ConnectorResponse,
} from '../../hooks/use-deployment/types/connector';
import {
  ApplicationTypes,
  Deployment,
  DeploymentDraft,
} from '../../hooks/use-deployment/types/deployment';
import { useShowNotification } from '@commercetools-frontend/actions-global';
import {
  DOMAINS,
  NOTIFICATION_KINDS_SIDE,
} from '@commercetools-frontend/constants';
import {
  CustomViewDraft,
  MyCustomView,
} from '../../hooks/use-deployment/types/view';

interface DeploymentContextType {
  user?: User;
  apps?: MyCustomApplication[];
  views?: MyCustomView[];
  organizations?: Organization[];
  connectors?: ConnectorDraft[];
  deployments?: Deployment[];
  selectedOrganization?: string;
  selectedApplicationType: ApplicationTypes;
  selectedApp?: MyCustomApplication;
  selectedView?: MyCustomView;
  selectedConnector?: ConnectorDraft;
  selectedDeployment?: Deployment;
  selectedDeploymentDraft?: DeploymentDraft;
  onSelectConnector: (connector?: ConnectorDraft) => void;
  onSelectApplicationType: (applicationType: ApplicationTypes) => void;
  onSelectOrganization: (organizationId?: string) => void;
  onSelectDeployment: (deployment?: Deployment) => void;
  onSelectDeploymentDraft: (deployment?: DeploymentDraft) => void;
  onSelectApp: (app?: MyCustomApplication) => void;
  onSelectView: (view?: MyCustomView) => void;
  onCreateCustomApp: (
    organizationId: string,
    customAppDraft: CustomAppDraft
  ) => Promise<MyCustomApplication | undefined>;
  onCreateCustomView: (
    organizationId: string,
    customViewDraft: CustomViewDraft
  ) => Promise<MyCustomView | undefined>;
  onCreateConnectApp: (
    organizationId: string,
    connectAppDraft: ConnectorDraft
  ) => Promise<ConnectorDraft | undefined>;
  onStartDeployment: () => Promise<Deployment | undefined>;
}

const DeploymentContext = createContext<DeploymentContextType | undefined>(
  undefined
);

export const DeploymentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const showSuccessNotification = useShowNotification();

  const {
    user,
    myApps,
    myViews,
    myOrganizations,
    createCustomApp,
    createCustomView,
    createConnectorDraft,
    updateApps,
    updateViews,
    getConnectors,
    getDeployments,
    createDeployment,
    createDeploymentStatus,
    updateDeployment,
  } = useDeployment();

  const [selectedOrganization, onSelectOrganization] = useState<string>();
  const [selectedApplicationType, onSelectApplicationType] =
    useState<ApplicationTypes>('custom-app');
  const [selectedApp, onSelectApp] = useState<MyCustomApplication>();
  const [selectedView, onSelectView] = useState<MyCustomView>();
  const [selectedConnector, onSelectConnector] = useState<ConnectorDraft>();
  const [selectedDeployment, setSelectedDeployment] = useState<Deployment>();
  const [selectedDeploymentDraft, setSelectedDeploymentDraft] =
    useState<DeploymentDraft>();
  const [connectors, setConnectors] = useState<ConnectorDraft[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);

  const onSelectDeploymentDraft = (deploymentDraft?: DeploymentDraft) => {
    setDeployments((prev) => {
      if (!deploymentDraft) {
        return prev;
      }
      const found = prev.find((d) => d.key === deploymentDraft.key);
      if (found) {
        return prev;
      }
      return [...prev, deploymentDraft];
    });
    setSelectedDeployment(undefined);
    setSelectedDeploymentDraft(deploymentDraft);
  };

  const onSelectDeployment = (deployment?: Deployment) => {
    if (!deployment) {
      setSelectedDeployment(undefined);
      setSelectedDeploymentDraft(undefined);
      return;
    }
    setSelectedDeployment(deployment);
    setSelectedDeploymentDraft(undefined);
  };

  const updateConnectors = async () => {
    if (!selectedOrganization) {
      setConnectors([]);
    } else {
      getConnectors(selectedOrganization).then((result) => {
        setConnectors(result);
        if (result.length === 1) {
          onSelectConnector(result[0]);
        }
      });
    }
  };
  const updateDeployments = async () => {
    if (!selectedOrganization || !selectedConnector) {
      setDeployments([]);
    } else {
      getDeployments(selectedOrganization, selectedConnector?.id).then(
        (result) => {
          setDeployments(result);
        }
      );
    }
  };
  const onCreateCustomApp = async (
    organizationId: string,
    customAppDraft: CustomAppDraft
  ): Promise<MyCustomApplication | undefined> => {
    const { manageCamelCase, managePascalCase, viewCamelCase, viewPascalCase } =
      convertToRouteNames(customAppDraft.entryPointUriPath);

    const result = await createCustomApp(organizationId, {
      ...customAppDraft,
      permissions: customAppDraft.permissions.map((permission, index) => ({
        ...permission,
        name: index === 0 ? viewCamelCase : manageCamelCase,
      })),
      mainMenuLink: {
        ...customAppDraft.mainMenuLink,
        permissions: [viewPascalCase, managePascalCase],
      },
    });
    await updateApps();
    return result;
  };
  const onCreateCustomView = async (
    organizationId: string,
    customViewDraft: CustomViewDraft
  ): Promise<MyCustomView | undefined> => {
    const result = await createCustomView(organizationId, {
      ...customViewDraft,
      labelAllLocales: [
        {
          locale: 'en',
          value: customViewDraft.defaultLabel!,
        },
      ],
      permissions: customViewDraft.permissions.map((permission, index) => ({
        ...permission,
        name: index === 0 ? 'view' : 'manage',
      })),
    });
    await updateViews();
    return result;
  };
  const onCreateConnectApp = async (
    organizationId: string,
    connectAppDraft: ConnectorDraft
  ): Promise<ConnectorDraft | undefined> => {
    const result = await createConnectorDraft(organizationId, connectAppDraft);
    await updateConnectors();
    return result;
  };

  const onStartDeployment = async (): Promise<Deployment | undefined> => {
    if (!selectedOrganization) {
      return;
    }
    if (!selectedDeployment && !selectedDeploymentDraft) {
      showSuccessNotification({
        domain: DOMAINS.SIDE,
        kind: NOTIFICATION_KINDS_SIDE.error,
        text: 'No deployment selected',
      });
    }

    let result = {} as Deployment;

    if (selectedDeployment) {
      // update
      result = await updateDeployment(selectedOrganization, selectedDeployment);
    } else if (selectedDeploymentDraft) {
      // create
      result = await createDeployment(
        selectedOrganization,
        selectedDeploymentDraft
      );
    }

    if (!result.id) {
      showSuccessNotification({
        domain: DOMAINS.SIDE,
        kind: NOTIFICATION_KINDS_SIDE.error,
        text: 'Error starting deployment',
      });
      return;
    }

    if (selectedApplicationType === 'custom-app') {
      await createDeploymentStatus({
        deploymentId: result.id,
        organizationId: selectedOrganization,
        customAppId: selectedApp?.id || '',
        connectorId: selectedConnector?.id || '',
      });
    } else if (selectedApplicationType === 'custom-view') {
      await createDeploymentStatus({
        deploymentId: result.id,
        organizationId: selectedOrganization,
        customViewId: selectedView?.id || '',
        connectorId: selectedConnector?.id || '',
      });
    }

    return result;
  };

  const apps = useMemo(() => {
    return myApps?.filter((app) => app.organizationId === selectedOrganization);
  }, [myApps, selectedOrganization]);

  const views = useMemo(() => {
    return myViews?.filter(
      (view) => view.organizationId === selectedOrganization
    );
  }, [myViews, selectedOrganization]);

  useEffect(() => {
    updateConnectors();
  }, [selectedOrganization]);

  useEffect(() => {
    updateDeployments();
  }, [selectedOrganization, selectedConnector]);

  return (
    <DeploymentContext.Provider
      value={{
        user,
        apps,
        views,
        organizations: myOrganizations,
        selectedOrganization,
        selectedApplicationType,
        selectedApp,
        selectedView,
        selectedConnector,
        connectors,
        deployments,
        selectedDeployment,
        selectedDeploymentDraft,
        onSelectOrganization,
        onSelectApplicationType,
        onSelectApp,
        onSelectView,
        onCreateCustomApp,
        onCreateCustomView,
        onSelectConnector,
        onCreateConnectApp,
        onSelectDeploymentDraft,
        onSelectDeployment,
        onStartDeployment,
      }}
    >
      {children}
    </DeploymentContext.Provider>
  );
};

export const useDeploymentContext = () => {
  const context = useContext(DeploymentContext);
  if (context === undefined) {
    throw new Error('useDeploymentContext must be used within App');
  }
  return context;
};
