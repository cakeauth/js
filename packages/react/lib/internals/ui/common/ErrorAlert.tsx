"use client";

import { AlertTriangle } from "lucide-react";
import { Alert, AlertDescription, AlertTitle } from "../primitives/Alert";

const ErrorAlert = () => {
  const searchParams = new URLSearchParams(
    new URL(window.location.href).searchParams,
  );
  const error = searchParams.get("error");

  if (error) {
    return (
      <Alert variant="destructive" className="-mt-2">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Something went wrong</AlertTitle>
        <AlertDescription>{error || "Something went wrong!"}</AlertDescription>
      </Alert>
    );
  }
};

export default ErrorAlert;
