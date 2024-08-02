import React from 'react';
import PageList from '../page-list';
import PageBuilder from '../page-builder';
import { useHistory } from 'react-router-dom';
import { InfoDetailPage } from '@commercetools-frontend/application-components';
import { useAppContext } from '../../providers/app';
import AppToolbar from './app-toolbar';
export const App: React.FC = () => {
  const { appConfig, currentPage, updatePage, addPage, updateCurrentPageId } =
    useAppContext();

  const history = useHistory();

  return (
    <InfoDetailPage
      onPreviousPathClick={() => history.push('/')}
      customTitleRow={<AppToolbar />}
    >
      {appConfig && (
        <div className="builder-layout">
          <PageList
            pages={appConfig?.pages || []}
            onAddPage={addPage}
            onSelectPage={updateCurrentPageId}
            currentPageId={currentPage?.id}
          />
          {currentPage && (
            <PageBuilder page={currentPage} onUpdatePage={updatePage} />
          )}
        </div>
      )}
    </InfoDetailPage>
  );
};
