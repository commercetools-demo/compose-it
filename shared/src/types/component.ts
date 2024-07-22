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