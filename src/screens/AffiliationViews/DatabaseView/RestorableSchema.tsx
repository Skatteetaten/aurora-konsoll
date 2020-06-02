import React from 'react';
import styled from 'styled-components';
import TextField from '@skatteetaten/frontend-components/TextField';
import { TextFieldEvent } from '../../../types/react';
import {
  IDatabaseSchema,
  IRestorableDatabaseSchemas
} from '../../../models/schemas';
import { EnterModeThenConfirm } from './EnterModeThenConfirm';

export interface IRestorableSchemaProps {
  className?: string;
  affiliation: string;
  restorableDatabaseSchemas?: IRestorableDatabaseSchemas;
  onComponentMounted: (affiliation: string) => void;
}

export interface IRestorableSchemaState {
  filter: string;
}

export class RestorableSchema extends React.Component<
  IRestorableSchemaProps,
  IRestorableSchemaState
> {
  public state: IRestorableSchemaState = {
    filter: ''
  };

  public componentDidMount(): void {
    this.props.onComponentMounted(this.props.affiliation);
  }

  public render() {
    const { className, affiliation, restorableDatabaseSchemas } = this.props;
    const { filter } = this.state;
    console.log(restorableDatabaseSchemas);
    return (
      <div className={className}>
        <div className="styled-action-bar">
          <div className="styled-input-and-restore">
            <div className="styled-input">
              <TextField
                placeholder="Søk etter skjema"
                onChange={this.onFilterChange}
                value={filter}
              />
            </div>
            <EnterModeThenConfirm
              confirmButtonEnabled={[].length !== 0}
              confirmText="Gjennopprett valgte"
              inactiveIcon="History"
              inactiveText="Velg skjemaer for gjenoppretting"
              onEnterMode={this.onEnterDeletionMode}
              onExitMode={this.onExitDeletionMode}
              onConfirmClick={this.onDeleteSelectionConfirmed}
              iconColor="green"
            />
          </div>
        </div>
      </div>
    );
  }

  private onFilterChange = (event: TextFieldEvent, newValue?: string) => {
    this.setState({ filter: newValue || '' });
  };

  private onExitDeletionMode = () => {};

  private onEnterDeletionMode = () => {};

  private onDeleteSelectionConfirmed = () => {};
}
export default styled(RestorableSchema)`
  height: 100%;
  overflow-x: auto;

  .ms-DetailsRow {
    cursor: pointer;
  }

  .styled-action-bar {
    display: flex;
    align-items: center;
    justify-content: space-between;
    margin: 20px 0 20px 20px;
  }

  .styled-input-and-restore {
    display: flex;
    align-items: center;
  }

  .styled-input {
    width: 300px;
  }

  .styled-create {
    margin-right: 20px;
  }

  .styledTable {
    margin-left: 20px;
    display: flex;
    grid-area: table;
    i {
      float: right;
    }
  }

  .jdbcurl-col {
    font-size: 14px;
  }
`;
