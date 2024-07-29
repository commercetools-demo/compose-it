import { useEffect, useState } from 'react';
import { useDatasource } from '../../../hooks/use-datasource';
import { Datasource, DatasourceResponse } from '../../../types/datasource';
import {
  Drawer,
  useModalState,
} from '@commercetools-frontend/application-components';
import DatasourceForm from '../datasource-form';
const DatasourceList = () => {
  const [datasources, setDatasources] = useState<DatasourceResponse[]>([]);

  const [selectedDatasourceResponse, setSelectedDatasourceResponse] =
    useState<DatasourceResponse>();

  const { updateDatasource, fetchAllDatasources } = useDatasource();

  const drawerState = useModalState();

  const refresh = () => {
    fetchAllDatasources().then((data) => setDatasources(data?.results || []));
  };

  const handleUpdateDatasource = async (datasource: Datasource) => {
    const result = await updateDatasource(
      selectedDatasourceResponse?.key || '',
      datasource
    );

    refresh();
    if (!!result) {
      drawerState.closeModal();
    }
  };

  const handleOpenModal = (datasource: DatasourceResponse) => {
    setSelectedDatasourceResponse(datasource);
    drawerState.openModal();
  };

  useEffect(() => {
    refresh();
  }, []);
  return (
    <>
      <ul>
        {datasources.map((datasource) => (
          <li key={datasource.key} onClick={() => handleOpenModal(datasource)}>
            {datasource.key}
          </li>
        ))}
      </ul>
      <Drawer
        title="Add new datasource"
        isOpen={drawerState.isModalOpen}
        onClose={drawerState.closeModal}
        hideControls
        size={30}
      >
        <DatasourceForm
          onSubmit={handleUpdateDatasource}
          onCancel={drawerState.closeModal}
          datasource={selectedDatasourceResponse?.value}
        />
      </Drawer>
    </>
  );
};

export default DatasourceList;
