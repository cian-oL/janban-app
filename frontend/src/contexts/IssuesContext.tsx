import React, { useContext, useState } from "react";

import { Issue } from "@/types/kanbanTypes";

type Props = {
  children: React.ReactNode;
};

type IssuesContext = {
  issues: Issue[] | undefined;
  setIssues: React.Dispatch<React.SetStateAction<Issue[] | undefined>>;
};

const IssuesContext = React.createContext<IssuesContext | undefined>(undefined);

export const IssuesProvider = ({ children }: Props) => {
  const [issues, setIssues] = useState<Issue[] | undefined>(undefined);

  return (
    <IssuesContext.Provider value={{ issues, setIssues }}>
      {children}
    </IssuesContext.Provider>
  );
};

export const useIssuesContext = () => {
  const context = useContext(IssuesContext);

  if (context === undefined) {
    throw new Error("useIssuesContext must be inside an IssuesProvider");
  }

  return context as IssuesContext;
};
