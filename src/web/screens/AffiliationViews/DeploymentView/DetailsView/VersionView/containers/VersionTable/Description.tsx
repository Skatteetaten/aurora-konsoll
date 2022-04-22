import { ImageTagType } from 'web/models/ImageTagType';
import * as React from 'react';

const Description = (props: {
  versionType: ImageTagType;
  numberOfVersions: number;
  searchText: string;
}) => {
  const { versionType, numberOfVersions, searchText } = props;
  const prefix =
    numberOfVersions > 0 ? `Viser ${numberOfVersions}` : 'Fant ingen';
  const [er, e] = numberOfVersions === 1 ? ['', ''] : ['er', 'e'];

  // prettier-ignore
  // Prettier vil legge inn unødvendig mange linjeskift her. Denne trenger ikke å ta så mye plass.
  switch (versionType) {
        case ImageTagType.AURORA_VERSION: return <>{prefix} Aurora-versjon{er}.</>;
        case ImageTagType.AURORA_SNAPSHOT_VERSION: return <>{prefix} unik{e} <i>snapshot</i>-versjon{er}.</>;
        case ImageTagType.BUGFIX: return <>{prefix} <i>bugfix</i>-versjon{er}.</>;
        case ImageTagType.LATEST: return <>{prefix} <i>latest</i>-versjon{er}.</>;
        case ImageTagType.MAJOR: return <>{prefix} <i>major</i>-versjon{er}.</>;
        case ImageTagType.MINOR: return <>{prefix} <i>minor</i>-versjon{er}.</>;
        case ImageTagType.SNAPSHOT: return <>{prefix} <i>snapshot</i>-versjon{er}.</>;
        case ImageTagType.COMMIT_HASH: return <>{prefix} <i>commit hash</i>-versjon{er}.</>;
        default: return <>{prefix} resultat{er} av søk etter "{searchText}".</>;
    }
};

export default Description;
