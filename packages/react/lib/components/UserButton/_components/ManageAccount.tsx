"use client";

import { Settings2 } from "lucide-react";
import React from "react";
import { DropdownMenuItem } from "../../../internals/ui/primitives/DropdownMenu";
import UserDialog from "../../UserDialog";

const ManageAccount = () => {
  const [open, setOpen] = React.useState(false);

  return (
    <>
      <DropdownMenuItem
        className="cursor-pointer px-3 py-3 text-muted-foreground group"
        onClick={(e) => {
          e.preventDefault();
          setOpen(true);
        }}
      >
        <Settings2 className="text-muted-foreground group-hover:text-primary" />
        Manage Account
      </DropdownMenuItem>
      <UserDialog open={open} onOpenChange={setOpen} />
    </>
  );
};

export default ManageAccount;
