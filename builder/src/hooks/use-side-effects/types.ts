import { ComponentConfig } from '../../components/library/general';

export type SideEffect = {
  condition: (source: ComponentConfig, target?: ComponentConfig) => boolean;
  action: (
    source: ComponentConfig,
    target?: ComponentConfig
  ) => Partial<ComponentConfig>;
};
