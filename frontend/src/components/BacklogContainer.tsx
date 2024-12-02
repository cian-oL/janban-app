import { SortableContext } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";

import { Issue } from "@/types/kanbanTypes";
import IssueCard from "./IssueCard";

type Props = {
  containerTitle: "Active Board" | "Backlog";
  issues?: Issue[];
  handleDeleteIssue: (issue: Issue) => void;
};

const BacklogContainer = ({
  containerTitle,
  issues,
  handleDeleteIssue,
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
      <div className="bg-indigo-600 text-white font-bold rounded-t-md border border-b-2 border-amber-300 p-1 h-16">
        <h2>{containerTitle}</h2>
      </div>
      <SortableContext items={columnIssueIds}>
        <div
          ref={DroppableNodeRef}
          className={`flex flex-col flex-1 gap-4 p-2 pb-20 overflow-x-hidden overflow-y-auto bg-indigo-300 border-2 transition-all duration-75 ${
            isOver
              ? "border-amber-500 bg-slate-500 shadow-inner"
              : "border-amber-300"
          }`}
        >
          {issues?.map((issue) => (
            <IssueCard
              key={issue.issueCode}
              issue={issue}
              handleDeleteIssue={handleDeleteIssue}
            />
          ))}
        </div>
      </SortableContext>
    </div>
  );
};

export default BacklogContainer;
