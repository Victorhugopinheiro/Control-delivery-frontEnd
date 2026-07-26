"use client"


import * as React from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { toast } from "sonner"
import * as z from "zod"
import { SignInForm, SignInFormType } from "../../../lib/zodTypes/loginZodForm"
import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
} from "@/components/ui/field"
import { Input } from "@/components/ui/input"
import {
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  InputGroupTextarea,
} from "@/components/ui/input-group"
import { WorkerForm, WorkerType } from "../../../lib/zodTypes/addWorkerZod"

import { useAuth } from "@/context/authContext"
import { useState } from "react"
import { useRouter } from "next/navigation"

export default function Login() {


  const router = useRouter()
  const { login, status } = useAuth()
  const [email, setEmail] = React.useState("")
  const [password, setPassword] = useState("")
  const [submitting, setSubmitting] = useState(false)


  const form = SignInForm()

  async function onSubmit({ email, password }: SignInFormType) {

  
    setSubmitting(true)

    try {
      await login(email, password)
      router.replace("/dashboard")
      toast.success("Login efetuado com sucesso")
    } catch {
      toast.error("Nao foi possivel autenticar. Verifique suas credenciais.")
    } finally {
      setSubmitting(false)
    }
  }






  return (
    <div className="flex flex-col items-center justify-center w-full gap-4 p-4">
      <Card className="w-full max-w-10/12">
        <CardHeader>
          <CardTitle>Cadastrando novo funcionário</CardTitle>
          <CardDescription>
            Preencha os campos abaixo para cadastrar um novo funcionário no sistema.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form id="form-rhf-demo" onSubmit={form.handleSubmit(onSubmit)}>
            <FieldGroup>
              <Controller
                name="email"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                      Digite seu email
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Digite o seu email"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />
              <Controller
                name="password"
                control={form.control}
                render={({ field, fieldState }) => (
                  <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor="form-rhf-demo-title">
                      Digite sua senha
                    </FieldLabel>
                    <Input
                      {...field}
                      id="form-rhf-demo-title"
                      aria-invalid={fieldState.invalid}
                      placeholder="Digite sua senha"
                      autoComplete="off"
                    />
                    {fieldState.invalid && (
                      <FieldError errors={[fieldState.error]} />
                    )}
                  </Field>
                )}
              />


            </FieldGroup>
          </form>
        </CardContent>
        <CardFooter>
          <Field orientation="horizontal">
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              Reset
            </Button>
            <Button type="submit" form="form-rhf-demo">
              Submit
            </Button>
          </Field>
        </CardFooter>
      </Card>
    </div>
  )
}
