import React from 'react';
import { availableModules } from '../../components/library/available-modules';
import {
  builtInComponentLibrary,
  reverseComponentMap,
} from '../../components/library';
import { FlyingComponentsResponse } from '../../types/datasource';

export const useRuntimeComponents = () => {
  const loadComponentsForRuntime = (components: FlyingComponentsResponse[]) => {
    return components.reduce(
      (newComponents: Record<string, React.ComponentType>, c) => {
        try {
          const { value } = c;
          const { name, code } = JSON.parse(value?.serializedCode || '{}');

          // Create a module-like environment
          const module = { exports: {} };

          const require = (moduleName: string) => {
            // Check in availableModules first
            if (availableModules[moduleName]) {
              return availableModules[moduleName];
            }

            // Check in reverseComponentMap
            if (reverseComponentMap[moduleName]) {
              return reverseComponentMap[moduleName];
            }

            // Check in builtInComponentLibrary
            if (builtInComponentLibrary[moduleName]) {
              return builtInComponentLibrary[moduleName];
            }

            // Handle nested components (e.g., Text.Body)
            const parts = moduleName.split('.');
            if (parts.length > 1 && builtInComponentLibrary[parts[0]]) {
              let component = builtInComponentLibrary[parts[0]];
              for (let i = 1; i < parts.length; i++) {
                if (component[parts[i]]) {
                  component = component[parts[i]];
                } else {
                  return {};
                }
              }
              return component;
            }

            return {};
          };

          // Evaluate the code in this environment
          const wrappedCode = `
              (function(module, exports, require) {
                ${code}
              })(module, module.exports, require);
            `;
          eval(wrappedCode);

          // The component should now be in module.exports.default
          const CustomComponent = module.exports.default || module.exports;

          if (typeof CustomComponent !== 'function') {
            throw new Error('Component is not a valid React component');
          }

          newComponents[name] = CustomComponent;
        } catch (error) {
          console.error(`Error loading component:`, error);
        }
        return newComponents;
      },
      {}
    );
  };
  return {
    loadComponentsForRuntime,
  };
};
