export async function getSong(): Promise<PlaylistTracks> {
  const response = await fetch('https://heardles.netlify.app/api/get-song');
  const body = await response.json();
  return body;
}

interface PlaylistTracks {
  items: {
    track: {
      artists: { name: string }[];
      album: {
        images: { height: number; url: string; width: number }[];
        name: string;
      };
      name: string;
      preview_url: string;
    };
  }[];
}
