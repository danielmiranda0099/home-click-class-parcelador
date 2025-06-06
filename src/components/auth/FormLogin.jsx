"use client";
import { useFormState, useFormStatus } from "react-dom";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { login } from "@/actions/login";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { useEffect } from "react";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" className="w-full" disabled={pending}>
      {pending ? "Iniciando sesión..." : "Iniciar sesión"}
    </Button>
  );
}

//TODO: En console web sale error, check luego
export function FormLogin() {
  const router = useRouter();
  const [state, formAction] = useFormState(login, null);

  useEffect(() => {
    if (state?.success && state.data.role.includes("admin")) {
      router.push("/admin/dashboard");
    }
    if (
      state?.success &&
      (state.data.role.includes("student") ||
        state.data.role.includes("teacher"))
    ) {
      router.push("/classes");
    }
  }, [state]);

  return (
    <form className="space-y-4" action={formAction}>
      <div className="space-y-2">
        <Label htmlFor="email">Correo electrónico</Label>
        <Input
          id="email"
          name="email"
          type="email"
          placeholder="correo@gmail.com"
          required
        />
      </div>
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <Label htmlFor="password">Contraseña</Label>
        </div>
        <Input id="password" type="password" name="password" />
      </div>
      <Link href="#" className="text-sm text-muted-foreground hover:underline">
        ¿Olvidaste tu contraseña?
      </Link>
      {state?.error && <p className="text-sm text-red-500">{state.error}</p>}
      <SubmitButton />
    </form>
  );
}
