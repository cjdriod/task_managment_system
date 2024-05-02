import React, {useMemo, useState} from "react";
import {Button, Col, Row} from "react-bootstrap";
import {v4 as uuidv4} from "uuid";
import {TASK_STATUS} from "../../constant/const";
import EmptyTaskBlock from "./blocks/EmptyTaskBlock";
import TaskBlock from "./blocks/TaskBlock";
import * as L from "../../constant/localStorageKeys";

const TaskCollections = ({task, taskPrefix, updateTask, wrapperClass, showAddMore}) => {
  return (
    <div className={`${wrapperClass} task-left-border`}>
      <TaskBlock task={task} taskPointer={taskPrefix} updateTask={updateTask}/>

      {task.children &&
        task.children.map((childTask, index) => {
          const childKey = [taskPrefix, index].join("-")
          return <React.Fragment key={childTask.id}>
            <TaskCollections
              task={childTask}
              taskPrefix={childKey}
              updateTask={updateTask}
              wrapperClass="ml-3"
              showAddMore={index === task.children.length - 1}
            />
          </React.Fragment>
        })}

      <div className='action-group d-flex'>
        {
          task.children.length === 0 &&
          <Button variant="link" className='pl-0 order-2 text-black-50 font-italic' onClick={() => {
            updateTask({
              id: uuidv4(),
              title: '',
              status: TASK_STATUS.inProgress,
              children: []
            }, [String(taskPrefix), 0].join('-'));
          }}>🗐 Add sub-task</Button>
        }

        {showAddMore && <Button variant="link" className='pl-0 order-1' onClick={() => {
          const chunks = String(taskPrefix).split('-')
          chunks[chunks.length - 1] = (Number(chunks[chunks.length - 1]) + 1).toString()
          updateTask({id: uuidv4(), title: '', status: TASK_STATUS.inProgress, children: []}, chunks.join('-'));
        }}>+ Add new task</Button>}
      </div>
    </div>
  );
};

export default () => {
  const [tasks, setTasks] = useState(JSON.parse(localStorage.getItem(L.TASK_LIST)) || []);
  // const [filter, setFilter] = useState("");

  // const filterOptions = useMemo(() => {
  //   return [
  //     {key: "all", label: "All", value: ""},
  //     ...Object.keys(TASK_STATUS).map((key) => ({
  //       key: key,
  //       label: TASK_STATUS[key],
  //       value: TASK_STATUS[key],
  //     })),
  //   ];
  // }, []);

  const autoSaveLocal = (tasks) => {
    localStorage.setItem(L.TASK_LIST, JSON.stringify(tasks))
  }

  const updateTask = (task, address) => {
    const addressChunks = String(address).split("-");
    setTasks((prevState) => {
      let result = [...prevState];
      let [target, parent] = [result, result]
      for (let i = 0; i < addressChunks.length; i++) {
        const index = Number(addressChunks[i]);
        if (i === addressChunks.length - 1) {
          if (task) {
            (target[index] = {...task})
          } else if (parent.children) {
            parent.children = [...parent.children.slice(0, Number(index)), ...parent.children.slice(Number(index) + 1)]
          } else {
            result = [...parent.slice(0, Number(index)), ...parent.slice(Number(index) + 1)];
          }
          continue;
        }
        parent = target[index]
        target = target[index].children;
      }

      autoSaveLocal(result)
      return result;
    });
  };

  return (
    <div>
      {/*<Row className="align-items-center mb-4">*/}
      {/*  <Col xs="auto">*/}
      {/*    <Form.Label>Filter</Form.Label>*/}
      {/*  </Col>*/}

      {/*  <Col xs="auto">*/}
      {/*    <Form.Control*/}
      {/*      as="select"*/}
      {/*      value={filter}*/}
      {/*      onChange={(evt) => {*/}
      {/*        setFilter(evt.target.value);*/}
      {/*      }}*/}
      {/*    >*/}
      {/*      {filterOptions.map((filter) => (*/}
      {/*        <option key={filter.key} value={filter.key}>*/}
      {/*          {filter.label}*/}
      {/*        </option>*/}
      {/*      ))}*/}
      {/*    </Form.Control>*/}
      {/*  </Col>*/}
      {/*</Row>*/}

      <Row>
        <Col>
          {(tasks.length === 0 && (
              <EmptyTaskBlock createSample={(res) => {
                setTasks(res)
                autoSaveLocal(res)
              }} createTaskCtaAction={() => {
                updateTask({title: '', status: TASK_STATUS.inProgress, children: []}, '0');
              }}/>
            )) ||
            tasks.map((task, taskIdx) => (
              <React.Fragment key={task.id}>
                <TaskCollections
                  task={task}
                  taskPrefix={taskIdx}
                  updateTask={updateTask}
                  showAddMore={taskIdx === tasks.length - 1}
                />
              </React.Fragment>
            ))}
        </Col>
      </Row>

      <Row>
        <Col>
          <Button
            size="sm"
            variant="outline-secondary"
            onClick={() => {
              setTasks([])
              autoSaveLocal([])
            }}
            className={`mt-5 ${tasks.length === 0 ? 'd-none' : 'd-block'}`}
          >
            Reset all my task
          </Button>
        </Col>
      </Row>
    </div>
  );
};
