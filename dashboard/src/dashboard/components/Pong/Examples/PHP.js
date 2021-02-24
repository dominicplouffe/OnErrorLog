import React from "react";
import { Row, Col } from "react-bootstrap";

const CSharp = ({ pongKey, api_url }) => {
  return (
    <>
      <Row>
        <Col xs={12}>
          <pre className="code p-4" style={{ lineHeight: "20px" }}>
            <span className="text-success">
              # Example to send a start and end request to onErrorLog using PHP
            </span>
            <br />
            $curl = curl_init();
            <br />
            <br />
            <span className="text-success"># Send your start request</span>
            <br />
            curl_setopt_array(
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;$curl,
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;array(
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CURLOPT_URL =&gt; '
            <span className="text-warning">
              {api_url}pongme/start/{pongKey}
            </span>
            '
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;)
            <br />
            );
            <br />
            <br />
            <span className="text-success"># START OF YOUR CODE BLOCK...</span>
            <br />
            ...
            <br />
            <span className="text-success"># END OF YOUR CODE BLOCK...</span>
            <br />
            <br />
            <span className="text-success"># Send your end request</span>
            <br />
            curl_setopt_array(
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;$curl,
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;array(
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;CURLOPT_URL =&gt; '
            <span className="text-warning">
              {api_url}pongme/end/{pongKey}
            </span>
            '
            <br />
            &nbsp;&nbsp;&nbsp;&nbsp;)
            <br />
            );
          </pre>
        </Col>
        <Col xs={12}>
          <small>
            Note: You need to install the request library:{" "}
            <strong>pip install requests</strong>
          </small>
        </Col>
      </Row>
    </>
  );
};

export default CSharp;
