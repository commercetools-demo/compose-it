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
  useLocation,
  Link,
} from 'react-router-dom';
import PropertyEditor from '../property-editor';
import ComponentPalette from '../component-palette';
import Spacings from '@commercetools-uikit/spacings';
import { useQuery } from '../../hooks/use-query';
import styled from 'styled-components';

const StyledDiv = styled.div`
  padding: 0 10px;
`;
const StyledLink = styled(Link)`
  border: ${({ selected }) => (selected ? 'solid #0070f3' : 'none')};
  border-width: ${({ selected }) => (selected ? '0 0 2px 0' : '0')};
  color: ${({ selected }) => (selected ? '#0070f3' : 'inherit')};
  font-weight: ${({ selected }) => (selected ? 'bold' : 'normal')};
  padding: ${({ selected }) => (selected ? '4px 0' : '4px 8px')};
`;

const ThinBorder = styled.div`
  height: 1px;
  background-color: #ccc;
`;

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

  const { constructPath } = useQuery();
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const tab = searchParams.get('tab');

  return (
    <StyledDiv>
      <Spacings.Stack scale="s">
        <Spacings.Inline scale="l">
          <StyledLink
            selected={tab === 'add'}
            to={constructPath(match.url, 'tab', 'add')}
          >
            Palette
          </StyledLink>
          <StyledLink
            selected={tab === 'properties'}
            to={constructPath(match.url, 'tab', 'properties')}
          >
            Properties
          </StyledLink>
        </Spacings.Inline>
        <ThinBorder />
        <Switch>
          <Route exact path={`${match.path}/`}>
            {tab === 'add' && <ComponentPalette />}
            {tab === 'properties' && !!component && (
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
            {tab === 'properties' && !component && (
              <div>No component selected</div>
            )}
          </Route>
        </Switch>
      </Spacings.Stack>
    </StyledDiv>
  );
};

export default TabbedSidebar;
