import Spacings from '@commercetools-uikit/spacings';
import { FieldArray, Form, Formik } from 'formik';
import React from 'react';
import FlatButton from '@commercetools-uikit/flat-button';
import { PlusBoldIcon } from '@commercetools-uikit/icons';
import ArrayEditoInputItem from './array-editor-input-item';

type Props = {
  value: object[];
  onChange: (value: object[]) => void;
};

const ArrayEditorInput: React.FC<Props> = ({ value, onChange }) => {
  return (
    <Formik
      initialValues={{ value }}
      onSubmit={(values) => onChange(values.value)}
      validateOnBlur
      validate={(values) => {
        onChange(values.value);
        return {}; // Return empty object to satisfy Formik's validate function
      }}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <FieldArray name="value">
            {({ insert, remove, push }) => (
              <Spacings.Stack scale="m" alignItems="flex-start">
                {values.value.map((item, index) => (
                  <ArrayEditoInputItem
                    key={`value.${index}`}
                    index={index}
                    item={item}
                    handleChange={handleChange}
                    remove={remove}
                  />
                ))}
                <FlatButton
                  type="button"
                  label="Add a new index to the array"
                  icon={<PlusBoldIcon />}
                  onClick={() => push({ key: '', label: '' })}
                />
              </Spacings.Stack>
            )}
          </FieldArray>
        </Form>
      )}
    </Formik>
  );
};

export default ArrayEditorInput;
