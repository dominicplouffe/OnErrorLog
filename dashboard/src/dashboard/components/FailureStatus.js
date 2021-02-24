import React from "react";
import { Badge } from "react-bootstrap";

const FailureStatus = ({ failure }) => {
  const getStatus = (failure) => {
    if (!failure) {
      return null;
    }

    if (failure.recovered_on) {
      return <Badge variant="warning">Recovered</Badge>;
    }

    if (failure.acknowledged_on && !failure.ignored_on && !failure.fixed_on) {
      return <Badge variant="success">Acknowledged</Badge>;
    }

    if (failure.ignored_on && !failure.fixed_on) {
      return <Badge variant="danger">Ignored</Badge>;
    }

    if (failure.fixed_on) {
      return <Badge variant="primary">Fixed</Badge>;
    }

    return <Badge variant="danger">Unknown Status</Badge>;
  };

  return getStatus(failure);
};

export default FailureStatus;
