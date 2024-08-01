import Spacings from '@commercetools-uikit/spacings';
import { FieldArray, Form, Formik } from 'formik';
import React from 'react';
import IconButton from '@commercetools-uikit/icon-button';
import TextInput from '@commercetools-uikit/text-input';
import { CloseIcon, PlusBoldIcon } from '@commercetools-uikit/icons';

type Props = {
  value: (string | object)[];
  onChange: (value: (string | object)[]) => void;
};

const formatValue = (item: string | object) => {
  if (typeof item === 'object') {
    return JSON.stringify(item, null, 2);
  }
  return item;
};

const parseValue = (value: string): string | object => {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
};

const ArrayEditorInput: React.FC<Props> = ({ value, onChange }) => {
  return (
    <Formik
      initialValues={{ value }}
      onSubmit={(values) => onChange(values.value)}
      validateOnBlur
      validate={(values) => {
        onChange(values.value.map(parseValue));
        return {}; // Return empty object to satisfy Formik's validate function
      }}
    >
      {({ values, handleChange, setFieldValue }) => (
        <Form>
          <FieldArray name="value">
            {({ insert, remove, push }) => (
              <Spacings.Stack scale="m">
                {values.value.map((item, index) => (
                  <Spacings.Inline key={`value.${index}`}>
                    <TextInput
                      name={`value.${index}`}
                      value={formatValue(item)}
                      onChange={(event) => {
                        setFieldValue(`value.${index}`, event.target.value);
                      }}
                      onBlur={(event) => {
                        const parsedValue = parseValue(event.target.value);
                        setFieldValue(`value.${index}`, parsedValue);
                      }}
                    />
                    <IconButton
                      type="button"
                      label="Remove"
                      onClick={() => remove(index)}
                      icon={<CloseIcon />}
                    />
                  </Spacings.Inline>
                ))}
                <IconButton
                  type="button"
                  label="Add"
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
