"use client";
import { useFormStatus } from "react-dom";
import { useState } from "react";
import { ErrorAlert, InputPriceLesson } from "@/components";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckIcon, PlusIcon } from "@/components/icons";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button type="submit" disabled={pending} className="flex gap-1 justify-center items-center">
      <CheckIcon size={"1.2rem"} />
      Guardar
    </Button>
  );
}

export function PopupFormCreateNewTransaction({
  is_open,
  setIsOpen,
  onCreateNewTransaction,
  error_message,
}) {
  const [amount_transaction, setAmountTransaction] = useState();
  return (
    <Dialog open={is_open} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          Movimiento
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Movimiento</DialogTitle>
          <DialogDescription>
            Ingrese los detalles del nuevo movimiento aquí.
          </DialogDescription>
        </DialogHeader>
        <form className="space-y-4" action={onCreateNewTransaction}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                name="date"
                defaultValue={
                  new Date(
                    new Date().getTime() -
                      new Date().getTimezoneOffset() * 60000
                  )
                    .toISOString()
                    .split("T")[0]
                }
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="monto">Monto</Label>
              {/* TODO: Refact Name component <InputPriceLesson /> */}
              <InputPriceLesson
                name="amount"
                value={amount_transaction}
                setValue={setAmountTransaction}
              />
            </div>
          </div>
          <div className="space-y-5">
            <RadioGroup name="type" required className="flex gap-3">
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="income" id="option-one" className="data-[state=checked]:text-green-500" />
                <Label htmlFor="option-one">Ingreso</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="expense" id="option-two" className="data-[state=checked]:text-red-500"/>
                <Label htmlFor="option-two">Egreso</Label>
              </div>
            </RadioGroup>
          </div>
          <div className="space-y-2">
            <Label htmlFor="descripcion">Concepto</Label>
            <Input
              id="descripcion"
              placeholder="Ingrese una descripción"
              name="concept"
              required
            />
          </div>
          <div className="mb-6">
            <ErrorAlert message={error_message} />
          </div>
          <div className="flex justify-end gap-3">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancelar
              </Button>
            </DialogClose>
            <SubmitButton />
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
