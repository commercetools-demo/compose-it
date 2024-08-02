import React from 'react';
import { useRouteMatch } from 'react-router';
import { AppProvider } from '../../providers/app';
import { App } from '.';
export const AppWrapper: React.FC = () => {
  const { params }: { params: { key: string } } = useRouteMatch();
  return (
    <AppProvider appKey={params.key}>
      <App />
    </AppProvider>
  );
};
