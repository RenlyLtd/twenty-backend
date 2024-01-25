import { useEffect } from 'react';

import { useColumnDefinitionsFromFieldMetadata } from '@/object-metadata/hooks/useColumnDefinitionsFromFieldMetadata';
import { useObjectMetadataItem } from '@/object-metadata/hooks/useObjectMetadataItem';
import { useObjectNameSingularFromPlural } from '@/object-metadata/hooks/useObjectNameSingularFromPlural';
import { useRecordTableContextMenuEntries } from '@/object-record/hooks/useRecordTableContextMenuEntries';
import { useRecordTable } from '@/object-record/record-table/hooks/useRecordTable';
import { filterAvailableTableColumns } from '@/object-record/utils/filterAvailableTableColumns';
import { useViewBar } from '@/views/hooks/useViewBar';

type RecordIndexTableContainerEffectProps = {
  objectNamePlural: string;
  recordTableId: string;
  viewBarId: string;
};

export const RecordIndexTableContainerEffect = ({
  objectNamePlural,
  recordTableId,
  viewBarId,
}: RecordIndexTableContainerEffectProps) => {
  const {
    setAvailableTableColumns,
    setOnEntityCountChange,
    setObjectMetadataConfig,
  } = useRecordTable({ recordTableId });

  const { objectNameSingular } = useObjectNameSingularFromPlural({
    objectNamePlural,
  });

  const {
    objectMetadataItem,
    basePathToShowPage,
    labelIdentifierFieldMetadata,
  } = useObjectMetadataItem({
    objectNameSingular,
  });

  const { columnDefinitions, filterDefinitions, sortDefinitions } =
    useColumnDefinitionsFromFieldMetadata(objectMetadataItem);

  const { setEntityCountInCurrentView } = useViewBar({
    viewBarId,
  });

  useEffect(() => {
    if (basePathToShowPage && labelIdentifierFieldMetadata) {
      setObjectMetadataConfig?.({
        basePathToShowPage,
        labelIdentifierFieldMetadataId: labelIdentifierFieldMetadata.id,
      });
    }
  }, [
    basePathToShowPage,
    objectMetadataItem,
    labelIdentifierFieldMetadata,
    setObjectMetadataConfig,
  ]);

  useEffect(() => {
    const availableTableColumns = columnDefinitions.filter(
      filterAvailableTableColumns,
    );

    setAvailableTableColumns(availableTableColumns);
  }, [
    columnDefinitions,
    objectMetadataItem,
    sortDefinitions,
    filterDefinitions,
    setAvailableTableColumns,
  ]);

  const { setActionBarEntries, setContextMenuEntries } =
    useRecordTableContextMenuEntries({
      objectNamePlural,
      recordTableId,
    });

  useEffect(() => {
    setActionBarEntries?.();
    setContextMenuEntries?.();
  }, [setActionBarEntries, setContextMenuEntries]);

  useEffect(() => {
    setOnEntityCountChange(
      () => (entityCount: number) => setEntityCountInCurrentView(entityCount),
    );
  }, [setEntityCountInCurrentView, setOnEntityCountChange]);

  return <></>;
};
