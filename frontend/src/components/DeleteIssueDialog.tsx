import { Issue } from "../types/kanbanTypes";

import {
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "../components/ui/alert-dialog";

type Props = {
  issue: Issue;
  handleDeleteIssue: (issue: Issue) => void;
};

const DeleteIssueDialog = ({ issue, handleDeleteIssue }: Props) => {
  return (
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
        <AlertDialogDescription>
          This action cannot be undone. This will permanently delete the issue
          from the server.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel className="my-2 rounded-lg bg-amber-300 text-black font-bold hover:bg-amber-400">
          Cancel
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={() => handleDeleteIssue(issue)}
          className="rounded-lg text-white font-bold bg-red-500 hover:bg-red-700"
        >
          Delete Issue
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  );
};

export default DeleteIssueDialog;
