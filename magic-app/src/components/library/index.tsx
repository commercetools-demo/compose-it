import React from 'react';
import Page from './page';
import Link from '@commercetools-uikit/link';
import Text from '@commercetools-uikit/text';
import Card from '@commercetools-uikit/card';
import PrimaryButton from '@commercetools-uikit/primary-button';

export const componentLibrary: Record<string, React.FC<any>> = {
  Page,
  ...Object.keys(Text).reduce(
    (acc, key) => ({ ...acc, [`Text.${key}`]: Text[key] }),
    {}
  ),
  PrimaryButton,
  Card,
  Link,
};
