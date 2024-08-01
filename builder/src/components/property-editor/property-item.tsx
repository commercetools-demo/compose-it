import { usePropertyDatasource } from './hooks/use-property-datasource';
import { useBuilderStateContext } from '../../providers/process';
import { PathSelector } from './path-selector';
import { useMemo } from 'react';
import { ComponentConfig } from '../library/general';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import PropertyValueEditor from './components/property-value-editor';

type Props = {
  propertyKey: string;
  component: ComponentConfig;
  onUpdateComponent: (updatedComponent: ComponentConfig) => void;
};

export const PropertyItem = ({
  component,
  propertyKey,
  onUpdateComponent,
}: Props) => {
  const { extractPaths } = usePropertyDatasource();
  const { datasources } = useBuilderStateContext();

  const selectedDatasource = useMemo(
    () =>
      component.config?.propsBindings?.[propertyKey]?.type === 'datasource' &&
      typeof component.config?.propsBindings?.[propertyKey]?.value ===
        'string' &&
      !!component.config?.propsBindings?.[propertyKey]?.value
        ? component.config?.propsBindings?.[propertyKey]?.value?.split('.')?.[0]
        : '',
    [component]
  );

  const availablePaths = useMemo(() => {
    if (selectedDatasource) {
      const datasource = datasources?.results.find(
        (d) => d.key === selectedDatasource
      );
      if (datasource?.value?.query) {
        const extractedPaths = extractPaths(datasource?.value?.query || '');
        return extractedPaths;
      }
    }
    return [];
  }, [selectedDatasource]);

  const selectedPath = useMemo(() => {
    return component.config?.propsBindings?.[propertyKey]?.type ===
      'datasource' &&
      typeof component.config?.propsBindings?.[propertyKey]?.value ===
        'string' &&
      !!component.config?.propsBindings?.[propertyKey]?.value
      ? component.config?.propsBindings?.[propertyKey]?.value
          ?.split('.')
          .slice(1)
          .join('.')
      : '';
  }, [component]);

  const updatePropsBinding = (
    key: string,
    value: string | number | unknown[] | boolean | object
  ) => {
    const updatedConfig = {
      ...(component.config || {}),
      propsBindings: {
        ...(component.config?.propsBindings || {}),
        [propertyKey]: {
          ...(component.config?.propsBindings?.[propertyKey] || {
            type: 'property',
          }),
          [key]: value,
        },
      },
    };

    onUpdateComponent({ ...component, config: updatedConfig });
  };

  const handleDatasourceChange = (datasourceKey: string) => {
    updatePropsBinding('value', datasourceKey);
  };

  const handlePropertyChange = (
    value: string | number | unknown[] | boolean | object
  ) => {
    updatePropsBinding('value', value);
  };
  const handleTypeChange = (type: 'property' | 'datasource') => {
    updatePropsBinding('type', type);
  };

  const handlePathSelect = (path: string) => {
    updatePropsBinding('value', `${selectedDatasource}.${path}`);
  };

  return (
    <CollapsiblePanel
      isDefaultClosed
      header={`${propertyKey} (${component.config?.propsBindings?.[propertyKey]?.dataType})`}
    >
      <label htmlFor={`use-datasource-${propertyKey}`}>use datasource:</label>
      <input
        type="checkbox"
        checked={
          component.config?.propsBindings?.[propertyKey]?.type === 'datasource'
        }
        id={`use-datasource-${propertyKey}`}
        onChange={(e) =>
          handleTypeChange(e.target.checked ? 'datasource' : 'property')
        }
      />
      {component.config?.propsBindings?.[propertyKey]?.type !==
        'datasource' && (
        <PropertyValueEditor
          propsBinding={component.config?.propsBindings?.[propertyKey]}
          componentType={component.type}
          value={component.config?.propsBindings?.[propertyKey]?.value}
          onChange={handlePropertyChange}
        />
      )}
      {component.config?.propsBindings?.[propertyKey]?.type ===
        'datasource' && (
        <>
          <select
            onChange={(e) => handleDatasourceChange(e.target.value)}
            value={selectedDatasource}
          >
            <option value="">Select a datasource</option>
            {datasources?.results.map((datasource) => (
              <option key={datasource.key} value={datasource.key}>
                {datasource.value?.name}
              </option>
            ))}
          </select>
          {selectedDatasource && (
            <PathSelector
              paths={availablePaths}
              value={selectedPath}
              onSelect={(path) => handlePathSelect(path)}
            />
          )}
        </>
      )}
    </CollapsiblePanel>
  );
};
