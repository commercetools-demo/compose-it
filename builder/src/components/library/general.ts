// Types for our component configurations

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
    propsBindings: Record<
      string,
      {
        type: 'datasource' | 'property';
        value: string;
      }
    >;
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
  components: ComponentConfig[];
};

export type AppConfig = {
  pages: PageConfig[];
};
