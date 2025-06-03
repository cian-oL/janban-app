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
  const { data: issues, isLoading: isGetLoading } = useGetAllIssues();
  const { mutateAsync: updateIssue } = useUpdateIssue();
  const { mutateAsync: deleteIssue } = useDeleteIssue();
  // const { issues, setIssues } = useIssuesContext();

  // useEffect(() => {
  //   if (allIssues) {
  //     try {
  //       setIssues(allIssues);
  //     } catch (err) {
  //       console.log(err);
  //       toast.error("Error fetching issues");
  //     }
  //   }
  // }, [allIssues, setIssues]);

  const handleUpdateIssue = async (issueWithUpdatedData: Issue) => {
    try {
      await updateIssue(issueWithUpdatedData);
    } catch (err) {
      console.log(err);
      toast.error("Error updating issue");
    }
  };

  const handleDeleteIssue = async (issueToDelete: Issue) => {
    try {
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
