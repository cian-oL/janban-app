import { SortableContext } from "@dnd-kit/sortable";
import { useMemo } from "react";
import { useDroppable } from "@dnd-kit/core";

import { Issue } from "@/types/kanbanTypes";
import IssueCard from "./IssueCard";

type Props = {
  column: "Active Board" | "Backlog";
  issues?: Issue[];
  handleDeleteIssue: (issue: Issue) => void;
};

const BacklogContainer = ({ column, issues, handleDeleteIssue }: Props) => {
  const columnIssueIds: string[] = useMemo(() => {
    if (!issues) {
      return [""];
    }

    return issues.map((issue) => issue.issueCode);
  }, [issues]);

  const { isOver, setNodeRef: DroppableNodeRef } = useDroppable({
    id: column,
    data: {
      type: "Column",
      column,
    },
  });

  return (
    <div className="flex min-h-[50vh] w-full flex-col p-5 md:min-h-screen">
      <div className="flex h-16 items-center justify-center rounded-t-md border border-b-2 border-amber-300 bg-indigo-600 p-2 font-bold text-white lg:text-sm xl:text-base">
        <h2>{column}</h2>
      </div>
      <SortableContext items={columnIssueIds}>
        <div
          ref={DroppableNodeRef}
          className={`flex flex-1 flex-col gap-4 overflow-y-auto overflow-x-hidden border-2 bg-indigo-300 p-2 pb-20 transition-all duration-75 ${
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
      <div className="b-t-2 flex h-16 items-center justify-center rounded-b-md border border-amber-300 bg-indigo-600 p-2 text-xs font-bold text-white">
        <p>{column}</p>
      </div>
    </div>
  );
};

export default BacklogContainer;
