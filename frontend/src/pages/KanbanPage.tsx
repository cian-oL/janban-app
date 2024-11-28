import { useEffect } from "react";
import { toast } from "sonner";

import {
  useDeleteIssue,
  useGetAllIssues,
  useUpdateIssue,
} from "@/api/issueApiClient";
import { useIssuesContext } from "@/contexts/IssueContext";
import KanbanBoard from "@/components/KanbanBoard";
import { set } from "zod";

const KanbanPage = () => {
  const { allIssues, isLoading: isGetLoading } = useGetAllIssues();
  const { updateIssue, isLoading: isUpdateLoading } = useUpdateIssue();
  const { deleteIssue, isLoading: isDeleteLoading } = useDeleteIssue();
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

  const handleUpdateIssue = async (issue: Issue) => {
    try {
      // START HERE
      await updateIssue(issue);
    } catch (err) {
      console.log(err);
      toast.error("Error updating issue");
    }
  };

  return <KanbanBoard issues={issues} />;
};

export default KanbanPage;
