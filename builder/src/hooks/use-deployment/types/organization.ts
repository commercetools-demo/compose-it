export type Organization = {
  id: string;
  name: string;
  teams: Array<{
    id: string;
    name: string;
    __typename?: string;
  }>;
};

export type OrganizationResponse = {
  results: Array<Organization>;
};
