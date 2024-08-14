import Grid from '@commercetools-uikit/grid';
import Spacings from '@commercetools-uikit/spacings';
import { Form, Formik } from 'formik';
import FieldLabel from '@commercetools-uikit/field-label';
import Text from '@commercetools-uikit/text';
import NumberField from '@commercetools-uikit/number-field';
import TextField from '@commercetools-uikit/text-field';
import SelectField from '@commercetools-uikit/select-field';
import {
  ComponentProp,
  ComponentPropResponse,
} from '../../../types/datasource';
import { Drawer } from '@commercetools-frontend/application-components';
import CollapsiblePanel from '@commercetools-uikit/collapsible-panel';

type Props = {
  onSubmit: (component: ComponentPropResponse) => Promise<void>;
  onCancel: () => void;
  selectedComponent?: ComponentPropResponse;
};

const NewComponentForm = ({
  onSubmit,
  onCancel,
  selectedComponent = {
    key: '',
    value: {
      props: {},
      propsBindings: {},
    },
  } as ComponentPropResponse,
}: Props) => {
  const handleValidation = (values: ComponentPropResponse) => {
    const errors: Record<keyof ComponentPropResponse, string> = {} as never;
    const keysWithInvalidSort = Object.keys(values.value?.propsBindings).filter(
      (key) =>
        values.value?.propsBindings[key].sortOrder &&
        (parseFloat(values.value?.propsBindings[key].sortOrder) < 0 ||
          parseFloat(values.value?.propsBindings[key].sortOrder) > 1)
    );
    if (keysWithInvalidSort.length > 0) {
      errors.keysWithInvalidSort = keysWithInvalidSort;
    }
    return errors;
  };

  console.log(' selectedComponent', selectedComponent);

  const handleSubmit = (values: ComponentPropResponse) => {
    console.log('values', values);
  };

  return (
    <Formik
      initialValues={selectedComponent}
      onSubmit={onSubmit}
      validateOnBlur
      validate={handleValidation}
    >
      {({ values, errors, handleChange, submitForm, isValid, dirty }) => (
        <Form>
          <Drawer
            title="Modify component"
            isOpen={true}
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
            </Grid>
          </Drawer>
        </Form>
      )}
    </Formik>
  );
};
export default NewComponentForm;
