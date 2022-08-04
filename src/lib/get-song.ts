import type { IDetailedOption, IOption } from './types/IOption';

type IResponse = {
  answer: IDetailedOption;
  options: IOption[];
};

export async function getSong(): Promise<IResponse> {
  const playlistId = '0erQqpBCFFYj0gDam2pnp1';
  const response = await fetch(
    `https://heardles.netlify.app/api/get-song?playlist-id=${playlistId}`
  );
  const body = await response.json();
  return body;
}
