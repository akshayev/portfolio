export function reportPublicDataError(scope: string, error: unknown) {
  const message = error instanceof Error ? error.message : String(error);
  console.error(`[public-data:${scope}] ${message}`);
}
