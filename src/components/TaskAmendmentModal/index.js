import { useState } from "react"
import PropTypes from 'prop-types'
import { Col, Form, Row, Button, Modal } from "react-bootstrap"

function TaskAmendmentModal({show, closeModal, callback, parentIdValidation}) {
  const [formData, setFormData] = useState({})
  const [formError, setFormError] = useState({})
  const mode = 'Create'


  function setField(field, value) {
    setFormData({
      ...formData,
      [field]: value,
    })

    if (formError[field]) {
      setFormError({
        ...formError,
        [field]: null,
      })
    }
  }

  function handleSubmit() {
    let errorBag = {}

    if (!formData.title) {
      errorBag['title'] = 'Task title is required'
    }

    if (formData.parentId) {
      let validParentIdAttach = parentIdValidation(formData.parentId)

      if (!validParentIdAttach) {
        errorBag['parentId'] = 'Invalid parent ID'
      }
    }

    setFormError(errorBag)

    if (Object.keys(errorBag).length === 0) {
      callback(formData)
      resetModal()
    }
  }

  function resetModal() {
    setFormData({})
    setFormError({})
    closeModal()
  }


  return (
    // Disable animation to avoid findDOMNode issue in bootstrap
    <Modal show={show} onHide={resetModal} centered animation={false}>
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
              <Form.Control isInvalid={Boolean(formError.title)} onChange={evt => setField('title', evt.target.value)} />
              <Form.Control.Feedback type="Invalid" className="text-danger">{formError.title}</Form.Control.Feedback>
            </Col>
          </Row>

          <Row className="mb-3">
            <Col xs="3">
              <span>Parent ID</span>
            </Col>
            <Col>
              <Form.Control isInvalid={Boolean(formError.parentId)} onChange={evt => setField('parentId', +(evt.target.value))} />
              <Form.Control.Feedback type="Invalid" className="text-danger">{formError.parentId}</Form.Control.Feedback>
            </Col>
          </Row>

          <div className="float-right">
            <Button onClick={handleSubmit}>{mode}</Button>
          </div>
        </Form.Group>
      </Modal.Body>
    </Modal>
  )
}

TaskAmendmentModal.propsTypes = {
  show: PropTypes.bool.isRequired,
  closeModal: PropTypes.func.isRequired,
  callback: PropTypes.func.isRequired,
  parentIdValidation: PropTypes.func.isRequired,
}

export default TaskAmendmentModal