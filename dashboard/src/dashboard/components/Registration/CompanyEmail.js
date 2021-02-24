import React, { useState } from "react";
import api from "../../../utils/api";
import InputText from "../InputText";
import { Col, Button } from "react-bootstrap";
import { Link } from "react-router-dom";

const CompanyEmail = ({ step, callback }) => {
  const [companyName, setCompanyName] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("  ");
  const [formErrors, setFormErrors] = useState([]);

  const handleRegistration = async (event) => {
    if (event) event.preventDefault();

    const fErrors = [];
    let isValid = true;

    if (email.trim().length === 0) {
      fErrors.push("email");
      isValid = false;
    }
    if (companyName.trim().length === 0) {
      fErrors.push("companyName");
      isValid = false;
    }
    if (isValid) {
      // Send Info to API

      const payload = {
        company_name: companyName,
        email_address: email,
      };

      const { data = null, error = null } = await api(
        "auth/signup-start",
        "POST",
        payload,
        false,
        false
      );

      if (data) {
        callback();
      }

      if (error) {
        setError(error);
      }
    } else {
      setFormErrors(fErrors);
    }
  };

  if (step !== 1) {
    return null;
  }

  return (
    <>
      <h2 className="mt-3 text-center">
        <small>Welcome to</small>
        <br /> onErrorLog
      </h2>
      <p className="text-center">
        <small>
          Please let us know your company name and email address to get started.
        </small>
      </p>

      <div className="row">
        <div className="col-lg-12">
          <InputText
            className="form-control"
            id="comapny_name"
            type="text"
            label="Company Name"
            placeholder="enter your company name"
            autoComplete="off"
            isInvalid={formErrors.indexOf("companyName") > -1}
            onChange={(e) => setCompanyName(e.target.value)}
          />
        </div>
        <div className="col-lg-12 mt-2">
          <InputText
            className="form-control"
            id="email"
            type="email"
            label="Email Address"
            placeholder="enter your company email"
            autoComplete="off"
            isInvalid={formErrors.indexOf("email") > -1}
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
        <div className="col-lg-12 text-center mt-2">
          <button
            type="button"
            className="btn btn-block btn-primary"
            onClick={() => handleRegistration()}
          >
            Continue
          </button>
          <Button variant="link" onClick={() => callback()}>
            <small>I already have a code</small>
          </Button>
        </div>
        <Col className="text-danger mt-3 text-center">&nbsp;{error}&nbsp;</Col>
        <div className="col-lg-12 text-center mt-2">
          Already have an account?{" "}
          <Link to="/auth/login" className="text-primary">
            Sign In
          </Link>
        </div>
      </div>
    </>
  );
};

export default CompanyEmail;
