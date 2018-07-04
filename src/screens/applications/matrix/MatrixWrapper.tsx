import { default as styled } from 'styled-components';

const MatrixWrapper = styled.div`
  position: relative;
  font-size: 14px;

  table {
    border-spacing: 0;
    table-layout: fixed;
  }

  thead tr:nth-child(1) th {
    background: white;
    position: sticky;
    top: 0;
    z-index: 10;
  }

  tbody {
    td {
      &:first-child {
        max-width: 210px;
        position: sticky;
        left: 0;
        background: white;
        z-index: 9;
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
    white-space: nowrap;
    border-top: 1px solid #ddd;
  }
`;

export default MatrixWrapper;
