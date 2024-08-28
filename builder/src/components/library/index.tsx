import React from 'react';
import Link from '@commercetools-uikit/link';
import Text from '@commercetools-uikit/text';
import Card from '@commercetools-uikit/card';
import TextInput from '@commercetools-uikit/text-input';
import TextField from '@commercetools-uikit/text-field';
import DataTable from '@commercetools-uikit/data-table';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Form from './components/form';
import Loop from './components/loop';
import {
  FormModalPage,
  FormDetailPage,
} from '@commercetools-frontend/application-components';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const builtInComponentLibrary: Record<string, React.FC<any> | any> = {
  ...Object.keys(Text).reduce(
    (acc, key) => ({ ...acc, [`Text.${key}`]: Text[key] }),
    {}
  ),
  PrimaryButton,
  TextInput,
  TextField,
  DataTable,
  Card,
  Link,
  Form,
  Loop,
  FormModalPage,
  FormDetailPage,
};

export const reverseComponentMap: Record<string, React.FC<any> | any> = {
  '@commercetools-uikit/link': Link,
  '@commercetools-uikit/text': Text,
  '@commercetools-uikit/text-input': TextInput,
  '@commercetools-uikit/text-field': TextField,
  '@commercetools-uikit/data-table': DataTable,
  '@commercetools-uikit/card': Card,
  '@commercetools-uikit/form': Form,
  '@commercetools-uikit/loop': Loop,
  '@commercetools-uikit/form-modal-page': FormModalPage,
  '@commercetools-uikit/form-detail-page': FormDetailPage,
};
