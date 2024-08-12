import {
  BrowserRouter as Router,
  Switch,
  Route,
  useRouteMatch,
  Link,
  useHistory,
} from 'react-router-dom';
import {
  TabularModalPage,
  TabHeader,
} from '@commercetools-frontend/application-components';
import { SyntheticEvent, useEffect } from 'react';
import OrganizationList from './organization-list';
import Spacings from '@commercetools-uikit/spacings';
import { useDeploymentContext } from '../../../providers/deployment';
import PrimaryButton from '@commercetools-uikit/primary-button';
import CustomApplicationList from './custom-app-list';

type Props = {
  onClose: () => void;
};

const NewDeploymentWizard = ({ onClose }: Props) => {
  const { selectedOrganization } = useDeploymentContext();
  const match = useRouteMatch();
  const { replace, goBack, push } = useHistory();

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
        title="Manage your account"
        isOpen={true}
        onClose={handleClose}
        shouldDelayOnClose={false}
        tabControls={
          <>
            <TabHeader
              to={`${match.url}/organization`}
              label="Select Organization"
            />
            <TabHeader
              to={`${match.url}/custom-applications`}
              label="Custom Applications"
              isDisabled={!selectedOrganization}
            />
          </>
        }
      >
        <Switch>
          <Route path={`${match.path}/organization`}>
            <OrganizationList parentUrl={match.url} />
          </Route>
          <Route path={`${match.path}/custom-applications`}>
            <CustomApplicationList />
          </Route>
        </Switch>
      </TabularModalPage>
    </Router>
  );
};

export default NewDeploymentWizard;
