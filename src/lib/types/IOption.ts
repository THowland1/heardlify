export type IOption = {
  artists: {
    id: string;
    name: string;
  }[];
  name: string;
  id: string;
};
export type IDetailedOption = IOption & {
  imgSrc: string;
  year: number;
};
