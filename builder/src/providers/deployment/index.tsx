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
  Deployment,
  DeploymentDraft,
} from '../../hooks/use-deployment/types/deployment';

interface DeploymentContextType {
  user?: User;
  apps?: MyCustomApplication[];
  organizations?: Organization[];
  connectors?: ConnectorDraft[];
  deployments?: Deployment[];
  selectedOrganization?: string;
  selectedApp?: MyCustomApplication;
  selectedConnector?: ConnectorDraft;
  selectedDeployment?: DeploymentDraft;
  onSelectConnector: (connector?: ConnectorDraft) => void;
  onSelectOrganization: (organizationId?: string) => void;
  onSelectDeployment: (deployment?: Deployment) => void;
  onSelectDeploymentDraft: (deployment?: DeploymentDraft) => void;
  onSelectApp: (app?: MyCustomApplication) => void;
  onCreateCustomApp: (
    organizationId: string,
    customAppDraft: CustomAppDraft
  ) => Promise<MyCustomApplication | undefined>;
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
  const {
    user,
    myApps,
    myOrganizations,
    createCustomApp,
    createConnectorDraft,
    updateApps,
    getConnectors,
    getDeployments,
    createDeployment,
    createDeploymentStatus,
  } = useDeployment();

  const [selectedOrganization, onSelectOrganization] = useState<string>();
  const [selectedApp, onSelectApp] = useState<MyCustomApplication>();
  const [selectedConnector, onSelectConnector] = useState<ConnectorDraft>();
  const [selectedDeployment, setSelectedDeployment] =
    useState<DeploymentDraft>();
  const [connectors, setConnectors] = useState<ConnectorDraft[]>([]);
  const [deployments, setDeployments] = useState<Deployment[]>([]);

  const onSelectDeploymentDraft = (deploymentDraft?: DeploymentDraft) => {
    setDeployments([...(deployments || []), deploymentDraft]);
  };

  const onSelectDeployment = (deployment?: Deployment | DeploymentDraft) => {
    if (!deployment) {
      return;
    }
    if ('deployedRegion' in deployment) {
      setSelectedDeployment({
        region: deployment.deployedRegion,
        configurations: deployment.applications.map((app) => ({
          applicationName: app.applicationName,
          standardConfiguration: app.standardConfiguration,
        })),
        connector: {
          key: deployment.connector.key,
          id: deployment.connector.id,
          version: deployment.connector.version,
          staged: false,
        },
        key: deployment.key,
      });
    } else {
      setSelectedDeployment(deployment);
    }
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
  const onCreateConnectApp = async (
    organizationId: string,
    connectAppDraft: ConnectorDraft
  ): Promise<ConnectorDraft | undefined> => {
    const result = await createConnectorDraft(organizationId, connectAppDraft);
    await updateConnectors();
    return result;
  };

  const onStartDeployment = async (): Promise<Deployment | undefined> => {
    if (!selectedOrganization || !selectedDeployment) {
      return;
    }
    const result = await createDeployment(
      selectedOrganization,
      selectedDeployment
    );
    await createDeploymentStatus({
      deploymentId: result.id,
      organizationId: selectedOrganization,
      customAppId: selectedApp?.id || '',
      connectorId: selectedConnector?.id || '',
    });
    return result;
  };

  const apps = useMemo(() => {
    return myApps?.filter((app) => app.organizationId === selectedOrganization);
  }, [myApps, selectedOrganization]);

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
        organizations: myOrganizations,
        selectedOrganization,
        selectedApp,
        selectedConnector,
        connectors,
        deployments,
        selectedDeployment,
        onSelectOrganization,
        onSelectApp,
        onCreateCustomApp,
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
