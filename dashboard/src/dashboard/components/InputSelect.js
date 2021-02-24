import React from "react";
import { Form } from "react-bootstrap";

const InputSelect = ({
  id,
  values = [],
  showDefault = false,
  defaultText = "Select a value",
  defaultValue = null,
  onChange = null,
  isInvalid = null,
  invalidText = null,
  label = null,
  required = false,
  placeholder = null,
  helperText = null,
  type = "text",
  disabled = false,
}) => (
  <Form.Group controlId={id}>
    {label && <Form.Label>{label}</Form.Label>}
    <Form.Control
      as="select"
      required={required}
      type={type}
      placeholder={placeholder}
      value={defaultValue}
      className={isInvalid ? `is-invalid` : ``}
      onChange={onChange}
      disabled={disabled}
    >
      {showDefault && <option value="">{defaultText}</option>}
      {values.map((m, i) => (
        <option key={i} value={m.value}>
          {m.text}
        </option>
      ))}
    </Form.Control>
    {isInvalid && invalidText ? (
      <Form.Control.Feedback type="invalid">
        {invalidText}
      </Form.Control.Feedback>
    ) : (
      <Form.Text className="text-muted pl-2">{helperText}</Form.Text>
    )}
  </Form.Group>
);

export default InputSelect;
