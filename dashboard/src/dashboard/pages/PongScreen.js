import React, { useState, useEffect, useRef } from "react";
import Body from "../components/Body";
import { API_URL } from "../../utils/globals";
import api from "../../utils/api";
import { useHistory } from "react-router-dom";
import { Card, Row, Col, Button, Tabs, Tab } from "react-bootstrap";
import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";
import Python from "../components/Pong/Examples/Python";
import Node from "../components/Pong/Examples/Node";
import Bash from "../components/Pong/Examples/Bash";
import PHP from "../components/Pong/Examples/PHP";
import Ruby from "../components/Pong/Examples/Ruby";
import Headers from "../components/Headers";
import DisableButton from "../components/Ping/DisableButton";
import EnableButton from "../components/Ping/EnableButton";
import DeleteButton from "../components/Ping/DeleteButton";
import AlertCard from "../components/AlertCard";
import useAuth from "../../auth/useAuth";

const generatePongKey = () => {
  let keyParts = [];

  for (let i = 0; i < 4; i++) {
    let part = "";
    for (let j = 0; j < 6; j++) {
      part = `${part}${Math.floor(Math.random() * 10)}`;
    }
    keyParts.push(part);
  }

  const key = keyParts.join("-");

  return key;
};

const PongScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);
  const [exampleTab, setExampleTab] = useState("python");
  const headersRef = useRef(null);

  const [showCallbackBasic, setShowCallbackBasic] = useState(false);

  const [pongId, setPongId] = useState(null);
  const [alertId, setAlertId] = useState(null);
  const [pongKey, setPongKey] = useState();
  const [pongName, setPongName] = useState("");
  const [docLink, setDocLink] = useState("");
  const [incidentInterval, setIncidentInterval] = useState("");
  const [incidentMethod, setIncidentMethod] = useState("");
  const [incidentEmail, setIncidentEmail] = useState("");
  const [incidentEndpoint, setIncidentEndpoint] = useState("");
  const [incidentEndpointUser, setIncidentEndpointUser] = useState("");
  const [incidentEndpointPass, setIncidentEndpointPass] = useState("");
  const [showHeaderModal, setShowHeaderModal] = useState(false);
  const [headerType, setHeaderType] = useState("endpoint");
  const [active, setActive] = useState(true);
  const [triggers, setTriggers] = useState([
    {
      id: null,
      trigger_type: "complete_not_triggered_in",
      interval_value: 5,
      unit: "minutes",
      interval_error: false,
      is_delete: false,
    },
  ]);
  const [cron, setCron] = useState("");
  const [cronError, setCronError] = useState(false);
  const [formErrors, setFormErrors] = useState([""]);
  const [summary, setSummary] = useState(null);
  const { refresh } = useAuth();

  const [cronHelper, setCronHelper] = useState(
    'If this task is running as a cron, let us know the cron schedule (e.g. "5 0 * 8 *"). If no cron schedule is specified, onErrorLog will assume the task is running 24h per day.'
  );

  let history = useHistory();
  useEffect(() => {
    const id = props.match.params.id;

    if (id !== "0") {
      fetchPong(parseInt(id));
      setPongId(parseInt(id));
    } else {
      setPongKey(generatePongKey());
      setLoading(false);
    }
    // eslint-disable-next-line
  }, [props.match.params, refresh]);

  const fetchPong = async (id) => {
    const { data = null, error = null } = await api(`pong/${id}/`);

    if (data) {
      setPongName(data.name);
      setDocLink(data.alert.doc_link);
      setIncidentMethod(data.alert.notification_type);
      setIncidentEndpoint(data.alert.callback_url || "");
      setIncidentEndpointUser(data.alert.callback_username || "");
      setIncidentEndpointPass(data.alert.callback_password || "");
      setIncidentInterval(data.alert.incident_interval || "");
      setAlertId(data.alert.id);
      setActive(data.active);
      setPongKey(data.push_key);
      setCron(data.cron_desc || "");
      setTriggers(data.triggers);

      fetchSummary(id);
    }

    if (error) {
      alert("Something went wrong, we cannot find your pong");
    }

    setLoading(false);
  };

  const setValue = (method, value) => {
    if (method === setIncidentMethod) {
      if (value === "team") {
        setIncidentEndpoint(null);
        setIncidentEndpointPass("");
        setIncidentEndpointUser("");
      }
    }
    method(value);
  };

  const deletePong = async () => {
    await api(`pong/${pongId}/`, "DELETE");

    history.push("/pongs");
  };

  const savePong = async (pongActive) => {
    const errors = validateForm();

    if (pongActive === null) {
      pongActive = active;
    }
    if (errors.length === 0 && !cronError) {
      const payload = {
        name: pongName,
        doc_link: docLink,
        direction: "pull",
        notification_type: incidentMethod,
        callback_url: incidentEndpoint,
        callback_username: incidentEndpointUser,
        callback_password: incidentEndpointPass,
        incident_interval: incidentInterval,
        active: pongActive,
        push_key: pongKey,
        cron_desc: cron,
        triggers: triggers,
      };

      let data = null;
      if (pongId) {
        payload["id"] = pongId;
        const res = await api(`pong/${pongId}/`, "PUT", payload);
        data = res.data;
      } else {
        const res = await api(`pong/`, "POST", payload);
        data = res.data;
      }

      if (data) {
        await headersRef.current.saveHeaders(data.id);
        history.push(`/pong/${data.id}/`);
        setSaved(true);
      }
    }
  };

  const validateForm = () => {
    const errors = [];

    if (pongName.trim().length === 0) {
      errors.push("name");
    }
    if (incidentInterval.toString().trim().length === 0) {
      errors.push("incidentinterval");
    }

    if (incidentMethod.trim().length === 0) {
      errors.push("incidentmethod");
    } else if (incidentMethod === "callback") {
      if (!incidentEndpoint || incidentEndpoint.trim().length === 0) {
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

  const fetchSummary = async (id) => {
    const { data = null, error = null } = await api(
      `alert_summary/pong/${id}/`
    );

    if (data) {
      setSummary(data.objects[0]);
    }
    if (error) {
      alert("Something went wrong, we cannot find your pong");
    }
  };

  const setTriggerValue = (k, v, idx) => {
    const newtrigs = [...triggers];

    if (k === "interval") {
      if (isNaN(parseInt(v))) {
        newtrigs[idx].interval_error = true;
      } else {
        newtrigs[idx].interval_error = false;
      }
    }

    newtrigs[idx][k] = v;

    setTriggers(newtrigs);
  };

  const addTrigger = () => {
    const newtrigs = [...triggers];

    newtrigs.push({
      id: null,
      trigger_type: "complete_not_triggered_in",
      interval_value: 5,
      unit: "minutes",
      interval_error: false,
      is_delete: false,
    });

    setTriggers(newtrigs);
  };

  const deleteTrigger = (idx) => {
    const newtrigs = [];

    for (let i = 0; i < triggers.length; i++) {
      if (i === idx) {
        if (triggers[i] === null) {
          continue;
        }
        triggers[i].is_delete = true;
      }

      newtrigs.push(triggers[i]);
    }

    setTriggers(newtrigs);
  };

  const checkCron = async (cron) => {
    const { data = null, error = null } = await api(
      "pong/cron_check/",
      "POST",
      {
        cron: cron,
      }
    );

    if (data) {
      setCronError(false);
      let pretty = data.pretty;
      pretty = `${pretty.substr(0, 1).toLowerCase()}${pretty.substr(1)}`;
      setCronHelper(
        <>
          <span>
            onErrorLog will check this heartbeat{" "}
            <strong className="text-warning">{pretty}</strong>
          </span>
        </>
      );
    }

    if (error) {
      setCronError(true);
    }
  };

  const showDelete = () => {
    let cnt = 0;
    for (let i = 0; i < triggers.length; i++) {
      if (!cnt.is_delete) {
        cnt += 1;
      }
    }

    if (cnt === 1) {
      return false;
    }

    return true;
  };

  const renderTrigger = (t, i) => {
    if (t.is_delete) {
      return null;
    }
    return (
      <Row key={i} className="pt-2">
        <Col xs={12} lg={7}>
          <Row>
            <Col xs={10}>
              <label className="form-label">Select your trigger</label>
            </Col>
            <Col className="text-right">
              {showDelete() && (
                <Button
                  variant="link"
                  className="pt-1 mr-0 pr-0"
                  onClick={() => deleteTrigger(i)}
                >
                  <small>delete</small>
                </Button>
              )}
            </Col>
          </Row>
          <InputSelect
            id="triggertype"
            defaultValue={t.trigger_type}
            showDefault={false}
            values={[
              {
                value: "complete_not_triggered_in",
                text: "Complete endpoint has not been requested in",
              },
              {
                value: "start_not_triggered_in",
                text: "Start endpoint has not been requested in",
              },
              {
                value: "runs_less_than",
                text: "Task runs in less than",
              },
              {
                value: "runs_more_than",
                text: "Task runs for more than",
              },
              {
                value: "heartbeat_triggered",
                text: "Your heartbeat fail was triggered",
              },
            ]}
            onChange={(e) => setTriggerValue("trigger_type", e.target.value, i)}
          />
        </Col>
        <Col xs={6} lg={2}>
          {t.trigger_type !== "heartbeat_triggered" && (
            <InputText
              id="triggerinterval"
              label={"Duration"}
              value={t.interval_value}
              onChange={(e) =>
                setTriggerValue("interval_value", e.target.value, i)
              }
              isInvalid={t.interval_error}
            />
          )}
        </Col>
        <Col xs={6} lg={3} className="text-right">
          {t.trigger_type !== "heartbeat_triggered" && (
            <InputSelect
              id="triggertype"
              label="Time Unit"
              defaultValue={t.unit}
              showDefault={false}
              values={[
                {
                  value: "seconds",
                  text: "Second(s)",
                },
                {
                  value: "minutes",
                  text: "Minute(s)",
                },
                {
                  value: "days",
                  text: "Day(s)",
                },
              ]}
              onChange={(e) => setTriggerValue("unit", e.target.value, i)}
            />
          )}
        </Col>
      </Row>
    );
  };

  return (
    <Body
      title="Heartbeat Management"
      selectedMenu="pong"
      {...props}
      loading={loading}
    >
      {summary && (
        <AlertCard
          m={summary}
          showSummary={false}
          showEdit={false}
          showOther={true}
          otherPath="pong"
        />
      )}
      <Card>
        <Card.Body>
          <Row className="pt-3">
            <Col xs={12} lg={7}>
              <Row>
                <Col>
                  <Card.Title>Heartbeat</Card.Title>
                  <Card.Subtitle>
                    Tell us a bit about your heartbeat
                  </Card.Subtitle>
                </Col>
              </Row>

              <Row>
                <Col xs={12} sm={12} lg={6}>
                  <InputText
                    id="name"
                    label="Monitor Name"
                    value={pongName}
                    isInvalid={formErrors.indexOf("name") > -1}
                    onChange={(e) => setValue(setPongName, e.target.value)}
                  />
                </Col>
                <Col>
                  <InputText
                    id="name"
                    label="Cron Schedule"
                    value={cron}
                    isInvalid={cronError}
                    onChange={(e) => setValue(setCron, e.target.value)}
                    helperText={
                      <>
                        <span>{cronHelper}</span>
                      </>
                    }
                    onBlur={(e) => checkCron(e.target.value)}
                  />
                </Col>
              </Row>
              <Row>
                <Col xs={12} sm={12} lg={6}>
                  <InputText
                    id="doc_link"
                    label="Documentation URL"
                    value={docLink}
                    onChange={(e) => setValue(setDocLink, e.target.value)}
                    helperText={
                      <>
                        <span>
                          If you want to send a URL to your on-call team with
                          some documenation on the procedures to confirm and
                          resolve a failure, you enter it here. The URL will be
                          sent along with all failure notifications.
                        </span>
                      </>
                    }
                  />
                </Col>
              </Row>
            </Col>
            <Col className="doc-box">
              <h5 className="mt-0 pt-0">Help with this form</h5>
              <p>
                <strong>Monitor Name</strong>
                <span className="doc-text">
                  <br /> Give us a unique name to identify your monitor
                </span>
              </p>
              <p>
                <strong>Cron Schedule</strong>
                <br />
                <span className="doc-text">
                  If your task has a cron schedule, paste it here. This will
                  ensure that onErrorLog does not monitor the task when it is{" "}
                  <em>"not"</em> suppose to be running. For example, if you
                  enter this cron schedule <em>"5 4-12 * * *"</em>. onErrorLog
                  will monitor your task between the hours of 4am and 12pm UTC
                  only.
                  <br />
                  <br />
                  If you do not enter a cron schedule, onErrorLog will assume
                  that the task is running 24 hours a day, every day.
                </span>
              </p>
              <p>
                <strong>Documentation URL</strong>
                <span className="doc-text">
                  <br /> If you have a URL to a wiki page that explains what to
                  do in case this monitor is triggered, paste it here. It will
                  be sent along with the notification.
                </span>
              </p>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Row className="pt-3">
            <Col xs={12} lg={7}>
              <Row>
                <Col>
                  <Card.Title>Notification Rules</Card.Title>
                  <Card.Subtitle>
                    Tell us the rules that onErrorLog should apply to know when
                    to send an alert.
                  </Card.Subtitle>
                </Col>
              </Row>
              {triggers.map((t, i) => renderTrigger(t, i))}
              <Row className="pt-4">
                <Col className="text-right">
                  <Button
                    variant="primary"
                    onClick={() => addTrigger()}
                    className="btn-rounded"
                  >
                    New Rule
                  </Button>
                </Col>
              </Row>
            </Col>
            <Col className="doc-box">
              <h5 className="mt-0 pt-0">Help with this form</h5>
              <p>
                <strong>Trigger</strong>
                <span className="doc-text">
                  <br />
                  This rules tells onErrorLog when to check for an issue.
                  <br />
                  Once you save your monitor, you will be given two REST
                  endpoints. A <em>start</em> and an <em>end</em> endpoint. The
                  start endpoint is to be called at the beginning of your code
                  block and the end endpoint is to be called at the completion
                  of your code block. Using both of these endpoints, onErrorLog
                  can monitor your code to ensure it has completed successfully.
                </span>
              </p>
              <ul className="mt-2">
                <li>
                  <span className="doc-text">
                    <strong>Start endpoint has not be requested in</strong>: If
                    onErrorLog does not receive a request from your start
                    endpoint in x minutes, an alert will be triggered. For
                    example: The duration/unit is <em>5 minutes</em>. onErrorLog
                    receives a notification at 11:00am. By 11:05am it has not
                    yet recieved a notification from your{" "}
                    <em>start endpoint</em>, an alert will be triggered.
                  </span>
                </li>
                <li>
                  <span className="doc-text">
                    <strong>Complete endpoint has not be requested in</strong>:
                    If onErrorLog does not receive a request from your end
                    endpoint in x minutes, an alert will be triggered. For
                    example: The duration/unit is <em>5 minutes</em>. onErrorLog
                    receives a notification at 11:00am. By 11:05am it has not
                    yet recieved a notification from your <em>end endpoint</em>,
                    an alert will be triggered.
                  </span>
                </li>
                <li>
                  <span className="doc-text">
                    <strong>Task runs in less than</strong>: If onErrorLog
                    recieves a request from your end endpoint, but and the
                    difference from the start and end requests is less than the
                    specified duration/unit, an alert will be triggered. For
                    example: The duration/unit is 10 minutes, meaning that the
                    task should last at least 10 minutes. If onErrorLog recieves
                    your start endpoint at 11:00am and your end enpoint at
                    11:05am, an alert will be triggered. The task ran for 5
                    minutes less than expected.
                  </span>
                </li>
                <li>
                  <span className="doc-text">
                    <strong>Task runs for more than</strong>: If onErrorLog
                    recieves a request from your end endpoint, but and the
                    difference from the start and end requests is more than the
                    specified duration/unit, an alert will be triggered. For
                    example: The duration/unit is 10 minutes, meaning that the
                    task should not run for more than 10 minutes. If onErrorLog
                    recieves your start endpoint at 11:00am and your end enpoint
                    at 11:15am, an alert will be triggered. The task ran for 15
                    minutes, 5 more minutes than expected.
                  </span>
                </li>
                <li>
                  <span className="doc-text">
                    <strong>Your heartbeat fail was triggered</strong>: If
                    onErrorLog receives a request from the fail endpoint, the
                    monitor will be triggered.
                  </span>
                </li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      <Card>
        <Card.Body>
          <Row className="pt-3">
            <Col xs={12} sm={12} lg={7}>
              <Row>
                <Col>
                  <Card.Title>Notification Settings</Card.Title>
                  <Card.Subtitle>
                    Tell us what to do when we get trigger from your application
                  </Card.Subtitle>
                </Col>
              </Row>
              <Row>
                <Col xs={12} lg={6}>
                  <InputSelect
                    id="incidentmethod"
                    label="How would you like to be contacted"
                    defaultValue={incidentMethod}
                    defaultText="Select a contact method"
                    helperText="The method that onErrorLog will contact you when your monitor is triggered"
                    showDefault={true}
                    values={[
                      {
                        value: "team",
                        text: "Notify your team (email or text message)",
                      },
                      { value: "callback", text: "HTTP Callback" },
                    ]}
                    onChange={(e) =>
                      setValue(setIncidentMethod, e.target.value)
                    }
                    isInvalid={formErrors.indexOf("incidentmethod") > -1}
                  />
                </Col>
                <Col xs={12} lg={6}>
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
                    onChange={(e) =>
                      setValue(setIncidentInterval, e.target.value)
                    }
                  />
                </Col>
              </Row>

              {incidentMethod === "email" && (
                <Row className="pt-3 pl-2">
                  <Col xs={12} sm={12} lg={6}>
                    <InputText
                      id="incidentemail"
                      label="Contact Email"
                      value={incidentEmail}
                      placeholder="incident-report@mydomain.com"
                      helperText="The email address onErrorLog will contact when it finds an incident"
                      isInvalid={formErrors.indexOf("incidentemail") > -1}
                      onChange={(e) => {
                        setValue(setIncidentEmail, e.target.value);
                      }}
                    />
                  </Col>
                </Row>
              )}
              {incidentMethod === "callback" && (
                <Row className="pt-3">
                  <Col xs={12} sm={12} lg={12}>
                    <InputText
                      id="incidentenpoint"
                      label="HTTP Callback URL"
                      value={incidentEndpoint}
                      placeholder="https://www.mydomain.com/callback"
                      helperText={
                        <>
                          <span>
                            The callback that onErrorLog will hit when it finds
                            an incident (only POSTs are supported)
                          </span>
                          <Row>
                            <Col>
                              <Button
                                variant="link"
                                className="p-0 m-0 btn-link"
                                onClick={() =>
                                  setValue(
                                    setShowCallbackBasic,
                                    !showCallbackBasic
                                  )
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
                              {pongId !== null && (
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
                              )}
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
            </Col>
            <Col className="doc-box">
              <h5 className="mt-0 pt-0">Help with this form</h5>
              <p>
                <strong>How would you like to be contacted</strong>
                <span className="doc-text">
                  <br />
                  Select how you want your team to be contacted in case your
                  monitor is triggered
                </span>
              </p>

              <ul className="mt-2">
                <li>
                  <span className="doc-text">
                    <strong>Notify your team (email or text message)</strong>:
                    If you choose this option the team member that is on-call
                    will be alerted. Each team member can choose to receive
                    their notifications through email or text message from their
                    profile.
                  </span>
                </li>
                <li>
                  <span className="doc-text">
                    <strong>HTTP Callback</strong>: If you choose this option
                    the endpoint callback you specify will be requested by
                    onErrorLog. onErrorLog will perfor a <em>POST</em>. The body
                    of the request will contain some information about the
                    notification. You also have the option of configuring HTTP
                    headers and Basic Authentication.
                    <div className="mt-2">
                      <strong>Body Content Type</strong>: application/json
                      <br />
                      <strong>Body Fields</strong>: http_status_code, reason,
                      response_time
                    </div>
                  </span>
                </li>
              </ul>
            </Col>
          </Row>
        </Card.Body>
      </Card>

      {pongId && (
        <Card className="hide-small">
          <Card.Body>
            <Card.Title>Sending Requests to your Monitor</Card.Title>
            <Card.Subtitle>
              Below is the information that you'll need to send requests to your
              monitor
            </Card.Subtitle>
            <Row className="mt-3">
              <Col xs={12} lg={6}>
                <InputText
                  label={`Start Endpoint`}
                  value={`${API_URL}pongme/start/${pongKey}`}
                  helperText={`Use this endpoint when you start your task`}
                  disabled={true}
                  copy={true}
                  id="api-url"
                />
              </Col>
              <Col xs={12} lg={6}>
                <InputText
                  label={`End Endpoint`}
                  value={`${API_URL}pongme/end/${pongKey}`}
                  helperText={`Use this endpoint when you complete your task`}
                  disabled={true}
                  copy={true}
                  id="api-url"
                />
              </Col>
            </Row>
            <Row className="mt-3">
              <Col xs={12} lg={6}>
                <InputText
                  label={`Fail Endpoint`}
                  value={`${API_URL}pongme/fail/${pongKey}`}
                  helperText={`Use this endpoint when one of your tasks fails`}
                  disabled={true}
                  copy={true}
                  id="api-url"
                />
              </Col>
              <Col xs={12} lg={6}></Col>
            </Row>
            <Row className="mt-3">
              <Col>
                <div className="card-title h5 pb-0 mb-0">Examples</div>
                <div className="pl-1 pb-3">
                  <small>
                    Show examples of how to trigger your monitor with your
                    programming language.
                  </small>
                </div>

                <Tabs
                  id="example-code-tabs"
                  activeKey={exampleTab}
                  onSelect={(k) => setExampleTab(k)}
                  className="pl-3 pr-3"
                >
                  <Tab eventKey="python" title="Python">
                    <Python pongKey={pongKey} api_url={API_URL} />
                  </Tab>
                  <Tab eventKey="node" title="Node.js">
                    <Node pongKey={pongKey} api_url={API_URL} />
                  </Tab>
                  <Tab eventKey="bash" title="Bash">
                    <Bash pongKey={pongKey} api_url={API_URL} />
                  </Tab>
                  <Tab eventKey="php" title="PHP">
                    <PHP pongKey={pongKey} api_url={API_URL} />
                  </Tab>
                  <Tab eventKey="ruby" title="Ruby">
                    <Ruby pongKey={pongKey} api_url={API_URL} />
                  </Tab>
                </Tabs>
              </Col>
            </Row>
          </Card.Body>
        </Card>
      )}

      <Row>
        <Col className="text-left" xs={12} lg={6}>
          <DeleteButton
            pongId={pongId}
            active={active}
            deleteAction={() => deletePong()}
            text="pong"
          />
          {saved && (
            <strong className="text-success">
              Your monitor has been saved.
            </strong>
          )}
        </Col>
        <Col className="text-right" xs={12} lg={6}>
          <EnableButton
            objectId={pongId}
            active={active}
            text="pong"
            enableAction={() => {
              setActive(true);
              savePong(true);
            }}
          />
          <DisableButton
            objectId={pongId}
            active={active}
            text="pong"
            disableAction={() => {
              setActive(false);
              savePong(false);
            }}
          />{" "}
          <Button
            variant="primary"
            onClick={() => savePong(null)}
            className="btn-rounded"
          >
            Save Monitor
          </Button>
        </Col>
      </Row>

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

export default PongScreen;
