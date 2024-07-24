import { AppConfig, PageConfig } from '../components/library/general';

export interface AppDraft {
  name: string;
  description: string;
  key: string;
  appConfig: AppConfig;
}

export interface App {
  id: string;
  createdAt: string;
  key: string;
  value?: AppDraft;
}
