import { ComponentConfig, PageConfig } from '../library/general';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';
import PropertyValueEditor from './components/property-value-editor';
import DatasourceSelector from './components/datasource-selector';
import ViewSwitcher from '@commercetools-uikit/view-switcher';
import ActionSelector from './components/action-selector';

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
      <ViewSwitcher.Group
        isCondensed
        defaultSelected="property"
        selectedValue={component.config?.propsBindings?.[propertyKey]?.type}
        onChange={(value) => updatePropsBinding('type', value)}
      >
        <ViewSwitcher.Button value="property">Property</ViewSwitcher.Button>
        <ViewSwitcher.Button value="datasource">Datasource</ViewSwitcher.Button>
        <ViewSwitcher.Button value="action">Action</ViewSwitcher.Button>
      </ViewSwitcher.Group>
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
        value={component.config?.propsBindings?.[propertyKey]?.value}
      />
      <ActionSelector
        isActionSelected={
          component.config?.propsBindings?.[propertyKey]?.type === 'action'
        }
        onActionSelect={(actionKey?: string) => {
          if (actionKey) {
            updatePropsBinding('value', actionKey);
          } else {
            updatePropsBinding('type', 'action');
          }
        }}
        value={component.config?.propsBindings?.[propertyKey]?.value}
      />

      {component.config?.propsBindings?.[propertyKey]?.type === 'property' && (
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
