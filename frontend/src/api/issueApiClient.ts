import type { Issue } from "@/types/kanbanTypes";
import type { AxiosInstance } from "axios";

type DeleteIssueResponse = {
  message: string;
};

export const createIssue = async (
  formData: Partial<Issue>,
  axiosInstance: AxiosInstance,
  accessToken: string
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
      throw new Error("Error with create issue request");
    });
};

export const getAllIssues = async (
  axiosInstance: AxiosInstance,
  accessToken: string
): Promise<Issue[]> => {
  return await axiosInstance
    .get("/api/issues", {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch(() => {
      throw new Error("Error with fetching all issues");
    });
};

export const getIssue = async (
  issueCode: string,
  axiosInstance: AxiosInstance,
  accessToken: string
): Promise<Issue> => {
  return await axiosInstance
    .get(`/api/issues/${issueCode}`, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch(() => {
      throw new Error("Error with fetching issue");
    });
};

export const updateIssueByFormData = async (
  issueData: Partial<Issue>,
  axiosInstance: AxiosInstance,
  accessToken: string
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
      throw new Error("Error with updating issue");
    });
};

export const updateIssue = async (
  issue: Issue,
  axiosInstance: AxiosInstance,
  accessToken: string
): Promise<Issue> => {
  return await axiosInstance
    .put(`/api/issues/${issue.issueCode}`, issue, {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
    })
    .then((response) => response.data)
    .catch(() => {
      throw new Error("Error with updating issue");
    });
};

export const deleteIssue = async (
  issue: Issue,
  axiosInstance: AxiosInstance,
  accessToken: string
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
