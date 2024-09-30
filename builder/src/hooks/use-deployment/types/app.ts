export type MyCustomApplication = {
  id: string;
  name: string;
  description: string;
  organizationId: string;
  entryPointUriPath: string;
  url?: string;
  icon?: string;
  permissions?: CustomApplicationPermissionDataInput[];
  mainMenuLink?: CustomApplicationMenuLinkDraftDataInput;
  submenuLinks?: CustomApplicationSubmenuLinkDraftDataInput[];
  status: string;
  __typename?: string;
};

export type MyCustomApplications = {
  myCustomApplications: MyCustomApplication[];
};
export type CustomApplicationPermissionDataInput = {
  name: string;
  oAuthScopes: string[];
};

type CustomApplicationMenuLinkDraftDataInput = {
  defaultLabel: string;
  labelAllLocales?: { locale: string; value: string }[];
  permissions: string[];
};

type CustomApplicationSubmenuLinkDraftDataInput =
  CustomApplicationMenuLinkDraftDataInput & {
    uriPath: string;
  };
export type CustomAppDraft = {
  name: string;
  description?: string;
  url: string;
  entryPointUriPath: string;
  icon: string;
  permissions: CustomApplicationPermissionDataInput[];
  mainMenuLink: CustomApplicationMenuLinkDraftDataInput;
  submenuLinks: CustomApplicationSubmenuLinkDraftDataInput[];
};
