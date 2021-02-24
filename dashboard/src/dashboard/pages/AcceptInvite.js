import React, { useState, useEffect } from "react";
import { Row, Col } from "react-bootstrap";
import InputText from "../components/InputText";
import api from "../../utils/api";
import PhoneInput from "react-phone-number-input";
import { useHistory } from "react-router-dom";

const AcceptInvite = (props) => {
  const [code, setCode] = useState(null);
  const [confirmed, setConfirmed] = useState(false);
  const [expired, setExpired] = useState(false);

  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");

  const [error, setError] = useState("  ");
  const [formErrors, setFormErrors] = useState([]);

  const history = useHistory();

  const handleFinishSignup = async () => {
    const fErrors = [];
    let isValid = true;

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
        password: password,
        confirmation: confirmation,
        phone_number: phoneNumber,
      };
      const { data = null, error = null } = await api(
        "auth/finish-invite",
        "POST",
        payload,
        false,
        false
      );
      if (data) {
        history.push(`/auth/login`);
      }
      if (error) {
        setError(error);
      }
    } else {
      setFormErrors(fErrors);
    }
  };

  useEffect(() => {
    const fetchConfirmation = async (code) => {
      const { data = null, error = null } = await api(
        "/api/auth/check-invite",
        "POST",
        {
          code: code,
        },
        false,
        false
      );

      if (data) {
        setConfirmed(true);
      }
      if (error) {
        setExpired(true);
        setConfirmed(true);
      }
    };

    const code = props.location.search.replace("?code=", "");

    if (code) {
      setCode(code);
      fetchConfirmation(code);
    }

    // eslint-disable-next-line
  }, [props]);

  return (
    <>
      <div className="auth-wrapper d-flex no-block justify-content-center align-items-center position-relative">
        <div className="auth-box-big row">
          <div
            className="col-lg-6 col-md-4 modal-bg-img"
            style={{
              backgroundImage:
                "url(https://onerrorlog.s3.amazonaws.com/images/peace-of-mind-2.jpg)",
              backgroundSize: "cover",
            }}
          ></div>

          <div className="col-lg-6 col-md-8 bg-white">
            <div className="p-3">
              <div className="text-center">
                <img
                  src="https://onerrorlog.s3.amazonaws.com/images/oel-logo.png"
                  alt="wrapkit"
                  style={{ maxWidth: "100px" }}
                />
              </div>
              {!confirmed && (
                <Row className="pt-5 text-center">
                  <Col>Fetching Confirmation...</Col>
                </Row>
              )}
              {expired && (
                <Row className="pt-5 text-center">
                  <Col>
                    <p>Your code is either invalid or has expired.</p>
                    <p> Ask your administrator to resend a new invite.</p>
                  </Col>
                </Row>
              )}
              {confirmed && !expired && (
                <>
                  <h2 className="mt-3 text-center">
                    <small>Welcome to</small>
                    <br /> onErrorLog
                  </h2>

                  <Row>
                    <Col xs={12} lg={6} className="mt-2">
                      <InputText
                        className="form-control"
                        id="password"
                        type="password"
                        label="Password"
                        placeholder=""
                        autoComplete="off"
                        value={password}
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
                        value={confirmation}
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
                    <Col>
                      <p className="pb-2">&nbsp;</p>
                      <small>Used to notify you when we need to.</small>
                    </Col>
                  </Row>
                  <Col className="text-danger mt-3 text-center">
                    &nbsp;{error}&nbsp;
                  </Col>
                  <div className="col-lg-12 text-center mt-2">
                    <button
                      type="button"
                      className="btn btn-block btn-primary"
                      onClick={() => handleFinishSignup()}
                    >
                      Complete Registration
                    </button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AcceptInvite;
