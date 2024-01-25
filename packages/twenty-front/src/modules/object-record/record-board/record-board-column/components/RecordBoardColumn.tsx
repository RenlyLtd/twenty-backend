import styled from '@emotion/styled';
import { Droppable } from '@hello-pangea/dnd';
import { useRecoilValue } from 'recoil';

import { RecordBoardColumnContext } from '@/object-record/record-board/contexts/RecordBoardColumnContext';
import { useRecordBoardStates } from '@/object-record/record-board/hooks/internal/useRecordBoardStates';
import { RecordBoardColumnCardsContainer } from '@/object-record/record-board/record-board-column/components/RecordBoardColumnCardsContainer';
import { RecordBoardColumnHeader } from '@/object-record/record-board/record-board-column/components/RecordBoardColumnHeader';
import { BoardCardIdContext } from '@/object-record/record-board-deprecated/contexts/BoardCardIdContext';

const StyledColumn = styled.div<{ isFirstColumn: boolean }>`
  background-color: ${({ theme }) => theme.background.primary};
  border-left: 1px solid
    ${({ theme, isFirstColumn }) =>
      isFirstColumn ? 'none' : theme.border.color.light};
  display: flex;
  flex-direction: column;
  max-width: 200px;
  min-width: 200px;

  padding: ${({ theme }) => theme.spacing(2)};
  position: relative;
`;

type RecordBoardColumnProps = {
  recordBoardColumnId: string;
};

export const RecordBoardColumn = ({
  recordBoardColumnId,
}: RecordBoardColumnProps) => {
  const {
    isFirstColumnFamilyState,
    isLastColumnFamilyState,
    columnsFamilySelector,
  } = useRecordBoardStates();
  const columnDefinition = useRecoilValue(
    columnsFamilySelector(recordBoardColumnId),
  );

  const isFirstColumn = useRecoilValue(
    isFirstColumnFamilyState(recordBoardColumnId),
  );

  const isLastColumn = useRecoilValue(
    isLastColumnFamilyState(recordBoardColumnId),
  );

  if (!columnDefinition) {
    return null;
  }

  return (
    <RecordBoardColumnContext.Provider
      value={{
        columnDefinition: columnDefinition,
        isFirstColumn: isFirstColumn,
        isLastColumn: isLastColumn,
      }}
    >
      <Droppable droppableId={recordBoardColumnId}>
        {(droppableProvided) => (
          <StyledColumn isFirstColumn={isFirstColumn}>
            <RecordBoardColumnHeader />
            <RecordBoardColumnCardsContainer
              droppableProvided={droppableProvided}
            >
              {[].map((cardId, _index) => (
                <BoardCardIdContext.Provider
                  value={cardId}
                  key={cardId}
                ></BoardCardIdContext.Provider>
              ))}
            </RecordBoardColumnCardsContainer>
          </StyledColumn>
        )}
      </Droppable>
    </RecordBoardColumnContext.Provider>
  );
};
