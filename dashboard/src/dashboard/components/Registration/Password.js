import React, { useState } from "react";
import api from "../../../utils/api";
import InputText from "../InputText";
import { Col, Row } from "react-bootstrap";
import PhoneInput from "react-phone-number-input";

const Password = ({ step, callback, code }) => {
  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState(null);

  const [error, setError] = useState("  ");
  const [formErrors, setFormErrors] = useState([]);

  const handleCreateUser = async () => {
    const fErrors = [];
    let isValid = true;

    if (firstName.trim().length === 0) {
      fErrors.push("firstname");
      isValid = false;
    }

    if (lastName.trim().length === 0) {
      fErrors.push("lastname");
      isValid = false;
    }

    if (password.trim().length === 0) {
      fErrors.push("password");
      isValid = false;
    }

    if (confirmation.trim().length === 0) {
      fErrors.push("confirmation");
      isValid = false;
    }

    if (password !== confirmation) {
      fErrors.push("password");
      fErrors.push("confirmation");
      setError("Password and confirmation must match");
      isValid = false;
    }

    if (isValid) {
      const payload = {
        code: code,
        first_name: firstName,
        last_name: lastName,
        password: password,
        confirmation: confirmation,
        phone_number: phoneNumber,
      };
      const { data = null, error = null } = await api(
        "auth/signup-complete",
        "POST",
        payload,
        false,
        false
      );
      if (data) {
        callback(data);
      }
      if (error) {
        setError(error);
      }
    } else {
      setFormErrors(fErrors);
    }
  };

  if (step !== 3) {
    return null;
  }

  return (
    <>
      <h2 className="mt-3 text-center">
        <small>Welcome to</small>
        <br /> onErrorLog
      </h2>
      <Row>
        <Col xs={12} lg={6} className="mt-2">
          <InputText
            className="form-control"
            id="firstName"
            type="firstName"
            label="First Name"
            placeholder="Your first name"
            autoComplete="off"
            isInvalid={formErrors.indexOf("firstname") > -1}
            onChange={(e) => setFirstName(e.target.value)}
          />
        </Col>
        <Col xs={12} lg={6} className="mt-2">
          <InputText
            className="form-control"
            id="lastName"
            type="text"
            label="Last Name"
            placeholder="Your last name"
            autoComplete="off"
            isInvalid={formErrors.indexOf("lastname") > -1}
            onChange={(e) => setLastName(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={6} className="mt-2">
          <InputText
            className="form-control"
            id="password"
            type="password"
            label="Password"
            placeholder=""
            autoComplete="off"
            isInvalid={formErrors.indexOf("password") > -1}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Col>
        <Col xs={12} lg={6} className="mt-2">
          <InputText
            className="form-control"
            id="confirmation"
            type="password"
            label="Confirmation"
            placeholder=""
            autoComplete="off"
            isInvalid={formErrors.indexOf("confirmation") > -1}
            onChange={(e) => setConfirmation(e.target.value)}
          />
        </Col>
      </Row>
      <Row>
        <Col xs={12} lg={6} className="mt-2">
          <label className="form-label">
            Phone Number <small>(Optional)</small>
          </label>
          <PhoneInput
            id={
              formErrors.indexOf("phoneNumber") > -1
                ? "phonenumberError"
                : "phonenumber"
            }
            onChange={(e) => setPhoneNumber(e)}
            defaultCountry="US"
          />
        </Col>
      </Row>
      <Col className="text-danger mt-3 text-center">&nbsp;{error}&nbsp;</Col>
      <div className="col-lg-12 text-center mt-2">
        <button
          type="button"
          className="btn btn-block btn-primary"
          onClick={() => handleCreateUser()}
        >
          Complete Registration
        </button>
      </div>
    </>
  );
};

export default Password;
