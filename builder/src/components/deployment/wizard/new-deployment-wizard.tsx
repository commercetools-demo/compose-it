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
import { useAppContext } from '../../../providers/app';

type Props = {
  onClose: () => void;
};

const NewDeploymentWizard = ({ onClose }: Props) => {
  const { selectedOrganization } = useDeploymentContext();
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
        </Switch>
      </TabularModalPage>
    </Router>
  );
};

export default NewDeploymentWizard;
