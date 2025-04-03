import { StopsResponseType } from "@/types/ApiTypes";
import { NotificationType } from "@/types/ModalTypes";

type StopsState = {
  stops: StopsResponseType[];
  uniqueStops: UniqueStopType[];
  uniqueStopsSortDirection: "asc" | "dsc";
};

type LinesState = {
  lines: LineType[];
  activeLine?: LineType;
  activeLineStopsSortDirection: "asc" | "dsc";
};

type NotificationsState = {
  notification: NotificationType;
};

export type LoadingState = {
  loadInProgress: boolean;
};

type RootState = {
  stops: StopsState;
  lines: LinesState;
  notifications: NotificationsState;
  loading: LoadingState;
};

type StoreStateType = {
  stops: StopsResponseType[];
  uniqueStops: UniqueStopType[];
  lines: LineType[];
  notification: NotificationType;
  loadInProgress: boolean;
  activeLine?: LineType;
  activeStop?: StopType;
  activeLineStopsSortDirection: "asc" | "dsc";
  uniqueStopsSortDirection: "asc" | "dsc";
};

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

export {
  StoreStateType,
  LineType,
  StopType,
  UniqueStopType,
  NotificationType,
  RootState,
};
