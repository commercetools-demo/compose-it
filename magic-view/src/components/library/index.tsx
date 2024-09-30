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
import UiKitTextInput, {
  TTextInputProps,
} from '@commercetools-uikit/text-input';
import UiKitTextField, {
  TTextFieldProps,
} from '@commercetools-uikit/text-field';
import withFormikInput from './components/with-formik';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const builtInComponentLibrary: Record<string, React.FC<any>> = {
  ...Object.keys(Text).reduce(
    (acc, key) => ({ ...acc, [`Text.${key}`]: Text[key] }),
    {}
  ),
  PrimaryButton,
  DataTable,
  Form,
  Card,
  Link,
  TextInput: withFormikInput<TTextInputProps>(UiKitTextInput),
  TextField: withFormikInput<TTextFieldProps>(UiKitTextField),
  FormModalPage,
  FormDetailPage,
};

export const reverseComponentMap: Record<string, React.FC<any> | any> = {
  '@commercetools-uikit/link': Link,
  '@commercetools-uikit/text': Text,
  '@commercetools-uikit/text-input':
    withFormikInput<TTextInputProps>(UiKitTextInput),
  '@commercetools-uikit/text-field':
    withFormikInput<TTextFieldProps>(UiKitTextField),
  '@commercetools-uikit/data-table': DataTable,
  '@commercetools-uikit/card': Card,
  '@commercetools-uikit/form': Form,
  '@commercetools-uikit/form-modal-page': FormModalPage,
  '@commercetools-uikit/form-detail-page': FormDetailPage,
};
