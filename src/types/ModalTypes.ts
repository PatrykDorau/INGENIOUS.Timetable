type NotificationType = {
  title: string;
  text: string;
  timer: number;
  type: "success" | "error" | "info";
  active: boolean;
};

export { NotificationType };
