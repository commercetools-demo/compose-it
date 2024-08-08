// src/components/form-builder/index.tsx

import React, { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';

interface FormProps {
  onAction?: string;
  initialData?: string;
}

const Form: React.FC<PropsWithChildren<FormProps>> = ({ children }) => {
  return (
    <div className="form-builder">
      <div className="form-content">{children}</div>
    </div>
  );
};

Form.propTypes = {
  onAction: PropTypes.string,
  initialData: PropTypes.string,
};

Form.defaultProps = {
  initialData: '',
};

export default Form;
