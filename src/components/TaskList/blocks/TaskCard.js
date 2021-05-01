import React from "react";
import { Badge, Card, Col, Form, Row } from "react-bootstrap";

function TaskCard({ cardInfo, isChecked, callback, show=true }) {
  let { id, title, parentId, status } = cardInfo

  if (show) {
    return (
      <Card className="mb-2 task-card">
        <Card.Body>
          <Row>
            <Col xs="2" lg="1">#{id}</Col>
            <Col>
              <div className="font-weight-bold mb-1">{title}</div>
              {parentId && <Badge variant="warning">Parent id: {parentId}</Badge>}
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

        <Card.Footer className="py-1">
          <div>Status: {status}</div>
        </Card.Footer>
      </Card>
    )
  }

  return null
}

export default TaskCard