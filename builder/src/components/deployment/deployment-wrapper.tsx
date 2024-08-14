import { InfoModalPage } from '@commercetools-frontend/application-components';
import Spacings from '@commercetools-uikit/spacings';
import NewDeployment from './new-deployment';
import Text from '@commercetools-uikit/text';
import DeploymentStatusList from './wizard/deployment-status-list';
import { useAppContext } from '../../providers/app';

type Props = {
  onClose: () => void;
};

const DeploymentWrapper = ({ onClose }: Props) => {
  const { appGeneralInfo } = useAppContext();

  return (
    <InfoModalPage
      title="Deployments"
      isOpen={true}
      onClose={onClose}
      topBarPreviousPathLabel="Back"
    >
      <Spacings.Stack scale="l">
        <Spacings.Inline justifyContent="space-between">
          <Text.Subheadline>{`List of deployments for "${appGeneralInfo?.name}"`}</Text.Subheadline>
          <NewDeployment />
        </Spacings.Inline>
        <DeploymentStatusList />
      </Spacings.Stack>
    </InfoModalPage>
  );
};

export default DeploymentWrapper;
