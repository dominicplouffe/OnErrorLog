import React from "react";
const MetricConditionSentence = ({
  metricRollup,
  metricName,
  op,
  value,
  spanValue,
  spanType,
}) => {
  if (!value) {
    return null;
  }

  const sentence = ["OnErrorLog will notify you when the "];

  if (metricRollup === "value") {
    sentence.push(<strong>Last Value{` `}</strong>);
  } else if (metricRollup === "avg") {
    sentence.push(<strong>Average{` `}</strong>);
  } else if (metricRollup === "sum") {
    sentence.push(<strong>Sum{` `}</strong>);
  }

  sentence.push("of the ");

  if (metricName === "cpu_percent.cpu") {
    sentence.push(<strong>CPU{` `}</strong>);
  } else if (metricName === "memory_percent.mem") {
    sentence.push(<strong>Memory{` `}</strong>);
  } else if (metricName === "disk_percent.disk") {
    sentence.push(<strong>Disk Space{` `}</strong>);
  }

  sentence.push("metric");

  if (["sum", "avg"].indexOf(metricRollup) > -1) {
    sentence.push(`, over the past ${spanValue}`);
    if (spanType === "hours") {
      sentence.push("hour(s),");
    } else {
      sentence.push("day(s),");
    }
  }

  const opText = {
    "==": " is equal to",
    "<": " is less than",
    "<=": " is less than or equal to",
    ">": " is greater than",
    ">=": " is greater than or equal to",
  };

  sentence.push(opText[op]);
  sentence.push(
    <strong>
      {` `}
      {value}
    </strong>
  );
  sentence.push(".");

  return sentence.map((s, i) => <span key={i}>{s}</span>);
};

export default MetricConditionSentence;
