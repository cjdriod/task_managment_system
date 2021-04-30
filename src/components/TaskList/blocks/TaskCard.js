import React from "react";
import { Card, Col, Form, Row } from "react-bootstrap";

function TaskCard({ cardInfo, isChecked, callback, show=true }) {
  let { id, title, parentId, status } = cardInfo

  if (show) {
    return (
      <Card className="mb-2 task-card">
        <Card.Body>
          <Row>
            <Col xs="1">#{id}</Col>
            <Col>
              <div className="font-weight-bold mb-1">{title}</div>
              {parentId && <small>Parent id: {parentId}</small>}
            </Col>
            <Col xs="auto">
              <Form.Check
                type="checkbox"
                checked={isChecked}
                className="custom-checkbox"
                onChange={(evt) => {callback(cardInfo, evt.currentTarget.checked)}}
              />
            </Col>
          </Row>
        </Card.Body>
        <Card.Footer className="py-0">
          <div>Status: {status}</div>
        </Card.Footer>
      </Card>
    )
  }

  return null
}

export default TaskCard