import React from "react";
import { TASK_STATUS } from '../../../constant/const'
import { Badge, Button, Card, Col, Form, Row } from "react-bootstrap";

function TaskCard({ cardInfo, isChecked, callback, openEditModal }) {
  let { id, title, parentId, status, children } = cardInfo
  let isSubTask = children.length === 0

  return (
    <Card className="mb-2 task-card touch-shadow" bg={isSubTask ? 'reset' : 'light'}>
      <Card.Body>
        <Row>
          <Col xs="2" lg="1">#{id}</Col>
          <Col>
            <div className={`font-weight-bold mb-1 ${(status === TASK_STATUS.complete && 'text-line-through') || ''}`}>
              {title[0].toUpperCase() + title.slice(1)}
            </div>
            {parentId && <Badge variant="warning">Parent id: {parentId}</Badge>}
          </Col>

          <Col xs="auto">
            {isSubTask &&
              <Form.Check
                id={'checkbox ' + id}
                type="checkbox"
                checked={isChecked}
                className="custom-checkbox"
                onChange={evt => { callback(cardInfo, evt.currentTarget.checked) }}
              />
            }
          </Col>
        </Row>
      </Card.Body>

      <Card.Footer className="py-1">
        <div className="d-flex justify-content-between">
          <div>Status: {status}</div>
          <div>
            <Button variant="link" className="p-0" onClick={openEditModal}>Edit</Button>
          </div>
        </div>
      </Card.Footer>
    </Card>
  )
}

export default TaskCard