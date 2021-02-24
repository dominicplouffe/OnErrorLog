import React, { useState } from "react";
import { Form, InputGroup, Button } from "react-bootstrap";
import { CopyToClipboard } from "react-copy-to-clipboard";

const InputText = ({
  id,
  value = null,
  onChange = null,
  onBlur = null,
  isInvalid = null,
  invalidText = null,
  label = null,
  required = false,
  placeholder = null,
  helperText = null,
  type = "text",
  disabled = false,
  copy = false,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyText = () => {
    setCopied(true);

    setTimeout(() => {
      setCopied(false);
    }, 1000);
  };

  return (
    <Form.Group controlId={id}>
      {label && (
        <Form.Label>
          {label} {copied && <small>copied!</small>}
        </Form.Label>
      )}
      <InputGroup>
        <Form.Control
          required={required}
          type={type}
          placeholder={placeholder}
          value={value}
          className={isInvalid ? `is-invalid` : ``}
          onChange={onChange}
          onBlur={onBlur}
          autoComplete="new-password"
          disabled={disabled}
        />

        {copy && (
          <InputGroup.Append>
            <InputGroup.Text>
              <CopyToClipboard text={value} onCopy={() => handleCopyText()}>
                <Button variant="link" className="p-0 m-0">
                  ✇
                </Button>
              </CopyToClipboard>
            </InputGroup.Text>
          </InputGroup.Append>
        )}
      </InputGroup>
      {isInvalid && invalidText ? (
        <Form.Control.Feedback type="invalid">
          {invalidText}
        </Form.Control.Feedback>
      ) : (
        <Form.Text className="text-muted pl-2">{helperText}</Form.Text>
      )}
    </Form.Group>
  );
};

export default InputText;
