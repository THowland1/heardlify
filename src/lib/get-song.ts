import type { IDetailedOption } from './types/IOption';

export async function getSong(): Promise<IDetailedOption> {
  const response = await fetch('https://heardles.netlify.app/api/get-song');
  const body = await response.json();
  return body;
}
