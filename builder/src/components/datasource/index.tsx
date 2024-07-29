import React from 'react';
import DatasourceList from './list';
import styled from 'styled-components';
import NewDatasource from './new-datasource';

const FlexDiv = styled.div`
  display: flex;
  flex-direction: row;
`;

const Datasources = () => {
  return (
    <FlexDiv>
      <DatasourceList />
      <NewDatasource />
    </FlexDiv>
  );
};

export default Datasources;
