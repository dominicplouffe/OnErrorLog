import React, { useState } from "react";
import api from "../../../utils/api";
import InputText from "../InputText";
import { Col } from "react-bootstrap";

const Code = ({ step, callback }) => {
  const [code, setCode] = useState("");
  const [error, setError] = useState("  ");
  const [formErrors, setFormErrors] = useState([]);

  const handleConfirmCode = async () => {
    const fErrors = [];
    let isValid = true;

    if (code.trim().length === 0) {
      fErrors.push("code");
      isValid = false;
    }

    if (isValid) {
      const payload = {
        code: code,
      };

      const { data = null, error = null } = await api(
        "auth/signup-code",
        "POST",
        payload,
        false,
        false
      );

      if (data) {
        callback(code);
      }

      if (error) {
        setError(error);
      }
    } else {
      setFormErrors(fErrors);
    }
  };

  if (step !== 2) {
    return null;
  }

  return (
    <>
      <h2 className="mt-3 text-center">
        <small>Welcome to</small>
        <br /> onErrorLog
      </h2>
      <p className="text-center pt-2 mt-5">
        We have sent a confirmation with a code. When you get the email please
        enter the code below to continue the regirstraion process.
      </p>
      <div className="col-lg-12 mt-2">
        <InputText
          className="form-control"
          id="code"
          type="text"
          label="Confirmation Code"
          placeholder="enter the confirmation code"
          autoComplete="off"
          isInvalid={formErrors.indexOf("code") > -1}
          onChange={(e) => setCode(e.target.value)}
        />
      </div>
      <Col className="text-danger mt-3 text-center">&nbsp;{error}&nbsp;</Col>
      <div className="col-lg-12 text-center mt-2">
        <button
          type="button"
          className="btn btn-block btn-primary"
          onClick={() => handleConfirmCode()}
        >
          Confirm Code
        </button>
      </div>
    </>
  );
};

export default Code;
