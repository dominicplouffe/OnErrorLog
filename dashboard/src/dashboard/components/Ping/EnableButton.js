import React, { useState } from "react";
import { Button, Modal } from "react-bootstrap";

const EnableButton = ({ objectId, active, enableAction, text }) => {
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
        "If you enabled your Uptime monitor, onErrorLog wil restart monitoring the URL you provided.",
    },
    pong: {
      name: "Monitor",
      warning:
        "By enabling your Monitor, you will be able to start sending requests again.",
    },
    metric_condition: {
      name: "",
      warning:
        "By enabling your notification, onErrorLog will continue to monitor and alert your metric.",
    },
  };

  return (
    <>
      <Button
        variant="success"
        onClick={() => setShowModal(true)}
        className="btn-rounded"
      >
        Enable {textMapping[text].name}
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
              enableAction();
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

export default EnableButton;
