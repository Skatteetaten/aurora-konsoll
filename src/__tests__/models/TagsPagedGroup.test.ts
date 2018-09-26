import { ITag, ITagsPaged } from 'services/auroraApiClients';
import { ImageTagType, TagStateManager } from 'services/TagStateManager';

export function createTagsPaged(
  endCursor: string = '',
  hasNextPage: boolean = false,
  tags: ITag[] = []
): ITagsPaged {
  return {
    endCursor,
    hasNextPage,
    tags
  };
}

const tagsPagedGroup = new TagStateManager(
  {
    auroraVersion: createTagsPaged(),
    bugfix: createTagsPaged(),
    latest: createTagsPaged(),
    major: createTagsPaged('test', false, [
      {
        lastModified: '20.03.2018',
        name: '3',
        type: ImageTagType.MAJOR
      }
    ]),
    minor: createTagsPaged(),
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
    tags: []
  });
});

it('should update tags for a given ImageTagType', () => {
  expect(tagsPagedGroup.getTagsPaged(ImageTagType.MAJOR)).toEqual({
    endCursor: 'test',
    hasNextPage: false,
    tags: [
      {
        lastModified: '20.03.2018',
        name: '3',
        type: ImageTagType.MAJOR
      }
    ]
  });

  tagsPagedGroup.updateTagsPaged(
    ImageTagType.MAJOR,
    createTagsPaged('test2', true, [
      {
        lastModified: '23.03.2018',
        name: '4',
        type: ImageTagType.MAJOR
      }
    ])
  );

  expect(tagsPagedGroup.getTagsPaged(ImageTagType.MAJOR)).toEqual({
    endCursor: 'test2',
    hasNextPage: true,
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
