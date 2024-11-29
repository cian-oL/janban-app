import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragStartEvent,
  DragEndEvent,
} from "@dnd-kit/core";
import { arrayMove, sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import { kanbanColumns } from "../config/kanbanConfig";
import KanbanColumnContainer from "./KanbanColumnContainer";
import { Issue } from "../types/kanbanTypes";
import { Button } from "./ui/button";

type Props = {
  issues?: Issue[];
  handleUpdateIssue: (issueWithUpdatedData: Issue) => void;
  handleDeleteIssue: (issueToDelete: Issue) => void;
};

const KanbanBoard = ({
  issues,
  handleUpdateIssue,
  handleDeleteIssue,
}: Props) => {
  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 4,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragStart = (e: DragStartEvent) => {
    setActiveIssue(e.active.data.current?.issue);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over || !issues) {
      return;
    }

    const activeIssueId = active.id;
    const activeIssueColumnId = active.data.current?.issue.columnId;
    const overId = over.id;

    // setIssues((issues) => {
    const activeIssueIndex = issues.findIndex(
      (issue) => issue.issueCode === activeIssueId
    );

    if (activeIssueId === overId || activeIssueColumnId === overId) {
      handleUpdateIssue(issues[activeIssueIndex]);
      setActiveIssue(null);
      return arrayMove(issues, activeIssueIndex, activeIssueIndex);
    }

    if (over.data.current?.type === "Column") {
      issues[activeIssueIndex].columnId = overId.toString();
    }

    if (over.data.current?.type === "Issue") {
      issues[activeIssueIndex].columnId = over.data.current.issue.columnId;
    }

    handleUpdateIssue(issues[activeIssueIndex]);
    return arrayMove(issues, activeIssueIndex, activeIssueIndex);
    // });
  };

  return (
    <div className="px-1 flex flex-col">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Link to="/issues/create-issue">
          <Button className="p-0.5 w-full rounded-lg bg-amber-300 text-black font-bold   hover:bg-amber-400 md:w-[10%] md:ml-6">
            Add Issue
          </Button>
        </Link>
        <div className="flex flex-col justify-between items-center px-1 gap-4 md:flex-row">
          {kanbanColumns.map((column) => (
            <KanbanColumnContainer
              key={column.columnId}
              column={column}
              issues={issues?.filter(
                (issue) => issue.columnId === column.columnId
              )}
              handleDeleteIssue={handleDeleteIssue}
              activeIssue={activeIssue}
            />
          ))}
        </div>
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
