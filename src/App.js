import { Button, Col, Container, Navbar, Row } from 'react-bootstrap';
import TaskList from './components/TaskList';

function App() {
  return (
    <div className="App">
      <Container>
        <Navbar bg="light" className="mb-4">
          <Row className="flex-fill">
            <Col >
              <Navbar.Brand>Task Management System</Navbar.Brand>
            </Col>

            <Col xs="auto">
              <Button>+ Create</Button>
            </Col>
          </Row>
        </Navbar>

        <div>
          <TaskList />
        </div>
      </Container>
    </div>
  );
}

export default App;
