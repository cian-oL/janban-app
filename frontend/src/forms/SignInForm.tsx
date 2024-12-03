import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";
import { useState } from "react";

import { SignInFormData } from "@/types/userTypes";

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
import PasswordVisibilityButton from "@/components/PasswordVisibilityButton";

type Props = {
  onSave: (formData: SignInFormData) => void;
};

const formSchema = z.object({
  racfid: z
    .string()
    .min(1, "Required")
    .regex(/J\d{6}/, "Employee ID begins with J and contains 6 numbers"),
  password: z.string().min(1, "Required"),
});

const SignInForm = ({ onSave }: Props) => {
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);

  const form = useForm<SignInFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      racfid: "",
      password: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSave)}
        className="p-5 mx-auto my-5 rounded-lg flex flex-col gap-5 bg-indigo-100 md:max-w-[60%]"
      >
        <h1 className="mx-2 text-2xl font-bold underline">Sign In</h1>
        <FormDescription className="mx-2 text-sm italic">
          All fields are required
        </FormDescription>
        <div className="mx-2 flex flex-col gap-5">
          <FormField
            control={form.control}
            name="racfid"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 text-sm font-bold flex flex-col">
                  RACFID:
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="py-1 px-2 border rounded w-[94%] flex-1 font-normal md:w-[50%]"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 text-sm font-bold flex flex-col">
                  Password:
                </FormLabel>
                <FormControl>
                  <div className="flex">
                    <Input
                      {...field}
                      type={isPasswordVisible ? "text" : "password"}
                      className="py-1 px-2 border rounded w-full flex-1 font-normal md:w-[50%] md:flex-initial"
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
          <span className="flex flex-col items-center justify-start sm:flex-row">
            <Button
              type="submit"
              className="rounded-lg bg-amber-300 text-black font-bold w-full sm:w-fit hover:bg-amber-400"
            >
              Sign In
            </Button>
            <span className="m-2 text-sm">
              Not Registered?{" "}
              <Link to="/register" className="underline">
                Create an account here
              </Link>
            </span>
          </span>
        </div>
      </form>
    </Form>
  );
};

export default SignInForm;
