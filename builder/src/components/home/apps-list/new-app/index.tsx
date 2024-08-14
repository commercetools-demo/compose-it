import Grid from '@commercetools-uikit/grid';
import PrimaryButton from '@commercetools-uikit/primary-button';
import SecondaryButton from '@commercetools-uikit/secondary-button';
import Spacings from '@commercetools-uikit/spacings';
import { Form, Formik } from 'formik';
import FieldLabel from '@commercetools-uikit/field-label';
import TextInput from '@commercetools-uikit/text-input';
import Text from '@commercetools-uikit/text';
import { AppDraft } from '../../../../types/app';

type Props = {
  onSubmit: (app: AppDraft) => Promise<void>;
  onDeleteApp: (app: AppDraft) => Promise<void>;
  onCancel: () => void;
  app?: AppDraft;
};

const NewAppForm = ({
  onSubmit,
  onDeleteApp,
  onCancel,
  app = {
    name: '',
    description: '',
  } as AppDraft,
}: Props) => {
  const handleValidation = (values: AppDraft) => {
    const errors: Record<keyof AppDraft, string> = {} as never;
    if (!values.name) {
      errors['name'] = 'Required';
    }

    return errors;
  };

  return (
    <Spacings.Stack scale="l">
      <Formik
        initialValues={app}
        onSubmit={onSubmit}
        validateOnBlur
        validate={handleValidation}
      >
        {({ values, errors, handleChange, submitForm }) => (
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
                <PrimaryButton
                  label="Save"
                  onClick={submitForm}
                  type="button"
                />
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
              <Grid.Item gridColumn="span 2">
                <Spacings.Inline alignItems="center">
                  <FieldLabel title="Description" />
                  <TextInput
                    value={values?.description}
                    name="description"
                    onChange={handleChange}
                  />
                </Spacings.Inline>
                {errors.description && (
                  <Text.Caption tone="warning">
                    {errors.description}
                  </Text.Caption>
                )}
              </Grid.Item>
            </Grid>
          </Form>
        )}
      </Formik>
      <Spacings.Inline alignItems="center" justifyContent="flex-end">
        <PrimaryButton
          label="Delete app"
          onClick={() => onDeleteApp(app)}
          type="button"
          tone="critical"
        />
      </Spacings.Inline>
    </Spacings.Stack>
  );
};
export default NewAppForm;
