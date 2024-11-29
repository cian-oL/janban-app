import { useState } from "react";
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
import { sortableKeyboardCoordinates } from "@dnd-kit/sortable";

import BacklogContainer from "./BacklogContainer";
import { Issue } from "../types/kanbanTypes";
import { Button } from "./ui/button";

type Props = {
  issues?: Issue[];
  handleUpdateIssue: (issueWithUpdatedData: Issue) => void;
  handleDeleteIssue: (issueToDelete: Issue) => void;
};

const BacklogBoard = ({
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
    const issue = e.active.data.current?.issue;
    if (issue) {
      setActiveIssue(issue);

      // Hide the original issue during drag
      const originalIssue = document.querySelector(
        `[data-issue-id="${issue.issueCode}"]`
      );
      if (originalIssue) {
        (originalIssue as HTMLElement).style.opacity = "0";
      }
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over || !issues) {
      // Show the original issue if drag is cancelled
      if (activeIssue) {
        const originalIssue = document.querySelector(
          `[data-issue-id="${activeIssue.issueCode}"]`
        );
        if (originalIssue) {
          (originalIssue as HTMLElement).style.opacity = "1";
        }
      }
      setActiveIssue(null);
      return;
    }

    const activeIssueId = active.id;
    const activeIssueColumnId = active.data.current?.issue.columnId;
    const overId = over.id;

    const activeIssueIndex = issues.findIndex(
      (issue) => issue.issueCode === activeIssueId
    );

    if (activeIssueId === overId || activeIssueColumnId === overId) {
      // Show the original issue if no change
      if (activeIssue) {
        const element = document.querySelector(
          `[data-issue-id="${activeIssue.issueCode}"]`
        );
        if (element) {
          (element as HTMLElement).style.opacity = "1";
        }
      }

      setActiveIssue(null);
      return;
    }

    const updatedIssue = { ...issues[activeIssueIndex] };

    if (over.data.current?.type === "Column") {
      updatedIssue.columnId = overId.toString();
    } else if (over.data.current?.type === "Issue") {
      updatedIssue.columnId = over.data.current.issue.columnId;
    }

    handleUpdateIssue(issues[activeIssueIndex]);
    setActiveIssue(null);
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
          <Button className="p-0.5 w-full rounded-lg bg-amber-300 text-black font-bold hover:bg-amber-400 md:w-[10%] md:ml-6">
            Add Issue
          </Button>
        </Link>
        <div className="flex flex-col justify-between items-center px-1 gap-4">
          <BacklogContainer
            containerTitle="Active Board"
            issues={issues?.filter((issue) => issue.columnId !== "backlog")}
            handleDeleteIssue={handleDeleteIssue}
          />
          <BacklogContainer
            containerTitle="Backlog"
            issues={issues?.filter((issue) => issue.columnId === "backlog")}
            handleDeleteIssue={handleDeleteIssue}
          />
        </div>
      </DndContext>
    </div>
  );
};

export default BacklogBoard;
