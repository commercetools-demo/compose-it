import { PAGE_TYPES, PageConfig } from '../library/general';
import Spacings from '@commercetools-uikit/spacings';
import { Form, Formik } from 'formik';
import FieldLabel from '@commercetools-uikit/field-label';
import TextInput from '@commercetools-uikit/text-field';
import NumberInput from '@commercetools-uikit/number-input';
import SelectInput from '@commercetools-uikit/select-input';
import Text from '@commercetools-uikit/text';
import Grid from '@commercetools-uikit/grid';
import { useEffect, useState } from 'react';
import { Drawer } from '@commercetools-frontend/application-components';
import PropertyEditor from '../property-editor';
import { useBuilderStateContext } from '../../providers/process';
import styled from 'styled-components';

const Divider = styled.div`
  height: 1px;
  background-color: #ccc;
  margin: 20px 0;
`;

type Props = {
  hasMorePages?: boolean;
  page?: PageConfig;
  onSubmit: (page: PageConfig) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
};

const NewRouteForm = ({
  page,
  onSubmit,
  isOpen,
  hasMorePages,
  onClose,
}: Props) => {
  const [pageData, setPageData] = useState<PageConfig>(page);
  const { getComponentProps } = useBuilderStateContext();

  const handleValidation = (values: PageConfig) => {
    const errors: Record<keyof PageConfig, string | Record<string, string>> =
      {} as never;
    if (!values.name) {
      errors['name'] = 'Required';
    }
    if (!values.layout?.columns) {
      errors.layout = {
        columns: 'Required',
      };
    }
    setPageData(values);
    return errors;
  };

  useEffect(() => {
    if (!page) {
      const pageProps = hasMorePages
        ? getComponentProps('FormDetailPage')
        : null;
      setPageData({
        layout: { type: 'grid', columns: 12 },
        route: '',
        type: hasMorePages ? 'FormDetailPage' : 'landing',
        name: hasMorePages ? '' : 'Home',
        id: Date.now().toString(),
        props: pageProps?.props || {},
        config: {
          propsBindings: pageProps?.propsBindings || {},
        },
      });
    }
  }, []);

  const setPageProps = (pageType: string, oldType: string) => {
    if (!!pageType && pageType !== oldType) {
      const pageProps = getComponentProps(pageType);

      setPageData((prev) => ({
        ...prev,
        props: pageProps?.props || {},
        config: {
          propsBindings: pageProps?.propsBindings || {},
        },
      }));
    }
  };

  if (!pageData) {
    return null;
  }

  return (
    <Formik
      initialValues={pageData}
      onSubmit={onSubmit}
      validateOnBlur
      validate={handleValidation}
    >
      {({
        values,
        errors,
        setFieldValue,
        handleChange,
        handleSubmit,
        isValid,
        dirty,
      }) => (
        <Drawer
          title={!!pageData ? `Edit Page ${pageData.route}` : 'Add Page'}
          isOpen={isOpen}
          onClose={onClose}
          size={10}
          onPrimaryButtonClick={() => handleSubmit()}
          onSecondaryButtonClick={onClose}
          isPrimaryButtonDisabled={!isValid}
        >
          <Form>
            <Grid
              gridGap="16px"
              gridTemplateColumns="repeat(2, 1fr)"
              gridAutoColumns="1fr"
            >
              <Grid.Item gridColumn="span 2">
                <TextInput
                  title="Name"
                  value={values?.name || ''}
                  name="name"
                  onChange={handleChange}
                />
                {errors.name && (
                  <Text.Caption tone="warning">{errors.name}</Text.Caption>
                )}
              </Grid.Item>
              <Grid.Item gridColumn="span 2">
                <TextInput
                  title="Route"
                  hint={
                    hasMorePages
                      ? 'use /<path>/:id format for details page'
                      : 'keep empty for home page'
                  }
                  value={values?.route || ''}
                  name="route"
                  onChange={handleChange}
                />
                {errors.route && (
                  <Text.Caption tone="warning">{errors.route}</Text.Caption>
                )}
              </Grid.Item>
              <Grid.Item gridColumn="span 2">
                <Spacings.Inline alignItems="center">
                  <FieldLabel title="Columns" />
                  <NumberInput
                    value={values?.layout?.columns || 12}
                    name="layout.columns"
                    onChange={handleChange}
                  />
                </Spacings.Inline>
                {errors.layout?.columns && (
                  <Text.Caption tone="warning">
                    {errors.layout.columns}
                  </Text.Caption>
                )}
              </Grid.Item>
              <Grid.Item gridColumn="span 2">
                <Spacings.Inline alignItems="center">
                  <FieldLabel title="Page Type" />
                  <SelectInput
                    options={PAGE_TYPES}
                    value={values?.type}
                    name="type"
                    onChange={(e) => {
                      handleChange(e);
                      setPageProps(e.target.value, values.type);
                    }}
                  />
                </Spacings.Inline>
              </Grid.Item>
            </Grid>
            <Divider />
            {!!pageData?.type && (
              <PropertyEditor
                component={pageData}
                onUpdateComponent={(pageConfig) =>
                  setFieldValue(
                    'config.propsBindings',
                    pageConfig.config.propsBindings
                  )
                }
              />
            )}
          </Form>
        </Drawer>
      )}
    </Formik>
  );
};

export default NewRouteForm;
