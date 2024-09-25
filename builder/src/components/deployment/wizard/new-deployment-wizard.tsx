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
import AppType from './app-type';

type Props = {
  onClose: () => void;
};

const NewDeploymentWizard = ({ onClose }: Props) => {
  const {
    selectedOrganization,
    selectedApp,
    selectedConnector,
    selectedDeployment,
    selectedDeploymentDraft,
  } = useDeploymentContext();
  const { appGeneralInfo } = useAppContext();
  const match = useRouteMatch();
  const { replace } = useHistory();

  const handleClose = (e: SyntheticEvent) => {
    replace(`${match.url}`);
    onClose();
  };
  useEffect(() => {
    replace(`${match.url}/application-type`);
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
              to={`${match.url}/application-type`}
              label="1. Select deployment type"
            />
            <TabHeader
              to={`${match.url}/organization`}
              label="2. Select organization"
            />
            <TabHeader
              to={`${match.url}/custom-applications`}
              label="3. Select custom application"
              isDisabled={!selectedOrganization}
            />
            <TabHeader
              to={`${match.url}/connect-applications`}
              label="4. Select a connector"
              isDisabled={!selectedApp}
            />
            <TabHeader
              to={`${match.url}/deployments`}
              label="5. Select an installation"
              isDisabled={!selectedConnector}
            />
            <TabHeader
              to={`${match.url}/deploy`}
              label="6. Deploy"
              isDisabled={!selectedDeployment && !selectedDeploymentDraft}
            />
          </>
        }
      >
        <Switch>
          <Route path={`${match.path}/application-type`}>
            <AppType parentUrl={match.url} />
          </Route>
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
