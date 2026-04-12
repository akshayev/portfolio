export type AdminFormStatus = "idle" | "success" | "error";

export type AdminFieldErrors = Record<string, string[] | undefined>;

export type AdminActionState = {
  status: AdminFormStatus;
  message: string;
  fieldErrors?: AdminFieldErrors;
};

export const initialAdminActionState: AdminActionState = {
  status: "idle",
  message: "",
  fieldErrors: {},
};

export function getValidationErrorState(
  fieldErrors: AdminFieldErrors,
  message = "Please fix the highlighted fields and try again."
): AdminActionState {
  return {
    status: "error",
    message,
    fieldErrors,
  };
}

