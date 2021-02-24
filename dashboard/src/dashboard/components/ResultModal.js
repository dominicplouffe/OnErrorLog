import React from "react";
import { Badge, Modal, Table } from "react-bootstrap";

const ResultModal = ({ result, setShowModal, showModal, title }) => {
  return (
    <Modal size="lg" show={showModal} onHide={() => setShowModal(false)}>
      <Modal.Header closeButton>
        <Modal.Title id="result-modal">{title}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {result && (
          <Table borderless responsive="lg" size="sm">
            <tr>
              <td style={{ width: `200px` }}>Status</td>
              <td>
                {result.check_status ? (
                  <Badge variant="success">No Issues Found</Badge>
                ) : (
                  <Badge variant="danger">Failure</Badge>
                )}
              </td>
            </tr>
            <tr>
              <td style={{ width: `200px` }}>HTTP Status Code:</td>
              <td>{result.http_status_code || result.status_code}</td>
            </tr>
            <tr>
              <td style={{ width: `200px` }}>Reason:</td>
              <td>{result.reason}</td>
            </tr>
            <tr>
              <td style={{ width: `200px` }}>Content</td>
              <td>{result.content || "No Content"}</td>
            </tr>
          </Table>
        )}
      </Modal.Body>
    </Modal>
  );
};

export default ResultModal;
