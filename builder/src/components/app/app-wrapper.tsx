import { useRouteMatch } from 'react-router';
import { AppProvider } from '../../providers/app';
import { App } from '.';
import { ContextMenuProvider } from '../../providers/context-menu';
export const AppWrapper = ({ parentUrl }: { parentUrl: string }) => {
  const { params }: { params: { key: string } } = useRouteMatch();
  return (
    <AppProvider appKey={params.key}>
      <ContextMenuProvider>
        <App parentUrl={parentUrl} />
      </ContextMenuProvider>
    </AppProvider>
  );
};
