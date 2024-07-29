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
