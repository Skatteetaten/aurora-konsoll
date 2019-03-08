import {
  IDatabaseSchema,
  IDatabaseSchemaInput,
  IDatabaseSchemaView,
  IJdbcUser,
  IUpdateDatabaseSchemaInputWithCreatedBy
} from 'models/schemas';

import { Selection } from 'office-ui-fabric-react/lib/DetailsList';

export enum SortDirection {
  ASC,
  DESC,
  NONE
}

export let selectedIndices: number[] = [];

export const deletionDialogColumns = [
  {
    key: 'column1',
    name: 'Applikasjon',
    fieldName: 'application',
    minWidth: 200,
    maxWidth: 200,
    isResizable: true
  },
  {
    key: 'column2',
    name: 'Miljø',
    fieldName: 'environment',
    minWidth: 200,
    maxWidth: 200,
    isResizable: true
  },
  {
    key: 'column3',
    name: 'Diskriminator',
    fieldName: 'discriminator',
    minWidth: 200,
    maxWidth: 200,
    isResizable: true
  }
];

export const defaultColumns = () => [
  {
    fieldName: 'type',
    isResizable: true,
    key: 0,
    maxWidth: 120,
    minWidth: 120,
    name: 'Type',
    iconName: ''
  },
  {
    fieldName: 'environment',
    isResizable: true,
    key: 1,
    maxWidth: 200,
    minWidth: 200,
    name: 'Miljø',
    iconName: ''
  },
  {
    fieldName: 'application',
    isResizable: true,
    key: 2,
    maxWidth: 200,
    minWidth: 200,
    name: 'Applikasjon',
    iconName: ''
  },
  {
    fieldName: 'discriminator',
    isResizable: true,
    key: 3,
    maxWidth: 200,
    minWidth: 200,
    name: 'Diskriminator',
    iconName: ''
  },
  {
    fieldName: 'createdDate',
    isResizable: true,
    key: 4,
    maxWidth: 120,
    minWidth: 120,
    name: 'Opprettet',
    iconName: ''
  },
  {
    fieldName: 'lastUsedDate',
    isResizable: true,
    key: 5,
    maxWidth: 120,
    minWidth: 120,
    name: 'Sist brukt',
    iconName: ''
  },
  {
    fieldName: 'sizeInMb',
    isResizable: true,
    key: 6,
    maxWidth: 175,
    minWidth: 175,
    name: 'Størrelse (MB)',
    iconName: ''
  },
  {
    fieldName: 'createdBy',
    isResizable: true,
    key: 7,
    maxWidth: 120,
    minWidth: 120,
    name: 'Bruker',
    iconName: ''
  },
  {
    fieldName: 'applicationDeploymentsUses',
    isResizable: true,
    key: 8,
    maxWidth: 120,
    minWidth: 120,
    name: 'I bruk av',
    iconName: ''
  }
];

export const defaultSortDirections = new Array<SortDirection>(
  defaultColumns().length
).fill(SortDirection.NONE);

export const filterDatabaseSchemaView = (filter: string) => {
  return (v: IDatabaseSchemaView) =>
    v.createdBy.includes(filter) ||
    v.application.includes(filter) ||
    v.environment.includes(filter) ||
    v.discriminator.includes(filter) ||
    v.createdDate.includes(filter) ||
    (!v.lastUsedDate || v.lastUsedDate === null
      ? false
      : v.lastUsedDate.includes(filter)) ||
    v.sizeInMb.toString().includes(filter) ||
    v.type.includes(filter);
};

export default class DatabaseSchemaService {
  public sortNextAscending(sortDirection: SortDirection) {
    return (
      sortDirection === SortDirection.NONE ||
      sortDirection === SortDirection.DESC
    );
  }

  public getSelectionDetails(deleteSelectionIds: string[]): string {
    switch (deleteSelectionIds.length) {
      case 1:
        return `Vil du slette dette skjemaet?`;
      default:
        return `Vil du slette disse ${deleteSelectionIds.length} skjemaene?`;
    }
  }

  public toListIndex(
    index: number,
    selection: Selection,
    items: IDatabaseSchemaView[]
  ) {
    const viewItems = selection.getItems();
    const viewItem = viewItems[index];
    return items.findIndex(listItem => listItem === viewItem);
  }

  public toViewIndex(
    index: number,
    selection: Selection,
    items: IDatabaseSchemaView[]
  ) {
    const listItem = items[index];
    return selection.getItems().findIndex(viewItem => viewItem === listItem);
  }

  public currentSelection = (
    selection: Selection,
    items: IDatabaseSchemaView[]
  ) => {
    const newIndices = selection
      .getSelectedIndices()
      .map(index => this.toListIndex(index, selection, items))
      .filter(index => selectedIndices.indexOf(index) === -1);

    const unselectedIndices = selection
      .getItems()
      .map((item, index) => index)
      .filter(index => selection.isIndexSelected(index) === false)
      .map(index => this.toListIndex(index, selection, items));

    selectedIndices = selectedIndices.filter(
      index => unselectedIndices.indexOf(index) === -1
    );
    selectedIndices = [...selectedIndices, ...newIndices];
  };

  public updateCurrentSelection(
    selection: Selection,
    prevIndices: number[],
    items: IDatabaseSchemaView[]
  ) {
    const intersection = prevIndices.filter(element =>
      selectedIndices.includes(element)
    );

    if (prevIndices.length > 0) {
      for (const i of prevIndices) {
        if (!intersection.includes(i) && selection.isIndexSelected(i)) {
          selection.setIndexSelected(i, false, false);
        }
      }
    }

    const indices = selectedIndices
      .map(index => this.toViewIndex(index, selection, items))
      .filter(index => index !== -1);

    for (const i of indices) {
      if (!intersection.includes(i)) {
        selection.setIndexSelected(i, true, false);
      }
    }
  }

  public createColumns(index: number, sortDirection: SortDirection) {
    const columns = defaultColumns();
    if (index > -1) {
      const currentCol = columns[index];
      if (
        sortDirection === SortDirection.NONE ||
        sortDirection === SortDirection.DESC
      ) {
        currentCol.iconName = 'Down';
      } else if (sortDirection === SortDirection.ASC) {
        currentCol.iconName = 'Up';
      }
    }
    return columns;
  }

  public hasEmptyLabelValues(input: IDatabaseSchemaInput) {
    return (
      input.application.trim() === '' ||
      input.environment.trim() === '' ||
      input.discriminator.trim() === '' ||
      input.createdBy.trim() === ''
    );
  }

  public hasEmptyJdbcValues(input: IJdbcUser | null | undefined) {
    if (!input || !input.username || !input.password || !input.jdbcUrl) {
      return true;
    } else {
      return (
        input.jdbcUrl.trim() === '' ||
        input.password.trim() === '' ||
        input.username.trim() === ''
      );
    }
  }

  public isUpdateButtonDisabled(
    updatedSchemaValues: IUpdateDatabaseSchemaInputWithCreatedBy,
    schema?: IDatabaseSchema
  ) {
    const isUnchangedValues =
      schema &&
      schema.application === updatedSchemaValues.application &&
      (schema.description === updatedSchemaValues.description ||
        (schema.description === null &&
          updatedSchemaValues.description === '')) &&
      schema.environment === updatedSchemaValues.environment &&
      schema.discriminator === updatedSchemaValues.discriminator &&
      schema.createdBy === updatedSchemaValues.createdBy;

    const isEmpty = this.hasEmptyLabelValues(updatedSchemaValues);

    return isUnchangedValues || isEmpty;
  }

  public sortItems(
    viewItems: IDatabaseSchemaView[],
    prevSortDirection: SortDirection,
    name: string | number | symbol
  ) {
    return viewItems.slice(0).sort((a: any, b: any) => {
      const valueA = this.lowerCaseIfString(a[name]);
      const valueB = this.lowerCaseIfString(b[name]);
      if (valueA === valueB) {
        return 0;
      } else if (this.isDate(valueA) || this.isDate(valueB)) {
        const dateA = this.createDate(valueA).getTime();
        const dateB = this.createDate(valueB).getTime();
        return this.sortNextAscending(prevSortDirection)
          ? dateB - dateA
          : dateA - dateB;
      } else {
        return (this.sortNextAscending(prevSortDirection)
        ? valueA < valueB
        : valueA > valueB)
          ? 1
          : -1;
      }
    });
  }

  private lowerCaseIfString(value: any) {
    return typeof value === 'string' ? (value as string).toLowerCase() : value;
  }

  private isDate(value: any) {
    const dateValidator = /^\d{2}[.]\d{2}[.]\d{4}$/;
    return typeof value === 'string' && (value as string).match(dateValidator);
  }

  private createDate(value: string | null) {
    if (value === null) {
      return new Date(0);
    } else {
      const values = value.split('.');
      return new Date(
        Number(values[2]),
        Number(values[1]) - 1,
        Number(values[0])
      );
    }
  }
}
