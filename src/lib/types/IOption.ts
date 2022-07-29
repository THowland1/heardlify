export type IOption = {
  artists: {
    list: {
      id: string;
      name: string;
    }[];
    formatted: string;
  };
  formatted: string;
  name: string;
  id: string;
};
export type IDetailedOption = IOption & {
  imgSrc: string;
  year: number;
  previewUrl: string;
};
