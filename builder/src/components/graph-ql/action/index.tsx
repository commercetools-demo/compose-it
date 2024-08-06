import ActionList from './list';
import NewAction from './new-action';
import Spacings from '@commercetools-uikit/spacings';
import Text from '@commercetools-uikit/text';

const Actions = () => {
  return (
    <>
      <Spacings.Stack scale="xl">
        <Spacings.Stack scale="l">
          <Spacings.Inline justifyContent="space-between">
            <Text.Subheadline as="h4">List of actions</Text.Subheadline>
            <NewAction />
          </Spacings.Inline>
          <ActionList />
        </Spacings.Stack>
      </Spacings.Stack>
    </>
  );
};

export default Actions;
