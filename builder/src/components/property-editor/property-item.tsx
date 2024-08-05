import { ComponentConfig, PageConfig } from '../library/general';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import PropertyValueEditor from './components/property-value-editor';
import DatasourceSelector from './components/datasource-selector';

type Props = {
  propertyKey: string;
  component: ComponentConfig | PageConfig;
  onUpdateComponent: (updatedComponent: ComponentConfig | PageConfig) => void;
};

export const PropertyItem = ({
  component,
  propertyKey,
  onUpdateComponent,
}: Props) => {
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

  const handlePropertyChange = (
    value: string | number | unknown[] | boolean | object
  ) => {
    updatePropsBinding('value', value);
  };

  return (
    <CollapsiblePanel
      isDefaultClosed
      header={`${propertyKey} (${component.config?.propsBindings?.[propertyKey]?.dataType})`}
    >
      <label htmlFor={`use-datasource-${propertyKey}`}>use datasource:</label>
      <DatasourceSelector
        isDatasourceSelected={
          component.config?.propsBindings?.[propertyKey]?.type === 'datasource'
        }
        onDatasourceSelect={(datasourceKey?: string, path?: string) => {
          if (datasourceKey && path) {
            updatePropsBinding('value', `${datasourceKey}.${path}`);
          } else if (datasourceKey) {
            updatePropsBinding('value', datasourceKey);
          } else {
            updatePropsBinding('type', 'datasource');
          }
        }}
        onDatasourceDeselect={() => {
          updatePropsBinding('type', 'property');
        }}
        value={component.config?.propsBindings?.[propertyKey]?.value}
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
    </CollapsiblePanel>
  );
};
