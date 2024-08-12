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
type Props = {
  onClose: () => void;
};

const NewDeploymentWizard = ({ onClose }: Props) => {
  const match = useRouteMatch();
  const { replace } = useHistory();

  const handleClose = (e: SyntheticEvent) => {
    e.stopPropagation();
    e.preventDefault();

    console.log('NOOOOOO');
  };
  useEffect(() => {
    replace(`${match.url}/tab-one`);
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
            <TabHeader to={`${match.url}/tab-one`} label="Tab One" />
            <TabHeader to={`${match.url}/tab-two`} label="Tab Two" />
          </>
        }
      >
        <Switch>
          <Route path={`${match.path}/tab-one`}>
            <div>tab1</div>
          </Route>
          <Route path={`${match.path}/tab-two`}>
            <div>tab2</div>
          </Route>
        </Switch>
      </TabularModalPage>
    </Router>
  );
};

export default NewDeploymentWizard;
