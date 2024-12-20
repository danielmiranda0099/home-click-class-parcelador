"use client";
import { useFormState, useFormStatus } from "react-dom";
import { useEffect, useState } from "react";
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
import { useAccountingStore } from "@/store/accountingStore";
import { handleUpsertTransaction } from "@/actions/accounting";
import { useCustomToast } from "@/hooks";
import { parseCurrencyToNumber } from "@/utils/parseCurrencyToNumber";

function SubmitButton() {
  const { pending } = useFormStatus();

  return (
    <Button
      type="submit"
      disabled={pending}
      className="flex gap-1 justify-center items-center"
    >
      <CheckIcon size={"1.2rem"} />
      Guardar
    </Button>
  );
}

export function PopupFormTransaction({
  is_open,
  setIsOpen,
  handleAction = null,
  showButtonTrigger = true,
}) {
  const { editTransaction, setEditTransaction } = useAccountingStore();
  const [amount_transaction, setAmountTransaction] = useState("");

  const [error_message_form_transaction, setErrorMessageFormTransaction] =
    useState("");
  const [form_state_form_transaction, dispathFormTransaction] = useFormState(
    handleUpsertTransaction,
    {
      data: [],
      success: null,
      error: false,
      message: null,
    }
  );

  const { toastSuccess } = useCustomToast();

  const onHandleUpsertTransaction = (form_data) => {
    const data = {
      date: form_data.get("date"),
      amount: parseCurrencyToNumber(form_data.get("amount")),
      type: form_data.get("type"),
      concept: form_data.get("concept"),
    };
    if (editTransaction) {
      data.operation = "update";
      data.updateId = editTransaction.id;
    } else {
      data.operation = "create";
    }
    dispathFormTransaction(data);
    setErrorMessageFormTransaction("");
  };

  useEffect(() => {
    if (editTransaction) {
      setAmountTransaction(editTransaction.amount.toString());
    }
  }, [editTransaction]);

  useEffect(() => {
    if (form_state_form_transaction.success) {
      toastSuccess({ title: "Movimiento creado exitosamente." });
      setIsOpen(false);
      if (handleAction) {
        handleAction();
      }
    }
    if (
      form_state_form_transaction.error &&
      error_message_form_transaction.length === 0
    ) {
      setErrorMessageFormTransaction(form_state_form_transaction.message);
    }
  }, [form_state_form_transaction]);

  return (
    <Dialog
      open={is_open}
      onOpenChange={(open) => {
        if (!open) {
          setEditTransaction(null);
          setErrorMessageFormTransaction("");
          setAmountTransaction("");
        }
        setIsOpen(open);
      }}
    >
      {showButtonTrigger && (
        <DialogTrigger asChild>
          <Button size="sm">
            <PlusIcon className="mr-2 h-4 w-4" />
            Movimiento
          </Button>
        </DialogTrigger>
      )}
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Agregar Movimiento</DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form className="space-y-4" action={onHandleUpsertTransaction}>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="fecha">Fecha</Label>
              <Input
                id="fecha"
                type="date"
                name="date"
                defaultValue={
                  editTransaction
                    ? new Date(editTransaction.date).toISOString().split("T")[0]
                    : new Date(
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
            <RadioGroup
              name="type"
              required
              className="flex gap-3"
              defaultValue={editTransaction?.type}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="income"
                  id="option-one"
                  className="data-[state=checked]:text-green-500"
                />
                <Label htmlFor="option-one">Ingreso</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem
                  value="expense"
                  id="option-two"
                  className="data-[state=checked]:text-red-500"
                />
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
              defaultValue={editTransaction?.concept}
              required
            />
          </div>
          <div className="mb-6">
            <ErrorAlert message={error_message_form_transaction} />
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
