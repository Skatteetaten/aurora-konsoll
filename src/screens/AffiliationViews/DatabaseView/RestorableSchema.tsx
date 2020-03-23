import React from 'react';
import TextField from '@skatteetaten/frontend-components/TextField';
import { TextFieldEvent } from '../../../types/react';
import {IDatabaseSchema, IRestorableDatabaseSchemas} from "../../../models/schemas";

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
