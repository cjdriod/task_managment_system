import React from 'react'
import TaskCard from './blocks/TaskCard'
import { TASK_STATUS } from '../../constant/const'
import { Button, Col, Form, Row } from 'react-bootstrap'
import TaskAmendmentModal from '../TaskAmendmentModal'

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
      taskList: [],
      currentFilter: '',
      isModalOpen: false,
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleTaskStatusChange = this.handleTaskStatusChange.bind(this)
    this.handleTaskListAmendment = this.handleTaskListAmendment.bind(this)
    this.parentTaskReferencingValidator = this.parentTaskReferencingValidator.bind(this)
  }

  handleFilterChange(evt) {
    this.setState({ currentFilter: evt.target.value })
  }

  handleTaskStatusChange(obj, value) {
    this.setState((state) => {
      let list = [...state.taskList]
      let targetIndex = list.findIndex(task => task.id === obj.id)

      list[targetIndex]['status'] =
        (value && (obj.parentId ? TASK_STATUS.done : TASK_STATUS.complete)) ||
        TASK_STATUS.inProgrss

      return { taskList: list }
    })
  }

  handleTaskListAmendment(payload) {
    let taskList = [...this.state.taskList]
    let taskDetails = {}
    let targetIndex = -1

    if (payload.id) {
      targetIndex = taskList.findIndex(task => task.id === payload.id)
    }

    taskDetails = targetIndex !== -1
      ? { ...taskList[targetIndex] }
      : { id: (({ ...(taskList.slice(-1)[0]) }).id || 0) + 100, status: TASK_STATUS.inProgrss }

    taskDetails = {
      ...taskDetails,
      title: payload.title,
      parentId: payload.parentId || null,
    }

    if (targetIndex !== -1) {
      taskList[targetIndex] = taskDetails
    } else {
      taskList.push(taskDetails)
    }

    this.setState({ taskList })
  }

  parentTaskReferencingValidator(parentId) {
    return Boolean(this.state.taskList.find(task => task.id === parentId))
  }

  componentDidMount() {
    this.setState({isModalOpen: this.state.taskList.length === 0})
  }


  render() {
    return (
      <div>
        <Row className="align-items-center mb-4">
          <Col xs="auto">
            <Form.Label>Filter</Form.Label>
          </Col>
          <Col xs="auto">
            <Form.Control as="select" onChange={this.handleFilterChange} value={this.state.currentFilter}>
              <FilterOptions />
            </Form.Control>
          </Col>
          <Col xs="auto" className="ml-auto">
            <Button onClick={() => this.setState({ isModalOpen: true })}>+ New</Button>
          </Col>
        </Row>

        {this.state.taskList.map(task => (
          <TaskCard
            key={task.id}
            cardInfo={task}
            callback={this.handleTaskStatusChange}
            isChecked={task.status !== TASK_STATUS.inProgrss}
            show={!this.state.currentFilter || this.state.currentFilter === task.status}
          />
        ))}


        <TaskAmendmentModal
          show={this.state.isModalOpen}
          callback={this.handleTaskListAmendment}
          closeModal={() => this.setState({ isModalOpen: false })}
          parentIdValidation={this.parentTaskReferencingValidator}
        />
      </div>
    )
  }
}

export default TaskList