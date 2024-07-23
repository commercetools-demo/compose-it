import { ComponentConfig } from '../../library/general';

export const useComponentConfig = () => {
  const removeComponentById = (
    components: ComponentConfig[],
    id: string
  ): ComponentConfig[] => {
    return components.filter((component) => {
      if (component.id === id) return false;
      if (component.props.children) {
        component.props.children = removeComponentById(
          component.props.children,
          id
        );
      }
      return true;
    });
  };

  const addComponentToTarget = (
    components: ComponentConfig[],
    targetId: string,
    newComponent: ComponentConfig
  ): ComponentConfig[] => {
    return components.map((component) => {
      if (component.id === targetId) {
        return {
          ...component,
          props: {
            ...component.props,
            children: [...(component.props.children || []), newComponent],
          },
        };
      }
      if (component.props.children) {
        return {
          ...component,
          props: {
            ...component.props,
            children: addComponentToTarget(
              component.props.children,
              targetId,
              newComponent
            ),
          },
        };
      }
      return component;
    });
  };

  const updateComponentInComponents = (
    components: ComponentConfig[],
    updatedComponent: ComponentConfig
  ) => {
    const updatedComponents = components.map((c) => {
      if (c.id === updatedComponent.id) {
        return { ...updatedComponent };
      }
      if (c.props.children) {
        c.props.children = updateComponentInComponents(
          c.props.children,
          updatedComponent
        );
      }
      return { ...c };
    });
    return updatedComponents;
  };

  const findComponentById = (
    components: ComponentConfig[],
    id?: string
  ): ComponentConfig | undefined => {
    const updatedComponents = components.find((c) => {
      if (c.id === id) {
        return true;
      }
      if (c.props.children) {
        return findComponentById(c.props.children, id);
      }
    });
    return updatedComponents;
  };

  return {
    removeComponentById,
    addComponentToTarget,
    findComponentById,
    updateComponentInComponents,
  };
};
