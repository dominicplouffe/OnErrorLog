import React from "react";
import { Row, Col } from "react-bootstrap";

const Node = ({ pongKey, api_url }) => {
  return (
    <Row>
      <Col xs={12}>
        <pre className="code p-4" style={{ lineHeight: "25px" }}>
          <span className="text-success">
            {"// "}# Example to send a start and end request to onErrorLog using
            Node.js
          </span>
          <br />
          <span className="text-danger">const</span> request ={" "}
          <span className="text-success">require</span>
          ('<span className="text-warning">request</span>');
          <br />
          <span className="text-success">{"// "} Send your start request</span>
          <br />
          <span className="text-success">requests</span>
          ('
          <span className="text-warning">
            {api_url}pongme/start/{pongKey}
          </span>
          ', {`{`} json: true {`}`}, , (err, res, body) ={`>`} {`{`}
          <br />
          {"   "} <span className="text-danger">if</span> (err) {`{`}{" "}
          <span className="text-danger">return </span>
          console.
          <span className="text-success">log</span>(err); {`}`}
          <br />
          {`}`});
          <br />
          <br />
          <span className="text-success">
            {"// "} START OF YOUR CODE BLOCK...
          </span>
          <br />
          ...
          <br />
          <span className="text-success">
            {"// "} END OF YOUR CODE BLOCK...
          </span>
          <br />
          <br />
          <span className="text-success">{"// "} Send your end request</span>
          <br />
          <span className="text-success">requests</span>
          ('
          <span className="text-warning">
            {api_url}pongme/end/{pongKey}
          </span>
          ', {`{`} json: true {`}`}, , (err, res, body) ={`>`} {`{`}
          <br />
          {"   "} <span className="text-danger">if</span> (err) {`{`}{" "}
          <span className="text-danger">return </span>
          console.
          <span className="text-success">log</span>(err); {`}`}
          <br />
          {`}`});
        </pre>
      </Col>
      <Col xs={12}>
        <small>
          Note: You need to install the request library:{" "}
          <strong>npm install request</strong>
        </small>
      </Col>
    </Row>
  );
};

export default Node;
