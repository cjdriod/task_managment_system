import React from 'react'
import TaskCard from './blocks/TaskCard'
import { TASK_STATUS } from '../../constant/const'
import { Button, Col, Form, Row, Media } from 'react-bootstrap'
import TaskAmendmentModal from '../TaskAmendmentModal'
import * as L from '../../constant/localStorageKeys'

function FilterOptions() {
  let options = [{ key: 'all', label: 'All', value: '' }]

  for (let i in TASK_STATUS) {
    options.push({ key: i, label: TASK_STATUS[i], value: TASK_STATUS[i] })
  }

  return options.map(opt => (
    <option key={opt.key} value={opt.value}>{opt.label}</option>
  ))
}

function TaskListChildComponent({ taskList, callback }) {
  if (taskList.length > 0) {
    return taskList.map(task => (
      <Media key={task.id} className={[{ 'border-light rounded card-group-outline mb-2': task.children.length > 0 }, 'ml-5']}>
        <Media.Body>
          <TaskCard
            cardInfo={task}
            callback={callback}
            isChecked={task.status !== TASK_STATUS.inProgrss}
          />
          <TaskListChildComponent taskList={task.children} callback={callback} />
        </Media.Body>
      </Media>
    ))
  }
  return false
}

class TaskList extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      taskList: JSON.parse(localStorage.getItem(L.TASK_LIST)) || [],
      currentFilter: '',
      isModalOpen: false,
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleTaskStatusChange = this.handleTaskStatusChange.bind(this)
    this.handleTaskListAmendment = this.handleTaskListAmendment.bind(this)
    this.parentTaskReferencingValidator = this.parentTaskReferencingValidator.bind(this)
    this.updateParentNode = this.updateParentNode.bind(this)
  }

  handleFilterChange(evt) {
    this.setState({ currentFilter: evt.target.value })
  }

  async handleTaskStatusChange(obj, value) {
    let taskList = [...this.state.taskList]
    let targetIndex = taskList.findIndex(task => task.id === obj.id)

    taskList[targetIndex]['status'] = (value && TASK_STATUS.complete) || TASK_STATUS.inProgrss
    await this.setState({ taskList })
    this.updateParentNode(taskList[targetIndex])
  }

  async handleTaskListAmendment(payload) {
    let taskList = [...this.state.taskList]
    let task = { id: (({ ...(taskList.slice(-1)[0]) }).id || 0) + 1, status: TASK_STATUS.inProgrss, children: [] }

    task = {
      ...task,
      title: payload.title,
      parentId: payload.parentId || null,
    }

    taskList.push(task)
    await this.setState({ taskList })
    this.updateParentNode(task)
  }

  async updateParentNode(children) {
    if (children.parentId) {
      let taskList = [...this.state.taskList]
      let parentNodeIndex = taskList.findIndex(task => task.id === children.parentId) // find parent node index

      let parentNodeChildrenIndex = taskList[parentNodeIndex]['children'].findIndex(child => child.id === children.id) // search for his children list

      if (parentNodeChildrenIndex === -1) {
        taskList[parentNodeIndex]['children'].push(children) // bind new children
      } else {
        taskList[parentNodeIndex]['children'].splice(parentNodeChildrenIndex, 1, children) // replace children with latest data
      }

      if (taskList[parentNodeIndex]['children'].every(task => task.status === TASK_STATUS.complete)) {
        taskList[parentNodeIndex].status = TASK_STATUS.complete
      } else {
        if (taskList[parentNodeIndex].status === TASK_STATUS.complete) {
          taskList[parentNodeIndex].status = TASK_STATUS.done
        }
      }

      await this.setState({ taskList })

      this.updateParentNode(taskList[parentNodeIndex]) // repeat same action bubble up to the root level
    }
  }

  parentTaskReferencingValidator(parentId) {
    return Boolean(this.state.taskList.find(task => task.id === parentId))
  }

  componentDidMount() {
    this.setState({ isModalOpen: this.state.taskList.length === 0 })
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

        {
          this.state.taskList.filter(task => !task.parentId).map(task => {
            if (!this.state.currentFilter || this.state.currentFilter === task.status) {
              return (
                <Media key={task.id} className={[{ 'border-light rounded card-group-outline': task.children.length > 0 }, 'mb-2']}>
                  <Media.Body>
                    <TaskCard
                      cardInfo={task}
                      callback={this.handleTaskStatusChange}
                      isChecked={task.status !== TASK_STATUS.inProgrss}
                      show={!this.state.currentFilter || this.state.currentFilter === task.status}
                    />
                    <TaskListChildComponent taskList={task.children} callback={this.handleTaskStatusChange} />
                  </Media.Body>
                </Media>
              )
            }
            return null
          })
        }

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