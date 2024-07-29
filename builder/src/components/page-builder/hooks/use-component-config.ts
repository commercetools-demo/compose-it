import { ComponentConfig } from '../../library/general';

export const useComponentConfig = () => {
  const removeComponentById = (
    components: ComponentConfig[],
    id: string
  ): ComponentConfig[] => {
    return components.filter((component) => {
      if (component.id === id) return false;
      if (
        component.props?.children &&
        Array.isArray(component.props.children)
      ) {
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
    if (!Array.isArray(components)) {
      return components;
    }
    return components.map((component) => {
      if (component.id === targetId) {
        return {
          ...component,
          props: {
            ...(component.props || {}),
            children: [...(component.props.children || []), newComponent],
          },
        };
      }
      if (
        component.props?.children &&
        Array.isArray(component.props.children)
      ) {
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
    if (!Array.isArray(components)) {
      return components;
    }
    const updatedComponents = components.map((c) => {
      if (c.id === updatedComponent.id) {
        return { ...updatedComponent };
      }
      if (c.props?.children && Array.isArray(c.props.children)) {
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
    if (!id || !Array.isArray(components)) {
      return undefined;
    }

    for (const component of components) {
      if (component.id === id) {
        return component;
      }

      // Check if the component is a MoleculeComponentConfig
      if (
        'props' in component &&
        'children' in component.props &&
        Array.isArray(component.props.children)
      ) {
        const foundInChildren = findComponentById(component.props.children, id);
        if (foundInChildren) {
          return foundInChildren;
        }
      }
    }

    return undefined;
  };

  return {
    removeComponentById,
    addComponentToTarget,
    findComponentById,
    updateComponentInComponents,
  };
};
