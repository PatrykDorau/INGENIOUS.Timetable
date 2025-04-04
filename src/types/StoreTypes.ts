import { StopsResponseType } from "@/types/ApiTypes";
import { NotificationType } from "@/types/ModalTypes";
import { LineType, StopType, UniqueStopType } from "@/types/BusDataTypes";

type StoreStateType = {
  stops: StopsResponseType[];
  uniqueStops: UniqueStopType[];
  lines: LineType[];
  notification?: NotificationType;
  loadInProgress?: boolean;
  activeLine?: LineType;
  activeStop?: StopType;
  activeLineStopsSortDirection: "asc" | "dsc";
  uniqueStopsSortDirection: "asc" | "dsc";
  loading?: {
    loadInProgress: boolean;
  };
  notifications?: {
    notification: NotificationType;
  };
};

export { StoreStateType, NotificationType };
