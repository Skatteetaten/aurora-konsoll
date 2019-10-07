import React, { useEffect } from 'react';
import TextField from 'aurora-frontend-react-komponenter/TextField';
import { ITextField } from 'office-ui-fabric-react';
import { ImageTagType } from 'models/ImageTagType';
import { fetchVersions } from 'store/state/versions/action.creators';
import { connect } from 'react-redux';
import { RootState, ReduxProps } from 'store/types';

const ENTER_KEY = 13;

interface IServerSideSearchProps {
  selectedVersionType: ImageTagType;
  repository: string;
  searchText?: string;
  handleSelectVersionType: (type: ImageTagType) => void;
  handleSetSearchText: (text: string) => void;
}

const mapStateToProps = ({ versions }: RootState) => ({
  isFetchingVersions: versions.isLoading
});

const mapDispatchToProps = {
  fetchVersions
};

type StateProps = ReduxProps<typeof mapDispatchToProps, typeof mapStateToProps>;

type Props = IServerSideSearchProps & StateProps;

const ServerSideSearch = ({
  selectedVersionType,
  handleSelectVersionType,
  handleSetSearchText,
  repository,
  fetchVersions,
  searchText,
  isFetchingVersions
}: Props) => {
  let searchRef: ITextField | undefined;
  useEffect(() => {
    if (searchRef) {
      searchRef.focus();
    }
  }, [searchRef]);

  const searchOnEnterPress = (e: React.KeyboardEvent<InputEvent>) => {
    if (selectedVersionType !== ImageTagType.SEARCH) {
      handleSelectVersionType(ImageTagType.SEARCH);
    }
    if (e.charCode === ENTER_KEY && !isFetchingVersions) {
      const text = searchRef ? searchRef.value : undefined;
      if (text) {
        handleSetSearchText(text);
        fetchVersions(repository, ImageTagType.SEARCH, 100, true, text);
      }
    }
  };
  return (
    <div style={{ width: 300, marginLeft: 20, marginRight: 6 }}>
      <TextField
        componentRef={(value: ITextField) => {
          if (!searchRef) {
            searchRef = value;
          }
        }}
        value={searchText}
        disabled={isFetchingVersions}
        placeholder="Søk etter versjon"
        iconProps={{ iconName: 'Search' }}
        onKeyPress={searchOnEnterPress}
      />
    </div>
  );
};

export const ServerSideSearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ServerSideSearch);
