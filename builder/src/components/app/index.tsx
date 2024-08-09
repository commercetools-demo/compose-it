import PageBuilder from '../page-builder';
import { useHistory } from 'react-router-dom';
import { InfoDetailPage } from '@commercetools-frontend/application-components';
import { useAppContext } from '../../providers/app';
import AppToolbar from './app-toolbar';
import Text from '@commercetools-uikit/text';
export const App = ({ parentUrl }: { parentUrl: string }) => {
  const { appConfig, currentPage, updatePage } = useAppContext();

  const history = useHistory();

  return (
    <InfoDetailPage
      onPreviousPathClick={() => history.push(parentUrl)}
      customTitleRow={<AppToolbar />}
    >
      {appConfig && (
        <div className="builder-layout">
          {!currentPage && (
            <Text.Subheadline>
              Select a page from Routing to begin building
            </Text.Subheadline>
          )}

          {currentPage && (
            <PageBuilder page={currentPage} onUpdatePage={updatePage} />
          )}
        </div>
      )}
    </InfoDetailPage>
  );
};
