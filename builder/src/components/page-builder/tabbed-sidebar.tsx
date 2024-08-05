import React from 'react';
import { ComponentConfig } from '../library/general';
import {
  TabularModalPage,
  useModalState,
  TabHeader,
} from '@commercetools-frontend/application-components';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
} from 'react-router-dom';
import PropertyEditor from '../property-editor';
import ComponentPalette from '../component-palette';
import Spacings from '@commercetools-uikit/spacings';
type Props = {
  component?: ComponentConfig;
  onUpdateComponent: (updatedComponent: ComponentConfig) => void;
  onDeleteComponent: (component: ComponentConfig) => void;
};

const TabbedSidebar = ({
  component,
  onUpdateComponent,
  onDeleteComponent,
}: Props) => {
  const match = useRouteMatch();

  return (
    <Spacings.Stack scale="l">
      <Spacings.Inline scale="l">
        <TabHeader to={`${match.url}/add`} label="Palette" />
        <TabHeader to={`${match.url}/properties`} label="Properties" />
      </Spacings.Inline>
      <Switch>
        <Route path={`${match.path}/add`}>
          <ComponentPalette />
        </Route>
        <Route path={`${match.path}/properties`}>
          {!!component && (
            <>
              <PropertyEditor
                component={component}
                onUpdateComponent={(componentConfig) =>
                  onUpdateComponent(componentConfig as ComponentConfig)
                }
              />
              <button
                onClick={() => onDeleteComponent(component)}
                type="button"
              >
                DELETE
              </button>
            </>
          )}
          {!component && <div>No component selected</div>}
        </Route>
      </Switch>
    </Spacings.Stack>
  );
};

export default TabbedSidebar;
