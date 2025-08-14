import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import IssueManagementForm from "@/components/forms/IssueManagementForm";
import { useCreateIssue } from "@/hooks/useIssue";

import type { Issue } from "../types/kanbanTypes";

const CreateIssuePage = () => {
  const navigate = useNavigate();
  const { mutateAsync: createIssue, isPending: isLoading } = useCreateIssue();

  const handleSave = (
    formData: Omit<Issue, "_id" | "createdAt" | "lastUpdated">,
  ) => {
    try {
      createIssue(formData).then((issue: Issue) => {
        toast.success(`Issue ${issue.issueCode} created`);
        navigate("/kanban");
      });
    } catch (err) {
      console.log("Error creating issue:", err);
      toast.error("Error creating issue. Please try again");
    }
  };

  return (
    <div className="mx-auto w-full rounded-lg border border-amber-300 bg-indigo-100 p-10">
      <h1 className="text-3xl font-bold">Create Issue</h1>
      <IssueManagementForm onSave={handleSave} isLoading={isLoading} />
    </div>
  );
};

export default CreateIssuePage;
