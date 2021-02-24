import React from "react";
import { Row, Col } from "react-bootstrap";

const Java = ({ pongKey, api_url }) => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <pre className="code p-4" style={{ lineHeight: "20px" }}>
            <span className="text-success">
              # Example to send a start and end request to onErrorLog using Bash
            </span>
            <span className="text-success"># Send your start request</span>
            <br />
            curl
            <span className="text-warning">
              {" "}
              "{api_url}pongme/start/{pongKey}"
            </span>{" "}
            -m 10
            <br />
            <br />
            /my/path/to/script.sh
            <br />
            <br />
            <span className="text-success"># Send your end request</span>
            <br />
            curl
            <span className="text-warning">
              {" "}
              "{api_url}pongme/end/{pongKey}"
            </span>{" "}
            -m 10
          </pre>
        </Col>
      </Row>
    </>
  );
};

export default Java;
