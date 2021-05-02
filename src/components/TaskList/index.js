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

function TaskListChildComponent({ taskList, callback, openEditModal }) {
  if (taskList.length > 0) {
    return taskList.map(task => (
      <Media key={task.id} className={[{ 'border-light rounded card-group-outline mb-2 border-right-0': task.children.length > 0 }, 'ml-5']}>
        <Media.Body>
          <TaskCard
            cardInfo={task}
            callback={callback}
            openEditModal={() => openEditModal({ isOpen: true, taskDetails: task })}
            isChecked={task.status !== TASK_STATUS.inProgrss}
          />

          <TaskListChildComponent taskList={task.children} callback={callback} openEditModal={openEditModal} />
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
      modalMeta: {
        isOpen: false,
        taskDetails: {},
      }
    }
    this.handleFilterChange = this.handleFilterChange.bind(this)
    this.handleChildNodeDetach = this.handleChildNodeDetach.bind(this)
    this.handleTaskStatusChange = this.handleTaskStatusChange.bind(this)
    this.handleTaskListAmendment = this.handleTaskListAmendment.bind(this)
    this.parentTaskReferencingValidator = this.parentTaskReferencingValidator.bind(this)
    this.updateParentNode = this.updateParentNode.bind(this)
    this.nodeDescendants = this.nodeDescendants.bind(this)
  }

  handleFilterChange(evt) {
    this.setState({ currentFilter: evt.target.value })
  }

  async handleChildNodeDetach(currentNode) {
    let taskList = [...this.state.taskList]
    let parentNodeIndex = taskList.findIndex(task => task.id === currentNode.parentId) 
    let currentNodeIndex = taskList[parentNodeIndex].children.findIndex(task => task.id === currentNode.id)

    taskList[parentNodeIndex].children.splice(currentNodeIndex, 1) // Detach child linking with parent
    await this.setState({ taskList })
    this.updateParentNode(taskList[parentNodeIndex])
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

    if (payload.id) {
      task = { ...payload } // Override with exiting task details (update)
    }

    task = {
      ...task,
      title: payload.title,
      parentId: payload.parentId || null,
    }

    if (payload.id) {
      let targetIndex = taskList.findIndex(task => task.id === payload.id) // Find existing record

      taskList.splice(targetIndex, 1, task) // Replace and slot in latest data
    } else {
      taskList.push(task)
    }
    await this.setState({ taskList })
    this.updateParentNode(task)
  }

  async updateParentNode(node) {
    if (node.parentId) {
      let taskList = [...this.state.taskList]
      let parentNodeIndex = taskList.findIndex(task => task.id === node.parentId) // Find parent node index

      let parentNodeChildrenIndex = taskList[parentNodeIndex]['children'].findIndex(child => child.id === node.id) // Search for his children list

      if (parentNodeChildrenIndex === -1) {
        taskList[parentNodeIndex]['children'].push(node) // bind new children
      } else {
        taskList[parentNodeIndex]['children'].splice(parentNodeChildrenIndex, 1, node) // Replace children with latest data
      }

      if (taskList[parentNodeIndex]['children'].every(task => task.status === TASK_STATUS.complete)) {
        taskList[parentNodeIndex].status = TASK_STATUS.complete
      } else {
        if (taskList[parentNodeIndex].status === TASK_STATUS.complete) {
          taskList[parentNodeIndex].status = TASK_STATUS.done
        }
      }

      await this.setState({ taskList })

      this.updateParentNode(taskList[parentNodeIndex]) // Repeat same action bubble up to the root level
    }
  }

  parentTaskReferencingValidator(parentId, currentNode={}) {
    if (parentId === 0) {
      return true
    }

    let parentTask = this.state.taskList.find(task => task.id === parentId) // Check for parent id existance

    if (currentNode.id && parentTask) {
      let blacklistParentNode = this.nodeDescendants(currentNode)

      return !blacklistParentNode.map(node => node.id).includes(parentId)
    }

    return Boolean(parentTask)
  }

  nodeDescendants(node) {
    // fyi: this function will include yourself in the 1st index
    let result = [{ id: node.id, status: node.status }]

    if (node.children) {
      node.children.forEach(child => {
        return result.push(...this.nodeDescendants(child))
      });
    }

    return result
  }

  componentDidMount() {
    if (this.state.taskList.length === 0) {
      this.setState({ modalMeta: { isOpen: true, taskDetails: {} } })
    }
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
            <Button onClick={() => this.setState({ modalMeta: { isOpen: true, taskDetails: {} } })}>+ New</Button>
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
                      openEditModal={() => this.setState({ modalMeta: { isOpen: true, taskDetails: task } })}
                    />

                    <TaskListChildComponent
                      taskList={task.children}
                      callback={this.handleTaskStatusChange}
                      openEditModal={modalMeta => this.setState({ modalMeta })} />
                  </Media.Body>
                </Media>
              )
            }
            return null
          })
        }

        {this.state.modalMeta.isOpen && <TaskAmendmentModal
          callback={this.handleTaskListAmendment}
          detechNodeAction={this.handleChildNodeDetach}
          taskDetails={this.state.modalMeta.taskDetails}
          parentIdValidation={this.parentTaskReferencingValidator}
          closeModal={() => this.setState({ modalMeta: { isOpen: false, taskDetails: {} } })}
        />}
      </div>
    )
  }
}

export default TaskList