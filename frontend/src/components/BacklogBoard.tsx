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
  DragOverlay,
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
    }
  };

  const handleDragEnd = (e: DragEndEvent) => {
    const { active, over } = e;

    if (!over || !issues) {
      setActiveIssue(null);
      return;
    }

    const activeIssueId = active.id;
    const overId = over.id;

    const activeIssueIndex = issues.findIndex(
      (issue) => issue.issueCode === activeIssueId
    );

    if (activeIssueId === overId) {
      setActiveIssue(null);
      return;
    }

    const updatedIssue = { ...issues[activeIssueIndex] };

    if (over.data.current?.type === "Column") {
      updatedIssue.isBacklog = overId === "Backlog";
    } else if (over.data.current?.type === "Issue") {
      updatedIssue.isBacklog = over.data.current.issue.isBacklog;
    }

    handleUpdateIssue(updatedIssue);
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
            column="Active Board"
            issues={issues?.filter((issue) => !issue.isBacklog)}
            handleDeleteIssue={handleDeleteIssue}
          />
          <BacklogContainer
            column="Backlog"
            issues={issues?.filter((issue) => issue.isBacklog)}
            handleDeleteIssue={handleDeleteIssue}
          />
        </div>
        <DragOverlay>
          {activeIssue ? (
            <div className="w-[100px] p-4 rounded-lg border border-white bg-indigo-800 opacity-50 text-white">
              <p className="font-bold underline text-sm hover:text-amber-400">
                {activeIssue.issueCode}
              </p>
            </div>
          ) : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
};

export default BacklogBoard;
