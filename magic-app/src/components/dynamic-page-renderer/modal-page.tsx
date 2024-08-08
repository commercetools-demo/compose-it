import React from 'react';
import { DynamicPageRendererProps } from './types';
import ComponentRenderer from './component-renderer';
import {
  FormModalPage,
  useModalState,
} from '@commercetools-frontend/application-components';
import { usePropsBinding } from '../library/hooks/use-props-binding';

const ModalPageRenderer: React.FC<DynamicPageRendererProps> = ({
  pageConfig,
  parentUrl,
}) => {
  const formModalState = useModalState(true);
  const { setPropsBinding, removeEmptyProps } = usePropsBinding();

  if (pageConfig?.config?.propsBindings) {
    const props = setPropsBinding(pageConfig.config.propsBindings);

    if (props) {
      pageConfig.props = removeEmptyProps({
        ...pageConfig.props,
        ...props,
      });
    }
  }

  return (
    <FormModalPage
      isOpen={formModalState.isModalOpen}
      title={pageConfig?.props?.title || 'Modal Page'}
      onClose={formModalState.closeModal}
      onPrimaryButtonClick={formModalState.closeModal}
      onSecondaryButtonClick={formModalState.closeModal}
      {...pageConfig?.props || {}}
    >
      <div
        className="dynamic-page"
        style={{
          display: 'grid',
          gridTemplateColumns: `repeat(${pageConfig?.layout?.columns}, 1fr)`,
          gap: '4px',
          position: 'relative',
        }}
      >
        {pageConfig?.components?.map((component) => (
          <ComponentRenderer
            key={component.id}
            component={component}
            parentUrl={parentUrl}
          />
        ))}
      </div>
    </FormModalPage>
  );
};

export default ModalPageRenderer;
