import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
} from 'react';
import { AppConfig, PageConfig } from '../../components/library/general';
import { useApps } from '../../hooks/use-app';

interface AppContextType {
  appConfig: AppConfig;
  currentPage?: PageConfig;
  //   history: AppConfig[];
  //   currentHistoryIndex: number;
  hasUndo: boolean;
  hasRedo: boolean;
  isPageDirty: boolean;
  isSaving: boolean;
  updatePage: (updatedPage: PageConfig) => void;
  savePage: () => void;
  updateCurrentPageId: (pageId: string) => void;
  addPage: (page: PageConfig) => void;
  undo: () => void;
  redo: () => void;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{
  children: React.ReactNode;
  appKey: string;
}> = ({ children, appKey }) => {
  const [appConfig, setAppConfig] = useState<AppConfig>();
  const [history, setHistory] = useState<(AppConfig | undefined)[]>([]);
  const [currentHistoryIndex, setCurrentHistoryIndex] = useState(0);
  const [currentPageId, updateCurrentPageId] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const currentPage = appConfig?.pages?.find((p) => p.id === currentPageId);

  const { getApp, updateAppConfig } = useApps();

  const savePage = async () => {
    if (!appConfig) return;
    setIsSaving(true);
    await updateAppConfig(appKey, appConfig);
    setHistory([]);
    setCurrentHistoryIndex(0);
    setIsSaving(false);
  };

  const addPage = (page: PageConfig) => {    
    setAppConfig((prev) => ({
      ...prev,
      pages: [...(prev?.pages || []), page],
    }));
    updateCurrentPageId(page.id);
    setHistory((prevHistory) => {
      const oldHistory = prevHistory.slice(0, currentHistoryIndex + 1);
      const newHistory = prevHistory.slice(-1);

      return [
        ...oldHistory,
        {
          ...newHistory[0],
          pages: (newHistory[0]?.pages || []).map((p) =>
            p.id === page.id ? page : p
          ),
        },
      ];
    });
    setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
  };

  const updateApp = (appConfig?: AppConfig) => {
    if (!appConfig) return;
    setAppConfig((prev) => ({
      ...prev,
      ...appConfig,
    }));
  };

  const updatePageInApp = (updatedPage?: PageConfig) => {
    if (!updatedPage) return;
    setAppConfig((prev) => ({
      ...prev,
      pages: (prev?.pages || []).map((p) =>
        p.id === updatedPage.id ? updatedPage : p
      ),
    }));
  };

  const fetchAppInitial = async () => {
    const result = await getApp(appKey);
    if (result?.value) {
      setAppConfig(result.value?.appConfig || {});
      setHistory([result.value?.appConfig]);
    }
  };

  const updatePage = (updatedPage: PageConfig) => {
    updatePageInApp(updatedPage);
    setHistory((prevHistory) => {
      const oldHistory = prevHistory.slice(0, currentHistoryIndex + 1);
      const newHistory = prevHistory.slice(-1);

      return [
        ...oldHistory,
        {
          ...newHistory[0],
          pages: (newHistory[0]?.pages || []).map((p) =>
            p.id === updatedPage.id ? updatedPage : p
          ),
        },
      ];
    });
    setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
  };

  // Implement the code for the TODO comment
  //   const debounceUpdateAppConfig = useCallback(
  //     (newConfig?: AppConfig) => {
  //         updateApp(newConfig);
  //     },
  //     [appKey]
  //   );

  const undo = useCallback(() => {
    if (currentHistoryIndex > 0) {
      setCurrentHistoryIndex((prevIndex) => prevIndex - 1);
      updateApp(history[currentHistoryIndex - 1]);
    }
  }, [currentHistoryIndex, history]);

  const redo = useCallback(() => {
    if (currentHistoryIndex < history.length - 1) {
      setCurrentHistoryIndex((prevIndex) => prevIndex + 1);
      updateApp(history[currentHistoryIndex + 1]);
    }
  }, [currentHistoryIndex, history]);

  const hasUndo = currentHistoryIndex > 0;
  const hasRedo = currentHistoryIndex < history.length - 1;
  const isPageDirty = history.length > 1;

  //   useEffect(() => {
  //     const timer = setTimeout(() => {
  //       debounceUpdateAppConfig(appConfig);
  //     }, 500);

  //     return () => clearTimeout(timer);
  //   }, [appConfig]);

  useEffect(() => {
    fetchAppInitial();
  }, [appKey]);

  if (!appConfig) {
    return null;
  }

  return (
    <AppContext.Provider
      value={{
        appConfig,
        currentPage,
        hasRedo,
        hasUndo,
        isPageDirty,
        isSaving,
        updatePage,
        addPage,
        savePage,
        updateCurrentPageId,
        undo,
        redo,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (context === undefined) {
    throw new Error('usePageBuilder must be used within a AppProvider');
  }
  return context;
};
