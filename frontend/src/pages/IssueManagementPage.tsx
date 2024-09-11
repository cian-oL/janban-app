import { useNavigate } from "react-router-dom";

import { toast } from "sonner";
import IssueManagementForm from "../forms/IssueManagementForm";
import { IssueFormData } from "../types/kanbanTypes";
import {
  useGetIssueByIssueCode,
  useUpdateIssueByFormData,
} from "../api/issueApiClient";
import LoadingSpinner from "@/components/LoadingSpinner";

const IssueManagementPage = () => {
  const navigate = useNavigate();
  const { currentIssue, isLoading: isGetLoading } = useGetIssueByIssueCode();
  const { updateIssue, isLoading: isUpdateLoading } =
    useUpdateIssueByFormData();

  const handleSave = (formData: IssueFormData) => {
    updateIssue(formData).then(() => {
      toast.success("Issue successfully updated");
      navigate("/kanban");
    });
  };

  return (
    <div className="w-full p-10 mx-auto border rounded-lg border-amber-300 bg-indigo-100">
      <h1 className="mx-2 text-2xl font-bold underline">Manage Issue</h1>
      <p className="mx-2 text-sm italic">View and Edit an Issue's Details</p>
      {isGetLoading ? (
        <LoadingSpinner />
      ) : (
        <IssueManagementForm
          currentIssue={currentIssue}
          onSave={handleSave}
          isLoading={isUpdateLoading}
        />
      )}
    </div>
  );
};

export default IssueManagementPage;
