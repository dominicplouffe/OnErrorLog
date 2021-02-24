import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import { Card, Row, Col, Alert, Form, Button } from "react-bootstrap";
import Invite from "../components/Team/Invite";
import api from "../../utils/api";

const Team = (props) => {
  const currentUser = props.currentUser;

  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState([]);
  const [numOnCall, setNumOnCall] = useState(0);
  const [showInvite, setShowInvite] = useState(false);

  const fetchUsers = async () => {
    const { data = null, error = null } = await api(
      "/api/org_user/?ordering=created_on",
      "GET",
      {}
    );

    if (data) {
      setUsers(data.results);
      setNumOnCall(data.results.filter((u) => u.is_oncall).length);
      setLoading(false);
    }

    if (error) {
      alert("Something went wrong!");
    }
  };

  const resendInvite = async (id) => {
    await api(
      `/api/auth/resend-invite?id=${id}&host=${document.location.origin}`,
      "GET",
      {}
    );

    alert("Your invitation has been resent");
  };

  const updateInfo = async (id, field, value) => {
    const usr = users.filter((u) => u.id === id)[0];

    const url = `/api/org_user/${usr.id}/`;

    const data = {
      first_name: usr.first_name,
      last_name: usr.last_name,
      phone_number: usr.phone_number,
      notification_type: usr.notification_type,
    };

    if (field === "role") {
      data.role = value;
    } else if (field === "active") {
      data.active = value;
    } else {
      data.is_oncall = value;
    }

    await api(url, "PUT", data);

    await fetchUsers();
  };

  useEffect(() => {
    if (loading) {
      fetchUsers();
    }

    // eslint-disable-next-line
  }, []);

  return (
    <Body title="Team" selectedMenu="team" loading={loading} {...props}>
      {showInvite && <Invite close={setShowInvite} callback={fetchUsers} />}

      {!showInvite && (
        <Row className="mb-3">
          <Col className="text-right">
            <Button
              variant="primary"
              onClick={() => setShowInvite(true)}
              className="btn-rounded"
            >
              Invite User
            </Button>
          </Col>
        </Row>
      )}

      <Card>
        <Card.Body>
          <Card.Title>Your Team</Card.Title>
          <Card.Subtitle>
            Below are the members of your team. You can add new members or
            deactivate existing members from here.
          </Card.Subtitle>
          {numOnCall === 0 && (
            <Alert variant="warning" className="m-3">
              <Alert.Heading>
                <strong>Nobody is On-Call?!</strong>
              </Alert.Heading>
              <p>
                It appears that you don't have anyone on-call. We just wanted to
                let you know in case that wasn't done on purpose.
              </p>
            </Alert>
          )}
          <Row className="mt-4">
            <Col className="hide">
              <Row>
                <Col lg={2} xs={6}>
                  <strong>First Name</strong>
                </Col>
                <Col lg={2} xs={6}>
                  <strong>Last Name</strong>
                </Col>
                <Col lg={3} xs={12}>
                  <strong>Email Address</strong>
                </Col>
                <Col lg={2} xs={6}>
                  <strong>Phone Number</strong>
                </Col>
                <Col className="text-center" lg={3} xs={12}>
                  <strong>Info</strong>
                </Col>
              </Row>
            </Col>
          </Row>
          <Row>
            <Col>
              {users.map((u, i) => (
                <Row key={i} className="pt-3">
                  <Col className="pt-2" lg={2} xs={6}>
                    <div
                      className="color-box"
                      style={{ backgroundColor: u.color }}
                    >
                      &nbsp;
                    </div>
                    {u.first_name}
                  </Col>
                  <Col className="pt-2" lg={2} xs={6}>
                    {u.last_name}
                  </Col>
                  <Col className="pt-2" lg={3} xs={12}>
                    {u.email_address}
                  </Col>
                  <Col className="pt-2" lg={2} xs={12}>
                    {u.phone_number}
                  </Col>
                  <Col className="text-center" lg={3} xs={12}>
                    <Row>
                      {u.email_verified_on && (
                        <>
                          <Col className="pt-1">
                            <Form.Check
                              type="checkbox"
                              label="Admin"
                              checked={
                                u.id === currentUser.role.id ||
                                u.role === "admin"
                                  ? true
                                  : false
                              }
                              disabled={u.id === currentUser.role.id}
                              onChange={(e) => {
                                if (!e.target.checked) {
                                  updateInfo(u.id, "role", "user");
                                } else {
                                  updateInfo(u.id, "role", "admin");
                                }
                              }}
                            />
                          </Col>
                          <Col className="pt-1">
                            <Form.Check
                              type="checkbox"
                              label="Active"
                              checked={u.active}
                              disabled={u.id === currentUser.role.id}
                              onChange={(e) => {
                                updateInfo(u.id, "active", e.target.checked);
                              }}
                            />
                          </Col>
                        </>
                      )}
                      {u.email_verified_on && (
                        <Col className="pt-1">
                          <Form.Check
                            type="checkbox"
                            label="On-Call"
                            checked={u.active ? u.is_oncall : false}
                            disabled={!u.active}
                            onChange={(e) => {
                              updateInfo(u.id, "is_oncall", e.target.checked);
                            }}
                          />
                        </Col>
                      )}
                      {!u.email_verified_on && (
                        <Col className="text-center text-info">
                          <em>Invitation has been sent.</em>
                          <Button
                            variant="link"
                            onClick={() => resendInvite(u.id)}
                          >
                            <small>(Resend)</small>
                          </Button>
                        </Col>
                      )}
                    </Row>
                  </Col>
                </Row>
              ))}
            </Col>
          </Row>
        </Card.Body>
      </Card>
    </Body>
  );
};

export default Team;
