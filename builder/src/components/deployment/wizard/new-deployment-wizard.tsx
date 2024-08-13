import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  useHistory,
} from 'react-router-dom';
import {
  TabularModalPage,
  TabHeader,
} from '@commercetools-frontend/application-components';
import { SyntheticEvent, useEffect } from 'react';
import OrganizationList from './organization-list';
import { useDeploymentContext } from '../../../providers/deployment';
import CustomApplicationList from './custom-app/custom-app-list';
import { useAppContext } from '../../../providers/app';
import ConnectApplicationList from './connect-app/connect-app-list';
import DeploymentList from './connect-deployment/deployment-list';
import Deploy from './deploy';

type Props = {
  onClose: () => void;
};

const NewDeploymentWizard = ({ onClose }: Props) => {
  const {
    selectedOrganization,
    selectedApp,
    selectedConnector,
    selectedDeployment,
  } = useDeploymentContext();
  const { appGeneralInfo } = useAppContext();
  const match = useRouteMatch();
  const { replace } = useHistory();

  const handleClose = (e: SyntheticEvent) => {
    // e.stopPropagation();
    // e.preventDefault();
    // goBack();
    replace(`${match.url}`);
    onClose();
    console.log('NOOOOOO');
  };
  useEffect(() => {
    replace(`${match.url}/organization`);
  }, []);
  return (
    <Router>
      <TabularModalPage
        title={`Deploy "${appGeneralInfo?.name}" app`}
        isOpen={true}
        onClose={handleClose}
        shouldDelayOnClose={false}
        tabControls={
          <>
            <TabHeader
              to={`${match.url}/organization`}
              label="1. Select organization"
            />
            <TabHeader
              to={`${match.url}/custom-applications`}
              label="2. Select custom application"
              isDisabled={!selectedOrganization}
            />
            <TabHeader
              to={`${match.url}/connect-applications`}
              label="3. Select a connector"
              isDisabled={!selectedApp}
            />
            <TabHeader
              to={`${match.url}/deployments`}
              label="4. Select a deployment"
              isDisabled={!selectedConnector}
            />
            <TabHeader
              to={`${match.url}/deploy`}
              label="5. Deploy"
              isDisabled={!selectedDeployment}
            />
          </>
        }
      >
        <Switch>
          <Route path={`${match.path}/organization`}>
            <OrganizationList parentUrl={match.url} />
          </Route>
          <Route path={`${match.path}/custom-applications`}>
            <CustomApplicationList parentUrl={match.url} />
          </Route>
          <Route path={`${match.path}/connect-applications`}>
            <ConnectApplicationList parentUrl={match.url} />
          </Route>
          <Route path={`${match.path}/deployments`}>
            <DeploymentList parentUrl={match.url} />
          </Route>
          <Route path={`${match.path}/deploy`}>
            <Deploy parentUrl={match.url} />
          </Route>
        </Switch>
      </TabularModalPage>
    </Router>
  );
};

export default NewDeploymentWizard;
