import React from 'react';
import { useFormikContext } from 'formik';

type WithFormikInputProps = {
  name?: string;
  [key: string]: any;
};

function withFormikInput<T extends WithFormikInputProps>(
  WrappedComponent: React.ComponentType<T>
) {
  return function FormikInput(props: T) {
    const { values, handleChange } = useFormikContext();

    if (!props.name) {
      return null;
    }

    return (
      <WrappedComponent
        {...props}
        value={values[props.name]}
        onChange={handleChange}
      />
    );
  };
}

export default withFormikInput;
