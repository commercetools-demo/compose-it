import React from 'react';
import { DynamicPageRendererProps } from './types';
import ComponentRenderer from './component-renderer';
import {
  FormModalPage,
  useModalState,
} from '@commercetools-frontend/application-components';
import { usePropsBinding } from '../library/hooks/use-props-binding';
import { useHistory } from 'react-router-dom';

const ModalPageRenderer: React.FC<DynamicPageRendererProps> = ({
  pageConfig,
  parentUrl,
}) => {
  const formModalState = useModalState(true);
  const { setPropsBinding, removeEmptyProps } = usePropsBinding();
  const { replace } = useHistory();

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
      hideControls
      {...(pageConfig?.props || {})}
      onClose={() =>
        parentUrl ? replace(parentUrl) : formModalState.closeModal()
      }
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
