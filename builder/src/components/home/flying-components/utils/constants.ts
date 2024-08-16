export const DEFAULT_REACT_CODE = `
    import React from 'react';
    import Text from '@commercetools-uikit/text';
    import Card from '@commercetools-uikit/card';

    const CustomComponent: React.FC = () => {
        return (
        <Card>
            <Text.Headline as="h1">Hello, Custom Component!</Text.Headline>
        </Card>
        );
    };

    export default CustomComponent;
    `;
