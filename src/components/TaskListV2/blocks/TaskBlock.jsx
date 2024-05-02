import React from 'react';
import {Button, FormControl, InputGroup} from "react-bootstrap";
import {TASK_STATUS} from "../../../constant/const";

export default ({task, taskPointer, updateTask}) => {
  const isCompleted = task.status === TASK_STATUS.complete;

  return <InputGroup className="border-0 py-1">
    <InputGroup.Prepend>
      <InputGroup.Checkbox
        defaultChecked={isCompleted}
        onChange={(evt) => {
          updateTask(
            {
              ...task,
              status: evt.target.checked
                ? TASK_STATUS.complete
                : TASK_STATUS.inProgress,
            },
            taskPointer
          );
        }}
      />
    </InputGroup.Prepend>
    <FormControl
      defaultValue={task.title}
      readOnly={isCompleted}
      onChange={(evt) => {
        updateTask({...task, title: evt.target.value.trim()}, taskPointer);
      }}
      placeholder="Just DO it...."
    />
    <InputGroup.Append>
      <Button type='button' variant='outline-secondary' onClick={() => {
        updateTask(undefined, taskPointer)
      }}>Delete</Button>
    </InputGroup.Append>
  </InputGroup>
}