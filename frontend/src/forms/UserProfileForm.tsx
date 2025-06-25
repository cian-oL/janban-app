import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { User } from "@/types/userTypes";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import LoadingButton from "@/components/LoadingButton";

const formSchema = z.object({
  racfid: z.string(),
  email: z.string().min(1, "Required").email("Not in email format"),
  name: z.string().min(1, "Required"),
});

type ProfileFormValues = z.infer<typeof formSchema>;

type Props = {
  mode: "edit" | "create";
  formData: Partial<User>;
  isSubmitting: boolean;
  onSave: (formData: Partial<User>) => void;
};

const UserProfileForm = ({ mode, formData, isSubmitting, onSave }: Props) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      racfid: formData.racfid || "",
      email: formData.email || "",
      name: formData.name || "",
    },
    mode: "onChange",
  });

  const handleSubmit = (formValues: ProfileFormValues) => {
    onSave({
      ...formValues,
      clerkId: formData.clerkId,
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="mx-auto my-5 flex flex-col gap-5 rounded-lg bg-indigo-100 p-5 md:max-w-[60%]"
      >
        <h1 className="mx-2 text-2xl font-bold underline">Profile</h1>
        <FormDescription className="mx-2 text-sm italic">
          <p>
            {mode === "create"
              ? "Please provide your profile information"
              : "Edit your profile information"}
          </p>
          <p>All fields are required</p>
        </FormDescription>
        <div className="mx-2 flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="racfid"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-700">
                  RACFID:
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled
                    placeholder="JXXXXXX"
                    className="w-[94%] flex-1 rounded border px-2 py-1 font-normal"
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-700">
                  Email:
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    disabled={mode === "edit"}
                    placeholder="john.doe@example.com"
                    className="w-[94%] flex-1 rounded border px-2 py-1 font-normal"
                  />
                </FormControl>
                {mode === "edit" && (
                  <FormDescription>
                    Contact support to change your email address
                  </FormDescription>
                )}
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <div className="mx-2 flex flex-col gap-5">
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-700">
                  Name:
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    placeholder="John Doe"
                    className="w-[94%] flex-1 rounded border px-2 py-1 font-normal md:max-w-96"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <span className="mx-2">
          <Button
            data-testid="profile-form-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-amber-300 font-bold text-black hover:bg-amber-400 lg:w-fit"
          >
            {isSubmitting ? (
              <LoadingButton />
            ) : mode === "create" ? (
              "Create Profile"
            ) : (
              "Update Profile"
            )}
          </Button>
        </span>
      </form>
    </Form>
  );
};

export default UserProfileForm;
