import { Controller, useForm } from "react-hook-form";
import {
  loginRequestSchema,
  type LoginRequest,
} from "../../domain/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "../hooks/use-auth-modal";
import { useLogin } from "../../api/auth.mutations";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";

export const LoginForm = () => {
  const { openRegister, close } = useAuthModal();

  const { mutate: login, isPending } = useLogin();

  const form = useForm<LoginRequest>({
    resolver: zodResolver(loginRequestSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const handleSubmit = (values: LoginRequest) => {
    login(values, {
      onSuccess: () => {
        close();
        toast.success("Signed out");
      },
    });
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Email</FieldLabel>

            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder="example@gmail.com"
              type="email"
              autoComplete="off"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Password</FieldLabel>

            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder="********"
              type="password"
              autoComplete="off"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button className="cursor-pointer bg-custom-primary hover:bg-custom-primary/75 w-full">
        {isPending ? <Spinner /> : "Login"}
      </Button>

      <p className="text-muted-foreground text-center">
        Don't have an account?{" "}
        <span
          className="text-custom-primary cursor-pointer"
          onClick={openRegister}
        >
          Sign Up
        </span>
      </p>
    </form>
  );
};
