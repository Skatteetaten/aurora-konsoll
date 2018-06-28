import { default as styled } from 'styled-components';

const MatrixWrapper = styled.div`
  position: relative;
  font-size: 14px;

  table {
    border-spacing: 0;
    border-collapse: collapse;
    table-layout: fixed;
  }

  tbody {
    td {
      &:first-child {
        max-width: 210px;
      }
      max-width: 130px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }

  th,
  td {
    @extend table;
    padding: 15px 50px 15px 15px;
    text-align: left;
    border-bottom: 1px solid #ddd;
    border-top: 1px solid #ddd;
    white-space: nowrap;
  }
`;

export default MatrixWrapper;
