import { Navigate, Route, Routes } from "react-router-dom";

import Layout from "./layouts/Layout";
import KanbanLayout from "./layouts/KanbanLayout";
import HomePage from "./pages/HomePage";
import SignInPage from "./pages/SignInPage";
import RegisterPage from "./pages/RegisterPage";
import UserProfilePage from "./pages/UserProfilePage";
import ProtectedRoutes from "./auth/ProtectedRoutes";
import KanbanPage from "./pages/KanbanPage";
import CreateIssuePage from "./pages/CreateIssuePage";
import IssueManagementPage from "./pages/IssueManagementPage";

const AppRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={
          <Layout>
            <HomePage />
          </Layout>
        }
      />
      <Route
        path="/sign-in"
        element={
          <Layout>
            <SignInPage />
          </Layout>
        }
      />
      <Route
        path="/register"
        element={
          <Layout>
            <RegisterPage />
          </Layout>
        }
      />

      {/* protected routes */}
      <Route element={<ProtectedRoutes />}>
        <Route
          path="/my-profile"
          element={
            <Layout>
              <UserProfilePage />
            </Layout>
          }
        />
        <Route
          path="/kanban"
          element={
            <KanbanLayout>
              <KanbanPage />
            </KanbanLayout>
          }
        />
        <Route
          path="/issues/create-issue"
          element={
            <Layout>
              <CreateIssuePage />
            </Layout>
          }
        />
        <Route
          path="/issues/:issueCode"
          element={
            <Layout>
              <IssueManagementPage />
            </Layout>
          }
        />
      </Route>

      {/* redirect */}
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
};

export default AppRoutes;
