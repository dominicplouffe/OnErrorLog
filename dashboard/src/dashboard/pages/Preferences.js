// import React, { useState, useEffect } from "react";
// import Body from "../components/Body";
// import InputText from "../components/InputText";
// import InputSelect from "../components/InputSelect";
// import PasswordModal from "../components/Profile/Password";
// import { Card, Row, Col, Button } from "react-bootstrap";
// import "react-phone-number-input/style.css";
// import api from "../../utils/api";
// import PhoneInput from "react-phone-number-input";
// import useAuth from "../../auth/useAuth";

// const Preferences = (props) => {
//   const currentUser = props.currentUser;
//   const { loginUser } = useAuth();
//   const [loading, setLoading] = useState(true);
//   const [updated, setUpdated] = useState(false);

//   useEffect(() => {
//     setLoading(false);
//     // eslint-disable-next-line
//   }, [props]);

//   return (
//     <Body
//       title="Preferences"
//       selectedMenu="preferences"
//       {...props}
//       loading={loading}
//     >
//       <Card>
//         <Card.Body>
//           <Card.Title>Email Body</Card.Title>
//           <Card.Subtitle>
//             Please ensure that the information below is accurate so we ensure
//             your experience with onErrorLog is good.
//           </Card.Subtitle>
//         </Card.Body>
//       </Card>
//       {/* <Row className="mt-4">
//         <Col className="pl-4 mb-5 text-success" xs={12} lg={6}>
//           {updated && <strong>Your profile has been updated.</strong>}
//         </Col>
//         <Col className="text-right" xs={12} lg={6}>
//           <span className="pr-2">
//             <PasswordModal />
//           </span>
//           <Button
//             variant="primary"
//             onClick={() => saveProfile()}
//             className="btn-rounded"
//           >
//             Update Profile
//           </Button>
//         </Col>
//       </Row> */}
//     </Body>
//   );
// };

// export default Preferences;
