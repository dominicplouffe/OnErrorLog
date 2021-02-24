import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import { Card, Row, Col, Button, Badge } from "react-bootstrap";
import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";
import api from "../../utils/api";
import moment from "moment";
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import MetricConditionSentence from "../components/MetricConditionSentence";
import DisableButton from "../components/Ping/DisableButton";
import EnableButton from "../components/Ping/EnableButton";
import DeleteButton from "../components/Ping/DeleteButton";
import { useHistory } from "react-router-dom";
import AlertCard from "../components/AlertCard";

const MetricConditionScreen = (props) => {
  const [loading, setLoading] = useState(true);
  const [saved, setSaved] = useState(false);

  const [metricId, setMetricId] = useState(0);
  const [name, setName] = useState("");
  const [metricName, setMetricName] = useState("");
  const [metricRollup, setMetricRollup] = useState("value");
  const [op, setOp] = useState("==");
  const [value, setValue] = useState("");
  const [spanValue, setSpanValue] = useState(1);
  const [spanType, setSpanType] = useState("hours");
  const [active, setActive] = useState(true);

  const [incidentMethod, setIncidentMethod] = useState("team");

  const [formErrors, setFormErrors] = useState([]);
  const [graphData, setGraphData] = useState([]);
  const [instance, setInstance] = useState(null);
  const [latestValue, setLatestValue] = useState(null);
  const [summary, setSummary] = useState(null);

  let history = useHistory();

  const mapping = {
    "cpu_percent.cpu": {
      title: "CPU Percentage Used",
      stroke: "cpu_status",
    },
    "memory_percent.mem": {
      title: "Memory Percentage Used",
      stroke: "mem_status",
    },
    "disk_percent.disk": {
      title: "Disk Percentage Used",
      stroke: "disk_status",
    },
  };

  useEffect(() => {
    if (loading) {
      setLoading(false);
      getInstance();
      getMetricCondition();
    }

    if (metricName) {
      sendMetricSample(metricName);
    }

    fetchSummary(props.match.params.id);
    // eslint-disable-next-line
  }, [metricRollup, spanValue, spanType, instance, active]);

  const getInstance = async (metric_name) => {
    const { data = null, error = null } = await api(
      `vital_instance/${props.match.params.instanceId}/?metric_name=${metric_name}`
    );

    if (data) {
      if (metric_name) {
        extractGraphData(data, metric_name, setGraphData);
      }
      setInstance(data);
    }
    if (error) {
      alert("Something went wrong, we cannot find your instance");
    }
  };

  const getMetricCondition = async () => {
    if (props.match.params.id === "0") {
      return null;
    }
    const { data = null, error = null } = await api(
      `metric_condition/${props.match.params.id}/`
    );

    if (data) {
      const mName = `${data.rule.category}.${data.rule.metric}`;
      setName(data.name);
      setMetricName(mName);
      setMetricRollup(data.rule.metric_rollup);
      setOp(data.rule.op);
      setValue(parseFloat(data.rule.value));
      setSpanType(data.rule.timespan.span);
      setSpanValue(parseInt(data.rule.timespan.value));
      setMetricId(data.id);
      setActive(data.active);

      getInstance(mName);
    }

    if (error) {
      alert("Oops something went wrong");
    }
  };

  const fetchSummary = async (id) => {
    const { data = null, error = null } = await api(
      `alert_summary/metric_condition/${id}/`
    );

    if (data) {
      setSummary(data.objects[0]);
    }
    if (error) {
      alert("Something went wrong, we cannot find your pong");
    }
  };

  const sendMetricSample = async (metricName) => {
    if (!instance) {
      return null;
    }
    const category = metricName.split(".")[0];
    const metric = metricName.split(".")[1];

    const rule = {
      category: category,
      metric: metric,
      metric_rollup: metricRollup,
      op: op,
      timespan: {
        value: parseInt(spanValue),
        span: spanType,
      },
    };

    const payload = {
      instance_id: instance.instance_id,
      rule: rule,
    };

    const { data = null, error = null } = await api(
      "metrics-sample",
      "POST",
      payload
    );

    if (data) {
      setLatestValue(data.value);
    }

    if (error) {
      alert("Oops something went wrong");
    }
  };

  const setMetricAndGetSample = (v) => {
    setMetricName(v);
    if (v) {
      getInstance(v);
      sendMetricSample(v);
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

  const setRuleValue = (f, v) => {
    f(v);
  };

  const getTimeValues = () => {
    const vals = [];

    for (let i = 0; i < 30; i++) {
      vals.push({ value: i + 1, text: i + 1 });
    }

    return vals;
  };

  const saveCondition = async (activeOverride) => {
    const errors = [];
    if (!value || isNaN(parseFloat(value))) {
      errors.push("value");
    }
    if (!name) {
      errors.push("name");
    }
    if (!metricName) {
      errors.push("metric_name");
    }
    if (!metricRollup) {
      errors.push("metric_rollup");
    }
    if (!metricRollup) {
      errors.push("metric_rollup");
    }
    if (!op) {
      errors.push("op");
    }

    if (["sum", "avg"].indexOf(metricRollup) > -1) {
      if (!spanValue) {
        errors.push("span_value");
      }
      if (!spanType) {
        errors.push("span_type");
      }
    }

    if (!incidentMethod) {
      errors.push("incidentmethod");
    }

    setFormErrors(errors);

    if (errors.length === 0) {
      let activeVal = active;

      if (activeOverride === true) {
        activeVal = true;
      } else if (activeOverride === false) {
        activeVal = false;
      }

      const payload = {
        instance: instance.instance_id,
        rule: {
          category: metricName.split(".")[0],
          metric: metricName.split(".")[1],
          metric_rollup: metricRollup,
          timespan: {
            value: spanValue,
            span: spanType,
          },
          op: op,
          value: value,
        },
        active: activeVal,
        notification_type: incidentMethod,
        incident_interval: 1,
        callback_url: null,
        callback_username: null,
        callback_password: null,
        doc_link: null,
        name: name,
      };

      if (metricId === 0) {
        const { data = null, error = null } = await api(
          "metric_condition/",
          "POST",
          payload
        );

        if (data) {
          setSaved(true);

          setMetricId(data.id);
          history.push(`/vital/${instance.id}/condition/${data.id}`);
        }
        if (error) {
          alert("Something went wrong, we cannot save your condition");
        }
      } else {
        const { data = null, error = null } = await api(
          `metric_condition/${metricId}/`,
          "PUT",
          payload
        );
        if (data) {
          setSaved(true);
        }
        if (error) {
          alert("Something went wrong, we cannot save your condition");
        }
      }
    }
  };

  const deletePong = async () => {
    await api(`metric_condition/${metricId}/`, "DELETE");

    history.push(`/vitals/${props.match.params.instanceId}`);
  };

  return (
    <Body title="Vitals" selectedMenu="vitals" {...props} loading={loading}>
      {instance && summary && (
        <AlertCard
          m={summary}
          showSummary={false}
          showEdit={false}
          showOther={true}
          otherPath={`vital/${instance.id}/condition`}
        />
      )}
      <Row>
        <Col>
          <Card>
            <Card.Body>
              <Card.Title>Metric : {instance && instance.name}</Card.Title>
              <Row>
                <Col xs={12} xl={6}>
                  <InputSelect
                    id="metric_name"
                    label="Select a metric that you want to be notified on:"
                    defaultValue={metricName}
                    defaultText="Select a Metric"
                    helperText="Select a metric you want to alert on"
                    showDefault={true}
                    values={[
                      { value: "cpu_percent.cpu", text: "CPU" },
                      { value: "memory_percent.mem", text: "Memory" },
                      { value: "disk_percent.disk", text: "Disk Space" },
                    ]}
                    onChange={(e) => {
                      setMetricAndGetSample(e.target.value);
                    }}
                    isInvalid={formErrors.indexOf("metric_name") > -1}
                  />

                  {metricName.length > 0 && (
                    <>
                      <Row className="mt-3">
                        <Col xs={12} sm={12} xl={8}>
                          <InputText
                            id="name"
                            value={name}
                            label="Name"
                            helperText="The name you want to give your condition"
                            onChange={(e) =>
                              setRuleValue(setName, e.target.value)
                            }
                            isInvalid={formErrors.indexOf("name") > -1}
                          />
                        </Col>
                      </Row>
                      <Row className="mt-3">
                        <Col xs={12} sm={12} xl={4}>
                          <InputSelect
                            id="metric_rollup"
                            label="Trigger a notification when"
                            defaultValue={metricRollup}
                            helperText="Select how you want to rollup the value"
                            showDefault={false}
                            values={[
                              { value: "value", text: "Last value" },
                              { value: "sum", text: "Sum of the values" },
                              { value: "avg", text: "Average of the values" },
                            ]}
                            onChange={(e) => {
                              setRuleValue(setMetricRollup, e.target.value);
                            }}
                            isInvalid={formErrors.indexOf("metric_rollup") > -1}
                          />
                          {["sum", "avg"].indexOf(metricRollup) > -1 && (
                            <Row className="ml-3 mt-2">
                              <Col xs={6}>
                                <InputSelect
                                  id="span_value"
                                  label="Over the past"
                                  showDefault={false}
                                  values={getTimeValues()}
                                  defaultValue={spanValue}
                                  onChange={(e) => {
                                    setRuleValue(setSpanValue, e.target.value);
                                  }}
                                  disabled={
                                    ["sum", "avg"].indexOf(metricRollup) === -1
                                  }
                                  isInvalid={
                                    formErrors.indexOf("span_value") > -1
                                  }
                                />
                              </Col>
                              <Col xs={6}>
                                <InputSelect
                                  id="span_type"
                                  label={<span>&nbsp;</span>}
                                  showDefault={false}
                                  values={[
                                    { value: "hours", text: "Hours" },
                                    { value: "days", text: "Days" },
                                  ]}
                                  defaultValue={spanType}
                                  onChange={(e) => {
                                    setRuleValue(setSpanType, e.target.value);
                                  }}
                                  disabled={
                                    ["sum", "avg"].indexOf(metricRollup) === -1
                                  }
                                  isInvalid={
                                    formErrors.indexOf("span_type") > -1
                                  }
                                />
                              </Col>
                            </Row>
                          )}
                        </Col>
                        <Col xs={12} sm={12} xl={4}>
                          <InputSelect
                            id="op"
                            label="Condition"
                            defaultValue={op}
                            showDefault={false}
                            values={[
                              { value: "==", text: "is equal to" },
                              { value: "<", text: "is less than" },
                              { value: "<=", text: "is less than or equal to" },
                              { value: ">", text: "is greater than" },
                              {
                                value: ">=",
                                text: "is greater than or equal to",
                              },
                            ]}
                            onChange={(e) => {
                              setRuleValue(setOp, e.target.value);
                            }}
                            isInvalid={formErrors.indexOf("op") > -1}
                          />
                        </Col>
                        <Col xs={12} sm={12} xl={4}>
                          <InputText
                            id="value"
                            value={value}
                            label="Value"
                            helperText="Must be a number"
                            onChange={(e) =>
                              setRuleValue(setValue, e.target.value)
                            }
                            isInvalid={formErrors.indexOf("value") > -1}
                          />
                        </Col>
                      </Row>

                      <Row className="mt-3">
                        <Col xs={12} sm={12} xl={12}>
                          <InputSelect
                            id="incidentmethod"
                            label="How would you like to be contacted"
                            defaultValue={incidentMethod}
                            defaultText="Select a contact method"
                            helperText="The method that onErrorLog will contact you if it can't ping your endpoint"
                            showDefault={true}
                            values={[
                              {
                                value: "team",
                                text:
                                  "Notify your team (email or text message)",
                              },
                            ]}
                            onChange={(e) => {
                              setIncidentMethod(e.target.value);
                            }}
                            isInvalid={
                              formErrors.indexOf("incidentmethod") > -1
                            }
                          />
                        </Col>
                      </Row>
                      {value && (
                        <Row>
                          <Col
                            className="mt-3 ml-2 pt-4 pb-4 text-center"
                            style={{
                              borderTop: "1px solid #f3f4f6",
                              borderBottom: "1px solid #f3f4f6",
                              backgroundColor: "#eef3fc",
                            }}
                          >
                            <MetricConditionSentence
                              metricRollup={metricRollup}
                              metricName={metricName}
                              op={op}
                              value={value}
                              spanValue={spanValue}
                              spanType={spanType}
                            />
                          </Col>
                        </Row>
                      )}
                      {value && (
                        <Row className="mt-3">
                          <Col className="text-left" xs={12} lg={6}>
                            <DeleteButton
                              active={active}
                              deleteAction={() => deletePong()}
                              text="metric_condition"
                            />
                            {saved && (
                              <strong className="text-success">
                                Your condition has been saved.
                              </strong>
                            )}
                          </Col>
                          <Col className="text-right" xs={12} lg={6}>
                            <EnableButton
                              objectId={metricId}
                              active={active}
                              text="metric_condition"
                              enableAction={() => {
                                setActive(true);
                                saveCondition(true);
                              }}
                            />
                            <DisableButton
                              objectId={metricId}
                              active={active}
                              text="metric_condition"
                              disableAction={() => {
                                setActive(false);
                                saveCondition(false);
                              }}
                            />{" "}
                            <Button
                              variant="primary"
                              onClick={() => saveCondition()}
                              className="btn-rounded"
                            >
                              Save Notification
                            </Button>
                          </Col>
                        </Row>
                      )}
                    </>
                  )}
                </Col>
                <Col xs={12} xl={6}>
                  {instance && metricName && (
                    <>
                      <Row>
                        <Col>
                          <Card.Title>{mapping[metricName].title}</Card.Title>
                          <ResponsiveContainer width="100%" height={200}>
                            <AreaChart
                              data={graphData}
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
                                stroke={instance[mapping[metricName].stroke]}
                                fill={instance[mapping[metricName].stroke]}
                              />
                            </AreaChart>
                          </ResponsiveContainer>
                        </Col>
                      </Row>
                      {latestValue !== null && (
                        <Row className="pt-3">
                          <Col>
                            <Card.Title>
                              Value of the Selected Metric
                            </Card.Title>
                            <Card.Subtitle>
                              <p>
                                This is the current value based on the metric
                                and conditions that you selected.
                              </p>
                              <p>
                                For example, if you selected "Average of Disk
                                Space in the last 24 hours", the value in the
                                box below will be the average disk space usage
                                over the last 24 hours.
                              </p>
                            </Card.Subtitle>
                            <Row className="mt-3">
                              <Col className="pr-5 pl-5">
                                <Badge
                                  style={{
                                    backgroundColor:
                                      instance[mapping[metricName].stroke],
                                    width: "100%",
                                    color: "#FFF",
                                    opacity: 0.75,
                                  }}
                                  className="p-2"
                                >
                                  <Row>
                                    <Col className="text-center">
                                      <h3>{mapping[metricName].title}</h3>
                                    </Col>
                                  </Row>
                                  <Row className="pt-2">
                                    <Col className="text-center">
                                      {latestValue.toFixed(2)}
                                    </Col>
                                  </Row>
                                </Badge>
                              </Col>
                            </Row>
                          </Col>
                        </Row>
                      )}
                    </>
                  )}
                </Col>
              </Row>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Body>
  );
};

export default MetricConditionScreen;
