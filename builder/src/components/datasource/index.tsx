import DatasourceList from './list';
import NewDatasource from './new-datasource';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';

const Datasources = () => {
  return (
    <>
      <Spacings.Stack scale="xl">
        <Spacings.Stack scale="l">
          <Spacings.Inline justifyContent="space-between">
            <Text.Subheadline as="h4">List of datasources</Text.Subheadline>
            <NewDatasource />
          </Spacings.Inline>
          <DatasourceList />
        </Spacings.Stack>
      </Spacings.Stack>
    </>
  );
};

export default Datasources;
