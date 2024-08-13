import Spacings from '@commercetools-uikit/spacings';
import { Form, Formik } from 'formik';
import FieldLabel from '@commercetools-uikit/field-label';
import TextInput from '@commercetools-uikit/text-input';
import Text from '@commercetools-uikit/text';
import Grid from '@commercetools-uikit/grid';
import { Drawer } from '@commercetools-frontend/application-components';
import { useState } from 'react';
import { ConnectorDraft } from '../../../../hooks/use-deployment/types/connector';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useDeploymentContext } from '../../../../providers/deployment';

type Props = {
  onSubmit: (connectAppDraft: ConnectorDraft) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
};

const NewConnectAppForm = ({ onSubmit, isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const context = useApplicationContext((context) => context);
  const {user} = useDeploymentContext();

  const initialData: Partial<ConnectorDraft> = {
    name: '',
    description: '',
    key: '',
    repository: {
      tag: '',
      url: context?.environment?.repoUrl,
    },
    creator: {
      email: user?.email || '',
      name: (user?.firstName || '') + ' ' + (user?.lastName || ''),
      company: '',
    },
  };

  const handleOnSubmit = async (values: ConnectorDraft) => {
    setIsLoading(true);
    await onSubmit(values);
    setIsLoading(false);
  };

  const handleValidation = (values: ConnectorDraft) => {
    const errors: Record<
      keyof ConnectorDraft,
      string | Record<string, string>
    > = {} as never;
    if (!values.name) {
      errors['name'] = 'Required';
    }
    if (!values.key) {
      errors['key'] = 'Required';
    }
    if (!values.repository.url) {
      errors['repository'] = { url: 'Required' };
    }
    if (!values.repository.tag) {
      errors['repository'] = { tag: 'Required' };
    }

    return errors;
  };

  return (
    <Formik
      initialValues={initialData}
      onSubmit={handleOnSubmit}
      validateOnBlur
      validate={handleValidation}
    >
      {({ values, errors, isValid, handleChange, handleSubmit }) => (
        <Drawer
          title={'New Connect App'}
          isOpen={isOpen}
          onClose={onClose}
          size={10}
          onPrimaryButtonClick={() => handleSubmit()}
          onSecondaryButtonClick={onClose}
          isPrimaryButtonDisabled={!isValid || isLoading}
          labelPrimaryButton={!isLoading ? 'Create' : 'Loading...'}
        >
          <Form>
            <Grid
              gridGap="16px"
              gridTemplateColumns="repeat(2, 1fr)"
              gridAutoColumns="1fr"
            >
              <Grid.Item gridColumn="span 2">
                <Spacings.Inline alignItems="center">
                  <FieldLabel title="Name" />
                  <TextInput
                    value={values?.name || ''}
                    name="name"
                    onChange={handleChange}
                  />
                </Spacings.Inline>
                {errors.name && (
                  <Text.Caption tone="warning">{errors.name}</Text.Caption>
                )}
              </Grid.Item>
              <Grid.Item gridColumn="span 2">
                <Spacings.Inline alignItems="center">
                  <FieldLabel title="Key" />
                  <TextInput
                    value={values?.key || ''}
                    name="key"
                    onChange={handleChange}
                  />
                </Spacings.Inline>
                {errors.key && (
                  <Text.Caption tone="warning">{errors.key}</Text.Caption>
                )}
              </Grid.Item>
              <Grid.Item gridColumn="span 2">
                <Spacings.Inline alignItems="center">
                  <FieldLabel title="Description" />
                  <TextInput
                    value={values?.description || ''}
                    name="description"
                    onChange={handleChange}
                  />
                </Spacings.Inline>

              </Grid.Item>
              <Grid.Item gridColumn="span 2">
                <Spacings.Inline alignItems="center">
                  <FieldLabel title="Repository URL" />
                  <TextInput
                    value={values?.repository.url || ''}
                    name="repository.url"
                    onChange={handleChange}
                  />
                </Spacings.Inline>

                {errors.repository?.url && (
                  <Text.Caption tone="warning">
                    {errors.repository.url}
                  </Text.Caption>
                )}
              </Grid.Item>
              <Grid.Item gridColumn="span 2">
                <Spacings.Inline alignItems="center">
                  <FieldLabel title="Repository tag" />
                  <TextInput
                    value={values?.repository.tag || ''}
                    name="repository.tag"
                    onChange={handleChange}
                  />
                </Spacings.Inline>

                {errors.repository?.tag && (
                  <Text.Caption tone="warning">
                    {errors.repository.tag}
                  </Text.Caption>
                )}
              </Grid.Item>
            </Grid>
          </Form>
        </Drawer>
      )}
    </Formik>
  );
};

export default NewConnectAppForm;
