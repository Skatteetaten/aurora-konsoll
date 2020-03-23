import React from 'react';
import TextField from '@skatteetaten/frontend-components/TextField';
import { TextFieldEvent } from '../../../types/react';

export interface IRestorableSchemaProps {
  className?: string;
  affiliation: string;
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

  public render() {
    const { className, affiliation } = this.props;
    const { filter } = this.state;
    return (
      <div className={className}>
        <div className="styled-action-bar">
          <div className="styled-input-and-delete">
            <div className="styled-input">
              <TextField
                placeholder="Søk etter skjema"
                onChange={this.onFilterChange}
                value={filter}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }

  private onFilterChange = (event: TextFieldEvent, newValue?: string) => {
    this.setState({ filter: newValue || '' });
  };
}
