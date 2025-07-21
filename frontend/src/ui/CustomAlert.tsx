import { Alert } from "@heroui/alert";
import { FC } from "react";

export interface AlertState {
  alert: {
    color: "success" | "danger";
    title: string;
  };
}

export const CustomAlert: FC<AlertState> = ({ alert }) => (
  <div className="absolute bottom-4 right-4 z-50">
    <Alert color={alert.color} title={alert.title} />
  </div>
);
