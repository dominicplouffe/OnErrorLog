import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import { Card, Row, Col, Badge } from "react-bootstrap";
import api from "../../utils/api";
import AlertCard from "../components/AlertCard";
import moment from "moment";
import { Link } from "react-router-dom";
import useAuth from "../../auth/useAuth";

const Pong = (props) => {
  const [loading, setLoading] = useState(true);
  const [totals, setTotals] = useState({});
  const [pongs, setPongs] = useState([]);
  const [fetchDate, setFetchDate] = useState(null);
  const hours = 168;

  const { refresh } = useAuth();

  const useFetchInterval = (delay) => {
    const [doFetch, setDoFetch] = useState(true);
    useEffect(() => {
      const handler = setInterval(() => {
        fetchSummary(false);
        setDoFetch(false);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [delay, setDoFetch]);
    return doFetch;
  };

  const fetchSummary = async (skip = false) => {
    if (!skip) {
      const { data = null, error = null } = await api(
        `alert_summary/pong/?hours=${hours}`
      );

      if (data) {
        setTotals(data.totals);
        setPongs(data.objects);
        setFetchDate(new Date());
        setLoading(false);
      }

      if (error) {
        alert("Something went wrong, we cannot find your pong");
      }
    }
  };
  useEffect(() => {
    fetchSummary();
    // eslint-disable-next-line
  }, [refresh]);

  // Fetch content every 5 mins
  useFetchInterval(1000 * 60 * 5);

  return (
    <Body
      title="Heartbeat Monitor"
      selectedMenu="pong"
      {...props}
      loading={loading}
    >
      <Row>
        <Col className="right-align-small-center">
          <small>
            <span className="hide-small">Last refreshed on: </span>
            {fetchDate && moment(fetchDate).format("LLLL")}
          </small>
        </Col>
      </Row>
      <Card>
        <Card.Body>
          <Card.Title>
            <Row>
              <Col xs={12} lg={3} className="text-center">
                <h3>Heartbeat Monitor Summary</h3>
              </Col>
              <Col className="right-align-small-center  hide-small">
                <Link to="/newpong" className="btn btn-warning btn-rounded">
                  New Heartbeat Monitor
                </Link>
              </Col>
            </Row>
          </Card.Title>
          <Row>
            <Col className="text-center hide-small" xs={12} lg={3}>
              <small>&nbsp;</small>
              {totals.down === 0 ? (
                <h1 className="text-success">✔</h1>
              ) : (
                <h1 className="text-danger">✖</h1>
              )}
            </Col>
            <Col xs={12} lg={9}>
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
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {pongs.map((m, i) => (
        <AlertCard
          m={m}
          key={i}
          showSummary={true}
          showEdit={true}
          otherPath="pong"
        />
      ))}
      {pongs.length === 0 && !loading && (
        <Card>
          <Card.Body className="p-5">
            <Row>
              <Col className="text-center">
                <img
                  src="https://onerrorlog.s3.amazonaws.com/images/oel-logo.png"
                  alt="Oops"
                  className="mb-3 list-logo"
                />
                <h2 className="pt-3">
                  You have not added any Heartbeat Monitors to your account yet.
                </h2>
                <div className="pt-5">
                  <Link
                    to="/pong/0"
                    className="btn btn-warning btn-rounded mb-2 mr-2"
                    style={{ fontSize: "20px" }}
                  >
                    Add Your First Heartbeat Monitor
                  </Link>
                </div>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}
    </Body>
  );
};

export default Pong;
