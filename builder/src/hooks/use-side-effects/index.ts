import { useCallback, useMemo } from 'react';
import { ComponentConfig } from '../../components/library/general';
import { SideEffect } from './types';
import { usePropertyDatasource } from '../../components/property-editor/hooks/use-property-datasource';
const DroppedIntoFormTypes = ['TextField', 'TextInput'];
const DroppedIntoTargetPropName = 'initialData';
const DroppedIntoSourcePropName = 'value';

const ChangedPropComponentTypes = ['DataTable'];
const ChangedPropSourcePropName = 'rows';
const ChangedProptargetPropName = 'columns';

function getLabelFromDottedText(text?: string): string {
  if (!text || typeof text !== 'string') {
    return '';
  }
  if ( !text.includes('.')) {
    return text.toUpperCase();
  }
  return text.split('.')?.slice(-1)?.[0].toUpperCase() || '';
}

export const useSideEffects = () => {
  const { getAvailableSubPaths } = usePropertyDatasource();
  const sideEffects: SideEffect[] = useMemo(() => {
    return [
      // Example 1: When component Input is dropped into component Form
      {
        condition: (source, target) =>
          DroppedIntoFormTypes.includes(source.type) &&
          target?.type === 'Form' &&
          target.config?.propsBindings?.[DroppedIntoTargetPropName]?.type ===
            'datasource',

        action: (source, target) => ({
          ...source,
          config: {
            ...source.config,
            propsBindings: {
              ...source.config?.propsBindings,
              [DroppedIntoSourcePropName]: {
                ...(source.config?.propsBindings?.[DroppedIntoSourcePropName] ||
                  {}),
                type: 'datasource',
                value:
                  target?.config?.propsBindings?.[DroppedIntoTargetPropName]
                    ?.value,
              },
            },
          },
        }),
      },
      // Example 2: When a datasource value is selected for propertyBinding DataTable.rows, update columns
      {
        condition: (source) =>
          ChangedPropComponentTypes.includes(source.type) &&
          source.config?.propsBindings?.[ChangedPropSourcePropName]?.type ===
            'datasource' &&
          !!source.config?.propsBindings?.[ChangedProptargetPropName]?.value &&
          Array.isArray(
            source.config?.propsBindings?.[ChangedProptargetPropName]?.value
          ) &&
          source.config?.propsBindings?.[ChangedProptargetPropName]?.value
            .length === 0 &&
          !!source.config?.propsBindings?.[ChangedPropSourcePropName]?.value,
        action: (source) => {
          return {
            ...source,
            config: {
              ...source.config,
              propsBindings: {
                ...source.config?.propsBindings,
                [ChangedProptargetPropName]: {
                  ...(source.config?.propsBindings?.[
                    ChangedProptargetPropName
                  ] || {}),
                  type: 'property',
                  value: getAvailableSubPaths(
                    source.config?.propsBindings?.[ChangedPropSourcePropName]
                      ?.value
                  ).map((path) => ({
                    key: path,
                    label: getLabelFromDottedText(path),
                  })),
                },
              },
            },
          };
        },
      },
    ];
  }, []);

  const applySideEffects = useCallback(
    (source: ComponentConfig, target?: ComponentConfig) => {
      let updatedSource = { ...source };

      sideEffects.forEach((sideEffect) => {
        if (sideEffect.condition(source, target)) {
          updatedSource = sideEffect.action(
            updatedSource,
            target
          ) as ComponentConfig;
        }
      });

      return updatedSource;
    },
    []
  );

  return { applySideEffects };
};
