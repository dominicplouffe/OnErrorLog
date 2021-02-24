import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const DeleteButton = ({ objectId, active, deleteAction, text }) => {
  const [showModal, setShowModal] = useState(false);

  if (objectId === null) {
    return null;
  }
  if (active) {
    return null;
  }

  const textMapping = {
    ping: {
      name: "Uptime",
      warning:
        "If you delete your Uptime monitor, the associated URL will no longer be monitored.",
    },
    pong: {
      name: "Monitor",
      warning: "You about about to delete your monitor.",
    },
    metric_condition: {
      name: "Condition",
      warning: "You are about to delete your notification.",
    },
  };

  return (
    <>
      <Button
        variant="link"
        onClick={() => setShowModal(true)}
        style={{ color: "#a0a0a0" }}
      >
        [-] Delete {textMapping[text].name}
      </Button>
      <Modal show={showModal} onHide={setShowModal}>
        <Modal.Header closeButton>
          <Modal.Title>Delete {textMapping[text].name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>
            <strong>This action is NOT reversible!</strong>
          </p>
          <p>
            When you delete a {textMapping[text].name}, you also delete all the
            associated historical data. If you want to keep the associated data,
            keep the {textMapping[text].name} disabled. Disabled{" "}
            {textMapping[text].name} do not count towards your{" "}
            {textMapping[text].name} Count on your Plan.
          </p>
          <p>Are you absolutely certain you want to continue?</p>
        </Modal.Body>

        <Modal.Footer>
          <Button
            variant="light"
            onClick={() => setShowModal(false)}
            className="btn-rounded"
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => {
              deleteAction();
              setShowModal(false);
            }}
            className="btn-rounded"
          >
            Yes, Delete My {textMapping[text].name}
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DeleteButton;
