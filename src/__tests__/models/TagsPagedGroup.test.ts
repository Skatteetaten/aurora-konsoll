import { ImageTagType, TagsPagedGroup } from 'models/TagsPagedGroup';
import { ITag, ITagsPaged } from 'services/auroraApiClients';

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

const tagsPagedGroup = new TagsPagedGroup({
  auroraVersion: createTagsPaged(),
  bugfix: createTagsPaged(),
  latest: createTagsPaged(),
  major: createTagsPaged('test', false, [
    {
      lastModified: '20.03.2018',
      name: '3'
    }
  ]),
  minor: createTagsPaged(),
  snapshot: createTagsPaged()
});

it('should get tags for a given ImageTagType', () => {
  expect(tagsPagedGroup.getTagsPaged(ImageTagType.MAJOR)).toEqual({
    endCursor: 'test',
    hasNextPage: false,
    tags: [
      {
        lastModified: '20.03.2018',
        name: '3'
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
        name: '3'
      }
    ]
  });

  const nextTagsPagedGroup = tagsPagedGroup.updateTagsPaged(
    ImageTagType.MAJOR,
    createTagsPaged('test2', true, [
      {
        lastModified: '23.03.2018',
        name: '4'
      }
    ])
  );

  expect(nextTagsPagedGroup.getTagsPaged(ImageTagType.MAJOR)).toEqual({
    endCursor: 'test2',
    hasNextPage: true,
    tags: [
      {
        lastModified: '20.03.2018',
        name: '3'
      },
      {
        lastModified: '23.03.2018',
        name: '4'
      }
    ]
  });
});
