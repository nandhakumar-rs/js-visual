"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { LabControlsProps } from "@/types/lab";
import type { MappedProperty, MappingInputs, MappingStepState } from "./types";

export function MappingUsersControls({
  inputs,
  onInputsChange,
}: LabControlsProps<MappingInputs, MappingStepState>) {
  return (
    <div className="space-y-4">
      <div className="grid gap-2 sm:grid-cols-3">
        {inputs.users.map((user, i) => (
          <div key={user.id} className="space-y-1">
            <Label htmlFor={`user-name-${user.id}`}>User {i + 1} name</Label>
            <Input
              id={`user-name-${user.id}`}
              value={user.name}
              onChange={(e) => {
                const nextUsers = inputs.users.map((u, idx) =>
                  idx === i ? { ...u, name: e.target.value } : u
                );
                onInputsChange({ ...inputs, users: nextUsers });
              }}
            />
          </div>
        ))}
      </div>

      <div className="max-w-48 space-y-1">
        <Label htmlFor="mapped-property">Returned property</Label>
        <Select
          value={inputs.property}
          onValueChange={(v) => onInputsChange({ ...inputs, property: v as MappedProperty })}
        >
          <SelectTrigger id="mapped-property">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="name">name</SelectItem>
            <SelectItem value="age">age</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
