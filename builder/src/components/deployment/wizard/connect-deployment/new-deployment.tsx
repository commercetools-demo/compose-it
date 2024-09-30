import Spacings from '@commercetools-uikit/spacings';
import { Form, Formik } from 'formik';
import FieldLabel from '@commercetools-uikit/field-label';
import TextInput from '@commercetools-uikit/text-input';
import Text from '@commercetools-uikit/text';
import Grid from '@commercetools-uikit/grid';
import { Drawer } from '@commercetools-frontend/application-components';
import { useState } from 'react';
import { useApplicationContext } from '@commercetools-frontend/application-shell-connectors';
import { useDeploymentContext } from '../../../../providers/deployment';
import { DeploymentDraft } from '../../../../hooks/use-deployment/types/deployment';
import { useAppContext } from '../../../../providers/app';
import { extractRegionFromUrl } from '../../../../providers/deployment/utils';

type Props = {
  onSubmit: (deploymentDraft: DeploymentDraft) => void;
  isOpen: boolean;
  onClose: () => void;
};

const NewDeploymentForm = ({ onSubmit, isOpen, onClose }: Props) => {
  const [isLoading, setIsLoading] = useState(false);
  const context = useApplicationContext((context) => context);
  const { selectedConnector, selectedApp, selectedView } = useDeploymentContext();
  const { appGeneralInfo } = useAppContext();

  const initialData: Partial<DeploymentDraft> = {
    key: '',
    connector: {
      key: selectedConnector?.key || '',
      version: selectedConnector?.version,
      id: selectedConnector?.id || '',
    },
    region: extractRegionFromUrl(context.environment.mcApiUrl) || '',
    configurations: [
      {
        // TODO: move to .env
        applicationName: selectedApp ? 'magic-app' : 'magic-view',
        standardConfiguration: [
          {
            key: 'CUSTOM_APPLICATION_ID',
            value: selectedApp?.id || selectedView?.id || '',
          },
          {
            key: 'APP_KEY',
            value: appGeneralInfo?.key || '',
          },
          {
            key: 'CLOUD_IDENTIFIER',
            value: context.environment.location,
          },
          {
            key: 'ENTRY_POINT_URI_PATH',
            value: selectedApp?.entryPointUriPath ?? 'empty',
          },
          {
            key: 'APPLICATION_URL',
            value: 'https://todo.com',
          },
          {
            key: 'INITIAL_PROJECT_KEY',
            value: context.project?.key || '',
          },
        ],
      },
    ],
  };

  const handleOnSubmit = async (values: DeploymentDraft) => {
    setIsLoading(true);
    onSubmit(values);
    setIsLoading(false);
  };

  const handleValidation = (values: DeploymentDraft) => {
    const errors: Record<
      keyof DeploymentDraft,
      string | Record<string, string>
    > = {} as never;
    if (!values.key) {
      errors['key'] = 'Required';
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
          title={'New Connect Installation'}
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
                  <FieldLabel title="Installation Key" />
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
            </Grid>
          </Form>
        </Drawer>
      )}
    </Formik>
  );
};

export default NewDeploymentForm;
