import React from 'react';
import { get } from 'lodash';
import { ComponentConfig } from '../general';

interface LoopProps {
  data: any[];
  children: React.ReactNode;
}

const Loop: React.FC<LoopProps> = ({ data, children }) => {
  if (!Array.isArray(data) || !children) {
    return null;
  }

  console.log('CHILDREN', children);
 /// TODO: child loop should be outside of data loop
  return (
    <>
      {data.map((item, index) => (
        <React.Fragment key={index}>
          {React.Children.map(children, (child) => {
            if (React.isValidElement<ComponentConfig>(child)) {
              const childProps = { ...child.props };

              // Replace datasource bindings with actual data
              if (child.props.component.config?.propsBindings) {
                Object.keys(
                  child.props.component.config?.propsBindings
                ).forEach((key) => {
                  const binding =
                    child.props.component.config?.propsBindings[key];

                  if (binding.type === 'property') {
                    const blah = get(item, binding.value);
                    console.log(
                      'BOIBI',
                      blah,
                      key,
                      child.props.component.config?.propsBindings[key]
                    );
                    if (blah) {
                      child.props.component.config.propsBindings[key].value =
                        blah;
                    }
                    // childProps.component.props[key] = blah;
                  }
                });
              }

              return React.cloneElement(child, childProps);
            }
            return child;
          })}
        </React.Fragment>
      ))}
    </>
  );
};

export default Loop;
