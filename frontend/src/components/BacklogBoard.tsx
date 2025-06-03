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
    }),
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
      (issue) => issue.issueCode === activeIssueId,
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
    <div className="flex flex-col items-center lg:items-start">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <Button className="w-4/5 rounded-lg bg-amber-300 px-4 font-bold text-black hover:bg-amber-400 lg:ml-6 lg:w-fit">
          <Link to="/issues/create-issue">Add Issue</Link>
        </Button>
        <div className="flex w-full flex-col items-center justify-between px-1 md:flex-row">
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
            <div className="w-[100px] rounded-lg border border-white bg-indigo-800 p-4 text-white opacity-50">
              <p className="text-sm font-bold underline hover:text-amber-400">
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
