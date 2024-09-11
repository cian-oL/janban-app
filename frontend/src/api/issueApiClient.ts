import { useMutation, useQuery } from "react-query";
import { useParams } from "react-router-dom";

import { Issue, IssueFormData } from "../types/kanbanTypes";
import { useAxiosInstance } from "./authApiClient";
import { useAuthContext } from "@/auth/AuthContext";
import { toast } from "sonner";

type DeleteIssueResponse = {
  message: string;
};

export const useCreateIssue = () => {
  const axiosInstance = useAxiosInstance();
  const { accessToken } = useAuthContext();

  const createIssueRequest = async (
    formData: IssueFormData
  ): Promise<Issue> => {
    return await axiosInstance
      .post("/api/issues/create-issue", formData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data)
      .catch(() => {
        throw new Error("Failed to create issue");
      });
  };

  const {
    mutateAsync: createIssue,
    error,
    reset,
    isLoading,
  } = useMutation(createIssueRequest);

  if (error) {
    console.log(error.toString());
    toast.error("Failed to create issue");
    reset();
  }

  return { createIssue, isLoading };
};

export const useGetAllIssues = () => {
  const axiosInstance = useAxiosInstance();
  const { accessToken } = useAuthContext();

  const getAllIssues = async (): Promise<Issue[]> => {
    return await axiosInstance
      .get("/api/issues", {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data)
      .catch(() => {
        throw new Error("Failed to fetch all issues");
      });
  };

  const {
    data: allIssues,
    isLoading,
    error,
  } = useQuery("getAllIssues", getAllIssues);

  if (error) {
    console.log(error.toString());
    toast.error("Failed to retrieve issues");
  }

  return { allIssues, isLoading };
};

export const useGetIssueByIssueCode = () => {
  const axiosInstance = useAxiosInstance();
  const { accessToken } = useAuthContext();
  const { issueCode } = useParams();

  const getIssueByIssueCode = async (): Promise<Issue> => {
    return await axiosInstance
      .get(`/api/issues/${issueCode}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data)
      .catch(() => {
        throw new Error("Failed to fetch issue");
      });
  };

  const {
    data: currentIssue,
    error,
    isLoading,
  } = useQuery("getIssueByIssueCode", getIssueByIssueCode);

  if (error) {
    console.log(error.toString());
    toast.error("Failed to retrieve issue");
  }

  return { currentIssue, isLoading };
};

export const useUpdateIssueByFormData = () => {
  const axiosInstance = useAxiosInstance();
  const { accessToken } = useAuthContext();

  const updateIssueByFormData = async (
    issueData: IssueFormData
  ): Promise<Issue> => {
    return await axiosInstance
      .put(`/api/issues/${issueData.issueCode}`, issueData, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data)
      .catch(() => {
        throw new Error("Failed to update issue");
      });
  };

  const {
    mutateAsync: updateIssue,
    error,
    isLoading,
  } = useMutation(updateIssueByFormData);

  if (error) {
    console.log(error.toString());
    toast.error("Failed to upate issue");
  }

  return { updateIssue, isLoading };
};

export const useUpdateIssue = () => {
  const axiosInstance = useAxiosInstance();
  const { accessToken } = useAuthContext();

  const updateIssueRequest = async (issue: Issue): Promise<Issue> => {
    return await axiosInstance
      .put(`/api/issues/${issue.issueCode}`, issue, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data)
      .catch(() => {
        throw new Error("Failed to update issue");
      });
  };

  const {
    mutateAsync: updateIssue,
    error,
    isLoading,
  } = useMutation(updateIssueRequest);

  if (error) {
    console.log(error.toString());
    toast.error("Failed to update issue");
  }

  return { updateIssue, isLoading };
};

export const useDeleteIssue = () => {
  const axiosInstance = useAxiosInstance();
  const { accessToken } = useAuthContext();

  const deleteIssueRequest = async (
    issue: Issue
  ): Promise<DeleteIssueResponse> => {
    return await axiosInstance
      .delete(`/api/issues/${issue.issueCode}`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
        },
      })
      .then((response) => response.data)
      .catch(() => {
        throw new Error("Error occurred furing deletion");
      });
  };

  const {
    mutateAsync: deleteIssue,
    error,
    isLoading,
  } = useMutation(deleteIssueRequest);

  if (error) {
    console.log(error.toString());
    toast.error("Error occurred during issue deletion");
  }

  return { deleteIssue, isLoading };
};
