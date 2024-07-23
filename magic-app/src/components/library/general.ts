// Types for our component configurations

type ComponentLayout =  {
  gridColumn: number;
  gridRow: number;
  gridWidth: number;
  gridHeight: number;
};
type AtomComponentConfig = {
  type: string;
  id: string;
  props: Record<string, any>;
  layout: ComponentLayout;
};

type MoleculeComponentConfig = {
  type: string;
  id: string;
  props: Record<string, any>;
  layout: ComponentLayout;
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

