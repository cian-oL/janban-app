import { useEffect } from "react";
import { toast } from "sonner";

import {
  useDeleteIssue,
  useGetAllIssues,
  useUpdateIssue,
} from "@/hooks/useIssue";
import { useIssuesContext } from "@/contexts/IssueContext";
import BacklogBoard from "@/components/BacklogBoard";
import { Issue } from "@/types/kanbanTypes";
import LoadingSpinner from "@/components/LoadingSpinner";

const BacklogPage = () => {
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
        toast.error("Error fetching issues");
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
      <h1 className="text-xl font-bold bg-orange-500">
        (Under Construction -- limited functionality)
      </h1>
      {isGetLoading ? (
        <LoadingSpinner />
      ) : (
        <BacklogBoard
          issues={issues}
          handleUpdateIssue={handleUpdateIssue}
          handleDeleteIssue={handleDeleteIssue}
        />
      )}
    </>
  );
};

export default BacklogPage;
