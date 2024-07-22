// Types for our component configurations
export type AtomComponentConfig = {
  type: string;
  id: string;
  props: Record<string, any>;
};

export type MoleculeComponentConfig = {
  type: string;
  id: string;
  props: Record<string, any>;
  children: (AtomComponentConfig | MoleculeComponentConfig)[];
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

