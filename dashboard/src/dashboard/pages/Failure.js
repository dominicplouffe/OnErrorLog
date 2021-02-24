import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import { Card, Row, Col } from "react-bootstrap";
import "react-phone-number-input/style.css";
import { REASONS } from "../../utils/globals";
import api from "../../utils/api";
import AlertCard from "../components/AlertCard";
import FailureStatus from "../components/FailureStatus";
import moment from "moment";

const Failure = (props) => {
  const [loading, setLoading] = useState(true);
  const [failure, setFailure] = useState(null);
  const [summary, setSummary] = useState(null);
  const [ping, setPing] = useState(null);

  const useFetchInterval = (delay) => {
    const [doFetch, setDoFetch] = useState(true);
    useEffect(() => {
      const handler = setInterval(() => {
        fetchFailure(props.match.params.id);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [delay, setDoFetch]);
    return doFetch;
  };

  const fetchFailure = async (failureId) => {
    const { error = null, data = null } = await api(`failure/${failureId}/`);

    if (data) {
      setFailure(data);
      fetchSummary();
      setLoading(false);
    }

    if (error) {
      alert("Something went wrong");
    }
  };

  const fetchSummary = async () => {
    const { data = null, error = null } = await api(
      `alert_summary/${props.match.params.otype}/${props.match.params.oid}/`
    );
    if (data) {
      setSummary(data.objects[0]);

      if (props.match.params.otype === "ping") {
        fetchPing();
      }
    }
    if (error) {
      alert("Something went wrong fetching summary");
    }
  };

  const fetchPing = async () => {
    const { data = null, error = null } = await api(
      `ping/${props.match.params.oid}/`
    );

    if (data) {
      setPing(data);
    }
    if (error) {
      alert("Something went wrong fetching your ping");
    }
  };

  // Fetch content every 5 mins
  useFetchInterval(1000 * 60 * 5);

  useEffect(() => {
    fetchFailure(props.match.params.id);

    // eslint-disable-next-line
  }, [props]);

  return (
    <Body title="Failure" selectedMenu="failure" {...props} loading={loading}>
      {summary && (
        <AlertCard
          m={summary}
          showEdit={false}
          showSummary={true}
          otherPath={props.match.params.otype}
          showResponseView={props.match.params.otype === "ping"}
        />
      )}
      {!loading && (
        <>
          <Card>
            <Card.Body>
              <Card.Title>
                <Row>
                  <Col>Failure Details</Col>
                  <Col className="right-align-small-center">
                    <FailureStatus failure={failure} />
                  </Col>
                </Row>
              </Card.Title>
              <Card.Subtitle>
                Below are the detail of this failure
              </Card.Subtitle>

              <Row className="mt-4">
                <Col lg={6} xs={12}>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Triggered On</strong>:
                    </Col>
                    <Col>{moment(failure.created_on).format("LLLL")}</Col>
                  </Row>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Who was notified</strong>:
                    </Col>
                    <Col>{`${failure.notify_org_user.first_name} ${failure.notify_org_user.last_name}`}</Col>
                  </Row>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Reason</strong>:
                    </Col>
                    <Col>{REASONS[failure.reason]}</Col>
                  </Row>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Status Code</strong>:
                    </Col>
                    <Col>{failure.status_code}</Col>
                  </Row>
                </Col>
                <Col lg={6} xs={12}>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Acknowledged On</strong>:
                    </Col>
                    <Col>
                      {failure.acknowledged_on && (
                        <>
                          <div className="d-inline-flex">
                            {moment(failure.acknowledged_on).format("LLLL")}
                          </div>
                          <div className="d-inline-flex smaller pl-2">
                            by:{" "}
                            {`${failure.acknowledged_by.first_name} ${failure.acknowledged_by.last_name}`}
                          </div>
                        </>
                      )}
                      {!failure.acknowledged_on && <div>n/a</div>}
                    </Col>
                  </Row>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Recovered On</strong>:
                    </Col>
                    <Col>
                      {failure.recovered_on && (
                        <>
                          <div>
                            {moment(failure.recovered_on).format("LLLL")}
                          </div>
                        </>
                      )}
                      {!failure.recovered_on && <div>n/a</div>}
                    </Col>
                  </Row>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Fixed On</strong>:
                    </Col>
                    <Col>
                      {failure.fixed_on && (
                        <>
                          <div className="d-inline-flex">
                            {moment(failure.fixed_on).format("LLLL")}
                          </div>
                          <div className="d-inline-flex smaller pl-2">
                            by:{" "}
                            {`${failure.fixed_by.first_name} ${failure.fixed_by.last_name}`}
                          </div>
                        </>
                      )}
                      {!failure.fixed_on && <div>n/a</div>}
                    </Col>
                  </Row>
                  <Row className="pt-2">
                    <Col lg={3}>
                      <strong>Ignored On</strong>:
                    </Col>
                    <Col>
                      {failure.ignored_on && (
                        <>
                          <div className="d-inline-flex">
                            {moment(failure.ignored_on).format("LLLL")}
                          </div>
                          <div className="d-inline-flex smaller pl-2">
                            by:{" "}
                            {`${failure.ignored_by.first_name} ${failure.ignored_by.last_name}`}
                          </div>
                        </>
                      )}
                      {!failure.ignored_on && <div>n/a</div>}
                    </Col>
                  </Row>
                </Col>
              </Row>
            </Card.Body>
          </Card>

          <Card>
            <Card.Body>
              <Card.Title>
                {ping && (
                  <Row>
                    <Col>
                      Content returned from:{" "}
                      <span className="text-primary">{ping.endpoint}</span>
                    </Col>
                  </Row>
                )}
                {!ping && (
                  <Row>
                    <Col>Details of your failure</Col>
                  </Row>
                )}
              </Card.Title>
              <Row>
                {failure.content && (
                  <Col className="pl-3 pr-3">
                    <pre>{failure.content}</pre>
                  </Col>
                )}
                {!failure.content && (
                  <Col className="pl-3 pr-3">
                    The content was empty or not returned from {ping.endpoint}
                  </Col>
                )}
              </Row>
            </Card.Body>
          </Card>
        </>
      )}
    </Body>
  );
};

export default Failure;
