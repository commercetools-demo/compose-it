import Spacings from '@commercetools-uikit/spacings';
import { Form, Formik, FieldArray } from 'formik';
import FieldLabel from '@commercetools-uikit/field-label';
import TextInput from '@commercetools-uikit/text-input';
import TextField from '@commercetools-uikit/text-field';
import Text from '@commercetools-uikit/text';
import Grid from '@commercetools-uikit/grid';
import { Drawer } from '@commercetools-frontend/application-components';
import IconButton from '@commercetools-uikit/icon-button';
import { BinLinearIcon, PlusBoldIcon } from '@commercetools-uikit/icons';
import { useState } from 'react';
import { CustomViewDraft } from '../../../../hooks/use-deployment/types/view';
import Select from '@commercetools-uikit/select-field';

type Props = {
  onSubmit: (customViewDraft: CustomViewDraft) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
};

const NewCustomViewForm = ({ onSubmit, isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);

  const initialData: Partial<CustomViewDraft> = {
    defaultLabel: '',
    description: '',
    url: 'https://todo.com',
    permissions: [
      {
        name: 'view',
        oAuthScopes: ['view_products'],
      },
      {
        name: 'manage',
        oAuthScopes: ['manage_products'],
      },
    ],
    type: 'CustomPanel',
    locators: [],
    typeSettings: {
      size: 'SMALL',
    }
  };

  const handleOnSubmit = async (values: CustomViewDraft) => {
    setIsLoading(true);
    await onSubmit(values);
    setIsLoading(false);
  };

  const handleValidation = (values: CustomViewDraft) => {
    const errors: Record<
      keyof CustomViewDraft,
      string | Record<string, string>
    > = {} as never;
    if (!values.defaultLabel) {
      errors['defaultLabel'] = 'Required';
    }
    if (!values.url) {
      errors['url'] = 'Required';
    }

    return errors;
  };

  return (
    <Formik
      initialValues={initialData as CustomViewDraft}
      onSubmit={handleOnSubmit}
      validateOnBlur
      validate={handleValidation}
    >
      {({ values, errors, isValid, handleChange, handleSubmit }) => (
        <Drawer
          title={'New Custom View'}
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
                  <FieldLabel title="Default Label" />
                  <TextInput
                    value={values?.defaultLabel || ''}
                    name="defaultLabel"
                    onChange={handleChange}
                  />
                </Spacings.Inline>
                {errors.defaultLabel && (
                  <Text.Caption tone="warning">
                    {errors.defaultLabel}
                  </Text.Caption>
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
                  <FieldLabel title="URL" />
                  <TextInput
                    value={values?.url || ''}
                    name="url"
                    onChange={handleChange}
                  />
                </Spacings.Inline>

                {errors.url && (
                  <Text.Caption tone="warning">{errors.url}</Text.Caption>
                )}
              </Grid.Item>
              <Grid.Item gridColumn="span 2">
                <Spacings.Inline alignItems="center">
                  <Select
                    isRequired
                    title="Size"
                    name='typeSettings.size'
                    onChange={handleChange}
                    value={values.typeSettings.size}
                    options={[
                      { value: 'SMALL', label: 'Small' },
                      { value: 'LARGE', label: 'Large' },
                    ]}
                    placeholder="Select a size"
                  ></Select>
                </Spacings.Inline>

                {errors.url && (
                  <Text.Caption tone="warning">{errors.url}</Text.Caption>
                )}
              </Grid.Item>
              <Grid.Item gridColumn="span 2">
                <FieldArray name="permissions.0.oAuthScopes">
                  {({ insert, remove, push }) => (
                    <Spacings.Stack scale="m">
                      {values.permissions?.[0]?.oAuthScopes?.map(
                        (item, index) => (
                          <Spacings.Inline key={index} alignItems="flex-end">
                            <TextField
                              title="View oAuth scope"
                              value={item || ''}
                              name={`permissions.0.oAuthScopes.${index}`}
                              onChange={handleChange}
                            />
                            <IconButton
                              type="button"
                              label="remove"
                              icon={<BinLinearIcon />}
                              onClick={() => remove(index)}
                            />
                          </Spacings.Inline>
                        )
                      )}
                      <IconButton
                        type="button"
                        label="Add"
                        icon={<PlusBoldIcon />}
                        onClick={() => push('view_')}
                      />
                    </Spacings.Stack>
                  )}
                </FieldArray>
              </Grid.Item>
              <Grid.Item gridColumn="span 2">
                <FieldArray name="permissions.1.oAuthScopes">
                  {({ insert, remove, push }) => (
                    <Spacings.Stack scale="m">
                      {values.permissions?.[1]?.oAuthScopes?.map(
                        (item, index) => (
                          <Spacings.Inline key={index} alignItems="flex-end">
                            <TextField
                              title="Manage oAuth scope"
                              value={item || ''}
                              name={`permissions.1.oAuthScopes.${index}`}
                              onChange={handleChange}
                            />
                            <IconButton
                              type="button"
                              label="remove"
                              icon={<BinLinearIcon />}
                              onClick={() => remove(index)}
                            />
                          </Spacings.Inline>
                        )
                      )}
                      <IconButton
                        type="button"
                        label="Add"
                        icon={<PlusBoldIcon />}
                        onClick={() => push('manage_')}
                      />
                    </Spacings.Stack>
                  )}
                </FieldArray>
              </Grid.Item>
              <Grid.Item gridColumn="span 2">
                <FieldArray name="locators">
                  {({ insert, remove, push }) => (
                    <Spacings.Stack scale="m">
                      {values.locators.map((item, index) => (
                        <Spacings.Inline key={index} alignItems="flex-end">
                          <TextField
                            title="Locator"
                            value={item || ''}
                            name={`locators.${index}`}
                            onChange={handleChange}
                          />
                          <IconButton
                            type="button"
                            label="remove"
                            icon={<BinLinearIcon />}
                            onClick={() => remove(index)}
                          />
                        </Spacings.Inline>
                      ))}
                      <IconButton
                        type="button"
                        label="Add"
                        icon={<PlusBoldIcon />}
                        onClick={() => push('')}
                      />
                    </Spacings.Stack>
                  )}
                </FieldArray>
              </Grid.Item>
            </Grid>
          </Form>
        </Drawer>
      )}
    </Formik>
  );
};

export default NewCustomViewForm;
