import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

import IssueManagementForm from "../forms/IssueManagementForm";
import { useGetIssue, useUpdateIssueByFormData } from "../hooks/useIssue";
import LoadingSpinner from "@/components/LoadingSpinner";

import type { Issue } from "../types/kanbanTypes";

const IssueManagementPage = () => {
  const navigate = useNavigate();
  const { data: currentIssue, isLoading: isGetLoading } = useGetIssue();
  const { mutateAsync: updateIssue, isPending: isUpdateLoading } =
    useUpdateIssueByFormData();

  const handleSave = (
    formData: Omit<Issue, "_id" | "createdAt" | "lastUpdated">,
  ) => {
    try {
      updateIssue(formData).then(() => {
        toast.success("Issue successfully updated");
        navigate("/kanban");
      });
    } catch (err) {
      console.log("Error updating issue:", err);
      toast.error("Error updating issue. Please try again");
    }
  };

  return (
    <div className="mx-auto my-5 w-full rounded-lg border border-amber-300 bg-indigo-100 p-10 sm:max-w-[90%]">
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
