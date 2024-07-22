export const getComponentProps = (componentType: string) => {
    switch (componentType) {
      case 'Text.Headline':
        return {children: '', as: ''}
      case 'Button':
        return { text: 'Click Me' };
      case 'Card':
        return { type: 'flet', children: '' };
      case 'Page':
        return { layout: {}, children: '' };
      default:
        return {};
    }
}