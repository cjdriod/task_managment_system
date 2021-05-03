import emptyTaskIcon from '../../../assets/img/empty-note.png'
import { Card, Image, Button } from 'react-bootstrap'

function TaskListEmptyStateCard({ setTaskList }) {

  function setMockData() {
    /* TODO:
     idk why need to force raload then only can avoid invalid import data issue
     issue only happend when the user load the mock data twice */
    Promise.resolve(window.location.reload()).then(() => {
      Promise.resolve(import('../../../mock.json')).then(res => {
        setTaskList(res.default)
      })
    })
  }

  return (
    <Card className="text-center">
      <Card.Body>
        <div>
          <Image src={emptyTaskIcon} heigh="128" width="128" roundedCircle />
        </div>

        <div>
          <h5>You have nothing to work on~</h5>
          <div>Click the top right <div className="top-right-hand">👆</div> button to create new task</div>
          <div className="my-2">or</div>
          <Button size="sm" variant="outline-secondary" onClick={setMockData}>
            Click here for a delicious spaghetti 🍝
          </Button>
        </div>
      </Card.Body>

    </Card>
  )

}

export default TaskListEmptyStateCard