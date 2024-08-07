import React from 'react';
import Link from '@commercetools-uikit/link';
import Text from '@commercetools-uikit/text';
import Card from '@commercetools-uikit/card';
import PrimaryButton from '@commercetools-uikit/primary-button';
import DataTable from './components/data-table';
import {
  FormModalPage,
  FormDetailPage,
} from '@commercetools-frontend/application-components';
import Form from './components/form';
import TextInput from './components/text-input';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const componentLibrary: Record<string, React.FC<any>> = {
  ...Object.keys(Text).reduce(
    (acc, key) => ({ ...acc, [`Text.${key}`]: Text[key] }),
    {}
  ),
  PrimaryButton,
  DataTable,
  Form,
  Card,
  Link,
  TextInput,
  FormModalPage,
  FormDetailPage,
};
