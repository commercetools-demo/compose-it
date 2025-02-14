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
export type Action = {
  id: string;
  name: string;
  mutation: string;
  variables: string;
  config: {
    variableBindings: Record<string, PropsBindingState>;
  };
};
export type FlyingComponent = {
  props: Record<string, unknown>;
  propsBindings: Record<string, PropsBindingState>;
  code: string;
  serializedCode: string;
};
export interface FlyingComponentsResponse {
  id: string;
  createdAt: string;
  key: string;
  value?: FlyingComponent;
}
export type DatasourceDraft = {
  id: string;
  name: string;
  query: string;
  variables: string;
};

export type ActionDraft = {
  id: string;
  name: string;
  mutation: string;
  variables: string;
};

export interface DatasourceResponse {
  id: string;
  createdAt: string;
  key: string;
  value?: Datasource;
}

export interface ActionResponse {
  id: string;
  createdAt: string;
  key: string;
  value?: Action;
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
