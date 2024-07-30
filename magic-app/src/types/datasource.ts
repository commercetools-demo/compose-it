import { PropsBindingState } from '../components/library/general';

export type Datasource = {
  id: string;
  name: string;
  query: string;
  variables: string;
  config: {
    variableBindings: Record<string, PropsBindingState>;
  };
};

export type DatasourceDraft = {
  id: string;
  name: string;
  query: string;
  variables: string;
};

export interface DatasourceResponse {
  id: string;
  createdAt: string;
  key: string;
  value?: Datasource;
}

export type DatasourceRef = {
  key: string;
  typeId: 'datasource';
};

export type DatasourceSample = {
  key: string;
  typeId: 'datasource';
  sample: unknown;
};
