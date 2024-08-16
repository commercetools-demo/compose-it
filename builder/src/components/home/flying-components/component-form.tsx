import Grid from '@commercetools-uikit/grid';
import { Form, Formik } from 'formik';
import { FlyingComponentsResponse } from '../../../types/datasource';
import { Drawer } from '@commercetools-frontend/application-components';
import Text from '@commercetools-uikit/text';
import TextField from '@commercetools-uikit/text-field';
import EditorWrapper from './editor';
import { useState } from 'react';
import ErrorBoundary from '../../error-boundary';

type Props = {
  onSubmit: (component: FlyingComponentsResponse) => Promise<void>;
  onCancel: () => void;
  selectedComponent?: FlyingComponentsResponse;
};

const FlyingComponentForm = ({
  onSubmit,
  onCancel,
  selectedComponent = {
    key: '',
    value: {
      props: {},
      propsBindings: {},
      code: '',
    },
  } as FlyingComponentsResponse,
}: Props) => {
  const [compileError, setCompileError] = useState('');
  const handleValidation = (values: FlyingComponentsResponse) => {
    const errors: Record<keyof FlyingComponentsResponse, string> = {} as never;

    return errors;
  };

  const onSubmitForm = async (values: FlyingComponentsResponse) => {
    try {
      await onSubmit(values);
    } catch (error) {
      setCompileError(error.message);
    }
  };

  return (
    <Formik
      initialValues={selectedComponent}
      onSubmit={onSubmitForm}
      validateOnBlur
      validate={handleValidation}
    >
      {({
        values,
        errors,
        setFieldValue,
        handleChange,
        submitForm,
        isValid,
        dirty,
      }) => (
        <Form>
          <Drawer
            title={
              selectedComponent.key
                ? 'Modify flying component'
                : 'Add new flying component'
            }
            isOpen={true}
            size={30}
            onClose={onCancel}
            onPrimaryButtonClick={submitForm}
            onSecondaryButtonClick={onCancel}
            isPrimaryButtonDisabled={!isValid || !dirty}
          >
            <Grid
              gridGap="16px"
              gridTemplateColumns="repeat(1, 1fr)"
              gridAutoColumns="1fr"
            >
              <TextField
                name="key"
                value={values.key}
                onChange={handleChange}
                title="Key"
              />
              <ErrorBoundary>
                <EditorWrapper
                  setFieldValue={setFieldValue}
                  code={values.value?.code}
                />
              </ErrorBoundary>
            </Grid>
            {!!compileError && (
              <Text.Caption tone="warning">{compileError}</Text.Caption>
            )}
          </Drawer>
        </Form>
      )}
    </Formik>
  );
};
export default FlyingComponentForm;

/***
 * 
 {Object.keys(values.value?.props || {}).map((key) => (
                <Grid.Item gridColumn="span 1" key={key}>
                  <CollapsiblePanel header={key} isDefaultClosed condensed>
                    <Spacings.Stack alignItems="flex-start">
                      <Spacings.Inline justifyContent="flex-end">
                        <TextField
                          title="Prop Name"
                          value={key}
                          isReadOnly
                          name={`value.props.${key}-`}
                          onChange={handleChange}
                        />
                        <SelectField
                          title="Prop Type"
                          value={values.value?.propsBindings[key].dataType}
                          name={`value.propsBindings.${key}.dataType`}
                          onChange={handleChange}
                          options={[
                            {
                              value: 'string',
                              label: 'String',
                            },
                            {
                              value: 'boolean',
                              label: 'Boolean',
                            },
                            {
                              value: 'event',
                              label: 'Event',
                            },
                            {
                              value: 'array',
                              label: 'Array',
                            },
                            {
                              value: '',
                              label: 'None',
                            },
                          ]}
                        />
                        <TextField
                          title="Default value"
                          value={values.value?.props[key]}
                          name={`value.props.${key}`}
                          onChange={handleChange}
                        />
                        <NumberField
                          title="Sort order"
                          value={values.value?.propsBindings[key].sortOrder}
                          name={`value.propsBindings.${key}.sortOrder`}
                          onChange={handleChange}
                        />
                      </Spacings.Inline>
                      {errors.keysWithInvalidSort?.includes(key) && (
                        <Text.Caption tone="warning">
                          Sort order must be between 0 and 1
                        </Text.Caption>
                      )}
                      <TextField
                        title="Hint"
                        value={values.value?.propsBindings[key].hint}
                        name={`value.propsBindings.${key}.hint`}
                        onChange={handleChange}
                      />
                    </Spacings.Stack>
                  </CollapsiblePanel>
                </Grid.Item>
              ))}
 */
