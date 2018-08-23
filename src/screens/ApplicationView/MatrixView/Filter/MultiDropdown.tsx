import * as React from 'react';

import Dropdown, {
  IDropdownOption
} from 'aurora-frontend-react-komponenter/Dropdown';
import Grid from 'aurora-frontend-react-komponenter/Grid';
import IconButton from 'aurora-frontend-react-komponenter/IconButton';
import styled from 'styled-components';
import { toDropdownOptions } from 'utils/aurora-frontend';

export type MultiDropdownOptions = IDropdownOption & { selected: boolean };

interface IMultiDropdownProps {
  selectedKeys: string[];
  onChanged: (value: MultiDropdownOptions) => void;
  handleClearSelectedKeys: () => void;
  options: string[];
  placeHolder: string;
}

const DropdownWrapper = styled.div`
  > div {
    padding: 9px 0;
  }
`;

const MulitDropdown = ({
  onChanged,
  selectedKeys,
  handleClearSelectedKeys,
  options,
  placeHolder
}: IMultiDropdownProps) => (
  <Grid>
    <Grid.Row>
      <Grid.Col lg={10}>
        <DropdownWrapper>
          <Dropdown
            placeHolder={placeHolder}
            options={toDropdownOptions(options)}
            multiSelect={true}
            onChanged={onChanged}
            selectedKeys={selectedKeys}
          />
        </DropdownWrapper>
      </Grid.Col>
      {selectedKeys.length > 0 && (
        <Grid.Col lg={2}>
          <IconButton
            title="Fjern alle"
            buttonType="large"
            icon="Delete"
            onClick={handleClearSelectedKeys}
          />
        </Grid.Col>
      )}
    </Grid.Row>
  </Grid>
);

export default MulitDropdown;