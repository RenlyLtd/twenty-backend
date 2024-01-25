import { Sort } from '@/object-record/object-sort-dropdown/types/Sort';
import { SortDefinition } from '@/object-record/object-sort-dropdown/types/SortDefinition';
import { turnSortsIntoOrderBy } from '@/object-record/object-sort-dropdown/utils/turnSortsIntoOrderBy';

const sortDefinition: SortDefinition = {
  fieldMetadataId: 'id',
  label: 'definition label',
  iconName: 'icon',
};

describe('turnSortsIntoOrderBy', () => {
  it('should sort by createdAt if no sorts and createdAt field exists', () => {
    const fields = [{ id: 'field1', name: 'createdAt' }];
    expect(turnSortsIntoOrderBy([], fields)).toEqual({
      createdAt: 'DescNullsFirst',
    });
  });

  it('should return empty OrderByField if no sorts and no createdAt field', () => {
    expect(turnSortsIntoOrderBy([], [])).toEqual({});
  });

  it('should sort by first field if no sorts and createdAt field do not exists', () => {
    const fields = [{ id: 'field1', name: 'field1' }];
    expect(turnSortsIntoOrderBy([], fields)).toEqual({
      field1: 'DescNullsFirst',
    });
  });

  it('should create OrderByField with single sort', () => {
    const sorts: Sort[] = [
      {
        fieldMetadataId: 'field1',
        direction: 'asc',
        definition: sortDefinition,
      },
    ];
    const fields = [{ id: 'field1', name: 'field1' }];
    expect(turnSortsIntoOrderBy(sorts, fields)).toEqual({
      field1: 'AscNullsFirst',
    });
  });

  it('should create OrderByField with multiple sorts', () => {
    const sorts: Sort[] = [
      {
        fieldMetadataId: 'field1',
        direction: 'asc',
        definition: sortDefinition,
      },
      {
        fieldMetadataId: 'field2',
        direction: 'desc',
        definition: sortDefinition,
      },
    ];
    const fields = [
      { id: 'field1', name: 'field1' },
      { id: 'field2', name: 'field2' },
    ];
    expect(turnSortsIntoOrderBy(sorts, fields)).toEqual({
      field1: 'AscNullsFirst',
      field2: 'DescNullsLast',
    });
  });

  it('should throw error if field not found', () => {
    const sorts: Sort[] = [
      {
        fieldMetadataId: 'invalidField',
        direction: 'asc',
        definition: sortDefinition,
      },
    ];
    expect(() => turnSortsIntoOrderBy(sorts, [])).toThrow(
      'Could not find field invalidField in metadata object',
    );
  });
});
