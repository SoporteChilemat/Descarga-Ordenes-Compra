export function getCurrentDateISO(): string {
    return new Date().toISOString().split('T')[0];
}
