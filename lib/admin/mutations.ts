import { revalidatePath } from "next/cache";
import type { TablesInsert, TablesUpdate } from "@/types/supabase";
import { createClient } from "@/utils/supabase/server";
import type { AdminActionState } from "./action-state";

export type CmsTable =
  | "site_settings"
  | "hero_sections"
  | "about_sections"
  | "skills"
  | "global_visual_settings";

type RunAdminMutationParams<T extends CmsTable> = {
  table: T;
  payload: TablesInsert<T>;
  recordId?: string | null;
  successMessage: string;
  revalidatePaths?: string[];
};

type RunAdminDeleteParams<T extends CmsTable> = {
  table: T;
  recordId: string;
  successMessage: string;
  revalidatePaths?: string[];
};

function errorState(message: string): AdminActionState {
  return {
    status: "error",
    message,
    fieldErrors: {},
  };
}

export async function runAdminMutation<T extends CmsTable>({
  table,
  payload,
  recordId,
  successMessage,
  revalidatePaths = [],
}: RunAdminMutationParams<T>): Promise<AdminActionState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return errorState("You must be signed in to perform this action.");
  }

  const accessResult = await supabase.rpc("has_access_role");
  if (accessResult.error || !accessResult.data) {
    return errorState("You do not have permission to update this section.");
  }

  if (recordId) {
    const { error } = await supabase
      .from(table)
      .update(payload as TablesUpdate<T>)
      .eq("id", recordId);

    if (error) {
      return errorState(error.message);
    }
  } else {
    const { error } = await supabase.from(table).insert(payload);
    if (error) {
      return errorState(error.message);
    }
  }

  for (const path of revalidatePaths) {
    revalidatePath(path);
  }

  return {
    status: "success",
    message: successMessage,
    fieldErrors: {},
  };
}

export async function runAdminDelete<T extends CmsTable>({
  table,
  recordId,
  successMessage,
  revalidatePaths = [],
}: RunAdminDeleteParams<T>): Promise<AdminActionState> {
  const supabase = await createClient();

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    return errorState("You must be signed in to perform this action.");
  }

  const accessResult = await supabase.rpc("is_admin");
  if (accessResult.error || !accessResult.data) {
    return errorState("You do not have permission to delete this record.");
  }

  const { error } = await supabase.from(table).delete().eq("id", recordId);
  if (error) {
    return errorState(error.message);
  }

  for (const path of revalidatePaths) {
    revalidatePath(path);
  }

  return {
    status: "success",
    message: successMessage,
    fieldErrors: {},
  };
}
