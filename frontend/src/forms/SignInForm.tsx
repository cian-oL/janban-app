import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link } from "react-router-dom";

import { SignInFormData } from "@/types/userTypes";
// import { useMyUser } from "@/api/userApiClient";

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

const formSchema = z.object({
  racfid: z
    .string({ required_error: "Required" })
    .regex(/J\d{6}/, "Employee ID begins with J and contains 6 numbers"),
  password: z.string({ required_error: "Required" }),
});

const SignInForm = () => {
  const form = useForm<SignInFormData>({
    resolver: zodResolver(formSchema),
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(() => console.log("submit clicked"))}
        className="flex flex-col gap-5"
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
                    className="py-1 px-2 border rounded w-full flex-1 font-normal md:w-[30%]"
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
                  <Input
                    {...field}
                    type="password"
                    className="py-1 px-2 border rounded w-full flex-1 font-normal md:w-[30%]"
                  />
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
