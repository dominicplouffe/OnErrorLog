import React, { useState } from "react";
import { Card, Row, Col, Button } from "react-bootstrap";
import InputText from "../InputText";
import api from "../../../utils/api";

const Invite = ({ close, callback }) => {
  const [inviteSent, setInviteSent] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [formErrors, setFormErrors] = useState([]);
  const [showSuccess, setShowSuccess] = useState(false);

  const inviteUser = async () => {
    const errors = [];
    if (firstName.trim().length === 0) {
      errors.push("firstName");
    }

    if (lastName.trim().length === 0) {
      errors.push("lastName");
    }
    if (emailAddress.trim().length === 0) {
      errors.push("emailAddress");
    } else if (
      emailAddress.match("[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,}$") === null
    ) {
      errors.push("emailAddress");
    }

    if (errors.length === 0) {
      setInviteSent(true);
      const { data = null, error = null } = await api(
        `/api/auth/send-invite`,
        "POST",
        {
          first_name: firstName,
          email_address: emailAddress,
          last_name: lastName,
          host: document.location.origin,
        }
      );

      if (data) {
        setInviteSent(false);
        setFirstName("");
        setLastName("");
        setEmailAddress("");
        setShowSuccess(true);
        close(false);
        callback();
        return;
      }

      if (error) {
        alert("Something went wrong");
      }
    }

    setFormErrors(errors);
  };

  return (
    <Card>
      <Card.Body>
        <Card.Title>
          <Row>
            <Col>Invite a New User</Col>
            <Col className="text-right">
              <Button
                variant="custom"
                className="close"
                onClick={() => {
                  close(false);
                }}
              >
                X
              </Button>
            </Col>
          </Row>
        </Card.Title>
        <Card.Subtitle>
          Invite new users by filling out the form below
        </Card.Subtitle>

        <Row>
          <Col>
            <InputText
              id="firstName"
              label="First Name"
              isInvalid={formErrors.indexOf("firstName") > -1}
              value={firstName}
              onChange={(e) => {
                setFirstName(e.target.value);
                setShowSuccess(false);
              }}
            />
          </Col>
          <Col>
            <InputText
              id="lastName"
              label="Last Name"
              value={lastName}
              isInvalid={formErrors.indexOf("lastName") > -1}
              onChange={(e) => {
                setLastName(e.target.value);
                setShowSuccess(false);
              }}
            />
          </Col>
          <Col>
            <InputText
              id="emailAddress"
              label="Email Address"
              value={emailAddress}
              isInvalid={formErrors.indexOf("emailAddress") > -1}
              onChange={(e) => {
                setEmailAddress(e.target.value);
                setShowSuccess(false);
              }}
            />
          </Col>
        </Row>
        <Row className="mt-2">
          <Col className="pt-3">
            {showSuccess && (
              <span className="text-success">
                <strong>Your invite has been sent</strong>
              </span>
            )}
          </Col>
          <Col className="text-right">
            <Button
              variant="primary"
              onClick={() => inviteUser()}
              className="btn-rounded"
              disabled={inviteSent}
            >
              Invite User
            </Button>
          </Col>
        </Row>
      </Card.Body>
    </Card>
  );
};

export default Invite;
