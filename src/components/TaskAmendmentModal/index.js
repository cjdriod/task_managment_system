import React from "react"
import { Col, Form, Row, Button, Modal } from "react-bootstrap"

class TaskAmendmentModal extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      formData: props.taskDetails,
      formError: {},
    }
    this.isUpdate = Object.keys(props.taskDetails).length > 0
    this.setField = this.setField.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.resetModal = this.resetModal.bind(this)
  }

  setField(field, value) {
    this.setState(state => ({
      formData: {
        ...state.formData,
        [field]: value
      }
    }))

    if (this.state.formData[field]) {
      this.setState(state => ({
        formError: {
          ...state.formError,
          [field]: null,
        }
      }))
    }
  }

  async handleSubmit() {
    let formError = {}
    let { title, parentId } = this.state.formData

    if (title === undefined || !title.trim()) {
      formError['title'] = 'Task title is required'
    }

    if (!(parentId === undefined || parentId === null)) {
      let validParentIdAttach = this.props.parentIdValidation(Number(parentId), this.state.formData)

      if (!validParentIdAttach) {
        formError['parentId'] = 'Invalid parent ID'
      }
    }

    this.setState({ formError })

    if (Object.keys(formError).length === 0) {
      if (
        this.isUpdate &&
        this.props.taskDetails.parentId !== (Number(parentId) || null) &&
        this.props.taskDetails.parentId !== null
      ) {
        // Only remove node if the current node is not a root node(parentId = null)
        await this.props.detechNodeAction(this.props.taskDetails) // Remove parent linkage
      }

      this.props.callback({ ...this.state.formData, title, parentId: Number(parentId) || null })
      this.resetModal()
    }
  }

  resetModal() {
    this.setState({ formData: {}, formError: {} })
    this.props.closeModal()
  }

  render() {
    let mode = this.isUpdate ? 'Update' : 'Create'

    return (
      // Disable animation to avoid findDOMNode issue in bootstrap
      <Modal show onHide={this.resetModal} centered animation={false}>
        <Modal.Header closeButton>
          <Modal.Title>{mode} Task</Modal.Title>
        </Modal.Header>

        <Modal.Body>
          <Form.Group>
            <Row className="mb-2">
              <Col xs="3">
                <span>Title</span>
                <span className="text-danger">*</span>
              </Col>

              <Col>
                <Form.Control
                  value={this.state.formData.title || ''}
                  isInvalid={Boolean(this.state.formError.title)}
                  onChange={evt => this.setField('title', evt.target.value)}
                />

                <Form.Control.Feedback type="Invalid" className="text-danger">
                  {this.state.formError.title}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col xs="3">
                <span>Parent ID</span>
              </Col>

              <Col>
                <Form.Control
                  value={this.state.formData.parentId || ''}
                  isInvalid={Boolean(this.state.formError.parentId)}
                  onChange={evt => this.setField('parentId', evt.target.value)}
                />

                <Form.Control.Feedback type="Invalid" className="text-danger">
                  {this.state.formError.parentId}
                </Form.Control.Feedback>
              </Col>
            </Row>

            <div className="float-right">
              <Button variant={(mode === 'Update' && 'success') || 'primary'} onClick={this.handleSubmit}>
                {mode}
              </Button>
            </div>

          </Form.Group>
        </Modal.Body>
      </Modal>

    )
  }
}



export default TaskAmendmentModal