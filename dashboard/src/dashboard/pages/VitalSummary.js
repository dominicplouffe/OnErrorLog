import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import api from "../../utils/api";
import moment from "moment";
import useAuth from "../../auth/useAuth";
import { Card, Row, Col, Badge } from "react-bootstrap";
import InstanceCard from "../components/InstanceCard";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Link } from "react-router-dom";
import AlertCard from "../components/AlertCard";

const VitalSummary = (props) => {
  const [loading, setLoading] = useState(true);
  const [instance, setInstance] = useState(null);
  const [cpuData, setCPUData] = useState([]);
  const [memData, setMemData] = useState([]);
  const [diskData, setDiskData] = useState([]);
  const [totals, setTotals] = useState({});
  const [notifications, setNotifications] = useState([]);

  const { refresh } = useAuth();

  const fetchInstance = async () => {
    const { data = null, error = null } = await api(
      `vital_instance/${props.match.params.id}/`
    );

    extractGraphData(data, "cpu_percent.cpu", setCPUData);
    extractGraphData(data, "memory_percent.mem", setMemData);
    extractGraphData(data, "disk_percent.disk", setDiskData);

    if (data) {
      setInstance(data);
      fetchNotifications(data.id);
    }
    if (error) {
      alert("Something went wrong, we cannot find your instance");
    }

    setLoading(false);
  };

  const fetchNotifications = async (id) => {
    const { data = null, error = null } = await api(
      `alert_summary/metric_condition/?hours=24&filter=instance_id=${id}`
    );

    if (data) {
      setNotifications(data.objects);
      setTotals(data.totals);
    }

    if (error) {
      alert("Something went wrong, cannot fetch your notifications");
    }
  };

  const extractGraphData = (data, key, setFunc) => {
    const values = [];

    for (let i = 0; i < data[key].length; i++) {
      const ss = data[key][i];
      const row = {
        name: `${moment(ss.date).format("MM/DD H:mm")}`,
        value: ss.value,
      };

      values.push(row);
    }

    setFunc(values);
  };

  useEffect(() => {
    fetchInstance();
    // eslint-disable-next-line
  }, [refresh]);

  return (
    <Body title="Vitals" selectedMenu="vitals" {...props} loading={loading}>
      <Row>
        <Col>
          <InstanceCard instance={instance} />
        </Col>
      </Row>
      {instance && (
        <>
          <Row>
            <Col md={12} lg={12} xl={4}>
              <Card>
                <Card.Body>
                  <Card.Title>CPU Percentage Used</Card.Title>
                  <Card.Subtitle>
                    Below is the graph of the CPU usage for the past 24 hours in
                    1 hour intervals
                  </Card.Subtitle>
                  <Row>
                    <Col className="pt-3">
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart
                          data={cpuData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <XAxis dataKey="name" tick={true} />
                          <YAxis />
                          <Tooltip />
                          {/* content={<CustomTooltip />} */}
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={instance.cpu_status}
                            fill={instance.cpu_status}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12} lg={12} xl={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Memory Percentage Used</Card.Title>
                  <Card.Subtitle>
                    Below is the graph of the Memory usage for the past 24 hours
                    in 1 hour intervals
                  </Card.Subtitle>
                  <Row>
                    <Col className="pt-3">
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart
                          data={memData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <XAxis dataKey="name" tick={true} />
                          <YAxis />
                          <Tooltip />
                          {/* content={<CustomTooltip />} */}
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={instance.mem_status}
                            fill={instance.mem_status}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
            <Col md={12} lg={12} xl={4}>
              <Card>
                <Card.Body>
                  <Card.Title>Disk Percentage Used</Card.Title>
                  <Card.Subtitle>
                    Below is the graph of the Disk usage for the past 24 hours
                    in 1 hour intervals
                  </Card.Subtitle>
                  <Row>
                    <Col className="pt-3">
                      <ResponsiveContainer width="100%" height={200}>
                        <AreaChart
                          data={diskData}
                          margin={{
                            top: 10,
                            right: 30,
                            left: 0,
                            bottom: 0,
                          }}
                        >
                          <XAxis dataKey="name" tick={true} />
                          <YAxis />
                          <Tooltip />
                          {/* content={<CustomTooltip />} */}
                          <Area
                            type="monotone"
                            dataKey="value"
                            stroke={instance.disk_status}
                            fill={instance.disk_status}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    </Col>
                  </Row>
                </Card.Body>
              </Card>
            </Col>
          </Row>
        </>
      )}

      {instance && (
        <Card>
          <Card.Body>
            <Card.Title>
              <Row>
                <Col xs={12} lg={3} className="text-center">
                  <h3>{instance.name} Notification Summary</h3>
                </Col>
                <Col className="right-align-small-center">
                  <Link
                    to={`/vital/${instance.id}/condition/0`}
                    className="btn btn-warning btn-rounded"
                  >
                    New Notification
                  </Link>
                </Col>
              </Row>
            </Card.Title>
            <Row>
              <Col className="text-center" xs={12} lg={3}>
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
      )}

      {notifications.map((m, i) => (
        <AlertCard
          m={m}
          key={i}
          showSummary={true}
          showEdit={true}
          otherPath={`vital/${instance.id}/condition`}
          showResponseView={false}
        />
      ))}
    </Body>
  );
};

export default VitalSummary;
