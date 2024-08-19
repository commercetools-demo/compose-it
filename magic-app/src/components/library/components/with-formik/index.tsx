import React from 'react';
import { useFormikContext } from 'formik';
import get from 'lodash/get';
type WithFormikInputProps = {
  name?: string;
  [key: string]: any;
};

function withFormikInput<T extends WithFormikInputProps>(
  WrappedComponent: React.ComponentType<T>
) {
  return function FormikInput(props: T) {
    const { values = null, handleChange = () => {} } = useFormikContext() || {};

    if (!props.name) {
      return null;
    }

    return (
      <WrappedComponent
        {...props}
        value={!!values ? get(values, props.name) : props.value}
        isDisabled={!values}
        onChange={(e) => {
          console.log('e', e.target.value);
          handleChange(e);
        }}
      />
    );
  };
}

export default withFormikInput;
