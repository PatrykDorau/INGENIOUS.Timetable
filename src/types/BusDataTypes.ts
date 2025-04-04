type UniqueStopType = {
  stop: string;
  order: number;
};

type StopType = {
  stop: string;
  active: boolean;
  time: string[];
  order: number;
};

type LineType = {
  line: number;
  active: boolean;
  stops: StopType[];
};

export { LineType, StopType, UniqueStopType };
