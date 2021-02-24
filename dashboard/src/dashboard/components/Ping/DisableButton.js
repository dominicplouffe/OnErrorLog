import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const DisableButton = ({ objectId, active, disableAction, text }) => {
  const [showModal, setShowModal] = useState(false);

  if (objectId === null) {
    return null;
  }
  if (!active) {
    return null;
  }

  const textMapping = {
    ping: {
      name: "Ping",
      warning:
        "If you disable your Uptime monitor, the associated URL will no longer be monitored.",
    },
    pong: {
      name: "Monitor",
      warning: "You about about to disable your Monitor.",
    },
    metric_condition: {
      name: "",
      warning: "You are about to disable your notification.",
    },
  };

  return (
    <>
      <Button
        variant="danger"
        onClick={() => setShowModal(true)}
        className="btn-rounded"
      >
        Pause {textMapping[text].name}
      </Button>
      <Modal show={showModal} onHide={setShowModal}>
        <Modal.Header closeButton>
          <Modal.Title>Disable {textMapping[text].name}</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <p>{textMapping[text].warning}</p>
          <p>Are you certain you want to continue?</p>
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
            variant="primary"
            onClick={() => {
              disableAction();
              setShowModal(false);
            }}
            className="btn-rounded"
          >
            Proceed
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default DisableButton;
