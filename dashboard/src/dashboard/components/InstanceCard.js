import React from "react";
import { Card, Row, Col, Badge } from "react-bootstrap";
import { Link } from "react-router-dom";

const InstanceCard = ({ instance, showSummary }) => {
  if (!instance) {
    return null;
  }
  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <Row>
            <Col className="text-left" xs={8}>
              {instance.name} - Current Values
            </Col>
            <Col className="right-align-small-center" xs={4}>
              {showSummary && (
                <small>
                  <Link to={`/vitals/${instance.id}`}>summary</Link>
                </small>
              )}
            </Col>
          </Row>
        </Card.Title>

        <Row className="pt-2 pb-2" noGutters>
          <Col xs={4} className="p-1">
            <Badge
              style={{
                backgroundColor: instance.cpu_status,
                width: "100%",
                color: "#FFF",
                opacity: 0.75,
              }}
              className="p-2"
            >
              <Row>
                <Col className="text-center">CPU</Col>
              </Row>
              <Row className="pt-2">
                <Col className="text-center">
                  {(instance.cpu_percent * 100).toFixed(2)}%
                </Col>
              </Row>
            </Badge>
          </Col>
          <Col xs={4} className="p-1">
            <Badge
              style={{
                backgroundColor: instance.mem_status,
                width: "100%",
                color: "#FFF",
                opacity: 0.75,
              }}
              className="p-2"
            >
              <Row>
                <Col className="text-center">Mem</Col>
              </Row>
              <Row className="pt-2">
                <Col className="text-center">
                  {(instance.mem_percent * 100).toFixed(2)}%
                </Col>
              </Row>
            </Badge>
          </Col>
          <Col xs={4} className="p-1">
            <Badge
              style={{
                backgroundColor: instance.disk_status,
                width: "100%",
                color: "#FFF",
                opacity: 0.75,
              }}
              className="p-2"
            >
              <Row>
                <Col className="text-center">Disk</Col>
              </Row>
              <Row className="pt-2">
                <Col className="text-center">
                  {(instance.disk_percent * 100).toFixed(2)}%
                </Col>
              </Row>
            </Badge>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default InstanceCard;
