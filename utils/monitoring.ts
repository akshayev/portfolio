export function reportPublicDataError(scope: string, error: unknown) {
  if (error instanceof Error) {
    console.error(`[public-data:${scope}] ${error.message}`);

    if (error.stack) {
      console.error(error.stack);
    }

    return;
  }

  if (typeof error === "object" && error !== null) {
    try {
      console.error(`[public-data:${scope}] ${JSON.stringify(error)}`);
      return;
    } catch {
      // fall through
    }
  }

  console.error(`[public-data:${scope}] ${String(error)}`);
}
