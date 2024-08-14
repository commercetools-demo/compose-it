import IconButton from '@commercetools-uikit/icon-button';
import { TruckIcon } from '@commercetools-uikit/icons';
import { useModalState } from '@commercetools-frontend/application-components';
import DeploymentWrapper from './deployment-wrapper';
import { useDeployment } from '../../hooks/use-deployment';

const Deployment = () => {
  const pageModalState = useModalState();
  const { myApps, myOrganizations, user } = useDeployment();

  return (
    <div>
      <IconButton
        icon={<TruckIcon />}
        label="Export"
        onClick={pageModalState.openModal}
      />
      {pageModalState.isModalOpen && (
        <DeploymentWrapper onClose={pageModalState.closeModal} />
      )}
    </div>
  );
};

export default Deployment;
