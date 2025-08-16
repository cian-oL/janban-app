import { useAuth } from "@clerk/clerk-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import type { Project } from "@/types/projectTypes";

const PROJECTS_QUERY_KEY = "projects";
const PROJECT_QUERY_KEY = "project";

export const useCreateProject = () => {
  const { getToken } = useAuth();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (
      formData: Omit<Project, "_id" | "createdAt" | "lastUpdated">,
    ) => {
      const accessToken = await getToken();

      if (!accessToken) {
        throw new Error("No authentication token available");
      }

      return createProject(formData, accessToken);
    },

    onMutate: async (formData) => {
      await queryClient.cancelQueries({ queryKey: [PROJECTS_QUERY_KEY] });
      const currentProjects = queryClient.getQueryData<Project[]>([
        PROJECTS_QUERY_KEY,
      ]);

      const optimisticProject: Project = {
        ...formData,
        _id: `temp-${Date.now()}`,
        createdAt: new Date().toISOString(),
        lastUpdated: new Date().toISOString(),
      };

      queryClient.setQueryData<Project[]>([PROJECTS_QUERY_KEY], (old) => [
        ...(old || []),
        optimisticProject,
      ]);

      return { currentProjects, tempId: optimisticProject._id };
    },
  });
};
