import Grid from '@commercetools-uikit/grid';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import { Form, Formik } from 'formik';
import FieldLabel from '@commercetools-uikit/field-label';
import TextInput from '@commercetools-uikit/text-input';
import Text from '@commercetools-uikit/text';
import { Action } from '../../../../types/datasource';
import Editor from '../../datasource/editor';

type Props = {
  onSubmit: (action: Action) => Promise<void>;
  onCancel: () => void;
  action?: Action;
};

const initialQueryCtp = `# shift-option/alt-click on a query below to jump to it in the explorer
# option/alt-click on a field in the explorer to select all subfields
query ProjectInfo {
  project {
    name
    key
  }
}
`;

const ActionForm = ({
  onSubmit,
  onCancel,
  action = {
    name: '',
    mutation: initialQueryCtp,
    variables: '',
  } as Action,
}: Props) => {
  const handleValidation = (values: Action) => {
    const errors: Record<keyof Action, string> = {} as never;
    if (!values.name) {
      errors['name'] = 'Required';
    }
    if (!values.mutation) {
      errors['mutation'] = 'Required';
    }

    return errors;
  };

  return (
    <Formik
      initialValues={action}
      onSubmit={onSubmit}
      validateOnBlur
      validate={handleValidation}
    >
      {({ values, errors, handleChange, submitForm, setFieldValue }) => (
        <Form>
          <div style={{ paddingBottom: '16px' }}>
            <Spacings.Inline
              alignItems="center"
              justifyContent="flex-end"
              scale="m"
            >
              <SecondaryButton
                label="Cancel"
                onClick={onCancel}
                type="button"
              />
              <PrimaryButton label="Save" onClick={submitForm} type="button" />
            </Spacings.Inline>
          </div>
          <Grid
            gridGap="16px"
            gridTemplateColumns="repeat(2, 1fr)"
            gridAutoColumns="1fr"
          >
            <Grid.Item gridColumn="span 2">
              <Spacings.Inline alignItems="center">
                <FieldLabel title="Name" />
                <TextInput
                  value={values?.name}
                  name="name"
                  onChange={handleChange}
                />
              </Spacings.Inline>
              {errors.name && (
                <Text.Caption tone="warning">{errors.name}</Text.Caption>
              )}
            </Grid.Item>
          </Grid>
          <Editor
            target="ctp"
            query={action.mutation}
            onUpdateQuery={(mutation) => setFieldValue('mutation', mutation)}
            variables={action.variables}
            onUpdateVariables={(variables) =>
              setFieldValue('variables', variables)
            }
          />
          {errors.mutation && (
            <Text.Caption tone="warning">{errors.mutation}</Text.Caption>
          )}
        </Form>
      )}
    </Formik>
  );
};
export default ActionForm;
