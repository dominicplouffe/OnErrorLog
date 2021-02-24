import React, { useState } from "react";
import CompanyEmail from "../components/Registration/CompanyEmail";
import Code from "../components/Registration/Code";
import Password from "../components/Registration/Password";
import { useHistory } from "react-router-dom";

const Registration = () => {
  const [code, setCode] = useState(null);
  const [step, setStep] = useState(1);

  const history = useHistory();

  const incrementStep = () => {
    setStep(step + 1);
  };

  const savePayload = (code) => {
    incrementStep();
    setCode(code);
  };

  const complete = () => {
    history.push(`/auth/login`);
  };

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
              <CompanyEmail step={step} callback={incrementStep} />
              <Code step={step} callback={savePayload} />
              <Password step={step} code={code} callback={complete} />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Registration;
