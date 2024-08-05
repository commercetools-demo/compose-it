import { joinUrls } from '../../utils/url-utils';
import { ComponentConfig, PageConfig } from './general';

type FixUpRoutingConfig = {
  [componentType: string]: {
    props?: {
      [propName: string]: {
        type?: 'postfix' | 'prefix' | 'replace' | 'full';
      };
    };
  };
};

/// TODO: can store this in a config file

const fixUpRoutingConfig: FixUpRoutingConfig = {
  Link: {
    props: {
      to: {
        type: 'postfix',
      },
    },
  },
};

export const fixUpRoutingProps = (
  component: ComponentConfig | PageConfig,
  parentUrl?: string
): ComponentConfig | PageConfig => {
  if (component.type in fixUpRoutingConfig) {
    for (const propName in fixUpRoutingConfig[component.type].props) {
      component.props[propName] = parentUrl
        ? joinUrls(parentUrl, component.props[propName])
        : component.props[propName];
    }
  }
  return component;
};
