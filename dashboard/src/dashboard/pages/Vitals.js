import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import { Card, Row, Col } from "react-bootstrap";
import api from "../../utils/api";
import InstanceCard from "../components/InstanceCard";

const Vitals = (props) => {
  const [loading, setLoading] = useState(true);
  const [instances, setInstances] = useState([]);

  const useFetchInterval = (delay) => {
    const [doFetch, setDoFetch] = useState(true);
    useEffect(() => {
      const handler = setInterval(() => {
        fetchInstances();
      }, delay);

      return () => {
        clearTimeout(handler);
      };
    }, [delay, setDoFetch]);
    return doFetch;
  };

  const fetchInstances = async () => {
    const { data = null, error = null } = await api(`vital_instance/`);

    if (data) {
      await setInstances(data.results);
    }
    if (error) {
      alert("Something went wrong, we cannot find your instances");
    }

    setLoading(false);
  };

  // Fetch content every 5 mins
  useFetchInterval(1000 * 60);

  useEffect(() => {
    fetchInstances();
    // eslint-disable-next-line
  }, []);

  return (
    <Body title="Vitals" selectedMenu="vitals" {...props} loading={loading}>
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Vital Status</Card.Title>
              <Card.Subtitle>
                Below is a summary of the servers are sending their vital
                metrics.
              </Card.Subtitle>
            </Card.Body>
          </Card>
        </Col>
      </Row>
      <Row>
        {instances.map((instance, i) => (
          <Col xs={12} md={6} lg={6} xl={6} key={i}>
            <InstanceCard instance={instance} showSummary={true} />
          </Col>
        ))}
      </Row>
    </Body>
  );
};

export default Vitals;
