import type { IDetailedOption, IOption } from './types/IOption';

export type IResponse = {
  answer: IDetailedOption;
  options: IOption[];
  playlist: {
    name: string;
    imageUrl: string;
  };
};

export async function getSong(
  playlistId: string,
  date: Date
): Promise<IResponse> {
  const response = await fetch(
    `https://heardles.netlify.app/api/get-song?playlist-id=${playlistId}&date=${
      date.toISOString().split('T')[0]
    }`
  );
  const body = await response.json();
  return body;
}
