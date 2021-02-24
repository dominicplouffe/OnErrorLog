import React, { useState } from "react";
import { Row, Col, Button, Modal } from "react-bootstrap";
import InputText from "../InputText";
import api from "../../../utils/api";
import useAuth from "../../../auth/useAuth";

const PasswordModal = () => {
  const [showModal, setShowModal] = useState(false);
  const [password, setPassword] = useState("");
  const [confirmation, setConfirmation] = useState("");

  const [error, setError] = useState("");
  const [formErrors, setFormErrors] = useState([]);

  const [showDone, setShowDone] = useState(false);

  const { user } = useAuth();

  const handleChangePassword = async () => {
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
      const { data = null, error = null } = await api(
        `auth/change-password/${user.id}/`,
        "PUT",
        {
          password: password,
        }
      );

      if (data) {
        setShowDone(true);
      }

      if (error) {
        setError(error.password);
      }
    } else {
      setFormErrors(fErrors);
    }
  };

  return (
    <>
      <Button
        variant="primary"
        onClick={() => setShowModal(true)}
        className="btn-rounded"
      >
        Change Password
      </Button>
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        animation={false}
      >
        <Modal.Header closeButton>
          <Modal.Title>Update Your Password</Modal.Title>
        </Modal.Header>
        {showDone && (
          <Modal.Body>
            <Row>
              <Col className="mt-3 mb-3 text-center">
                Your password has been changed!
              </Col>
            </Row>
          </Modal.Body>
        )}
        {!showDone && (
          <Modal.Body>
            <Row>
              <Col>
                <InputText
                  className="form-control"
                  id="password"
                  type="password"
                  label="New Password"
                  placeholder=""
                  autoComplete="off"
                  isInvalid={formErrors.indexOf("password") > -1}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </Col>
            </Row>
            <Row className="mt-2">
              <Col>
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
            {error && (
              <Row>
                <Col className="text-danger mt-3 text-center">
                  &nbsp;{error}&nbsp;
                </Col>
              </Row>
            )}
          </Modal.Body>
        )}
        <Modal.Footer>
          <Button
            variant="secondary"
            onClick={() => setShowModal(false)}
            className="btn-rounded"
          >
            Close
          </Button>
          {!showDone && (
            <Button
              variant="primary"
              onClick={() => handleChangePassword()}
              className="btn-rounded"
            >
              Change Password
            </Button>
          )}
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default PasswordModal;
