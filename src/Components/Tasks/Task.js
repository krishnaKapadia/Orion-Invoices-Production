import React, { Component } from 'react';
import { Button } from 'reactstrap';

class Task extends Component {

  constructor(props){
    super(props)

    this.state = {
      completed: false
    }

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({ completed: !this.state.completed })
  }

  render() {
    return (
      <tr>
        <td>{this.props.desc}</td>
        <td width="25%"><Button onClick={(e) => this.props.removeTask(this.props.id)} className="addButton fullWidthButton" color="primary"> Done </Button></td>
      </tr>
    );
  }

}

export default Task;
