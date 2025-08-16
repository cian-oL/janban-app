import { createBrowserRouter, RouterProvider } from "react-router-dom";

import Layout from "@/layouts/Layout";
import HomePage from "@/pages/HomePage";
import SignInPage from "@/pages/SignInPage";
import RegisterPage from "@/pages/RegisterPage";
import UserProfilePage from "@/pages/UserProfilePage";
import ProtectedRoute from "@/components/auth/ProtectedRoute";
import KanbanPage from "@/pages/KanbanPage";
import CreateIssuePage from "@/pages/CreateIssuePage";
import IssueManagementPage from "@/pages/IssueManagementPage";
import UnderConstructionPage from "@/pages/UnderConstructionPage";
import NotFoundPage from "@/pages/NotFoundPage";
import AuthRedirectPage from "@/pages/auth/AuthRedirectPage";
import ProjectsPage from "@/pages/projects/ProjectsPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },

      // Auth routes
      {
        path: "/sign-in",
        element: <SignInPage />,
      },
      {
        path: "/register",
        element: <RegisterPage />,
      },

      // Protected routes
      {
        path: "/",
        element: <ProtectedRoute />,
        children: [
          {
            path: "/auth-redirect",
            element: <AuthRedirectPage />,
          },
          {
            path: "/my-profile",
            element: <UserProfilePage />,
          },
          {
            path: "/projects",
            element: <ProjectsPage />,
          },
          {
            path: "/kanban",
            element: <KanbanPage type="active-board" />,
            handle: { layoutVariant: "kanban" },
          },
          {
            path: "/kanban/backlog",
            element: <KanbanPage type="backlog" />,
          },
          {
            path: "/issues/create-issue",
            element: <CreateIssuePage />,
          },
          {
            path: "/issues/:issueCode",
            element: <IssueManagementPage />,
          },
        ],
      },

      // Redirect pages
      {
        path: "/under-construction",
        element: <UnderConstructionPage />,
      },
      {
        path: "/projects",
        element: <UnderConstructionPage />,
      },
      {
        path: "*",
        element: <NotFoundPage />,
      },
    ],
  },
]);

const AppRouter = () => {
  return <RouterProvider router={router} />;
};

export default AppRouter;
