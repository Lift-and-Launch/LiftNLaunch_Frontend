import React from "react";
import { Navigate } from "react-router-dom";

/** Deep-link alias that opens the Agency page with the consultation modal. */
export default function ConsultationIntake() {
  return <Navigate to="/agency?consult=1" replace />;
}
