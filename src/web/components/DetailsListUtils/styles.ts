import styled from 'styled-components';

// wraps around all contents in the view
export const ViewContainer = styled.div`
  display: flex;
  flex-direction: column;
  height: 100%;
  margin: 0 20px;
`;

// wraps around everything in the ActionBar e.g. searchfield, loadingbutton
export const ActionBarContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin: 20px 0;
`;

// wraps around loadingbutton and other buttons on the right side of the ActionBar
export const ActionBarButtonsContainer = styled.div`
  display: flex;
  align-items: center;
`;

// wraps around the DetailsList
export const TableContainer = styled.div`
  .ms-DetailsRow {
    cursor: pointer;
  }

  position: relative;
  flex: 1;
  display: flex;
  grid-area: table;
`;

export const BoldParagraph = styled.p`
  font-weight: bold;
`;

export const MessageBarContent = styled.div`
  overflow: auto;
  max-height: 200px;
`;
