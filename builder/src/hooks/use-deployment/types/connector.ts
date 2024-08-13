import { PagedQueryResponse } from "../../../types/general";

export type ConnectorDraft = {
  id?: string;
  key: string;
  name: string;
  description?: string;
  version?: number;
  creator?: {
    name: string;
    email: string;
    company: string;
  };
  repository: {
    url: string;
    tag: string;
  };
};

export type ConnectorResponse  = PagedQueryResponse<ConnectorDraft>
