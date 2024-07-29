import React, { useCallback, useEffect, useState } from 'react';
import PageList from '../page-list';
import PageBuilder from '../page-builder';
import { AppConfig, PageConfig } from '../library/general';
import { useRouteMatch } from 'react-router';
import { useApps } from '../../hooks/use-app';

export const App: React.FC = () => {
  const { params }: { params: { key: string } } = useRouteMatch();

  const { getApp, updateAppConfig } = useApps();
  const [appConfig, setAppConfig] = useState<AppConfig>();

  const fetchApp = async () => {
    const result = await getApp(params.key);
    console.log('result', result);

    if (result?.value) {
      setAppConfig(result.value?.appConfig || {});
    }
  };

  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  const addPage = (page: PageConfig) => {
    setAppConfig((prev) => ({
      ...prev,
      pages: [...(prev?.pages || []), page],
    }));
    setCurrentPageId(page.id);
  };

  const updatePage = (updatedPage: PageConfig) => {
    setAppConfig((prev) => ({
      ...prev,
      pages: (prev?.pages || []).map((p) =>
        p.id === updatedPage.id ? updatedPage : p
      ),
    }));
  };

  const currentPage = appConfig?.pages?.find((p) => p.id === currentPageId);

  useEffect(() => {
    fetchApp();
  }, [params]);

  // Implement the code for the TODO comment
  const debounceUpdateAppConfig = useCallback(
    (newConfig?: AppConfig) => {
      updateAppConfig(params.key, newConfig);
    },
    [params.key]
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      debounceUpdateAppConfig(appConfig);
    }, 500);

    return () => clearTimeout(timer);
  }, [appConfig]);

  return (
    <div className="compose-it-builder">
      <h1>ComposeIt Builder</h1>
      {appConfig && (
        <div className="builder-layout">
          <PageList
            pages={appConfig?.pages || []}
            onAddPage={addPage}
            onSelectPage={setCurrentPageId}
            currentPageId={currentPageId}
          />
          {currentPage && (
            <PageBuilder page={currentPage} onUpdatePage={updatePage} />
          )}
        </div>
      )}
    </div>
  );
};
