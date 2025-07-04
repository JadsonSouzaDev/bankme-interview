"use client";

import { Button, Input, Label } from "@/components/ui";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { toast } from "sonner";
import { AuthService } from "@/services/auth.service";
import { useRouter } from "next/navigation";
import { AxiosError } from "axios";

const signupSchema = z.object({
  login: z.string()
    .min(1, "Login is required")
    .min(3, "Login must be at least 3 characters")
    .max(20, "Login must be at most 20 characters"),
  password: z.string()
    .min(1, "Password is required")
    .min(6, "Password must be at least 6 characters")
    .max(100, "Password must be at most 100 characters"),
});

type SignupFormData = z.infer<typeof signupSchema>;

const SignupForm = () => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
    mode: "onBlur",
  });

  const onSubmit = async (data: SignupFormData) => {
    try {
      const authService = new AuthService();
      const user = await authService.signup(data);
      
      toast.success(`Account created successfully for ${user.login}!`);
      router.push("/");
    } catch (error) {
      if (error instanceof AxiosError) {
        toast.error(error.response?.data.message);
      }
      else{
        toast.error("An error occurred while creating your account");
      }
    }
  };

  return (
    <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="login">Login</Label>
          <Input
            id="login"
            {...register("login")}
            type="text"
            autoComplete="login"
            placeholder="Enter your login"
          />
          {errors.login && (
            <p className="text-red-500 text-xs">{errors.login.message}</p>
          )}
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Password</Label>
          <Input
            id="password"
            {...register("password")}
            type="password"
            autoComplete="current-password"
            placeholder="Enter your password"
          />
          {errors.password && (
            <p className="text-red-500 text-xs">{errors.password.message}</p>
          )}
        </div>
        <p className="text-blue-500/80 text-xs">
          By signing up, you agree to our{" "}
          <Link href="/terms" className="text-blue-500 font-bold">
            Terms of Service
          </Link>{" "}
          and{" "}
          <Link href="/privacy" className="text-blue-500 font-bold">
            Privacy Policy
          </Link>
        </p>
      </div>

      <div className="flex flex-col justify-center space-y-4 mt-8">
        <Button 
          className="w-full" 
          variant="default" 
          type="submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Creating account..." : "Signup"}
        </Button>
        <div className="flex justify-center">
          <p className="text-sm text-blue-500/80">
            Already have an account?{" "}
            <Link href="/login" className="text-blue-500 font-bold">
              Login
            </Link>
          </p>
        </div>
      </div>
    </form>
  );
};

export default SignupForm;
