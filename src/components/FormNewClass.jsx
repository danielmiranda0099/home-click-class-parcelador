"use client";
import {
  Dialog,
  DialogTrigger,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogBody,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";

export function FormNewClass() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline">New Class</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Create New Class</DialogTitle>
        </DialogHeader>
        <div>
          <form className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="topic">Class Topic</Label>
              <Textarea id="topic" placeholder="Enter class topic" />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="teams-link">Teams Link</Label>
              <Input
                id="teams-link"
                type="url"
                placeholder="Enter Teams link"
              />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="start-date">Start Date</Label>
                <Input id="start-date" type="datetime-local" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="end-date">End Date</Label>
                <Input id="end-date" type="datetime-local" />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="participants">Participants</Label>
              <div className="flex items-center gap-2">
                <Checkbox id="group-class" />
                <Label htmlFor="group-class">Group Class</Label>
              </div>
              <Select id="participants">
                <SelectTrigger>
                  <SelectValue placeholder="Select participants" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="participant1">Participant 1</SelectItem>
                  <SelectItem value="participant2">Participant 2</SelectItem>
                  <SelectItem value="participant3">Participant 3</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </form>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <DialogClose asChild>
            <Button>Create</Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
