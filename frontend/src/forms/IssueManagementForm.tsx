import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";

import { Issue, IssueFormData } from "../types/kanbanTypes";
import { useGetAllUsers } from "@/api/userApiClient";
import { useDeleteIssue } from "../api/issueApiClient";
import { issueCategories, kanbanColumns } from "../config/kanbanConfig";
import DeleteIssueDialog from "../components/DeleteIssueDialog";

import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { AlertDialog, AlertDialogTrigger } from "../components/ui/alert-dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type Props = {
  currentIssue?: Issue;
  onSave: (formData: IssueFormData) => void;
  isLoading: boolean;
};

const formSchema = z.object({
  issueCategory: z.string().min(1, "Required"),
  issueCode: z
    .string()
    .min(1, "Required")
    .regex(/JI-\d{6}/, 'Write in format "JI-XXXXXX" with 6 numbers'),
  name: z.string().min(1, "Required"),
  description: z.string().min(1, "Required"),
  storyPoints: z
    .number()
    .min(1, "Select between 1-8 inclusive")
    .max(8, "Select between 1-8 inclusive"),
  assignee: z.string().min(1, "Required"),
  columnId: z.string().min(1, "Required"),
});

const IssueManagementForm = ({
  currentIssue,
  onSave,
  isLoading: isLoading,
}: Props) => {
  const navigate = useNavigate();
  const { users } = useGetAllUsers();
  const { deleteIssue, isLoading: isDeleteLoading } = useDeleteIssue();

  const form = useForm<IssueFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      issueCategory: "",
      issueCode: "",
      name: "",
      description: "",
      storyPoints: 0,
      assignee: "",
      columnId: "",
    },
  });

  const handleDelete = (issueToDelete: Issue) => {
    deleteIssue(issueToDelete).then(() => {
      navigate("/kanban");
      toast.success("Issue deleted");
    });
  };

  useEffect(() => {
    if (!currentIssue) {
      return;
    }

    form.reset(currentIssue);
  }, [currentIssue, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="flex flex-col gap-5"
      >
        <FormField
          control={form.control}
          name="issueCategory"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mx-2 pt-5 text-slate-700 text-sm font-bold">
                Category:
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={currentIssue?.issueCategory}
              >
                <FormControl>
                  <SelectTrigger className="ml-2 border rounded w-[95%] py-1 px-2 text-gray-700 text-sm font-normal md:w-[30%]">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {issueCategories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex flex-col mx-2 gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="issueCode"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 text-sm font-bold">
                  Code:
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={!!currentIssue}
                    placeholder="JI-XXXXXX"
                    className="border rounded py-1 px-2 text-gray-700 text-sm font-normal"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 text-sm font-bold">
                  Name:
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="border rounded py-1 px-2 text-gray-700 text-sm font-normal"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mx-2 text-slate-700 text-sm font-bold">
                Description:
              </FormLabel>
              <FormControl>
                <Textarea
                  {...field}
                  className="border rounded py-1 mx-2 text-gray-700 text-sm font-normal"
                />
              </FormControl>
              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        <div className="flex flex-col w-1/2 mx-2 gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="storyPoints"
            render={({ field }) => (
              <FormItem className="w-full md:w-[20%]">
                <FormLabel className="text-slate-700 text-sm font-bold">
                  Story Points:
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="number"
                    min={1}
                    max={8}
                    placeholder="1 - 8"
                    className="border rounded py-1 px-2 text-gray-700 text-sm font-normal"
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="assignee"
            render={({ field }) => (
              <FormItem className="w-full md:w-[30%]">
                <FormLabel className="text-slate-700 text-sm font-bold">
                  Assignee:
                </FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={currentIssue?.assignee}
                >
                  <FormControl>
                    <SelectTrigger className="border rounded w-[95%] py-1 px-2 text-gray-700 text-sm font-normal md:w-[70%]">
                      <SelectValue placeholder="Assign..." />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {users?.map((user) => (
                      <SelectItem key={user.racfid} value={user.name}>
                        {user.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>

                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>

        {/* <div className="flex flex-col mx-2 md:flex-row gap-5"> */}
        <FormField
          control={form.control}
          name="columnId"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="mx-2 text-slate-700 text-sm font-bold">
                Status:
              </FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={currentIssue?.columnId}
              >
                <FormControl>
                  <SelectTrigger className="ml-2 border rounded w-[95%] py-1 px-2 text-gray-700 text-sm font-normal md:w-[30%]">
                    <SelectValue placeholder="Select..." />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="backlog">Backlog</SelectItem>
                  {kanbanColumns.map((column) => (
                    <SelectItem key={column.columnId} value={column.columnId}>
                      {column.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>

              <FormMessage className="text-red-500" />
            </FormItem>
          )}
        />
        {/* </div> */}
        <div className="flex flex-col mx-2 md:flex-row gap-5">
          <Button
            type="submit"
            disabled={isLoading}
            className="my-2 w-full rounded-lg bg-amber-300 text-black font-bold hover:bg-amber-400 md:w-fit"
          >
            {isLoading ? "Saving..." : "Submit"}
          </Button>
          {currentIssue && (
            <AlertDialog>
              <AlertDialogTrigger
                disabled={isDeleteLoading}
                className="my-2 px-2 py-2 w-full rounded-lg text-white text-sm font-bold bg-red-500 hover:bg-red-700 md:w-fit"
              >
                {isDeleteLoading ? "Deleting" : "Delete Issue"}
              </AlertDialogTrigger>
              <DeleteIssueDialog
                issue={currentIssue}
                handleDelete={handleDelete}
              />
            </AlertDialog>
          )}
        </div>
      </form>
    </Form>
  );
};

export default IssueManagementForm;
