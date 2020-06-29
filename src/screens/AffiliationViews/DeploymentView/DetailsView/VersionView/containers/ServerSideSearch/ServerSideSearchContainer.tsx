import React, { useEffect, KeyboardEvent, useRef, useState } from 'react';
import TextField from '@skatteetaten/frontend-components/TextField';
import LoadingButton from 'components/LoadingButton';

import { ITextField } from 'office-ui-fabric-react/lib-commonjs';
import { ImageTagType } from 'models/ImageTagType';
import {
  fetchVersions,
  clearStateForType,
} from 'store/state/versions/action.creators';
import { connect } from 'react-redux';
import { RootState, ReduxProps } from 'store/types';

import palette from '@skatteetaten/frontend-components/utils/palette';

const { skeColor } = palette;

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
  isFetchingSearchVersions:
    versions.isFetching && selectedVersionType === ImageTagType.SEARCH,
});

const mapDispatchToProps = {
  fetchVersions,
  clearStateForType,
};

type StateProps = ReduxProps<typeof mapDispatchToProps, typeof mapStateToProps>;

type Props = IServerSideSearchProps & StateProps;

const ServerSideSearch = ({
  handleSelectVersionType,
  handleSetSearchText,
  repository,
  fetchVersions,
  isFetchingSearchVersions,
  clearStateForType,
}: Props) => {
  const textFieldRef = useRef<ITextField | null>();
  const [isSearchButtonDisabled, setSearchButtonDisabled] = useState(true);

  useEffect(() => {
    if (textFieldRef.current) {
      textFieldRef.current.focus();
    }
  }, [textFieldRef]);

  const searchOnEnterPress = (
    e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    if (e.charCode === ENTER_KEY) {
      searchOnClick();
    }
  };

  const searchOnClick = () => {
    if (!isFetchingSearchVersions) {
      handleSelectVersionType(ImageTagType.SEARCH);
      const text = textFieldRef.current?.value;
      if (text) {
        handleSetSearchText(text);
        clearStateForType(ImageTagType.SEARCH);
        fetchVersions(repository, ImageTagType.SEARCH, 100, true, text);
      }
    }
  };

  return (
    <>
      <div style={{ width: 300, marginLeft: 20, marginRight: 20 }}>
        <TextField
          componentRef={(ref) => (textFieldRef.current = ref)}
          disabled={isFetchingSearchVersions}
          placeholder="Søk etter versjon"
          onKeyUp={() =>
            !textFieldRef.current?.value
              ? setSearchButtonDisabled(true)
              : setSearchButtonDisabled(false)
          }
          onKeyPress={searchOnEnterPress}
          iconProps={{ iconName: 'Search', style: { color: skeColor.blue } }}
        />
      </div>
      <LoadingButton
        loading={isFetchingSearchVersions}
        buttonStyle="primaryRounded"
        onClick={searchOnClick}
        disabled={isSearchButtonDisabled || isFetchingSearchVersions}
      >
        Søk
      </LoadingButton>
    </>
  );
};

export const ServerSideSearchContainer = connect(
  mapStateToProps,
  mapDispatchToProps
)(ServerSideSearch);
