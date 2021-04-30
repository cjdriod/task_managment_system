import React from 'react'
import { Col, Form, Row } from 'react-bootstrap'
import TaskCard from './blocks/TaskCard'

const TASK_STATUS = {
  inProgrss: 'In Progress',
  done: 'Done',
  complete: 'Complete',
}

function FilterOptions() {
  let options = [{ key: 'all', label: 'All', value: '' }]

  for (let i in TASK_STATUS) {
    options.push({ key: i, label: TASK_STATUS[i], value: TASK_STATUS[i] })
  }

  return options.map(opt => (
    <option key={opt.key} value={opt.value}>{opt.label}</option>
  ))
}

class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      tasksList: [],
      currentFilter: '',
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleTaskStusChange = this.handleTaskStusChange.bind(this)
  }

  handleFilterChange(evt) {
    this.setState({ currentFilter: evt.target.value })
  }

  handleTaskStusChange(obj, value) {
    this.setState((state) => {
      let list = [...state.tasksList]
      let targetIndex = list.findIndex(task => task.id === obj.id)

      list[targetIndex]['status'] = (value && TASK_STATUS.done) || TASK_STATUS.inProgrss

      return { tasksList: list }
    })
  }

  render() {
    return (
      <Col>
        <Row className="align-items-center mb-4">
          <Col sm="auto">
            <Form.Label>Filter</Form.Label>
          </Col>
          <Col>
            <Form.Control as="select" onChange={this.handleFilterChange} value={this.state.currentFilter}>
              <FilterOptions />
            </Form.Control>
          </Col>
        </Row>

        {this.state.tasksList.map(task => (
          <TaskCard
          key={task.id}
          cardInfo={task}
          callback={this.handleTaskStusChange}
          isChecked={task.status !== TASK_STATUS.inProgrss}
          show={!this.state.currentFilter || this.state.currentFilter === task.status}
          />
        ))}

      </Col>
    )
  }
}

export default TaskList