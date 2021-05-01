import { Container, Navbar } from 'react-bootstrap';
import TaskList from './components/TaskList';

function App() {
  return (
    <div className="App">
      <Container>
        <Navbar bg="light" className="mb-4">
          <Navbar.Brand>Task Management System</Navbar.Brand>
        </Navbar>

        <div>
          <TaskList className="shadow-sm" />
        </div>
      </Container>
    </div>
  );
}

export default App;
