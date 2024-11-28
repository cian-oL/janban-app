import { SortableContext } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { DragOverlay, useDroppable } from "@dnd-kit/core";
import { createPortal } from "react-dom";

import { Column, Issue } from "@/types/kanbanTypes";
import IssueCard from "./IssueCard";

type Props = {
  containerTitle: "Active Board" | "Backlog";
  issues?: Issue[];
  handleDelete: (issue: Issue) => void;
  activeIssue: Issue | null;
};

const BacklogContainer = ({
  containerTitle,
  issues,
  handleDelete,
  activeIssue,
}: Props) => {
  const columnIssueIds: string[] = useMemo(() => {
    if (!issues) {
      return [""];
    }

    return issues.map((issue) => issue.issueCode);
  }, [issues]);

  const { isOver, setNodeRef: DroppableNodeRef } = useDroppable({
    id: containerTitle,
  });

  return (
    <div className="flex flex-col w-full p-5">
      <div className="bg-indigo-600 text-white font-bold cursor-grab rounded-t-md  border border-b-2 border-amber-300 p-1 h-16">
        <h2>{containerTitle}</h2>
      </div>
      <SortableContext items={columnIssueIds}>
        <div
          ref={DroppableNodeRef}
          className={`flex flex-col flex-1 gap-4 p-2 overflow-x-hidden overflow-y-auto bg-indigo-300 border border-amber-300 ${
            isOver && "border-4 border-amber-600"
          }`}
        >
          {issues?.map((issue) => (
            <IssueCard
              key={issue.issueCode}
              issue={issue}
              handleDelete={handleDelete}
            />
          ))}
        </div>
      </SortableContext>
      {createPortal(
        <DragOverlay>
          {activeIssue && (
            <IssueCard issue={activeIssue} handleDelete={handleDelete} />
          )}
        </DragOverlay>,
        document.body
      )}
    </div>
  );
};

export default BacklogContainer;
