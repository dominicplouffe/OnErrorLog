import React, { useState } from "react";
import { login } from "../../utils/auth";
import useAuth from "../../auth/useAuth";
import { useLocation } from "react-router-dom";
import { Col } from "react-bootstrap";
import { Link } from "react-router-dom";
import InputText from "../components/InputText";

const Login = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("  ");
  const [loggedIn, setLoggedIn] = useState(false);
  const { loginUser } = useAuth();

  const { search } = useLocation();
  const query = new URLSearchParams(search);
  const next = query.get("n");

  const handleLogin = async (event) => {
    if (event) event.preventDefault();

    const data = {
      username: username,
      password: password,
    };

    const { isAuthenticated = null } = await login(data);

    if (isAuthenticated) {
      await loginUser();
      setLoggedIn(true);
      return;
    }

    setError("Something went wrong.. try again");
  };

  if (loggedIn) {
    document.location.href = next || "/dashboard";
  }

  return (
    <>
      <div className="auth-wrapper d-flex no-block justify-content-center align-items-center position-relative">
        <div className="auth-box row">
          <div
            className="col-lg-7 col-md-5 modal-bg-img"
            style={{
              backgroundImage:
                "url(https://onerrorlog.s3.amazonaws.com/images/peace-of-mind-2.jpg)",
              backgroundSize: "cover",
            }}
          ></div>
          <div className="col-lg-5 col-md-7 bg-white">
            <div className="p-3">
              <div className="text-center">
                <img
                  src="https://onerrorlog.s3.amazonaws.com/images/oel-logo.png"
                  alt="wrapkit"
                  style={{ maxWidth: "100px" }}
                />
              </div>
              <h2 className="mt-3 text-center">
                <small>Sign In to</small>
                <br />
                onErrorLog
              </h2>
              <p className="text-center">
                <small>
                  Enter your credentials to access onErrorLog.
                  <br />
                  &nbsp;
                </small>
              </p>

              <div className="row">
                <div className="col-lg-12">
                  <InputText
                    className="form-control"
                    id="username"
                    type="text"
                    placeholder="enter your username"
                    autoComplete="off"
                    label="Username"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                  />
                </div>
                <div className="col-lg-12">
                  <InputText
                    className="form-control"
                    id="pwd"
                    type="password"
                    placeholder="enter your password"
                    autoComplete="off"
                    label="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="col-lg-12 text-center mt-2">
                  <button
                    type="button"
                    className="btn btn-block btn-primary"
                    onClick={() => handleLogin()}
                  >
                    Sign In
                  </button>
                </div>
                <Col className="text-danger mt-3 text-center">
                  &nbsp;{error}&nbsp;
                </Col>
                <div className="col-lg-12 text-center mt-2">
                  Don't have an account?{" "}
                  <Link to="/auth/register" className="text-primary">
                    Sign Up
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;
