import type { IDetailedOption, IOption } from './types/IOption';

type IResponse = {
  answer: IDetailedOption;
  options: IOption[];
};

export async function getSong(): Promise<IResponse> {
  const response = await fetch('https://heardles.netlify.app/api/get-song');
  const body = await response.json();
  return body;
}
