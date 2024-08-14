// Types for our component configurations

import { ActionRef, DatasourceRef } from '../../types/datasource';

export type PropsBindingState = {
  type: 'datasource' | 'property' | 'action';
  dataType?: string;
  value: string | number | boolean | null | object;
  hint?: string;
  sortOrder?: number;
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
  datasourceRefs?: DatasourceRef[];
  actionRefs?: ActionRef[];
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

export const ENTITY_ACTIONT_TYPES = [
  { label: 'Save AttributeGroup', value: 'createSyncAttributeGroups' },
  { label: 'Save CartDiscount', value: 'createSyncCartDiscounts' },
  { label: 'Save Categorie', value: 'createSyncCategories' },
  { label: 'Save Channel', value: 'createSyncChannels' },
  { label: 'Save CustomerGrou', value: 'createSyncCustomerGroup' },
  { label: 'Save Customer', value: 'createSyncCustomers' },
  { label: 'Save DiscountCode', value: 'createSyncDiscountCodes' },
  { label: 'Save Inventorie', value: 'createSyncInventories' },
  { label: 'Save Order', value: 'createSyncOrders' },
  { label: 'Save ProductDiscount', value: 'createSyncProductDiscounts' },
  { label: 'Save ProductSelection', value: 'createSyncProductSelections' },
  { label: 'Save ProductType', value: 'createSyncProductTypes' },
  { label: 'Save Product', value: 'createSyncProducts' },
  { label: 'Save Project', value: 'createSyncProjects' },
  { label: 'Save ShippingMethod', value: 'createSyncShippingMethods' },
  { label: 'Save StandalonePrice', value: 'createSyncStandalonePrices' },
  { label: 'Save State', value: 'createSyncStates' },
  { label: 'Save Store', value: 'createSyncStores' },
  { label: 'Save TaxCategorie', value: 'createSyncTaxCategories' },
  { label: 'Save Type', value: 'createSyncTypes' },
  { label: 'Save Zone', value: 'createSyncZones' },
];
