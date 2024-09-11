import { useNavigate } from "react-router-dom";

import { toast } from "sonner";
import IssueManagementForm from "@/forms/IssueManagementForm";
import { IssueFormData } from "../types/kanbanTypes";
import { useCreateIssue } from "@/api/issueApiClient";

const CreateIssuePage = () => {
  const navigate = useNavigate();
  const { createIssue, isLoading } = useCreateIssue();

  const handleSave = (formData: IssueFormData) => {
    createIssue(formData).then(() => {
      toast.success("Issue successfully created");
      navigate("/kanban");
    });
  };

  return (
    <div className="w-full p-10 mx-auto border rounded-lg border-amber-300 bg-indigo-100">
      <h1 className="text-3xl font-bold">Create Issue</h1>
      <IssueManagementForm onSave={handleSave} isLoading={isLoading} />
    </div>
  );
};

export default CreateIssuePage;
