import React, { useState, useEffect } from "react";
import Body from "../components/Body";
import InputText from "../components/InputText";
import InputSelect from "../components/InputSelect";
import PasswordModal from "../components/Profile/Password";
import { Card, Row, Col, Button } from "react-bootstrap";
import "react-phone-number-input/style.css";
import api from "../../utils/api";
import PhoneInput from "react-phone-number-input";
import useAuth from "../../auth/useAuth";

const Profile = (props) => {
  const currentUser = props.currentUser;
  const { loginUser } = useAuth();
  const [loading, setLoading] = useState(true);
  const [updated, setUpdated] = useState(false);

  const [firstName, setFirstName] = useState(null);
  const [lastName, setLastName] = useState(null);
  const [emailAddress, setEmailAddress] = useState(null);
  const [phoneNumber, setPhoneNumber] = useState(null);
  const [notificationType, setNotificationType] = useState(null);
  const [formErrors, setFormErrors] = useState([]);

  const saveProfile = async () => {
    const errors = [];

    if (firstName.trim().length === 0) {
      errors.push("firstName");
    }

    if (lastName.trim().length === 0) {
      errors.push("lastName");
    }

    if (errors.length === 0) {
      const url = `/api/org_user/${currentUser.role.id}/`;

      let ntype = notificationType;
      if (phoneNumber && phoneNumber.trim().length === 0) {
        setNotificationType("email");
        ntype = "email";
      }

      const { data = null, error = null } = await api(url, "PUT", {
        first_name: firstName,
        last_name: lastName,
        phone_number: phoneNumber,
        notification_type: ntype,
      });

      if (data) {
        loginUser();
        setUpdated(true);
      }

      if (error) {
        alert("Something went wrong");
      }

      return;
    } else {
      setFormErrors(errors);
    }
  };

  useEffect(() => {
    setFirstName(currentUser.role.first_name);
    setLastName(currentUser.role.last_name);
    setEmailAddress(currentUser.role.email_address);
    setPhoneNumber(currentUser.role.phone_number);
    setNotificationType(currentUser.role.notification_type || "email");
    setLoading(false);
    // eslint-disable-next-line
  }, [props]);

  return (
    <Body title="Profile" selectedMenu="profile" {...props} loading={loading}>
      <Card>
        <Card.Body>
          <Card.Title>Your Profile</Card.Title>
          <Card.Subtitle>
            Please ensure that the information below is accurate so we ensure
            your experience with onErrorLog is good.
          </Card.Subtitle>
          <Row>
            <Col xs={12} lg={6} className="mt-4">
              <InputText
                id="firstName"
                label="First Name"
                value={firstName}
                isInvalid={formErrors.indexOf("firstName") > -1}
                onChange={(e) => setFirstName(e.target.value)}
              />
            </Col>
            <Col xs={12} lg={6} className="mt-4">
              <InputText
                id="lastName"
                label="Last Name"
                value={lastName}
                isInvalid={formErrors.indexOf("lastName") > -1}
                onChange={(e) => setLastName(e.target.value)}
              />
            </Col>
          </Row>
          <Row>
            <Col xs={12} lg={6} className="mt-4">
              <InputText
                id="emailAddress"
                label={
                  currentUser.role.email_verified_on
                    ? `Email Address 🟢`
                    : `Email Address 🔴`
                }
                value={emailAddress}
                isInvalid={formErrors.indexOf("emailAddress") > -1}
                onChange={(e) => setEmailAddress(e.target.value)}
                disabled={true}
              />
            </Col>
            <Col xs={12} lg={6} className="mt-4">
              <label className="form-label">
                {currentUser.role.phone_number_verified_on
                  ? `Phone Number 🟢`
                  : `Phone Number 🔴`}
              </label>
              <PhoneInput
                id={
                  formErrors.indexOf("phoneNumber") > -1
                    ? "phonenumberError"
                    : "phonenumber"
                }
                value={phoneNumber ? phoneNumber.replace("+", "") : phoneNumber}
                onChange={(e) => setPhoneNumber(e)}
                defaultCountry="US"
              />
            </Col>
          </Row>
          {phoneNumber && (
            <Row>
              <Col xs={12} lg={6} className="mt-4">
                <InputSelect
                  id="notPref"
                  label="Notification Preference"
                  defaultValue={notificationType}
                  showDefault={false}
                  values={[
                    { value: "email", text: "Email" },
                    { value: "text", text: "Text Message" },
                  ]}
                  onChange={(e) => setNotificationType(e.target.value)}
                />
              </Col>
              <Col xs={12} lg={6} className="mt-4"></Col>
            </Row>
          )}
        </Card.Body>
      </Card>
      <Row className="mt-4">
        <Col className="pl-4 mb-5 text-success" xs={12} lg={6}>
          {updated && <strong>Your profile has been updated.</strong>}
        </Col>
        <Col className="text-right" xs={12} lg={6}>
          <span className="pr-2">
            <PasswordModal />
          </span>
          <Button
            variant="primary"
            onClick={() => saveProfile()}
            className="btn-rounded"
          >
            Update Profile
          </Button>
        </Col>
      </Row>
    </Body>
  );
};

export default Profile;
