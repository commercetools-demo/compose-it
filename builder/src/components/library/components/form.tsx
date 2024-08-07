// src/components/form-builder/index.tsx

import React, { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';

interface FormProps {
  action?: string;
  actionType?: string;
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
  action: PropTypes.string,
  initialData: PropTypes.string,
  actionType: PropTypes.string,
};

Form.defaultProps = {
  actionType: 'customer',
};

export default Form;
