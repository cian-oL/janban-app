import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useNavigate } from "react-router-dom";

import { UserFormData } from "@/types/userTypes";
import { useRegisterUser } from "@/api/userApiClient";
import { useAuthContext } from "@/auth/AuthContext";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";

const formSchema = z
  .object({
    racfid: z
      .string()
      .min(1, "Required")
      .regex(/J\d{6}/, "Employee ID begins with J and contains 6 numbers"),
    password: z
      .string()
      .min(1, "Required")
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#%^&*?])(?=.{8,})/,
        "Passwords must meet strong password criteria"
      ),
    email: z.string().min(1, "Required").email("Not in email format"),
    name: z.string().min(1, "Required"),
    confirmPassword: z.string().min(1, "Required"),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match",
    path: ["confirmPassword"],
  });

const RegistrationForm = () => {
  const { registerUser } = useRegisterUser();
  const navigate = useNavigate();
  const { setAccessToken } = useAuthContext();

  const onSubmit = (formData: UserFormData) => {
    registerUser(formData).then((data) => {
      setAccessToken(data);
      toast.success("User registered");
      navigate("/");
    });
  };

  const form = useForm<UserFormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      racfid: "",
      password: "",
      email: "",
      name: "",
      confirmPassword: "",
    },
  });

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="flex flex-col gap-5"
      >
        <h1 className="mx-2 text-2xl font-bold underline">Register</h1>
        <FormDescription className="mx-2 text-sm italic">
          All fields are required
        </FormDescription>
        <div className="mx-2 flex flex-col gap-5 md:flex-row">
          <FormField
            control={form.control}
            name="racfid"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-slate-700 text-sm font-bold">
                  RACFID:
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    className="py-1 px-2 border rounded w-full flex-1 font-normal"
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
                <FormLabel className="text-slate-700 text-sm font-bold">
                  Email:
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="email"
                    className="py-1 px-2 border rounded w-full flex-1 font-normal"
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
                    className="py-1 px-2 border rounded w-full flex-1 font-normal"
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
                <FormLabel className="text-slate-700 text-sm font-bold">
                  Password:
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="py-1 px-2 border rounded w-full flex-1 font-normal"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <ul className="pt-1 text-sm text-gray-400 md:pt-5 md:flex md:flex-col">
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
                <FormLabel className="text-slate-700 text-sm font-bold">
                  Confirm Password:
                </FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    type="password"
                    className="py-1 px-2 border rounded w-full flex-1 font-normal"
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
        </div>
        <span className="mx-2">
          <Button
            type="submit"
            className="rounded-lg bg-amber-300 text-black font-bold w-full lg:w-fit hover:bg-amber-400"
          >
            Register
          </Button>
        </span>
      </form>
    </Form>
  );
};

export default RegistrationForm;
