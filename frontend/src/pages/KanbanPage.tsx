import { toast } from "sonner";

import {
  useDeleteIssue,
  useGetAllIssues,
  useUpdateIssue,
} from "@/hooks/useIssue";
import KanbanBoard from "@/components/KanbanBoard";
import { Issue } from "@/types/kanbanTypes";
import LoadingSpinner from "@/components/LoadingSpinner";

const KanbanPage = () => {
  const { data: issues, isLoading: isGetLoading } = useGetAllIssues();
  const { mutateAsync: updateIssue } = useUpdateIssue();
  const { mutateAsync: deleteIssue } = useDeleteIssue();

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
