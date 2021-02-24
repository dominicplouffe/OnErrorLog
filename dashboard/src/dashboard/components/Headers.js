import React, {
  useEffect,
  useState,
  forwardRef,
  useImperativeHandle,
} from "react";
import { Modal, Table, Row, Col, Button, Form } from "react-bootstrap";
import api from "../../utils/api";

const Headers = forwardRef(
  ({ alertId, headerType, setShowModal, showModal }, ref) => {
    const [headers, setHeaders] = useState([]);
    const [newHeaderValue, setNewHeaderValue] = useState("");
    const [newHeaderKey, setNewHeaderKey] = useState("");
    const [newHeaderId, setNewHeaderId] = useState(null);

    const fetchHeaders = async () => {
      if (alertId === null) {
        return;
      }
      const { data = null, error = null } = await api(
        `ping_header/?alert=${alertId}&header_type=${headerType}`
      );

      if (data) {
        setHeaders(data.results);
      }

      if (error) {
        alert("Something went wrong, we cannot find your headers");
      }
    };

    const deleteHeader = (id) => {
      const newHeaders = [...headers];
      const hdr = newHeaders[id];
      if (hdr.status === "new") {
        hdr.status = "ignore";
      } else {
        hdr.status = "delete";
      }

      setHeaders(newHeaders);
    };
    useImperativeHandle(ref, () => ({
      getHeaders() {
        return headers.reduce((acc, { key, value }) => {
          acc[key] = value;
          return acc;
        }, {});
      },
      async saveHeaders(alertId) {
        for (let i = 0; i < headers.length; i++) {
          const hdr = headers[i];
          if (hdr.status) {
            if (hdr.status === "update") {
              api(`ping_header/${hdr.id}/`, "PUT", hdr);
            } else if (hdr.status === "new") {
              api(`ping_header/`, "POST", {
                key: hdr.key,
                value: hdr.value,
                header_type: headerType,
                alert: alertId,
              });
            } else if (hdr.status === "delete") {
              api(`ping_header/${hdr.id}/`, "DELETE");
            }
          }
        }
      },
    }));

    const addHeader = () => {
      const newHeaders = [...headers];

      if (newHeaderId === null) {
        const hdr = {
          key: newHeaderKey,
          value: newHeaderValue,
          status: "new",
        };
        newHeaders.push(hdr);
      } else {
        newHeaders[newHeaderId].key = newHeaderKey;
        newHeaders[newHeaderId].value = newHeaderValue;
        newHeaders[newHeaderId].status = "update";
      }

      setHeaders(newHeaders);
      setNewHeaderKey("");
      setNewHeaderValue("");
      setNewHeaderId(null);
    };

    useEffect(() => {
      fetchHeaders();
      // eslint-disable-next-line
    }, [headerType]);

    const HeaderRow = ({ h, i }) => {
      if (h.status === "ignore") {
        return null;
      }
      if (h.status === "delete") {
        return null;
      }

      return (
        <tr>
          <td>{h.key}</td>
          <td>{h.value}</td>
          <td style={{ width: "100px" }} className="text-center">
            <Row className="mt-1" noGutters>
              <Col>
                <Button
                  variant="custom"
                  className="p-0 m-0"
                  onClick={() => {
                    setNewHeaderKey(h.key);
                    setNewHeaderValue(h.value);
                    setNewHeaderId(i);
                  }}
                >
                  <img
                    src="https://onerrorlog.s3.amazonaws.com/images/update.png"
                    alt="update"
                    className="icon"
                    style={{ height: "15px" }}
                  />
                </Button>
              </Col>
              <Col>
                <Button
                  variant="custom"
                  className="p-0 m-0"
                  onClick={() => deleteHeader(i)}
                >
                  <small className="text-danger">
                    <span role="img" aria-label={`delete`}>
                      ✖
                    </span>
                  </small>
                </Button>
              </Col>
            </Row>
          </td>
        </tr>
      );
    };
    return (
      <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title id="result-modal">Headers</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Table borderless>
            <thead>
              <tr>
                <th>Header Name</th>
                <th>Header Value</th>
              </tr>
            </thead>
            <tbody>
              {headers.map((h, i) => (
                <HeaderRow key={i} h={h} i={i} />
              ))}
              <tr>
                <td>
                  <Form.Control
                    value={newHeaderKey}
                    onChange={(e) => setNewHeaderKey(e.target.value)}
                  />
                </td>
                <td>
                  <Form.Control
                    value={newHeaderValue}
                    onChange={(e) => setNewHeaderValue(e.target.value)}
                  />
                </td>
                <td style={{ width: "100px" }} className="text-center">
                  <Row className="mt-1" noGutters>
                    <Col>
                      <Button
                        variant="custom"
                        className="p-0 m-0"
                        disabled={
                          newHeaderKey.trim().length > 0 &&
                          newHeaderValue.trim().length > 0
                            ? false
                            : true
                        }
                        onClick={() => addHeader()}
                      >
                        <small
                          className={
                            newHeaderKey.trim().length > 0 &&
                            newHeaderValue.trim().length > 0
                              ? "text-success"
                              : ""
                          }
                        >
                          <span role="img" aria-label={`update`}>
                            ✔
                          </span>
                        </small>
                      </Button>
                    </Col>
                    <Col>
                      <Button
                        variant="custom"
                        className="p-0 m-0"
                        disabled={newHeaderId !== null ? false : true}
                        onClick={() => {
                          setNewHeaderKey("");
                          setNewHeaderValue("");
                          setNewHeaderId(null);
                        }}
                      >
                        <small
                          className={newHeaderId !== null ? `text-danger` : ""}
                        >
                          <span role="img" aria-label={`delete`}>
                            ✖
                          </span>
                        </small>
                      </Button>
                    </Col>
                  </Row>
                </td>
              </tr>
            </tbody>
          </Table>
          <Row>
            <Col className="text-right">
              <Button
                variant="primary"
                onClick={() => setShowModal(false)}
                className="btn-rounded"
                disabled={
                  newHeaderValue.length !== 0 || newHeaderKey.length !== 0
                }
              >
                Close
              </Button>
            </Col>
          </Row>
        </Modal.Body>
      </Modal>
    );
  }
);

export default Headers;
