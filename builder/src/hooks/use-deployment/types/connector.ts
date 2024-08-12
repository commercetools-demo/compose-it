export type ConnectorDraft = {
  key: string;
  name: string;
  description: string;
  creator: {
    name: string;
    email: string;
    company: string;
  };
  repository: {
    url: string;
    tag: string;
  };
};
