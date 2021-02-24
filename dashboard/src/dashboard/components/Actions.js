import React from "react";
import { Row, Col, Button } from "react-bootstrap";
import api from "../../utils/api";
import useAuth from "../../auth/useAuth";

const Action = ({ fail, small = false }) => {
  const { forceRefresh } = useAuth();

  const sendStatus = async (fail, status) => {
    await api(`ping/${status}/${fail.id}/`);
    forceRefresh();
  };

  if (!fail) {
    return null;
  }

  return (
    <Row>
      <Col xs={12} lg={4} className="pt-2">
        <Button
          variant="success"
          onClick={() => {
            sendStatus(fail, "acknowledge");
          }}
          className="btn-rounded"
          style={{ width: "100%" }}
          disabled={fail.acknowledged_by}
        >
          {small ? `Ack` : `Acknowledge`}
        </Button>
      </Col>
      <Col xs={12} lg={4} className="pt-2">
        <Button
          variant="primary"
          onClick={() => {
            sendStatus(fail, "fix");
          }}
          className="btn-rounded"
          style={{ width: "100%" }}
        >
          Fixed
        </Button>
      </Col>
      <Col xs={12} lg={4} className="pt-2">
        <Button
          variant="danger"
          onClick={() => {
            sendStatus(fail, "ignore");
          }}
          className="btn-rounded"
          style={{ width: "100%" }}
        >
          Ignore
        </Button>
      </Col>
    </Row>
  );
};

export default Action;
