import Spacings from '@commercetools-uikit/spacings';
import { Form, Formik } from 'formik';
import FieldLabel from '@commercetools-uikit/field-label';
import TextInput from '@commercetools-uikit/text-input';
import Text from '@commercetools-uikit/text';
import Grid from '@commercetools-uikit/grid';
import { Drawer } from '@commercetools-frontend/application-components';
import { CustomAppDraft } from '../../../hooks/use-deployment/types/app';

type Props = {
  onSubmit: (customAppDraft: CustomAppDraft) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
};

const NewCustomAppForm = ({ onSubmit, isOpen, onClose }: Props) => {
  const initialData: Partial<CustomAppDraft> = {
    name: '',
    description: '',
    url: 'https://todo.com',
    entryPointUriPath: 'my-custom-app-route',
    icon: 'rocket',
    permissions: [
      {
        name: 'ViewMyCustomApp',
        oAuthScopes: ['view_products'],
      },
      {
        name: 'ManageMyCustomApp',
        oAuthScopes: ['manage_products'],
      },
    ],
    mainMenuLink: {
      defaultLabel: '',
      labelAllLocales: [],
      permissions: ['ViewMyCustomApp', 'ManageMyCustomApp'],
    },
    submenuLinks: [],
  };

  const handleValidation = (values: CustomAppDraft) => {
    const errors: Record<
      keyof CustomAppDraft,
      string | Record<string, string>
    > = {} as never;
    if (!values.name) {
      errors['name'] = 'Required';
    }
    if (!values.url) {
      errors['url'] = 'Required';
    }
    if (!values.entryPointUriPath) {
      errors['entryPointUriPath'] = 'Required';
    }
    if (!values.mainMenuLink.defaultLabel) {
      errors['mainMenuLink'] = 'Required';
    }

    return errors;
  };

  return (
    <Formik
      initialValues={initialData}
      onSubmit={onSubmit}
      validateOnBlur
      validate={handleValidation}
    >
      {({ values, errors, setFieldValue, handleChange, handleSubmit }) => (
        <Drawer
          title={'New Custom App'}
          isOpen={isOpen}
          onClose={onClose}
          size={10}
          onPrimaryButtonClick={() => handleSubmit()}
          onSecondaryButtonClick={onClose}
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
                  <FieldLabel title="Entry point route" />
                  <TextInput
                    value={values?.entryPointUriPath || ''}
                    name="entryPointUriPath"
                    onChange={handleChange}
                  />
                </Spacings.Inline>

                {errors.entryPointUriPath && (
                  <Text.Caption tone="warning">
                    {errors.entryPointUriPath}
                  </Text.Caption>
                )}
              </Grid.Item>
              <Grid.Item gridColumn="span 2">
                <Spacings.Inline alignItems="center">
                  <FieldLabel title="Main menu link label" />
                  <TextInput
                    value={values?.mainMenuLink.defaultLabel || ''}
                    name="mainMenuLink.defaultLabel"
                    onChange={handleChange}
                  />
                </Spacings.Inline>

                {errors.mainMenuLink && (
                  <Text.Caption tone="warning">
                    {errors.mainMenuLink}
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

export default NewCustomAppForm;
