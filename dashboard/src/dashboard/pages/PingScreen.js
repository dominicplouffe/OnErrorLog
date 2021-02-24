import React, { useState, useEffect, useRef } from "react";
import Body from "../components/Body";
import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";
import { Card, Row, Col, Button, Form } from "react-bootstrap";
import api from "../../utils/api";
import { useHistory } from "react-router-dom";
import AlertCard from "../components/AlertCard";
import ResultModal from "../components/ResultModal";
import Headers from "../components/Headers";
import DisableButton from "../components/Ping/DisableButton";
import EnableButton from "../components/Ping/EnableButton";
import DeleteButton from "../components/Ping/DeleteButton";
import useAuth from "../../auth/useAuth";

const PingScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const [showBasic, setShowBasic] = useState(false);
  const [showCallbackBasic, setShowCallbackBasic] = useState(false);
  const headersRef = useRef(null);

  // Fields
  const [pingId, setPingId] = useState(null);
  const [alertId, setAlertId] = useState(null);

  const [pingName, setPingName] = useState("");
  const [docLink, setDocLink] = useState("");
  const [endpoint, setEndpoint] = useState("");
  const [endpointUsername, setEndpointUsername] = useState("");
  const [endpointPassword, setEndpointPassword] = useState("");
  const [interval, setInterval] = useState("");
  const [returnCode, setReturnCode] = useState("");
  const [contentType, setContentType] = useState("");
  const [validationText, setValidationText] = useState("");
  const [jsonKey, setJsonKey] = useState("");
  const [jsonValue, setJsonValue] = useState("");

  const [incidentInterval, setIncidentInterval] = useState("");

  const [incidentMethod, setIncidentMethod] = useState("");
  const [incidentEndpoint, setIncidentEndpoint] = useState("");
  const [incidentEndpointUser, setIncidentEndpointUser] = useState("");
  const [incidentEndpointPass, setIncidentEndpointPass] = useState("");

  const [active, setActive] = useState(true);
  const [showResultModal, setShowResultModal] = useState(false);
  const [showHeaderModal, setShowHeaderModal] = useState(false);
  const [headerType, setHeaderType] = useState("endpoint");

  const [isTesting, setIsTesting] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [formErrors, setFormErrors] = useState([""]);
  const [summary, setSummary] = useState(null);
  const { refresh } = useAuth();

  let history = useHistory();

  const validateTesterForm = () => {
    const errors = [];

    if (endpoint.trim().length === 0) {
      errors.push("endpoint");
    }

    if (
      endpointUsername.trim().length > 0 &&
      endpointPassword.trim().length === 0
    ) {
      setShowBasic(true);
      errors.push("endpointpassword");
    }
    if (
      endpointPassword.trim().length > 0 &&
      endpointUsername.trim().length === 0
    ) {
      setShowBasic(true);
      errors.push("endpointusername");
    }
    if (returnCode.toString().trim().length === 0) {
      errors.push("returncode");
    }
    if (contentType.trim().length === 0) {
      errors.push("contenttype");
    } else if (contentType === "text/plain") {
      if (validationText.trim().length === 0) {
        errors.push("validationText");
      }
    } else if (contentType === "application/json") {
      if (jsonKey.trim().length === 0) {
        errors.push("jsonkey");
      }
      if (jsonValue.trim().length === 0) {
        errors.push("jsonvalue");
      }
    }

    return errors;
  };

  const validateForm = () => {
    const errors = validateTesterForm();

    if (pingName.trim().length === 0) {
      errors.push("name");
    }
    if (interval.toString().trim().length === 0) {
      errors.push("interval");
    }
    if (incidentInterval.toString().trim().length === 0) {
      errors.push("incidentinterval");
    }
    if (incidentMethod.trim().length === 0) {
      errors.push("incidentmethod");
    } else if (incidentMethod === "callback") {
      if (incidentEndpoint.trim().length === 0) {
        errors.push("incidentendpoint");
      } else {
        if (
          incidentEndpointUser.trim().length > 0 &&
          incidentEndpointPass.trim().length === 0
        ) {
          setShowCallbackBasic(true);
          errors.push("callbackpassword");
        }
        if (
          incidentEndpointPass.trim().length > 0 &&
          incidentEndpointUser.trim().length === 0
        ) {
          setShowCallbackBasic(true);
          errors.push("callbackusername");
        }
      }
    }
    setFormErrors(errors);

    return errors;
  };

  const savePing = async (pingActive) => {
    const errors = validateForm();

    if (pingActive === null) {
      pingActive = active;
    }

    if (errors.length === 0) {
      const payload = {
        name: pingName,
        endpoint: endpoint,
        endpoint_username: endpointUsername,
        endpoint_password: endpointPassword,
        interval: interval,
        status_code: returnCode,
        content_type: contentType,
        expected_string: jsonKey,
        expected_value: "", //validationText || jsonValue,
        callback_url: incidentEndpoint,
        callback_username: incidentEndpointUser,
        callback_password: incidentEndpointPass,
        incident_interval: incidentInterval,
        active: pingActive,
        notification_type: incidentMethod,
        doc_link: docLink,
      };

      if (jsonKey) {
        payload["expected_value"] = jsonValue;
      } else {
        payload["expected_value"] = validationText;
      }

      let data = null;
      if (pingId) {
        payload["id"] = pingId;
        const res = await api(`ping/${pingId}/`, "PUT", payload);
        data = res.data;
      } else {
        const res = await api(`ping/`, "POST", payload);
        data = res.data;
      }

      if (data) {
        await headersRef.current.saveHeaders(data.id);
        history.push(`/ping/${data.id}/`);
        setSaved(true);
      }
    }
  };

  const fetchSummary = async (id) => {
    if (loading) {
      const { data = null, error = null } = await api(
        `alert_summary/ping/${id}/`
      );

      if (data) {
        setSummary(data.objects[0]);
      }
      if (error) {
        alert("Something went wrong, we cannot find your ping");
      }
    }
  };

  const fetchPing = async (id) => {
    const { data = null, error = null } = await api(`ping/${id}/`);

    if (data) {
      setPingName(data.name);
      setEndpoint(data.endpoint || "");
      setEndpointUsername(data.endpoint_username || "");
      setEndpointPassword(data.endpoint_password || "");
      setInterval(data.interval || "");
      setReturnCode(data.status_code.toString());
      setContentType(data.content_type || "");
      setValidationText(data.expected_value || "");
      setJsonKey(data.expected_string || "");
      setJsonValue(data.expected_value || "");

      // Alert Settings
      setIncidentInterval(data.alert.incident_interval || "");
      setIncidentEndpoint(data.alert.callback_url || "");
      setIncidentEndpointUser(data.alert.callback_username || "");
      setIncidentEndpointPass(data.alert.callback_password || "");
      setIncidentMethod(data.alert.notification_type);
      setDocLink(data.alert.doc_link || "");
      setAlertId(data.alert.id);

      setActive(data.active);

      fetchSummary(id);
    }

    if (error) {
      alert("Something went wrong, we cannot find your ping");
    }

    setLoading(false);
  };

  const deletePing = async () => {
    await api(`ping/${pingId}/`, "DELETE");

    history.push("/pings");
  };

  const testPing = async () => {
    /*const errors = validateTesterForm();
    if (errors.length !== 0) {
      return;
    }*/

    setIsTesting(true);
    setTestResults(null);

    const headers = headersRef.current.getHeaders();
    let { data = null } = await api(`ping-test/`, "POST", {
      endpoint,
      headers,
      status_code: returnCode,
      content_type: contentType,
      expected_str: jsonKey,
      expected_value: jsonKey ? jsonValue : validationText,
      username: endpointUsername,
      password: endpointPassword,
    });

    if (data === null) {
      data = {};
      data["check_status"] = false;
      data["reason"] = "system_error";
    }

    setTestResults(data);
    setIsTesting(false);
  };

  useEffect(() => {
    const id = props.match.params.id;

    if (id !== "0") {
      fetchPing(parseInt(id));
      setPingId(parseInt(id));
    } else {
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [props.match.params, refresh]);

  const renderTestingLabel = () => {
    if (isTesting) {
      return "Running";
    }
    if (testResults && testResults.check_status) {
      return "Success";
    } else if (testResults && !testResults.check_status) {
      return "Failure";
    }

    return "Test Your Endpoint";
  };

  const getTestButtonVariant = () => {
    if (testResults && !testResults.check_status) {
      return "danger";
    }
    if (testResults && testResults.check_status) {
      return "success";
    }
    if (!testResults) {
      return "warning";
    }
  };

  const setValue = (method, value) => {
    if (method === setContentType) {
      setValidationText("");
      setJsonKey("");
      setJsonValue("");
    }
    if (method === setIncidentMethod) {
      if (value === "team") {
        setIncidentEndpoint(null);
        setIncidentEndpointPass("");
        setIncidentEndpointUser("");
      }
    }
    method(value);
    setTestResults(null);
  };

  return (
    <Body
      title="Ping Management"
      selectedMenu="ping"
      {...props}
      loading={loading}
    >
      {summary && (
        <AlertCard
          m={summary}
          showSummary={false}
          showEdit={false}
          otherPath="ping"
          showResponseView={true}
        />
      )}
      <Card>
        <Card.Body>
          <Card.Title>Uptime Monitor Details</Card.Title>
          <Card.Subtitle>
            A Uptime Monitor will hit a URL of your choice on a regular cadence
            to ensure that it is still working as expected. onErrorLog will not
            only confirm that the URL is up and working, but will also confirm
            that the data the web server sends back is correct.
          </Card.Subtitle>
          <Row className="mt-3">
            <Col xs={12} sm={12} lg={6}>
              <InputText
                id="name"
                label="Uptime Monitor"
                value={pingName}
                isInvalid={formErrors.indexOf("name") > -1}
                onChange={(e) => setValue(setPingName, e.target.value)}
              />
            </Col>
            <Col xs={12} sm={12} lg={6}>
              <InputText
                id="doc_link"
                label="Documentation URL"
                value={docLink}
                onChange={(e) => setValue(setDocLink, e.target.value)}
                helperText={
                  <>
                    <span>
                      If you want to send a URL to your on-call team with some
                      documenation on the procedures to confirm and resolve a
                      failure, you enter it here. The URL will be sent along
                      with all failure notifications.
                    </span>
                  </>
                }
              />
            </Col>
          </Row>
          <Row className="pt-3">
            <Col xs={12} sm={12} lg={6}>
              <InputText
                id="endpoint"
                label="Endpoint URL"
                value={endpoint}
                placeholder="https://www.mydomain.com/status"
                helperText={
                  <>
                    <span>
                      The URL which onErrorLog will ping to confirm that your
                      service is working
                    </span>
                    <Row>
                      <Col>
                        <Button
                          variant="link"
                          className="p-2 m-0 btn-link"
                          onClick={() => setValue(setShowBasic, !showBasic)}
                        >
                          <small>
                            {showBasic
                              ? ` [-] basic authentication`
                              : ` [+] show basic authentication`}
                          </small>
                        </Button>
                      </Col>
                      <Col className="text-right">
                        <Button
                          variant="link"
                          className="p-2 m-0 btn-link"
                          onClick={() => {
                            setShowHeaderModal(true);
                            setHeaderType("endpoint");
                          }}
                        >
                          <small>My endpoint needs headers</small>
                        </Button>
                      </Col>
                    </Row>
                  </>
                }
                isInvalid={formErrors.indexOf("endpoint") > -1}
                onChange={(e) => setValue(setEndpoint, e.target.value)}
              />
            </Col>
            <Col xs={12} sm={12} lg={6}>
              <InputSelect
                id="interval"
                label="Monitor Interval"
                defaultValue={interval}
                defaultText="Select an interval"
                helperText="The number of minutes that onErrorLog will wait in between requests to your endpoint"
                showDefault={true}
                values={[
                  { value: "5", text: "5 Minutes" },
                  { value: "10", text: "10 Minutes" },
                  { value: "15", text: "15 Minutes" },
                  { value: "20", text: "20 Minutes" },
                  { value: "25", text: "25 Minutes" },
                  { value: "30", text: "30 Minutes" },
                ]}
                isInvalid={formErrors.indexOf("interval") > -1}
                onChange={(e) => setValue(setInterval, e.target.value)}
              />
            </Col>
          </Row>
          {showBasic && (
            <Row className="pt-2 pl-2">
              <Col xs={12} sm={12} lg={6}>
                <InputText
                  id="endpointusenrame"
                  label="Username (OPTIONAL)"
                  value={endpointUsername}
                  placeholder=""
                  helperText="The username if your BASIC authentication for your endpoint."
                  isInvalid={formErrors.indexOf("endpointusername") > -1}
                  onChange={(e) =>
                    setValue(setEndpointUsername, e.target.value)
                  }
                />
              </Col>
              <Col xs={12} sm={12} lg={6}>
                <InputText
                  id="endpointpassword"
                  label="Password (OPTIONAL)"
                  value={endpointPassword}
                  placeholder=""
                  helperText="The password if your BASIC authentication for your endpoint."
                  type="password"
                  isInvalid={formErrors.indexOf("endpointpassword") > -1}
                  onChange={(e) =>
                    setValue(setEndpointPassword, e.target.value)
                  }
                />
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Uptime Monitor Validation</Card.Title>
          <Card.Subtitle>
            Enter the information needed to validate that your endpoint is
            working correctly.
          </Card.Subtitle>
          <Row className="pt-3">
            <Col xs={12} sm={12} lg={6}>
              <InputSelect
                id="returncode"
                label="Expected Status Code"
                defaultValue={returnCode}
                defaultText="Select a status code"
                helperText="The HTTP Status code your are expecting"
                showDefault={true}
                values={[
                  { value: "200", text: "200 OK" },
                  { value: "201", text: "201 Created" },
                  { value: "202", text: "202 Accepted" },
                  { value: "301", text: "301 Moved Permanently" },
                  { value: "302", text: "302 Moved Temporirarly" },
                  { value: "0", text: "** Don't Check for Status Code **" },
                ]}
                isInvalid={formErrors.indexOf("returncode") > -1}
                onChange={(e) => setValue(setReturnCode, e.target.value)}
              />
            </Col>
            <Col xs={12} sm={12} lg={6}>
              <InputSelect
                id="contenttype"
                label="Content Type"
                defaultValue={contentType}
                defaultText="Select a content type"
                helperText="The content type your request will return"
                showDefault={true}
                values={[
                  { value: "text/plain", text: "Text (Plain)" },
                  { value: "application/json", text: "JSON" },
                ]}
                onChange={(e) => setValue(setContentType, e.target.value)}
                isInvalid={formErrors.indexOf("contenttype") > -1}
              />
            </Col>
          </Row>
          {contentType === "text/plain" && (
            <Row className="pt-3">
              <Col>
                <Form.Group controlId="validationText">
                  <Form.Label>Validation Text</Form.Label>
                  <Form.Control
                    as="textarea"
                    rows="3"
                    className={`text-muted pl-2 ${
                      formErrors.indexOf("validationText") > -1
                        ? `is-invalid`
                        : ``
                    }`}
                    onChange={(e) => {
                      setValue(setValidationText, e.target.value);
                    }}
                    value={validationText}
                  />
                  <Form.Text className={`text-muted pl-2`}>
                    The text in this above text box will need to be in your
                    response
                  </Form.Text>
                </Form.Group>
              </Col>
            </Row>
          )}
          {contentType === "application/json" && (
            <Row className="pt-3 pl-2">
              <Col xs={12} sm={12} lg={6}>
                <InputText
                  id="jsonkey"
                  label="JSON Key"
                  value={jsonKey}
                  placeholder=""
                  helperText={
                    <>
                      <div>
                        - Separate nested keys with periods (e.g.
                        data.results.key_containing_value).
                      </div>
                      <div>
                        - Ensure the key/value case is the same as the expected
                        results.
                      </div>
                    </>
                  }
                  isInvalid={formErrors.indexOf("jsonkey") > -1}
                  onChange={(e) => setValue(setJsonKey, e.target.value)}
                />
              </Col>
              <Col xs={12} sm={12} lg={6}>
                <InputText
                  id="jsonvalue"
                  label="JSON Value"
                  value={jsonValue}
                  placeholder=""
                  helperText="The value your are expecting in the JSON that will be returned"
                  isInvalid={formErrors.indexOf("jsonvalue") > -1}
                  onChange={(e) => setValue(setJsonValue, e.target.value)}
                />
              </Col>
            </Row>
          )}
          <Row>
            <Col className="text-right">
              <>
                <Button
                  variant={getTestButtonVariant()}
                  onClick={() => testPing()}
                  className="btn-rounded"
                >
                  {renderTestingLabel()}
                </Button>
                {testResults && (
                  <Button
                    variant="primary"
                    className="ml-2 btn-rounded"
                    onClick={() => setShowResultModal(true)}
                  >
                    View Results
                  </Button>
                )}
              </>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Card.Title>Notification Settings</Card.Title>
          <Card.Subtitle>
            Tell us what to do when we find an issue with your endpoint
          </Card.Subtitle>
          <Row className="pt-3">
            <Col xs={12} sm={12} lg={6}>
              <InputSelect
                id="incidentmethod"
                label="How would you like to be contacted"
                defaultValue={incidentMethod}
                defaultText="Select a contact method"
                helperText="The method that onErrorLog will contact you if we find an issue with your endpoint"
                showDefault={true}
                values={[
                  {
                    value: "team",
                    text: "Notify your team (email or text message)",
                  },
                  { value: "callback", text: "HTTP Callback" },
                ]}
                onChange={(e) => setValue(setIncidentMethod, e.target.value)}
                isInvalid={formErrors.indexOf("incidentmethod") > -1}
              />
            </Col>
            <Col xs={12} sm={12} lg={6}>
              <InputSelect
                id="incidentinternal"
                label="Minimum Incident Count"
                defaultValue={incidentInterval}
                defaultText="Select an incident count"
                helperText={`onErrorLog will contact you when your monitor has been triggered ${
                  incidentInterval ? incidentInterval : `1`
                } time(s)`}
                showDefault={true}
                values={[
                  { value: "1", text: "Tell us right away" },
                  { value: "2", text: "2 Incidents" },
                  { value: "5", text: "5 Incidents" },
                  { value: "10", text: "10 Incidents" },
                ]}
                isInvalid={formErrors.indexOf("incidentinterval") > -1}
                onChange={(e) => setValue(setIncidentInterval, e.target.value)}
              />
            </Col>
          </Row>
          {incidentMethod === "callback" && (
            <Row className="pt-3">
              <Col xs={12} sm={12} lg={6}>
                <InputText
                  id="incidentenpoint"
                  label="HTTP Callback URL"
                  value={incidentEndpoint}
                  placeholder="https://www.mydomain.com/callback"
                  helperText={
                    <>
                      <span>
                        The callback that onErrorLog will hit when it finds an
                        incident (only POSTs are supported)
                      </span>
                      <Row>
                        <Col>
                          <Button
                            variant="link"
                            className="p-0 m-0 btn-link"
                            onClick={() =>
                              setValue(setShowCallbackBasic, !showCallbackBasic)
                            }
                          >
                            <small>
                              {showCallbackBasic
                                ? ` [-] basic authentication`
                                : ` [+] show basic authentication`}
                            </small>
                          </Button>
                        </Col>
                        <Col className="text-right">
                          <Button
                            variant="link"
                            className="p-2 m-0 btn-link"
                            onClick={() => {
                              setShowHeaderModal(true);
                              setHeaderType("callback");
                            }}
                          >
                            <small>My endpoint needs headers</small>
                          </Button>
                        </Col>
                      </Row>
                    </>
                  }
                  isInvalid={formErrors.indexOf("incidentendpoint") > -1}
                  onChange={(e) => {
                    setValue(setIncidentEndpoint, e.target.value);
                  }}
                />
              </Col>
              <Col>
                <strong>About Callbacks</strong>
                <small>
                  <div>
                    Callbacks will be sent in the case that an incident is
                    triggered. If everything is working properly, the callback
                    will be not initiated.
                  </div>
                  <Row className="mt-2">
                    <Col>
                      <strong>Method</strong>: POST
                    </Col>
                    <Col>
                      <strong>Body Content Type</strong>: application/json
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <strong>Body Fields:</strong> http_status_code, reason,
                      response_time
                    </Col>
                  </Row>
                </small>
              </Col>
            </Row>
          )}
          {showCallbackBasic && (
            <Row className="pt-2 pl-2">
              <Col xs={12} sm={12} lg={6}>
                <InputText
                  id="callbackusenrame"
                  label="Username (OPTIONAL)"
                  value={incidentEndpointUser}
                  placeholder=""
                  helperText="The username if your BASIC authentication for your callback endpoint."
                  isInvalid={formErrors.indexOf("callbackusername") > -1}
                  onChange={(e) =>
                    setValue(setIncidentEndpointUser, e.target.value)
                  }
                />
              </Col>
              <Col xs={12} sm={12} lg={6}>
                <InputText
                  id="callbackpassword"
                  label="Password (OPTIONAL)"
                  value={incidentEndpointPass}
                  placeholder=""
                  helperText="The password if your BASIC authentication for your callback endpoint."
                  type="password"
                  isInvalid={formErrors.indexOf("callbackpassword") > -1}
                  onChange={(e) =>
                    setValue(setIncidentEndpointPass, e.target.value)
                  }
                />
              </Col>
            </Row>
          )}
        </Card.Body>
      </Card>
      <Row>
        <Col className="text-left pl-3" xs={12} lg={6}>
          <DeleteButton
            pingId={pingId}
            active={active}
            deleteAction={() => deletePing()}
            text="ping"
          />
          {saved && (
            <strong className="text-success">Your ping has been saved.</strong>
          )}
        </Col>
        <Col className="text-right" xs={12} lg={6}>
          <EnableButton
            objectId={pingId}
            active={active}
            enableAction={() => {
              setActive(true);
              savePing(true);
            }}
            text="ping"
          />
          <DisableButton
            objectId={pingId}
            active={active}
            disableAction={() => {
              setActive(false);
              savePing(false);
            }}
            text="ping"
          />{" "}
          <Button
            variant="primary"
            onClick={() => savePing(null)}
            className="btn-rounded"
          >
            Save Uptime
          </Button>
        </Col>
      </Row>

      <ResultModal
        setShowModal={setShowResultModal}
        showModal={showResultModal}
        title={`Endpoint Test Results`}
        result={testResults}
      />

      <Headers
        ref={headersRef}
        showModal={showHeaderModal}
        setShowModal={setShowHeaderModal}
        headerType={headerType}
        alertId={alertId}
      />
    </Body>
  );
};

export default PingScreen;
