// src/components/form-builder/index.tsx

import React, { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';
import { Form as FormikForm, Formik } from 'formik';
import { useAppConfig } from '../../../providers/app-config';
import * as syncActions from '@commercetools/sync-actions';

interface FormProps {
  action?: string;
  initialData?: any;
  actionType?: string;
}

const Form: React.FC<PropsWithChildren<FormProps>> = ({
  children,
  actionType,
  action,
  initialData,
}) => {
  const { actions } = useAppConfig();

  const theAction = actions.find((a) => a.key === action);

  console.log('actionType', actionType);
  console.log('actions', Object.keys(syncActions));
  

  const submit = (values: any) => {
    const syncCustomers = createSyncCustomers();

    console.log('values', values, initialData);

    const actions = syncCustomers.buildActions(initialData, values);
    console.log('blah', actions);
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
              <FormikForm>{children}</FormikForm>
              <div>
                <button type="button" onClick={submitForm} className="primary">
                  Submit
                </button>
              </div>
            </>
          )}
        </Formik>
      </div>
    </div>
  );
};

Form.propTypes = {
  action: PropTypes.string,
  initialData: PropTypes.string,
};

Form.defaultProps = {};

export default Form;
