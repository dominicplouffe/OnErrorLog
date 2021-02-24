import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { Row, Col, Alert, Badge, Card } from "react-bootstrap";

const Body = ({
  currentUser,
  selectedMenu,
  title,
  children,
  loading = false,
}) => {
  const getSelectedMenuClass = (menuName) => {
    if (selectedMenu === menuName) {
      return "selected";
    }

    return "";
  };

  const getActiveMenuClass = (menuName) => {
    if (selectedMenu === menuName) {
      return "active";
    }
  };

  const windowSize = () => {};

  window.onresize = (e) => {
    windowSize();
  };

  useEffect(() => {
    windowSize();
    // eslint-disable-next-line
  });

  return (
    <>
      <header className="navbar navbar-dark sticky-top bg-dark flex-md-nowrap p-0 shadow">
        <a className="navbar-brand col-md-3 col-lg-2 me-0 px-3" href="/">
          <img
            src="https://onerrorlog.s3.amazonaws.com/images/oel-logo.png"
            alt="wrapkit"
            style={{ maxWidth: "80px", margin: "auto", float: "left" }}
          />
          <span
            className="pl-3 h3 mt-3"
            style={{
              float: "left",
              lineHeight: "10px",
              verticalAlign: "middle",
            }}
          >
            onErrorLog
          </span>
        </a>

        <ul className="navbar-nav px-3">
          <li className="nav-item text-nowrap">
            <Row noGutters>
              <Col className="pr-2">
                <Link className="nav-link" to="/newmonitor">
                  <div className="top-link text-center">
                    <Badge variant="success" className="p-0 mr-1">
                      &nbsp;&nbsp;
                    </Badge>
                    <Badge variant="primary" className="p-0 mr-1">
                      &nbsp;&nbsp;
                    </Badge>
                    <Badge variant="danger" className="p-0 mr-1">
                      &nbsp;&nbsp;
                    </Badge>
                    <Badge variant="warning" className="p-0 mr-1">
                      &nbsp;&nbsp;
                    </Badge>
                    <div className="p-0 m-0" style={{ lineHeight: "10px" }}>
                      <small>New Monitor</small>
                    </div>
                  </div>
                </Link>
              </Col>
              <Col>
                <Link className="nav-link" to="/auth/logout">
                  <div className="top-link text-center">
                    <img
                      src="https://onerrorlog.s3.amazonaws.com/images/logout.png"
                      alt="logout"
                      className="icon"
                    />
                    <div className="p-0 m-0" style={{ lineHeight: "10px" }}>
                      <small>Logout</small>
                    </div>
                  </div>
                </Link>
              </Col>
            </Row>
          </li>
        </ul>
      </header>

      <div className="container-fluid">
        <Row>
          <nav
            id="sidebarMenu"
            className="col-md-3 col-lg-2 d-md-block bg-light sidebar collapse mt-3 sidebar-nav"
          >
            <ul id="sidebarnav">
              <li
                className={`sidebar-item ${getSelectedMenuClass("dashboard")}`}
              >
                <Link
                  className={`sidebar-link sidebar-link ${getActiveMenuClass(
                    "dashboard"
                  )}`}
                  to="/dashboard"
                >
                  <img
                    src="https://onerrorlog.s3.amazonaws.com/images/dashboard.png"
                    alt="dashboard"
                    className="icon"
                  />
                  <span className="hide-menu">Dashboard</span>
                </Link>
              </li>
              <li className="sidebar-title">Monitors</li>

              <li className={`sidebar-item ${getSelectedMenuClass("ping")}`}>
                <Link
                  className={`sidebar-link sidebar-link ${getActiveMenuClass(
                    "ping"
                  )}`}
                  to="/pings"
                >
                  <img
                    src="https://onerrorlog.s3.amazonaws.com/images/website.png"
                    alt="pings"
                    className="icon"
                  />
                  <span className="hide-menu">REST Uptime</span>
                </Link>
              </li>
              <li className={`sidebar-item ${getSelectedMenuClass("pong")}`}>
                <Link
                  className={`sidebar-link sidebar-link ${getActiveMenuClass(
                    "pong"
                  )}`}
                  to="/pongs"
                >
                  <img
                    src="https://onerrorlog.s3.amazonaws.com/images/heartbeat.png"
                    alt="pings"
                    className="icon"
                  />
                  <span className="hide-menu">Heartbeat </span>
                </Link>
              </li>

              <li className={`sidebar-item ${getSelectedMenuClass("vitals")}`}>
                <Link
                  className={`sidebar-link sidebar-link ${getActiveMenuClass(
                    "vitals"
                  )}`}
                  to="/vitals"
                >
                  <img
                    src="https://onerrorlog.s3.amazonaws.com/images/vitals.png"
                    alt="vitals"
                    className="icon"
                  />
                  <span className="hide-menu">Vitals</span>
                </Link>
              </li>

              <li className="sidebar-title">Team &amp; Profile</li>
              {currentUser.role.role === "admin" && (
                <li className={`sidebar-item ${getSelectedMenuClass("team")}`}>
                  <Link
                    className={`sidebar-link sidebar-link ${getActiveMenuClass(
                      "team"
                    )}`}
                    to="/team"
                  >
                    <img
                      src="https://onerrorlog.s3.amazonaws.com/images/teams.png"
                      alt="team"
                      className="icon"
                    />
                    <span className="hide-menu">Team</span>
                  </Link>
                </li>
              )}

              {currentUser.role.role === "admin" && (
                <li
                  className={`sidebar-item ${getSelectedMenuClass("schedule")}`}
                >
                  <Link
                    className={`sidebar-link sidebar-link ${getActiveMenuClass(
                      "schedule"
                    )}`}
                    to="/schedule"
                  >
                    <img
                      src="https://onerrorlog.s3.amazonaws.com/images/schedule.png"
                      alt="schedule"
                      className="icon"
                    />
                    <span className="hide-menu">Schedule</span>
                  </Link>
                </li>
              )}

              <li className={`sidebar-item ${getSelectedMenuClass("profile")}`}>
                <Link
                  className={`sidebar-link sidebar-link ${getActiveMenuClass(
                    "profile"
                  )}`}
                  to="/profile"
                >
                  <img
                    src="https://onerrorlog.s3.amazonaws.com/images/profile.png"
                    alt="profile"
                    className="icon"
                  />
                  <span className="hide-menu">Profile</span>
                  {currentUser && currentUser.role.phone_number === null && (
                    <span
                      role="img"
                      aria-label="Mising Phone Number"
                      className="ml-1 hide-menu"
                    >
                      ☎️
                    </span>
                  )}
                </Link>
              </li>
            </ul>
          </nav>

          <main className="col-md-9 ms-sm-auto col-lg-10 px-md-4">
            <div className="d-flex justify-content-between flex-wrap flex-md-nowrap align-items-center pt-3 pb-2 mb-3">
              <Row className="w-100" noGutters>
                <Col>
                  {currentUser &&
                    currentUser.role.phone_number_verified_on === null && (
                      <Alert variant="info" dismissible>
                        <Alert.Heading>
                          <strong>Confirm Your Phone Number</strong>
                        </Alert.Heading>
                        <p>
                          It looks like you have not yet confirmed your phone
                          number. If you want to receive alerts with a text
                          message, please confirm your phone number in your{" "}
                          <Link to="/profile">
                            <strong>profile</strong>
                          </Link>
                        </p>
                      </Alert>
                    )}
                  {loading ? (
                    <Row className="w-100" noGutters>
                      <Col>
                        <Card>
                          <Card.Body className="p-5 text-center">
                            <h4>
                              Your data is being loaded... In the meantime,
                              please be safe!
                            </h4>
                          </Card.Body>
                        </Card>
                      </Col>
                    </Row>
                  ) : (
                    children
                  )}
                </Col>
              </Row>
            </div>
            <div className="footer text-center">
              &copy; Copyright{" "}
              <a
                href="https://www.dplouffe.ca"
                target="_blank"
                rel="noopener noreferrer"
              >
                dplouffe Analytics
              </a>
              . All rights reserved.
              <br />
              <a
                href="https://www.dplouffe.ca"
                target="_blank"
                rel="noopener noreferrer"
              >
                Privacy Policy
              </a>{" "}
              |{" "}
              <a
                href="https://www.dplouffe.ca"
                target="_blank"
                rel="noopener noreferrer"
              >
                Terms of Use
              </a>
            </div>
          </main>
        </Row>
      </div>

      <div className="bottom-menu">
        <Row className="pb-3">
          <Col
            className={`text-center pt-3 pb-3 ml-2 ${getActiveMenuClass(
              "dashboard"
            )}`}
          >
            <Link to="/dashboard">
              <img
                src="https://onerrorlog.s3.amazonaws.com/images/dashboard.png"
                alt="dashboard"
                className="icon-30"
              />
            </Link>
          </Col>
          <Col
            className={`text-center pt-3 pb-3 ${getActiveMenuClass("ping")}`}
          >
            <Link to="/pings">
              <img
                src="https://onerrorlog.s3.amazonaws.com/images/website.png"
                alt="pings"
                className="icon-30"
              />
            </Link>
          </Col>
          <Col
            className={`text-center pt-3 pb-3 ${getActiveMenuClass("pong")}`}
          >
            <Link to="/pongs">
              <img
                src="https://onerrorlog.s3.amazonaws.com/images/heartbeat.png"
                alt="pings"
                className="icon-30"
              />
            </Link>
          </Col>
          <Col
            className={`text-center pt-3 pb-3 ${getActiveMenuClass("team")}`}
          >
            <Link to="/team">
              <img
                src="https://onerrorlog.s3.amazonaws.com/images/teams.png"
                alt="pings"
                className="icon-30"
              />
            </Link>
          </Col>
          <Col
            className={`text-center pt-3 pb-3 ${getActiveMenuClass(
              "schedule"
            )}`}
          >
            <Link to="/schedule">
              <img
                src="https://onerrorlog.s3.amazonaws.com/images/schedule.png"
                alt="pings"
                className="icon-30"
              />
            </Link>
          </Col>
          <Col
            className={`text-center pt-3 pb-3 mr-2 ${getActiveMenuClass(
              "profile"
            )}`}
          >
            <Link to="/profile">
              <img
                src="https://onerrorlog.s3.amazonaws.com/images/profile.png"
                alt="pings"
                className="icon-30"
              />
            </Link>
          </Col>
        </Row>
      </div>
    </>
  );
};

export default Body;
