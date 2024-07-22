import React, { useState } from 'react';
import { AppConfig, PageConfig } from '../../types/generated/general';
import PageList from '../page-list';
import PageBuilder from '../page-builder';

export const App: React.FC = () => {
  const [appConfig, setAppConfig] = useState<AppConfig>({
    pages: [],
  });
  const [currentPageId, setCurrentPageId] = useState<string | null>(null);

  const addPage = (page: PageConfig) => {
    setAppConfig(prev => ({
      ...prev,
      pages: [...prev.pages, page],
    }));
    setCurrentPageId(page.id);
  };

  const updatePage = (updatedPage: PageConfig) => {
    setAppConfig(prev => ({
      ...prev,
      pages: prev.pages.map(p => p.id === updatedPage.id ? updatedPage : p),
    }));
  };

  const currentPage = appConfig.pages.find(p => p.id === currentPageId);

  return (
    <div className="compose-it-builder">
      <h1>ComposeIt Builder</h1>
      <div className="builder-layout">
        <PageList
          pages={appConfig.pages}
          onAddPage={addPage}
          onSelectPage={setCurrentPageId}
          currentPageId={currentPageId}
        />
        {currentPage && (
          <PageBuilder
            page={currentPage}
            onUpdatePage={updatePage}
          />
        )}
      </div>
    </div>
  );
};
