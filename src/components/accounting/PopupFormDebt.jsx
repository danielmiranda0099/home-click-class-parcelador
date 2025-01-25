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
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { useCustomToast } from "@/hooks";
import { parseCurrencyToNumber } from "@/utils/parseCurrencyToNumber";
import { handleUpsertDebt } from "@/actions/accounting";
import { useAccountingStore } from "@/store/accountingStore";

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

export function PopupFormDebt({ is_open, setIsOpen, handleAction = null }) {
  const [amount_debt, setAmountDebt] = useState();
  const { editDebt, setEditDebt } = useAccountingStore();
  const { toastSuccess } = useCustomToast();
  const [form_state_form_debt, dispathFormDebt] = useFormState(
    handleUpsertDebt,
    {
      data: [],
      success: null,
      error: false,
      message: null,
    }
  );
  const [error_message_form_new_Debt, setErrorMessageFormNewDebt] =
    useState("");

  const onCreateNewDebt = (form_data) => {
    const data = {
      amount: parseCurrencyToNumber(form_data.get("amount")),
      type: form_data.get("type"),
      concept: form_data.get("concept"),
    };
    if (editDebt) {
      data.operation = "update";
      data.updateId = editDebt.id;
    } else {
      data.operation = "create";
    }
    dispathFormDebt(data);
    setErrorMessageFormNewDebt("");
  };

  useEffect(() => {
    if (editDebt) {
      setAmountDebt(editDebt.amount.toString());
    }
  }, [editDebt]);

  useEffect(() => {
    if (form_state_form_debt.success) {
      toastSuccess({ title: "Movimiento de cartera creado exitosamente." });
      setIsOpen(false);
      if (handleAction) {
        handleAction();
      }
    }
    if (form_state_form_debt.error) {
      setErrorMessageFormNewDebt(form_state_form_debt.message);
    } else {
      setErrorMessageFormNewDebt("");
    }
  }, [form_state_form_debt]);

  return (
    <Dialog
      open={is_open}
      onOpenChange={(open) => {
        if (!open) {
          setEditDebt(null);
          setErrorMessageFormNewDebt("");
          setAmountDebt("");
        }
        setIsOpen(open);
      }}
    >
      <DialogTrigger asChild>
        <Button size="sm">
          <PlusIcon className="mr-2 h-4 w-4" />
          Cartera
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle className="text-left">
            Registrar Movimiento de Cartera
          </DialogTitle>
          <DialogDescription></DialogDescription>
        </DialogHeader>
        <form className="space-y-4" action={onCreateNewDebt}>
          <div className="space-y-2">
            <RadioGroup
              name="type"
              required
              className="flex gap-3"
              defaultValue={editDebt?.type}
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
            <Label htmlFor="monto">Monto</Label>
            {/* TODO: Refact Name component <InputPriceLesson /> */}
            <InputPriceLesson
              name="amount"
              value={amount_debt}
              setValue={setAmountDebt}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descripcion">Concepto</Label>
            <Input
              id="descripcion"
              placeholder="Ingrese una descripción"
              name="concept"
              defaultValue={editDebt?.concept}
              required
            />
          </div>
          <div className="mb-6">
            <ErrorAlert message={error_message_form_new_Debt} />
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
