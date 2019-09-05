import { ImageTagType } from 'models/ImageTagType';
import { ITag, ITagsPaged } from 'models/Tag';
import { TagStateManager } from 'screens/AffiliationViews/DetailsView/TagStateManager';

function createTagsPaged(
  endCursor: string = '',
  hasNextPage: boolean = false,
  tags: ITag[] = [],
  totalCount = 0
): ITagsPaged {
  return {
    endCursor,
    hasNextPage,
    tags,
    totalCount
  };
}

const tagsPagedGroup = new TagStateManager(
  {
    auroraSnapshotVersion: createTagsPaged(),
    auroraVersion: createTagsPaged(),
    bugfix: createTagsPaged(),
    commitHash: createTagsPaged(),
    latest: createTagsPaged(),
    major: createTagsPaged(
      'test',
      false,
      [
        {
          lastModified: '20.03.2018',
          name: '3',
          type: ImageTagType.MAJOR
        }
      ],
      1
    ),
    minor: createTagsPaged(
      'minor',
      false,
      [
        {
          lastModified: '28.03.2018',
          name: '1.2',
          type: ImageTagType.MINOR
        },
        {
          lastModified: '20.03.2018',
          name: '1.1',
          type: ImageTagType.MINOR
        }
      ],
      2
    ),
    snapshot: createTagsPaged()
  },
  () => {
    return;
  }
);

it('should get tags for a given ImageTagType', () => {
  expect(tagsPagedGroup.getTagsPaged(ImageTagType.MAJOR)).toEqual({
    endCursor: 'test',
    hasNextPage: false,
    totalCount: 1,
    tags: [
      {
        lastModified: '20.03.2018',
        name: '3',
        type: ImageTagType.MAJOR
      }
    ]
  });
  expect(tagsPagedGroup.getTagsPaged(ImageTagType.AURORA_VERSION)).toEqual({
    endCursor: '',
    hasNextPage: false,
    totalCount: 0,
    tags: []
  });
});

it('should update tags for a given ImageTagType', () => {
  tagsPagedGroup.updateTagsPaged(
    ImageTagType.MAJOR,
    createTagsPaged(
      'test2',
      true,
      [
        {
          lastModified: '23.03.2018',
          name: '4',
          type: ImageTagType.MAJOR
        }
      ],
      2
    )
  );

  expect(tagsPagedGroup.getTagsPaged(ImageTagType.MAJOR)).toEqual({
    endCursor: 'test2',
    hasNextPage: true,
    totalCount: 2,
    tags: [
      {
        lastModified: '20.03.2018',
        name: '3',
        type: ImageTagType.MAJOR
      },
      {
        lastModified: '23.03.2018',
        name: '4',
        type: ImageTagType.MAJOR
      }
    ]
  });
});

it('should update tags and insert new tags in the start of the array for a given ImageTagType', () => {
  expect(tagsPagedGroup.getTagsPaged(ImageTagType.MINOR)).toEqual({
    endCursor: 'minor',
    hasNextPage: false,
    totalCount: 2,
    tags: [
      {
        lastModified: '28.03.2018',
        name: '1.2',
        type: ImageTagType.MINOR
      },
      {
        lastModified: '20.03.2018',
        name: '1.1',
        type: ImageTagType.MINOR
      }
    ]
  });

  tagsPagedGroup.updateTagsPaged(
    ImageTagType.MINOR,
    createTagsPaged(
      'minor2',
      true,
      [
        {
          lastModified: '15.01.2018',
          name: '1.0',
          type: ImageTagType.MINOR
        },
        {
          lastModified: '10.01.2018',
          name: '0.9',
          type: ImageTagType.MINOR
        }
      ],
      4
    )
  );

  tagsPagedGroup.updateTagsPaged(ImageTagType.MINOR, undefined, {
    endCursor: 'minor2',
    hasNextPage: true,
    totalCount: 4,
    tags: [
      {
        lastModified: '28.05.2018',
        name: '1.4',
        type: ImageTagType.MINOR
      },
      {
        lastModified: '01.05.2018',
        name: '1.3',
        type: ImageTagType.MINOR
      }
    ]
  });

  expect(tagsPagedGroup.getTagsPaged(ImageTagType.MINOR)).toEqual({
    endCursor: 'minor2',
    hasNextPage: true,
    totalCount: 4,
    tags: [
      {
        lastModified: '28.05.2018',
        name: '1.4',
        type: ImageTagType.MINOR
      },
      {
        lastModified: '01.05.2018',
        name: '1.3',
        type: ImageTagType.MINOR
      },
      {
        lastModified: '28.03.2018',
        name: '1.2',
        type: ImageTagType.MINOR
      },
      {
        lastModified: '20.03.2018',
        name: '1.1',
        type: ImageTagType.MINOR
      },
      {
        lastModified: '15.01.2018',
        name: '1.0',
        type: ImageTagType.MINOR
      },
      {
        lastModified: '10.01.2018',
        name: '0.9',
        type: ImageTagType.MINOR
      }
    ]
  });
});
