import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect, useState } from "react";

import { User } from "@/types/userTypes";
import PasswordVisibilityButton from "@/components/PasswordVisibilityButton";

import { toast } from "sonner";
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

type Props = {
  currentUser?: User;
  isLoading?: boolean;
  onSave: (formData: User & { confirmPassword: string }) => void;
};

const formSchema = z
  .object({
    racfid: z.string(),
    password: z
      .string()
      .min(1, "Required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%^&*?])(?=.{8,})/,
        "Passwords must meet strong password criteria",
      ),
    email: z.string().min(1, "Required").email("Not in email format"),
    name: z.string().min(1, "Required"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const UserProfileForm = ({ currentUser, isLoading, onSave }: Props) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<User & { confirmPassword: string }>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      racfid: "",
      password: "",
      email: "",
      name: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (!currentUser) {
      toast.error("Error loading profile");
      return;
    }

    if (!currentUser) {
      return;
    }

    form.reset({
      racfid: currentUser?.racfid,
      email: currentUser?.email,
      name: currentUser?.name,
    });
  }, [currentUser, form]);

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="mx-auto my-5 flex flex-col gap-5 rounded-lg bg-indigo-100 p-5 md:max-w-[60%]"
      >
        {currentUser ? (
          <>
            <h1 className="mx-2 text-2xl font-bold underline">Profile</h1>
            <FormDescription className="mx-2 text-sm italic">
              Edit Information by confirming password and submitting
            </FormDescription>
          </>
        ) : (
          <>
            <h1 className="mx-2 text-2xl font-bold underline">Register</h1>
            <FormDescription className="mx-2 text-sm italic">
              All fields are required
            </FormDescription>
          </>
        )}
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
                <FormMessage className="text-red-500" />
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
                    className="w-[94%] flex-1 rounded border px-2 py-1 font-normal"
                  />
                </FormControl>
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
                    className="w-[94%] flex-1 rounded border px-2 py-1 font-normal md:max-w-96"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <div className="mx-2 flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-700">
                  {currentUser && "Enter/Change"} Password:
                </FormLabel>
                <FormControl>
                  <div className="flex">
                    <Input
                      {...field}
                      type={isPasswordVisible ? "text" : "password"}
                      className="w-full flex-1 rounded border px-2 py-1 font-normal md:max-w-60"
                    />
                    <PasswordVisibilityButton
                      isPasswordVisible={isPasswordVisible}
                      setIsPasswordVisible={setIsPasswordVisible}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <ul className="pt-1 text-sm text-gray-400 md:flex md:flex-col md:pt-5">
            <li>A minimum of 8 characters</li>
            <li>At least one lowercase letter</li>
            <li>At least one uppercase letter</li>
            <li>At least one number</li>
            <li>At least one symbol</li>
          </ul>
        </div>
        <div className="mx-2 flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="confirmPassword"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-sm font-bold text-slate-700">
                  Confirm Password:
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type={isPasswordVisible ? "text" : "password"}
                    className="w-[94%] flex-1 rounded border px-2 py-1 font-normal md:w-full"
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
            disabled={isLoading}
            className="w-full rounded-lg bg-amber-300 font-bold text-black hover:bg-amber-400 lg:w-fit"
          >
            {isLoading ? "Saving..." : currentUser ? "Submit" : "Register"}
          </Button>
        </span>
      </form>
    </Form>
  );
};

export default UserProfileForm;
