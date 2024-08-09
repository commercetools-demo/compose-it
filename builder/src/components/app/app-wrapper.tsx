import { useRouteMatch } from 'react-router';
import { AppProvider } from '../../providers/app';
import { App } from '.';
export const AppWrapper = ({ parentUrl }: { parentUrl: string }) => {
  const { params }: { params: { key: string } } = useRouteMatch();
  return (
    <AppProvider appKey={params.key}>
      <App parentUrl={parentUrl} />
    </AppProvider>
  );
};
