import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

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
import LoadingButton from "@/components/common/LoadingButton";
import ChangeUserPasswordDialog from "@/components/auth/ChangeUserPasswordDialog";

import type { User } from "@/types/userTypes";

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
      passwordEnabled: formData.passwordEnabled,
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
        <div className="mx-2 flex flex-col gap-5">
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
                    className="w-full flex-1 rounded border px-2 py-1 font-normal sm:max-w-72"
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
                    className="w-full flex-1 rounded border px-2 py-1 font-normal sm:max-w-72"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <label className="text-sm font-bold text-slate-700">
            Primary Authentication Method:
          </label>
          <FormControl>
            <p className="w-full flex-1 rounded border px-2 py-1 text-sm font-normal sm:max-w-72">
              {formData.passwordEnabled
                ? "Password Entry"
                : "Single Sign-On (SSO)"}
            </p>
          </FormControl>
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
                    className="w-full flex-1 rounded border px-2 py-1 font-normal sm:max-w-72"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
        {mode === "edit" && (
          <FormDescription className="mx-2">
            Contact support to change your email address
          </FormDescription>
        )}
        <span className="mx-2 flex flex-col gap-2 md:flex-row md:justify-between lg:justify-normal">
          {formData.passwordEnabled && <ChangeUserPasswordDialog />}
          <Button
            data-testid="profile-form-submit-btn"
            type="submit"
            disabled={isSubmitting}
            className="w-full rounded-lg bg-amber-300 font-bold text-black hover:bg-amber-400 md:w-40"
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
