import { PAGE_TYPES, PageConfig } from '../library/general';
import Spacings from '@commercetools-uikit/spacings';
import { Form, Formik } from 'formik';
import FieldLabel from '@commercetools-uikit/field-label';
import TextInput from '@commercetools-uikit/text-input';
import NumberInput from '@commercetools-uikit/number-input';
import SelectInput from '@commercetools-uikit/select-input';
import Text from '@commercetools-uikit/text';
import Grid from '@commercetools-uikit/grid';
import { useState } from 'react';
import { Drawer } from '@commercetools-frontend/application-components';
import PropertyEditor from '../property-editor';

type Props = {
  page?: PageConfig;
  onSubmit: (page: PageConfig) => Promise<void>;
  isOpen: boolean;
  onClose: () => void;
};

const NewRouteForm = ({
  page = {
    layout: { type: 'grid', columns: 12 },
    route: '',
    type: 'FormDetailPage',
    name: '',
    id: Date.now().toString(),
  },
  onSubmit,
  isOpen,
  onClose,
}: Props) => {
  const [pageData, setPageData] = useState<PageConfig>(page);
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

  const onPageConfigUpdate = (updatedPage: PageConfig) => {
    setPageData(updatedPage);
  };

  return (
    <Drawer
      title={!!pageData ? `Edit Page ${pageData.route}` : 'Add Page'}
      isOpen={isOpen}
      onClose={onClose}
      size={10}
      onPrimaryButtonClick={() => onSubmit(pageData)}
      onSecondaryButtonClick={onClose}
    >
      <Formik
        initialValues={pageData}
        onSubmit={() => {}}
        validateOnBlur
        validate={handleValidation}
      >
        {({ values, errors, handleChange }) => (
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
                  <FieldLabel title="Route" />
                  <TextInput
                    value={values?.route || ''}
                    name="route"
                    onChange={handleChange}
                  />
                </Spacings.Inline>
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
                    onChange={handleChange}
                  />
                </Spacings.Inline>
              </Grid.Item>
            </Grid>
            {!!pageData?.type && (
              <PropertyEditor
                component={pageData}
                onUpdateComponent={(pageConfig) =>
                  onPageConfigUpdate(pageConfig as PageConfig)
                }
              />
            )}
          </Form>
        )}
      </Formik>
    </Drawer>
  );
};

export default NewRouteForm;
