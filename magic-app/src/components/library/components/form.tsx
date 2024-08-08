// src/components/form-builder/index.tsx

import React, { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';
import { Form as FormikForm, Formik } from 'formik';
import PrimaryButton from '@commercetools-uikit/primary-button';
import Spacings from '@commercetools-uikit/spacings';

interface FormProps {
  onAction?: (initialData: any, values: any) => Promise<any>;
  initialData?: any;
}

const Form: React.FC<PropsWithChildren<FormProps>> = ({
  children,
  onAction,
  initialData,
}) => {
  const submit = async (values: any) => {
    return onAction?.(initialData, values);
  };

  // wait for initial data to be loaded
  // TODO: show erro that initial data is not loaded
  if (typeof initialData === 'string') {
    return null;
  }

  return (
    <div className="form-builder">
      <div className="form-content">
        <Formik
          initialValues={initialData}
          onSubmit={(values) => submit(values)}
        >
          {({ submitForm }) => (
            <>
              <Spacings.Stack scale="l">
                <FormikForm>{children}</FormikForm>
                <Spacings.Inline scale="l">
                  <PrimaryButton
                    label="Submit"
                    type="button"
                    onClick={submitForm}
                  >
                    Submit
                  </PrimaryButton>
                </Spacings.Inline>
              </Spacings.Stack>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

Form.propTypes = {
  onAction: PropTypes.func,
  initialData: PropTypes.string,
};

Form.defaultProps = {};

export default Form;
