import { mkdir } from 'fs/promises';

export async function createDirectoryIfNotExists(directory: string) {
  try {
    await mkdir(directory, { recursive: true });
  } catch (error) {
    if ((error as any).code !== 'EEXIST') {
      throw error;
    }
  }
}
