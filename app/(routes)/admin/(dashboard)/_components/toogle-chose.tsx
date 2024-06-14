"use client";

import { IconButton } from "@/components/ui/button";
import { Heading } from "@/components/ui/heading";
import { Switch } from "@/components/ui/switch";
import { cn } from "@/lib/utils";
import { CarTaxiFront, ScanFace, TicketIcon, X } from "lucide-react";
import * as React from "react";

type SwitchToogleProps = {
  switch1: boolean;
  switch2: boolean;
  switch3: boolean;
};

type StateType = SwitchToogleProps & {
  checkedOrder: (keyof SwitchToogleProps)[];
};

function reducer(state: StateType, action: { type: keyof SwitchToogleProps }) {
  const switchName = action.type;
  const isSwitchCurrentlyChecked = state[switchName];
  let newCheckedOrder = [...state.checkedOrder];

  if (isSwitchCurrentlyChecked) {
    newCheckedOrder = newCheckedOrder.filter((s) => s !== switchName);
  } else {
    if (newCheckedOrder.length >= 2) {
      const switchToUncheck = newCheckedOrder.shift();
      return {
        ...state,
        [switchToUncheck!]: false,
        [switchName]: true,
        checkedOrder: [...newCheckedOrder, switchName],
      };
    } else {
      newCheckedOrder.push(switchName);
    }
  }

  return {
    ...state,
    [switchName]: !isSwitchCurrentlyChecked,
    checkedOrder: newCheckedOrder,
  };
}

function ToogleChose() {
  const [state, dispatch] = React.useReducer(reducer, {
    switch1: false,
    switch2: false,
    switch3: false,
    checkedOrder: [],
  });
  return (
    <div className="max-w-xl space-y-4 rounded-md bg-gray-800 p-4 shadow-md">
      <div className="flex items-center justify-between">
        <Heading
          className="text-white"
          title="Choose whate suits you..."
          description="You can only pick two, sorry!"
        />
        <IconButton
          Icon={X}
          className="h-fit rounded-lg bg-white"
          iconClassName="text-black size-4"
        />
      </div>
      <div className="space-y-4">
        <SwitchToogle
          checked={state.switch1}
          onCheckedChange={() => dispatch({ type: "switch1" })}
          name="Good"
          description="Top-notch quality"
          Icon={ScanFace}
          iconClassName="text-green-500"
          switchClassName="data-[state=checked]:bg-green-500 "
        />
        <SwitchToogle
          checked={state.switch2}
          onCheckedChange={() => dispatch({ type: "switch2" })}
          name="Fast"
          description="Get it done quickly"
          Icon={CarTaxiFront}
          iconClassName="text-blue-500"
          switchClassName="data-[state=checked]:bg-blue-500 "
        />
        <SwitchToogle
          checked={state.switch3}
          onCheckedChange={() => dispatch({ type: "switch3" })}
          name="Cheap"
          description="Low cost"
          Icon={TicketIcon}
          iconClassName="text-violet-500"
          switchClassName="data-[state=checked]:bg-violet-500 "
        />
      </div>
    </div>
  );
}

export default ToogleChose;

function SwitchToogle({
  switchClassName,
  name,
  description,
  Icon,
  iconClassName,
  onCheckedChange,
  checked,
}: {
  switchClassName?: string;
  name: string;
  description?: string;
  Icon: React.ElementType;
  iconClassName?: string;
  onCheckedChange: () => void;
  checked: boolean;
}) {
  return (
    <div className="flex items-center justify-between">
      <label
        htmlFor={name}
        className="flex items-center justify-start gap-2 text-white"
      >
        <div className="bg-green size-fit rounded-md bg-slate-600/50 p-2">
          <Icon className={cn("size-6", iconClassName)} />
        </div>
        <div>
          <h3 className="text-lg font-bold">{name}</h3>
          <p>{description}</p>
        </div>
      </label>
      <Switch
        checked={checked}
        onCheckedChange={onCheckedChange}
        id={name}
        className={cn("data-[state=unchecked]:bg-input", switchClassName)}
      />
    </div>
  );
}
