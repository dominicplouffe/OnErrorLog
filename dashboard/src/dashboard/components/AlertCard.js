import React, { useEffect, useState } from "react";
import {
  Card,
  Row,
  Col,
  Badge,
  Dropdown,
  SplitButton,
  Button,
} from "react-bootstrap";
import { Link } from "react-router-dom";
import Actions from "../components/Actions";

const AlertCard = ({
  m,
  showSummary,
  showEdit,
  otherObjects,
  otherPath,
  showResponseView,
}) => {
  const [statusItem, setStatusItem] = useState(null);
  const [statusOverride, setStatusOverride] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line
  }, []);

  const renderStatusView = () => {
    return (
      <>
        <Col className="text-center" xs={6} sm={12} xl={3}>
          <small>Downtime</small>
          <h2>{m.downtime_s}</h2>
        </Col>
        <Col className="text-center text-nowrap" xs={12} sm={12} xl={3}>
          <Row>
            <Col xs={6} lg={3}>
              <small>Acknowledged</small>
              <h2>
                <Badge variant="success">
                  {m.stats ? m.stats.acknowledged : `0`}
                </Badge>
              </h2>
            </Col>
            <Col xs={6} lg={3}>
              <small>Fixed</small>
              <h2>
                <Badge variant="primary">{m.stats ? m.stats.fixed : `0`}</Badge>
              </h2>
            </Col>
            <Col xs={6} lg={3}>
              <small>Auto-Resolved</small>
              <h2>
                <Badge variant="warning">
                  {m.stats ? m.stats.resolved : `0`}
                </Badge>
              </h2>
            </Col>
            <Col xs={6} lg={3}>
              <small>Ignored</small>
              <h2>
                <Badge variant="danger">
                  {m.stats ? m.stats.ignored : `0`}
                </Badge>
              </h2>
            </Col>
          </Row>
        </Col>
      </>
    );
  };

  const renderResponseView = () => {
    return (
      <>
        <Col className="text-center" xs={6} sm={6} xl={3}>
          <small>Downtime</small>
          <h2>{m.downtime_s}</h2>
        </Col>
        <Col className="text-center" xs={12} sm={12} xl={3}>
          <small>Avg. Response Time</small>
          <h2>
            {(m.avg_resp * 1000).toFixed(2)}
            <small>ms</small>
          </h2>
        </Col>
      </>
    );
  };

  const renderCardData = () => {
    if (showResponseView && !statusOverride) {
      return renderResponseView();
    }

    return renderStatusView();
  };

  const getSnapshotBackground = (s) => {
    if (s["status"] === null) {
      return "#FFF";
    } else if (s["status"] === "success") {
      return "#409918";
    } else if (s["status"] === "warning") {
      return "#dba222";
    }

    return "#991840";
  };

  const getSuccessRate = (s) => {
    if (!s) {
      return null;
    }

    if (s.count === 0) {
      return null;
    }

    const sr = (s.success / s.count) * 100;

    if (sr < 100) {
      return `${sr.toFixed(0)}%`;
    }

    return null;
  };

  const renderStatusItem = () => {
    if (!statusItem) {
      return null;
    }

    return (
      <small>
        success: {statusItem.success} - failure: {statusItem.failure}
      </small>
    );
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <Row>
            <Col className="text-center" xl={3} md={12}>
              {(!otherObjects || otherObjects.length <= 1) && (
                <h3>{m.object.name}</h3>
              )}
              {otherObjects && otherObjects.length > 1 && (
                <SplitButton
                  title={m.object.name}
                  id="dropdown-menu-align-responsive-2"
                  variant="custom"
                >
                  {otherObjects.map((e, i) => (
                    <Dropdown.Item
                      eventKey={i}
                      key={i}
                      href={`/${otherPath}/summary/${e.id}/`}
                    >
                      {e.name}
                    </Dropdown.Item>
                  ))}
                </SplitButton>
              )}
            </Col>
            <Col className="text-center" xl={6} md={12}>
              <small>{m.object.endpoint}</small>
            </Col>
            <Col className="text-center" xl={3} md={12}>
              <Row>
                <Col className="text-center text-md-right">
                  {showSummary && (
                    <Link
                      className="btn btn-link btn-small"
                      to={`/${otherPath}/summary/${m.object.id}`}
                    >
                      Summary
                    </Link>
                  )}
                  {showEdit && showSummary ? <span> | </span> : ``}
                  {showEdit && (
                    <Link
                      className="btn btn-link btn-small"
                      to={`/${otherPath}/${m.object.id}`}
                    >
                      Edit
                    </Link>
                  )}
                  {showResponseView ? <span> | </span> : ``}
                  {showResponseView && (
                    <Button
                      variant="link"
                      onClick={() => {
                        setStatusOverride(!statusOverride);
                      }}
                    >
                      <Badge variant="success" className="p-0 mr-1">
                        &nbsp;&nbsp;
                      </Badge>
                      <Badge variant="primary" className="p-0 mr-1">
                        &nbsp;&nbsp;
                      </Badge>
                      <Badge variant="danger" className="p-0 mr-1">
                        &nbsp;&nbsp;
                      </Badge>
                      <Badge variant="warning" className="p-0 mr-1">
                        &nbsp;&nbsp;
                      </Badge>
                    </Button>
                  )}
                </Col>
              </Row>
            </Col>
          </Row>
        </Card.Title>
        {m.object.active && (
          <Row>
            <Col className="text-center hide-small" xs={12} sm={12} xl={3}>
              <small>&nbsp;</small>
              {m.object.alert.failure_count === 0 ? (
                <h1 className="text-success">✔</h1>
              ) : (
                <h1 className="text-danger">✖</h1>
              )}
            </Col>
            <Col className="text-center" xs={6} sm={12} xl={3}>
              <small>Failures</small>
              <h1>{m.failure}</h1>
            </Col>
            {m.object.alert.failure_count === 0 ? (
              renderCardData()
            ) : (
              <Col className="text-center pt-3" xs={12} sm={12} xl={6}>
                <Actions fail={m.fail} />
              </Col>
            )}
          </Row>
        )}
        {showResponseView && (
          <Row>
            <Col xs={12} sm={12} xl={12}>
              <Row className="pt-2">
                <Col xs={12} lg={6}>
                  <small>24h Status Snapshot</small>
                </Col>
                <Col className="text-right" xs={12} lg={6}>
                  {renderStatusItem()}
                </Col>
              </Row>

              <div className={`status-row`}>
                {m.snapshot.map((s, i) => (
                  <div
                    style={{
                      backgroundColor: getSnapshotBackground(s),
                    }}
                    key={i}
                    className={`status-cell`}
                    onMouseOver={() => setStatusItem(s)}
                    onMouseOut={() => setStatusItem(null)}
                  >
                    {getSuccessRate(s)}
                  </div>
                ))}
              </div>
            </Col>
          </Row>
        )}
        {!m.object.active && (
          <Row>
            <Col className="text-center">
              <h2>Paused</h2>
            </Col>
          </Row>
        )}
      </Card.Body>
    </Card>
  );
};

export default AlertCard;
