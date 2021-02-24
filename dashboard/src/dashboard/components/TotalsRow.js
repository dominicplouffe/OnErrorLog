import React from "react";
import { Row, Col, Badge } from "react-bootstrap";

const TotalRow = ({ totals }) => {
  if (!totals.total) {
    return null;
  }
  return (
    <Row>
      <Col className="text-center" xs={6} lg={3}>
        <small>Total</small>
        <h2>
          <Badge variant="primary">{totals.total}</Badge>
        </h2>
      </Col>
      <Col className="text-center" xs={6} lg={3}>
        <small>Up</small>
        <h2>
          <Badge variant="success">{totals.up}</Badge>
        </h2>
      </Col>
      <Col className="text-center" xs={6} lg={3}>
        <small>Down</small>
        <h2>
          <Badge variant="danger">{totals.down}</Badge>
        </h2>
      </Col>
      <Col className="text-center" xs={6} lg={3}>
        <small>Paused</small>
        <h2>
          <Badge variant="warning">{totals.paused}</Badge>
        </h2>
      </Col>
    </Row>
  );
};

export default TotalRow;
