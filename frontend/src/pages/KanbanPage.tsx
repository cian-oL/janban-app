import { useEffect } from "react";
import { toast } from "sonner";

import {
  useDeleteIssue,
  useGetAllIssues,
  useUpdateIssue,
} from "@/hooks/useIssueData";
import { useIssuesContext } from "@/contexts/IssueContext";
import KanbanBoard from "@/components/KanbanBoard";
import { Issue } from "@/types/kanbanTypes";
import LoadingSpinner from "@/components/LoadingSpinner";

const KanbanPage = () => {
  const { allIssues, isLoading: isGetLoading } = useGetAllIssues();
  const { updateIssue } = useUpdateIssue();
  const { deleteIssue } = useDeleteIssue();
  const { issues, setIssues } = useIssuesContext();

  useEffect(() => {
    if (allIssues) {
      try {
        setIssues(allIssues);
      } catch (err) {
        console.log(err);
        toast.error("Error displaying all issues");
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
        })
      );

      await updateIssue(issueWithUpdatedData);
    } catch (err) {
      console.log(err);
      toast.error("Error updating issue");
    }
  };

  const handleDeleteIssue = async (issueToDelete: Issue) => {
    try {
      setIssues(
        issues?.filter((issue) => issue.issueCode !== issueToDelete.issueCode)
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
      {isGetLoading ? (
        <LoadingSpinner />
      ) : (
        <KanbanBoard
          issues={issues}
          handleUpdateIssue={handleUpdateIssue}
          handleDeleteIssue={handleDeleteIssue}
        />
      )}
    </>
  );
};

export default KanbanPage;
