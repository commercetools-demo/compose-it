// src/components/form-builder/index.tsx

import React, { PropsWithChildren } from 'react';
import PropTypes from 'prop-types';

interface LoopProps {
  data?: any[];
}

const Loop: React.FC<PropsWithChildren<LoopProps>> = ({ children }) => {
  return (
    <div className="loop-builder">
      <div className="loop-content">{children}</div>
    </div>
  );
};

Loop.propTypes = {
  data: PropTypes.array,
};

Loop.defaultProps = {
  data: [],
};

export default Loop;
