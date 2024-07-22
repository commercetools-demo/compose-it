// Types for our component configurations
type AtomComponentConfig = {
  type: string;
  id: string;
  props: Record<string, any>;
};

type MoleculeComponentConfig = {
  type: string;
  id: string;
  props: Record<string, any>;
  children: (AtomComponentConfig | MoleculeComponentConfig)[];
};

type ComponentConfig = AtomComponentConfig | MoleculeComponentConfig;


// Position configuration for grid layout
type GridPosition = {
  column: number;
  row: number;
  width: number;
  height: number;
};

type PageConfig = {
  id: string;
  route: string;
  layout: {
    type: 'grid';
    columns: number;
  };
  components: ComponentConfig[];
};

type AppConfig = {
  pages: PageConfig[];
};

