import React, { useEffect, KeyboardEvent, useRef } from 'react';
import TextField from '@skatteetaten/frontend-components/TextField';
import { ITextField } from 'office-ui-fabric-react/lib-commonjs';
import { ImageTagType } from 'models/ImageTagType';
import {
  fetchVersions,
  clearStateForType
} from 'store/state/versions/action.creators';
import { connect } from 'react-redux';
import { RootState, ReduxProps } from 'store/types';

const ENTER_KEY = 13;

interface IServerSideSearchProps {
  selectedVersionType: ImageTagType;
  repository: string;
  handleSelectVersionType: (type: ImageTagType) => void;
  handleSetSearchText: (text: string) => void;
}

const mapStateToProps = (
  { versions }: RootState,
  { selectedVersionType }: IServerSideSearchProps
) => ({
  isFetchingVersions: versions.isFetching[selectedVersionType]
});

const mapDispatchToProps = {
  fetchVersions,
  clearStateForType
};

type StateProps = ReduxProps<typeof mapDispatchToProps, typeof mapStateToProps>;

type Props = IServerSideSearchProps & StateProps;

const ServerSideSearch = ({
  selectedVersionType,
  handleSelectVersionType,
  handleSetSearchText,
  repository,
  fetchVersions,
  isFetchingVersions,
  clearStateForType
}: Props) => {
  const textFieldRef = useRef<ITextField | null>();
  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [textFieldRef]);

  const searchOnEnterPress = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (selectedVersionType !== ImageTagType.SEARCH) {
      handleSelectVersionType(ImageTagType.SEARCH);
    }
    if (e.charCode === ENTER_KEY && !isFetchingVersions) {
      const text = textFieldRef.current
        ? textFieldRef.current.value
        : undefined;
      if (text) {
        handleSetSearchText(text);
        clearStateForType(ImageTagType.SEARCH);
        fetchVersions(repository, ImageTagType.SEARCH, 100, true, text);
      }
    }
  };
  return (
    <div style={{ width: 300, marginLeft: 20, marginRight: 6 }}>
      <TextField
        componentRef={ref => (textFieldRef.current = ref)}
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
