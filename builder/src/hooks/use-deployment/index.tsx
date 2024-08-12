/// <reference path="../../../@types/commercetools__sync-actions/index.d.ts" />
/// <reference path="../../../@types-extensions/graphql-ctp/index.d.ts" />

import type { ApolloError } from '@apollo/client';
import { useMcQuery } from '@commercetools-frontend/application-shell';
import { GRAPHQL_TARGETS, MC_API_PROXY_TARGETS } from '@commercetools-frontend/constants';
//import type { TDataTableSortingState } from '@commercetools-uikit/hooks';
import type {
  TMeQueryInterface_OrdersArgs,
  TOrder,
  TTaxedPrice,
  TTaxPortion,
} from '../../types/generated/ctp';
import FetchOrderDetailsQuery from './fetch-orderdetails.ctp.graphql';
import {
    useAsyncDispatch,
    actions,
    TSdkAction,
  } from '@commercetools-frontend/sdk';
import { buildUrlWithParams } from '../../utils/utils';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
/*type PaginationAndSortingProps = {
  page: { value: number };
  perPage: { value: number };
  tableSorting: TDataTableSortingState;
};*/
// type TUseOrderDetailsFetcher = (
//   orderDetailsResult?: TTaxedPrice['totalTax', 'amount'];
//   error?: ApolloError;
//   loading: boolean;
// };

export const useOrderDetailsFetcher = (): {
  orderDetailsResult: TOrder
} => {
    const dispatchAppsRead = useAsyncDispatch<
    TSdkAction,
    any
  >();
//   const context = useApplicationContext((context) => context);

//   const { data, error, loading } = useMcQuery<{ order: TOrder}>(FetchOrderDetailsQuery, {
//     context: {
//       target: GRAPHQL_TARGETS.SETTINGS_SERVICE,
//     }
//   });

  const blah = async () => {
    const result = await dispatchAppsRead(
        actions.get({
          mcApiProxyTarget: 'connect',
          uri: '/5e5bfbc5-2e3d-4ab7-af43-f318333be376/connectors',
          includeUserPermissions: true,
          
        })
      );
  }

  


  return {
    blah,
    // orderDetailsResult: data,
  };
};


// /proxy/connect/:organizationId