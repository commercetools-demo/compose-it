import { useAppContext } from '../../providers/app';
import Spacings from '@commercetools-uikit/spacings';
import FlatButton from '@commercetools-uikit/flat-button';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Text from '@commercetools-uikit/text';
import {
  ArrowLeftIcon,
  ArrowRightIcon,
  ExportIcon,
  RefreshIcon,
} from '@commercetools-uikit/icons';
import { useRouteMatch } from 'react-router';
import styled from 'styled-components';
import RoutingListButton from '../app-routing/routing-list-button';

const RotatingIcon = styled.div`
  animation: rotate 2s linear infinite;
  @keyframes rotate {
    from {
      transform: rotate(0deg);
    }
    to {
      transform: rotate(360deg);
    }
  }
`;

const AppToolbar = () => {
  const { params }: { params: { key: string } } = useRouteMatch();

  const { redo, undo, savePage, isSaving, hasRedo, hasUndo, isPageDirty } =
    useAppContext();
  return (
    <Spacings.Inline justifyContent="space-between">
      <Spacings.Inline>
        <Text.Headline as="h1">{`App: ${params.key}`}</Text.Headline>
        <RoutingListButton />
      </Spacings.Inline>
      <Spacings.Inline alignItems="center">
        <FlatButton
          icon={<ArrowRightIcon />}
          onClick={undo}
          label="Undo"
          isDisabled={!hasUndo}
        >
          Undo
        </FlatButton>
        <FlatButton
          icon={<ArrowLeftIcon />}
          onClick={redo}
          label="Redo"
          isDisabled={!hasRedo}
        >
          Undo
        </FlatButton>
        <PrimaryButton
          label="Save"
          isDisabled={!isPageDirty}
          iconLeft={
            isSaving ? (
              <RotatingIcon>
                <RefreshIcon />
              </RotatingIcon>
            ) : (
              <ExportIcon />
            )
          }
          onClick={savePage}
        />
      </Spacings.Inline>
    </Spacings.Inline>
  );
};

export default AppToolbar;
