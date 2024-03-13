export default function extractErrorMessage(err: unknown): string {
  return err instanceof Error
    ? err.message
    : (err as any).srcElement
    ? (err as any).srcElement.error.message
    : JSON.stringify(err);
}
