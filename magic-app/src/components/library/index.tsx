import React from 'react';
import Link from '@commercetools-uikit/link';
import Text from '@commercetools-uikit/text';
import Card from '@commercetools-uikit/card';
import PrimaryButton from '@commercetools-uikit/primary-button';
import DataTable from './data-table';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const componentLibrary: Record<string, React.FC<any>> = {
  ...Object.keys(Text).reduce(
    (acc, key) => ({ ...acc, [`Text.${key}`]: Text[key] }),
    {}
  ),
  PrimaryButton,
  DataTable,
  Card,
  Link,
};
