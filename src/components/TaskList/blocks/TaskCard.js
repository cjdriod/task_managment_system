import React from "react";
import { TASK_STATUS } from '../../../constant/const'
import { Badge, Button, Card, Col, Form, Row } from "react-bootstrap";

function DepandancySummary({ nodeInfo }) {
  return (
    <div className="text-right">
      <u>Total</u>

      <small>
        <table>
          <tbody>
            <tr>
              <td>Dependencies:</td>
              <td className="pl-2">{nodeInfo.total}</td>
            </tr>

            <tr>
              <td>Complete:</td>
              <td className="pl-2">{nodeInfo.complete}</td>
            </tr>

            <tr>
              <td>Done:</td>
              <td className="pl-2">{nodeInfo.done}</td>
            </tr>
          </tbody>
        </table>
      </small>
    </div>
  )
}

function TaskCard({ cardInfo, isChecked, callback, openEditModal, childrenInfoGetter, removeTaskAction }) {
  let { id, title, parentId, status, children } = cardInfo
  let isSubTask = children.length === 0
  let childInfo = {}

  function deleteTaskAction() {
    let totalRemovingNodeCount = (childInfo.total || 0) + 1

    Promise.resolve(
      window.confirm(
        `You are about to remove ${totalRemovingNodeCount} task with this action!` +
        `${childInfo.total ? '\n[Warning]: Children node will be remove together' : ''} `
      )
    ).then(async res => {
      if (res) {
        await removeTaskAction(cardInfo, true)
      }
    })
  }

  if (!isSubTask) {
    let descendantsInfo = childrenInfoGetter(cardInfo).slice(1) //Exclude self

    childInfo = descendantsInfo.reduce(((acc, cur) => {
      return {
        total: acc.total += 1,
        done: acc.done += Number(cur.status === TASK_STATUS.done),
        complete: acc.complete += Number(cur.status === TASK_STATUS.complete)
      }
    }), { total: 0, done: 0, complete: 0 })
  }

  return (
    <Card className="mb-2 task-card touch-shadow" bg={isSubTask ? 'reset' : 'light'}>
      <Card.Body>
        <Row>
          <Col xs="2" lg="1">#{id}</Col>
          <Col>
            <div className={`font - weight - bold mb - 1 ${ (status === TASK_STATUS.complete && 'text-line-through') || '' } `}>
              {title[0].toUpperCase() + title.slice(1)}
            </div>
            {parentId && <Badge variant="warning">Parent id: {parentId}</Badge>}
          </Col>

          <Col xs="auto">
            {isSubTask
              ? <Form.Check
                id={'checkbox ' + id}
                type="checkbox"
                checked={isChecked}
                className="custom-checkbox"
                onChange={evt => { callback(cardInfo, evt.currentTarget.checked) }}
              />
              : <DepandancySummary nodeInfo={childInfo} />
            }
          </Col>
        </Row>
      </Card.Body>

      <Card.Footer className="py-1">
        <div className="d-flex justify-content-between">
          <div>Status: <i>{status}</i></div>
          <div>
            <Button variant="link" className="p-0 pr-3 text-danger" onClick={deleteTaskAction}>Delete</Button>
            <Button variant="link" className="p-0" onClick={openEditModal}>Edit</Button>
          </div>
        </div>
      </Card.Footer>
    </Card>
  )
}

export default TaskCard