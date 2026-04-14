/**
 * Replace this with your database implementation.
 *
 * Expected behavior:
 * - Return active Expo push tokens for all users/devices.
 * - Mark tokens inactive when Expo returns DeviceNotRegistered.
 */
export async function getAllExpoPushTokensFromDb(): Promise<string[]> {
  return [];
}

export async function markExpoTokensInactive(_tokens: string[]): Promise<void> {
  // no-op placeholder
}
