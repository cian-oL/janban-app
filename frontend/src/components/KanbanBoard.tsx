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
import {
  useDeleteIssue,
  useGetAllIssues,
  useUpdateIssue,
} from "../api/issueApiClient";
import { Issue } from "../types/kanbanTypes";
import LoadingSpinner from "./LoadingSpinner";
import { Button } from "./ui/button";
import { useIssuesContext } from "@/contexts/IssueContext";

const KanbanBoard = () => {
  const { allIssues, isLoading: isGetLoading } = useGetAllIssues();
  const { updateIssue, isLoading: isUpdateLoading } = useUpdateIssue();
  const { deleteIssue, isLoading: isDeleteLoading } = useDeleteIssue();
  const { issues, setIssues } = useIssuesContext();

  const [activeIssue, setActiveIssue] = useState<Issue | null>(null);

  useEffect(() => {
    if (allIssues) {
      try {
        setIssues(allIssues);
      } catch (err) {
        console.log(err);
        toast.error("Error fetching issues");
      }
    }
  }, [allIssues]);

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

  const handleDelete = (issueToDelete: Issue) => {
    deleteIssue(issueToDelete).then(() => {
      setIssues(
        issues.filter((issue) => issue.issueCode !== issueToDelete.issueCode)
      );
      toast.success("Issue deleted");
    });
  };

  const handleDragStart = (e: DragStartEvent) => {
    setActiveIssue(e.active.data.current?.issue);
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over) {
      return;
    }

    const activeIssueId = active.id;
    const activeIssueColumnId = active.data.current?.issue.columnId;
    const overId = over.id;

    setIssues((issues) => {
      const activeIssueIndex = issues.findIndex(
        (issue) => issue.issueCode === activeIssueId
      );

      if (activeIssueId === overId || activeIssueColumnId === overId) {
        updateIssue(issues[activeIssueIndex]);
        setActiveIssue(null);
        return arrayMove(issues, activeIssueIndex, activeIssueIndex);
      }

      if (over.data.current?.type === "Column") {
        issues[activeIssueIndex].columnId = overId.toString();
      }

      if (over.data.current?.type === "Issue") {
        issues[activeIssueIndex].columnId = over.data.current.issue.columnId;
      }

      updateIssue(issues[activeIssueIndex]);
      return arrayMove(issues, activeIssueIndex, activeIssueIndex);
    });
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
        {isGetLoading || isUpdateLoading || isDeleteLoading ? (
          <LoadingSpinner />
        ) : (
          <div className="flex flex-col justify-between items-center px-1 gap-4 md:flex-row">
            {kanbanColumns.map((column) => (
              <KanbanColumnContainer
                key={column.columnId}
                column={column}
                issues={issues?.filter(
                  (issue) => issue.columnId === column.columnId
                )}
                handleDelete={handleDelete}
                activeIssue={activeIssue}
              />
            ))}
          </div>
        )}
      </DndContext>
    </div>
  );
};

export default KanbanBoard;
