import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import moment from "moment";
import { Card, Row, Col, Button } from "react-bootstrap";
import useAuth from "../../auth/useAuth";
import api from "../../utils/api";
import TotaslRow from "../components/TotalsRow";
import { Link } from "react-router-dom";
import AlertCardSmall from "../components/AlertCardSmall";

const Dashboard = (props) => {
  const [loading, setLoading] = useState(true);
  const [fetchDate, setFetchDate] = useState(null);
  const { refresh } = useAuth();

  const [pings, setPings] = useState([]);
  const [pingTotals, setPingTotals] = useState({});
  const [pongs, setPongs] = useState([]);
  const [pongTotals, setPongTotals] = useState({});
  // const [metricConditions, setMetricConditions] = useState([]);
  // const [metricTotals, setMetricTotals] = useState({});
  const [hours, setHours] = useState(168);

  const useFetchInterval = (delay) => {
    const [doFetch, setDoFetch] = useState(true);
    useEffect(() => {
      const handler = setInterval(() => {
        fetchAll(false);
        setDoFetch(false);
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [delay, setDoFetch]);
    return doFetch;
  };

  const fetchPings = async (skip = false) => {
    if (!skip) {
      const { data = null, error = null } = await api(
        `alert_summary/ping/?hours=${hours}`
      );

      if (data) {
        setPingTotals(data.totals);
        setPings(data.objects);
        setFetchDate(new Date());
      }

      if (error) {
        alert("Something went wrong, we cannot find your ping");
      }
    }
  };

  const fetchPongs = async (skip = false) => {
    if (!skip) {
      const { data = null, error = null } = await api(
        `alert_summary/pong/?hours=${hours}`
      );

      if (data) {
        setPongTotals(data.totals);
        setPongs(data.objects);
        setFetchDate(new Date());
      }

      if (error) {
        alert("Something went wrong, we cannot find your ping");
      }
    }
  };

  // const fetchMetricConditions = async (skip = false) => {
  //   if (!skip) {
  //     const { data = null, error = null } = await api(
  //       `alert_summary/metric_condition/?hours=${hours}`
  //     );

  //     if (data) {
  //       setMetricTotals(data.totals);
  //       setMetricConditions(data.objects);
  //       setFetchDate(new Date());
  //     }

  //     if (error) {
  //       alert("Something went wrong, we cannot find your ping");
  //     }
  //   }
  // };

  const fetchAll = async () => {
    await fetchPings();
    await fetchPongs();
    // await fetchMetricConditions();
    setLoading(false);
  };

  useEffect(() => {
    setLoading(true);
    fetchAll();
    // eslint-disable-next-line
  }, [refresh, hours]);

  // Fetch content every 5 mins
  useFetchInterval(1000 * 60 * 5);

  const getTotals = () => {
    const totals = {
      total: 0,
      active: 0,
      paused: 0,
      up: 0,
      down: 0,
    };

    const totalVals = [pingTotals, pongTotals]; //, metricTotals

    for (let i = 0; i < totalVals.length; i++) {
      const tv = totalVals[i];
      totals.total += tv.total;
      totals.active += tv.active;
      totals.paused += tv.paused;
      totals.up += tv.up;
      totals.down += tv.down;
    }

    return totals;
  };

  return (
    <Body title="Dashboard" selectedMenu="dashboard" {...props}>
      <Row>
        <Col className="text-left">
          <Button
            variant="link"
            className="p-0 m-0"
            onClick={() => setHours(24)}
            style={{ color: hours === 24 ? "red" : "" }}
          >
            <small>24h</small>
          </Button>
          <small> | </small>
          <Button
            variant="link"
            className="p-0 m-0"
            onClick={() => setHours(48)}
            style={{ color: hours === 48 ? "red" : "" }}
          >
            <small>48h</small>
          </Button>
          <small> | </small>
          <Button
            variant="link"
            className="p-0 m-0"
            onClick={() => setHours(72)}
            style={{ color: hours === 72 ? "red" : "" }}
          >
            <small>72h</small>
          </Button>
          <small> | </small>
          <Button
            variant="link"
            className="p-0 m-0"
            onClick={() => setHours(168)}
            style={{ color: hours === 168 ? "red" : "" }}
          >
            <small>7d</small>
          </Button>
          <small> | </small>
          <Button
            variant="link"
            className="p-0 m-0"
            onClick={() => setHours(336)}
            style={{ color: hours === 336 ? "red" : "" }}
          >
            <small>14d</small>
          </Button>
          <small> | </small>
          <Button
            variant="link"
            className="p-0 m-0"
            onClick={() => setHours(720)}
            style={{ color: hours === 720 ? "red" : "" }}
          >
            <small>30d</small>
          </Button>
        </Col>
        <Col className="right-align-small-center">
          <small>
            <span className="hide-small">Last refreshed on: </span>
            {fetchDate && moment(fetchDate).format("LLLL")}
          </small>
        </Col>
      </Row>
      <div style={{ padding: "5px" }}>
        <Card>
          <Card.Body>
            <Card.Title>
              <Row>
                <Col xs={12} lg={3} className="text-center">
                  <h3>Your Overall Summary</h3>
                </Col>
              </Row>
            </Card.Title>

            <Row>
              <Col className="text-center hide-small" xs={12} lg={3}>
                <small>&nbsp;</small>
                {getTotals().down === 0 ? (
                  <h1 className="text-success">✔</h1>
                ) : (
                  <h1 className="text-danger">✖</h1>
                )}
              </Col>
              <Col xs={12} lg={9}>
                {loading && (
                  <Row>
                    <Col className="text-center pt-4 pb-4">Loading...</Col>
                  </Row>
                )}
                {!loading && <TotaslRow totals={getTotals()} />}
              </Col>
            </Row>
          </Card.Body>
        </Card>
      </div>

      <div className="dashboard-box">
        <Card>
          <Card.Body>
            <Card.Title>
              <Row>
                <Col xs={12} className="text-left">
                  <h3>Your Uptime Monitors</h3>
                </Col>
              </Row>
            </Card.Title>

            {loading && (
              <Row>
                <Col className="text-center pt-4 pb-4">Loading...</Col>
              </Row>
            )}

            {!loading && pings.length === 0 && (
              <Row>
                <Col className="text-center pt-1 pb-3" xs={12}>
                  You have no Uptime Monitors setup.
                </Col>

                <Col className="text-center pt-1 pb-3" xs={12}>
                  <Link
                    to="/newping"
                    className="btn btn-warning btn-rounded hide-small"
                  >
                    New Uptime Monitor
                  </Link>
                </Col>
              </Row>
            )}

            {!loading && (
              <>
                <TotaslRow totals={pingTotals} />

                {pings.map((p, i) => (
                  <Row key={i}>
                    <Col className="pt-1">
                      <AlertCardSmall
                        m={p}
                        key={i}
                        showSummary={true}
                        showEdit={true}
                        otherPath="ping"
                        showResponseView={false}
                      />
                    </Col>
                  </Row>
                ))}
              </>
            )}
          </Card.Body>
        </Card>
      </div>
      {/* <div className="dashboard-box">
        <Card>
          <Card.Body>
            <Card.Title>
              <Row>
                <Col xs={12} className="text-left">
                  <h3>Your Vital Monitors</h3>
                </Col>
              </Row>
            </Card.Title>

            {loading && (
              <Row>
                <Col className="text-center pt-4 pb-4">Loading...</Col>
              </Row>
            )}

            {!loading && metricConditions.length === 0 && (
              <Row>
                <Col className="text-center pt-1 pb-3">
                  You have no Vital Monitors setup.
                </Col>
              </Row>
            )}

            {!loading && (
              <>
                <TotaslRow totals={pongTotals} />

                {metricConditions.map((p, i) => (
                  <Row key={i}>
                    <Col className="pt-3">
                      <AlertCardSmall
                        m={p}
                        key={i}
                        showSummary={true}
                        showEdit={true}
                        otherPath={`vital/${p.object.instance}/condition`}
                        showResponseView={false}
                      />
                    </Col>
                  </Row>
                ))}
              </>
            )}
          </Card.Body>
        </Card>
      </div> */}
      <div className="dashboard-box">
        <Card>
          <Card.Body>
            <Card.Title>
              <Row>
                <Col xs={12} className="text-left">
                  <h3>Your Heartbeat Monitors</h3>
                </Col>
              </Row>
            </Card.Title>

            {loading && (
              <Row>
                <Col className="text-center pt-4 pb-4">Loading...</Col>
              </Row>
            )}

            {!loading && pongs.length === 0 && (
              <Row>
                <Col className="text-center pt-1 pb-3" xs={12}>
                  You have no Heartbeat Monitors setup.
                </Col>
                <Col className="text-center pt-1 pb-3" xs={12}>
                  <Link
                    to="/newpong"
                    className="btn btn-warning btn-rounded hide-small"
                  >
                    New Heartbeat Monitor
                  </Link>
                </Col>
              </Row>
            )}

            {!loading && (
              <>
                <TotaslRow totals={pongTotals} />

                {pongs.map((p, i) => (
                  <Row key={i}>
                    <Col className="pt-3">
                      <AlertCardSmall
                        m={p}
                        key={i}
                        showSummary={true}
                        showEdit={true}
                        otherPath="pong"
                        showResponseView={false}
                      />
                    </Col>
                  </Row>
                ))}
              </>
            )}
          </Card.Body>
        </Card>
      </div>
    </Body>
  );
};

export default Dashboard;
