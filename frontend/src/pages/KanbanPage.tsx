import { useEffect } from "react";
import { toast } from "sonner";

import {
  useDeleteIssue,
  useGetAllIssues,
  useUpdateIssue,
} from "@/hooks/useIssue";
import { useIssuesContext } from "@/contexts/IssuesContext";
import KanbanBoard from "@/components/KanbanBoard";
import { Issue } from "@/types/kanbanTypes";
import LoadingSpinner from "@/components/LoadingSpinner";

type Props = {
  type: "active-board" | "backlog";
};

const KanbanPage = ({ type }: Props) => {
  const { data: allIssues, isLoading: isGetLoading } = useGetAllIssues();
  const { mutateAsync: updateIssue } = useUpdateIssue();
  const { mutateAsync: deleteIssue } = useDeleteIssue();
  const { issues, setIssues } = useIssuesContext();

  useEffect(() => {
    if (allIssues) {
      try {
        setIssues(allIssues);
      } catch (err) {
        console.log(err);
        toast.error("Error fetching issues. Please refresh page");
      }
    }
  }, [allIssues, setIssues]);

  const handleUpdateIssue = async (issueWithUpdatedData: Issue) => {
    try {
      setIssues((prevIssues) =>
        prevIssues?.map((issue) => {
          if (issue.issueCode === issueWithUpdatedData.issueCode) {
            return issueWithUpdatedData;
          }
          return issue;
        }),
      );

      await updateIssue(issueWithUpdatedData);
    } catch (err) {
      console.log(err);
      toast.error("Error updating issue. Please try again");
    }
  };

  const handleDeleteIssue = async (issueToDelete: Issue) => {
    try {
      setIssues(
        issues?.filter((issue) => issue.issueCode !== issueToDelete.issueCode),
      );

      await deleteIssue(issueToDelete);
      toast.success("Issue deleted");
    } catch (err) {
      console.log(err);
      toast.error("Error deleting issue");
    }
  };

  return (
    <>
      <h1>{"Project: Kanban"}</h1>
      {isGetLoading ? (
        <LoadingSpinner />
      ) : (
        <KanbanBoard
          type={type}
          issues={issues}
          handleUpdateIssue={handleUpdateIssue}
          handleDeleteIssue={handleDeleteIssue}
        />
      )}
    </>
  );
};

export default KanbanPage;
