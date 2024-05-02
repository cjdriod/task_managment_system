import React from 'react';
import {Button, Card, Image} from "react-bootstrap";
import emptyTaskIcon from "../../../assets/img/empty-note.png";
import mockData from '../../../mock.json'

export default ({createTaskCtaAction, createSample}) => {
  return <Card className="text-center">
    <Card.Body>
      <div>
        <Image src={emptyTaskIcon} heigh="128" width="128" roundedCircle/>
      </div>

      <div>
        <h5>You have nothing to work on~</h5>
        <div className='mb-3'>Click the button below to create new task</div>
        <div className='mb-3'>
          <Button size="sm" variant="outline-primary" onClick={createTaskCtaAction}>
            Create new task
          </Button>
        </div>
        <div>
          <Button size="sm" variant="outline-primary" onClick={() => {
            createSample(mockData)
          }}>
            Click here for a delicious spaghetti 🍝
          </Button>
        </div>
      </div>
    </Card.Body>

  </Card>
}