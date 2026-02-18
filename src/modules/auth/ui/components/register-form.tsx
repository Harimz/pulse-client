import { useForm, Controller } from "react-hook-form";
import {
  registerRequestSchema,
  type RegisterRequest,
} from "../../domain/auth.schemas";
import { zodResolver } from "@hookform/resolvers/zod";
import { Field, FieldError, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useAuthModal } from "../hooks/use-auth-modal";
import { useRegister } from "../../api/auth.mutations";
import { Spinner } from "@/components/ui/spinner";

export const RegisterForm = () => {
  const { openLogin } = useAuthModal();
  const { mutate: register, isPending } = useRegister();

  const form = useForm<RegisterRequest>({
    resolver: zodResolver(registerRequestSchema),
    defaultValues: {
      username: "",
      displayName: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const handleSubmit = (values: RegisterRequest) => {
    register(values);
  };

  return (
    <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
      <Controller
        name="displayName"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Name</FieldLabel>

            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder="John Doe"
              autoComplete="off"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="username"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Username</FieldLabel>

            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              placeholder="TestUser"
              autoComplete="off"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Email</FieldLabel>

            <Input
              {...field}
              aria-invalid={fieldState.invalid}
              type="email"
              placeholder="john@example.com"
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
              type="password"
              aria-invalid={fieldState.invalid}
              placeholder="**********"
              autoComplete="off"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Controller
        name="confirmPassword"
        control={form.control}
        render={({ field, fieldState }) => (
          <Field data-invalid={fieldState.invalid}>
            <FieldLabel>Confirm Password</FieldLabel>

            <Input
              {...field}
              type="password"
              aria-invalid={fieldState.invalid}
              placeholder="**********"
              autoComplete="off"
            />

            {fieldState.invalid && <FieldError errors={[fieldState.error]} />}
          </Field>
        )}
      />

      <Button
        type="submit"
        className="cursor-pointer bg-custom-primary hover:bg-custom-primary/75 w-full"
      >
        {isPending ? <Spinner /> : "Sign Up"}
      </Button>

      <p className="text-muted-foreground text-center">
        Already have an account?{" "}
        <span
          className="text-custom-primary cursor-pointer"
          onClick={openLogin}
        >
          Login
        </span>
      </p>
    </form>
  );
};
