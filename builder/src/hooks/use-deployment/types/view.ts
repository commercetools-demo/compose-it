import { CustomApplicationPermissionDataInput } from './app';

export type MyCustomView = {
  id: string;
  description: string;
  organizationId: string;
  url: string;
  permissions: {
    name: string;
    oAuthScopes: string[];
    id: string;
  }[];
  status: string;
  defaultLabel: string;
  type: string;
  locators: string[];
};

export type CustomViewDraft = {
  defaultLabel?: string;
  labelAllLocales?: { locale: string; value: string }[];
  description?: string;
  type: 'CustomPanel';
  locators: string[];
  url: string;
  typeSettings: { size: 'SMALL' | 'LARGE' }
  permissions: CustomApplicationPermissionDataInput[];
};
