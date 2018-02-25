import React, { Component } from 'react';
import Task from './Task';
import {
  Table, Card, CardBody, CardFooter, Button, Input
} from 'reactstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'react-spinkit';

class TaskTable extends Component {
  /*
  *    Endpoint to send to API:
  *
  *    itemCount: 2,
  *    tasks [
  *        { task: "Do this" },
  *        { task: "Do that"}
  *    ]
  */

  constructor(props) {
    super(props)

    this.state = {
      tasks: [],
      taskCount: 0,
      newTaskToggle: false,
      newTask: "",
      loading: true
    }

    this.removeTask     = this.removeTask.bind(this);
    this.toggleInput    = this.toggleInput.bind(this);
    this.handleCheckbox = this.handleCheckbox.bind(this);
    this.setNewTask     = this.setNewTask.bind(this);
    this.saveTask       = this.saveTask.bind(this);
    this.getAllTasks    = this.getAllTasks.bind(this);
    this.renderLoader   = this.renderLoader.bind(this);
  }

  componentDidMount() {
    this.getAllTasks();
  }

  /*
  * Retrieves all the users tasks from the backend through axios
  */
  getAllTasks() {
    const result = axios.get("http://localhost:4000/api/v1/tasks").then( (data) => {
      var tasks = [];

      // TODO change response to return data.data.tasks
      data.data.map( (task) => {
        tasks.push({
          id: task._id, desc: task.desc
        });
      });

      this.setState({ tasks, loading: false });
    }).catch( (err) => {
      this.setState({ loading: false });
      if(err) toast.error("Could not get all Tasks, please reload the page", {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    })
  }

  // Saves the inputted task
  saveTask() {
    var tasks = this.state.tasks;
    const newTask = { desc: this.state.newTask };

    axios.post("http://localhost:4000/api/v1/tasks", newTask).then( (response) => {
      /**
       * Adds to local state to improve performace and removing the need to reload
         after submittion to get new database data
       */
       newTask.id = response.data.task._id;
       tasks.push(newTask);
       // Increment the key value
       const taskCount = this.state.taskCount + 1;
       this.setState( { tasks, taskCount } );

       toast.success("Task saved!", {
         position: toast.POSITION.BOTTOM_RIGHT
       })
    }).catch( (err) => {
      if(err) toast.error("Could not save task, please try again",{
        position: toast.POSITION.BOTTOM_RIGHT
      });
    });

    // toggle back the input
    this.toggleInput();
  }

  // Removes a spesific task, In other words marked as completed
  removeTask(taskId) {
    var tasks = this.state.tasks;

    // Removal request to backend API
    axios.delete(`http://localhost:4000/api/v1/tasks/${taskId}`).then( (response) => {

      toast.success("Task Completed", {
        position: toast.POSITION.BOTTOM_RIGHT
      });

      //Removal operation from local state, filters out the spesific task
      tasks = tasks.filter(task => task.id !== taskId );
      this.setState( { tasks } );
    }).catch( (err) => {
      if(err) toast.error("Could not complete task, please try again", {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    })
  }

  // Toggles the input new task mode
  toggleInput() {
    var newTaskToggle = this.state.newTaskToggle;

    newTaskToggle === false ? newTaskToggle = true : newTaskToggle = false;

    this.setState( { newTaskToggle } );
  }

  // Sets the task
  setNewTask(e) {
    var task = this.state.newTask;
    task = e.target.value;
    this.setState( { newTask: task } );
  }

  handleCheckbox() {
    const target = event.target;
    console.log(event.target);
    this.setState({
        [target.name]: target.checked
    });
  }

  /**
  * Render loading spiner or tasks depending on loading state
  */
  renderLoader() {
    if(this.state.loading){
      return(
        <tr colSpan="2">
          <div className="taskLoadingContainer">
            <Spinner fadeIn='none' className="taskLoadingSpinner" name="three-bounce" color="#1abc9c" />
          </div>
        </tr>
      );
    }else{
      return(
        this.state.tasks.length > 0 ?
        this.state.tasks.map( (task) => (
          <Task key={task.id} id={task.id} desc={task.desc} removeTask={this.removeTask}/>
        )) : <tr><td colSpan="2"><p className="centerText">No Tasks remaining</p></td></tr>


      )
    }
  }

  render(){

    return(
      <div>
        <ToastContainer />
        <Card>
          <CardBody>
            <Table hover bordered>
              <thead>
                <tr>
                  <th colSpan="2"><h3>Tasks</h3></th>
                  {/* <th className="center"></th> */}
                </tr>
              </thead>

              <tbody>
                { this.renderLoader() }
                {
                  this.state.newTaskToggle === true &&
                    <tr>
                      <td><Input onChange={this.setNewTask} type="text"/></td>
                      <td width="25%"><Button onClick={this.saveTask} className="addButton fullWidthButton" color="primary"> Save </Button></td>
                    </tr>
                }
              </tbody>

              <tfoot>
                <tr>
                  <td colSpan="2">
                    {
                      this.state.newTaskToggle === false ?
                        <Button onClick={this.toggleInput} className="addButton fullWidthButton" color="primary">Add Task</Button>
                      : <Button onClick={this.toggleInput} className="addButton fullWidthButton" color="danger">Cancel</Button>
                    }
                  </td>
                </tr>
              </tfoot>

            </Table>
          </CardBody>

        </Card>
      </div>
    );
  }

}

export default TaskTable;
