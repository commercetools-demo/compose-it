import { PagedQueryResponse } from '../../../types/general';
import { MyCustomApplication } from './app';
import { MyCustomView } from './view';

export type Connector = {
  id?: string;
  key: string;
  name: string;
  description: string;
  version: number;
  creator: {
    name: string;
    title: string;
    email: string;
    company: string;
  };
  repository: {
    url: string;
    tag: string;
  };
  configurations: {
    applicationName: string;
    applicationType: string;
    securedConfiguration: {
      key: string;
      description: string;
      required: boolean;
    }[];
    standardConfiguration: {
      key: string;
      description: string;
      required: boolean;
      default: string | null;
    }[];
  }[];
  globalConfiguration: null;
  supportedRegions: string[];
  integrationTypes: string[];
  certified: boolean;
  documentationUrl: null;
};

export type ApplicationTypes = 'custom-app' | 'custom-view';

export type Deployment = {
  id: string;
  key: string;
  applicationType: ApplicationTypes;
  version: number;
  projectId: string;
  connector: Connector;
  deployedRegion: string;
  applications: Application[];
  globalConfiguration: null;
  details: {
    build: {
      id: string;
      report: {
        entries: Array<{
          title: string;
          type: string;
          application: string;
          message: null;
          createdAt: string;
        }>;
      };
    };
  };
  preview: boolean;
  status: string;
  createdAt: string;
};

export interface DeployedStatus extends Deployment {
  app?: MyCustomApplication;
  view?: MyCustomView;
  statusValue?: DeploymentStatusValue;
}

export type Configuration = {
  key: string;
  value: string;
};

export type Application = {
  applicationName: string;
  standardConfiguration: Configuration[];
  securedConfiguration: Configuration[];
  url?: string;
};

export type DeploymentDraft = {
  key: string;
  connector: {
    key: string;
    version: number;
    staged: boolean;
    id?: string;
  };
  region: string;
  configurations: Array<{
    applicationName: string;
    standardConfiguration: Configuration[];
  }>;
};

export type DeploymentResponse = PagedQueryResponse<Deployment>;

export type DeploymentStatusValue = {
  deploymentId: string;
  organizationId: string;
  customAppId?: string;
  customViewId?: string;
  connectorId: string;
  customAppInstallationId?: string;
};

export type DeploymentStatus = {
  id: string;
  createdAt: string;
  key: string;
  value?: DeploymentStatusValue[];
};
