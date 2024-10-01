
import { Col, Pagination } from 'antd';
import styled from 'styled-components';

export const WrapperProducts = styled.div`
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  justify-content: center;

  @media screen and (max-width: 576px) {
    gap: 8px;
  }
`;

export const WrapperNavbar = styled(Col)`
  background: #fff;
  margin-right: 10px;
  padding: 10px;
  border-radius: 4px;
  height: fit-content;
  margin-top: 20px;
  width: 100%;

  @media screen and (min-width: 768px) {
    width: 200px;
  }
`;

export const WrapperPagination = styled(Pagination)`
  margin-top: 10px;

  @media screen and (max-width: 576px) {
    margin-bottom: 20px;
  }
`;
