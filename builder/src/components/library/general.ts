// Types for our component configurations

import { DatasourceRef } from '../../types/datasource';

export type PropsBindingState = {
  type: 'datasource' | 'property';
  dataType?: string;
  value: string | number | boolean | null | object;
};

type ComponentLayout = {
  gridColumn: number;
  gridRow: number;
  gridWidth: number;
  gridHeight: number;
};
type AtomComponentConfig = {
  type: string;
  id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  layout: ComponentLayout;
  config: {
    propsBindings: Record<string, PropsBindingState>;
  };
};

type MoleculeComponentConfig = AtomComponentConfig & {
  props: {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    [key: string]: any;
    children: (AtomComponentConfig | MoleculeComponentConfig)[];
  };
};

export type ComponentConfig = AtomComponentConfig | MoleculeComponentConfig;

// Position configuration for grid layout
export type GridPosition = {
  column: number;
  row: number;
  width: number;
  height: number;
};

export type PageConfig = {
  id: string;
  route: string;
  layout: {
    type: 'grid';
    columns: number;
  };
  type: 'landing' | 'FormDetailPage' | 'FormModalPage';
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  props: Record<string, any>;
  config: {
    propsBindings: Record<string, PropsBindingState>;
  };
  name?: string;
  components?: ComponentConfig[];
  datasources?: DatasourceRef[];
};

export type AppConfig = {
  pages: PageConfig[];
};

export const PAGE_TYPES = [
  {
    label: 'Landing Page',
    value: 'landing',
  },
  {
    label: 'Form Detail Page',
    value: 'FormDetailPage',
  },
  {
    label: 'Form Modal Page',
    value: 'FormModalPage',
  },
];
