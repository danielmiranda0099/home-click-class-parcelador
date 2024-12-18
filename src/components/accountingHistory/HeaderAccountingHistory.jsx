import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

export function HeaderAccountingHistory() {
  return (
    <header className="flex flex-col items-between justify-center gap-3 mb-6">
      <h1 className="text-3xl font-bold">Contabilidad financiera</h1>
      <p className="lg:w-[60%]">
        Ingrese un año para comenzar y ver su historial de transacciones.
      </p>

      <div className="w-full max-w-sm space-y-2">
        <div className="flex space-x-2">
          <Input
            id="year-input"
            type="number"
            min="1900"
            max="2100"
            className="w-32"
          />
          <Button>
            <Search className="mr-2 h-4 w-4" />
            Search
          </Button>
        </div>
      </div>
    </header>
  );
}
