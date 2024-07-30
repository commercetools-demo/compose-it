import Spacings from '@commercetools-uikit/spacings';
import Apps from '../apps-list';
import Datasources from '../datasource';
import Text from '@commercetools-uikit/text';
import styled from 'styled-components';

const StyledDiv = styled.div`
  padding-top: 32px;
`;

const Divider = styled.div`
  height: 1px;
  background-color: #f0f0f0;
  margin-top: 32px;
  margin-bottom: 32px;
`;

const Home = () => {
  return (
    <StyledDiv>
      <Spacings.Stack scale="xxl">
        <Text.Headline as="h1">COMPOSE IT</Text.Headline>
        <Apps />
        <Divider />
        <Datasources />
      </Spacings.Stack>
    </StyledDiv>
  );
};

export default Home;
