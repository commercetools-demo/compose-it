import React from 'react';
import { useLocation, useHistory } from 'react-router-dom';

export const useQuery = () => {
  const { search, pathname } = useLocation();
  const history = useHistory();
  const query = React.useMemo(
    () => new URLSearchParams(search),
    [search, pathname]
  );

  const setQuery = (key: string, value: string) => {
    query.set(key, value);
    history.push(`${pathname}?${query.toString()}`);
  };
  const getQuery = (key: string) => {
    if (search && pathname) {
      return query.get(key);
    }

    return '';
  };

  const constructPath = (path: string, key: string, value: string) => {
    query.set(key, value);
    const currentQuery = query.toString();
    return `${path}?${currentQuery}`;
  };

  return {
    getQuery,
    setQuery,
    constructPath,
  };
};
