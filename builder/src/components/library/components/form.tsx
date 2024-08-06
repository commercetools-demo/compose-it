// src/components/form-builder/index.tsx

import React, { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';

interface FormProps {
  action?: string;
}

const Form: React.FC<PropsWithChildren<FormProps>> = ({ children }) => {
  return (
    <div className="form-builder">
      <div className="form-content">{children}</div>
    </div>
  );
};

Form.propTypes = {
  action: PropTypes.string,
};

Form.defaultProps = {};

export default Form;
