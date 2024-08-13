import React, { createContext, useContext, useMemo, useState } from 'react';
import { User } from '../../hooks/use-deployment/types/user';
import {
  CustomAppDraft,
  MyCustomApplication,
} from '../../hooks/use-deployment/types/app';
import { Organization } from '../../hooks/use-deployment/types/organization';
import { useDeployment } from '../../hooks/use-deployment';
import { convertToRouteNames } from './utils';

interface DeploymentContextType {
  user?: User;
  apps?: MyCustomApplication[];
  organizations?: Organization[];
  selectedOrganization?: string;
  selectedApp?: string;
  onSelectOrganization: (organizationId?: string) => void;
  onSelectApp: (appId?: string) => void;
  onCreateCustomApp: (
    organizationId: string,
    customAppDraft: CustomAppDraft
  ) => Promise<MyCustomApplication | undefined>;
}

const DeploymentContext = createContext<DeploymentContextType | undefined>(
  undefined
);

export const DeploymentProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
  const { user, myApps, myOrganizations, createCustomApp, updateApps } =
    useDeployment();

  const [selectedOrganization, onSelectOrganization] = useState<string>();
  const [selectedApp, onSelectApp] = useState<string>();

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

  const apps = useMemo(() => {
    return myApps?.filter((app) => app.organizationId === selectedOrganization);
  }, [myApps, selectedOrganization]);

  return (
    <DeploymentContext.Provider
      value={{
        user,
        apps,
        organizations: myOrganizations,
        selectedOrganization,
        selectedApp,
        onSelectOrganization,
        onSelectApp,
        onCreateCustomApp,
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
