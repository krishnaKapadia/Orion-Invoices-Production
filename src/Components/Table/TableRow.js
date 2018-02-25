import React, { Component } from 'react';
import { Form, FormGroup, Label, Button, Input, Modal,
  ModalHeader, ModalBody, ModalFooter, Row, Col
} from 'reactstrap';
import axios from 'axios';
import { Link } from 'react-router-dom';
import Spinner from 'react-spinkit';

// Error notification
import { ToastContainer, toast } from 'react-toastify';
import { css } from 'glamor';

class TableRow extends Component {

  constructor(props) {
    super(props);

    this.state = {
      editModal: false, loadingButton: false, loadingButtonDelete: false
    }

    this.toggle = this.toggle.bind(this);
    this.togglePaid = this.togglePaid.bind(this);
    this.deleteClient = this.deleteClient.bind(this);
    this.updateClient = this.updateClient.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
    this.updateEmployee = this.updateEmployee.bind(this);
  }

  toggle() {
    this.setState({
      editModal: !this.state.editModal
    })
  }

  /**
  * Deletes the client thats stored by this TableRow
  */
  deleteClient() {
    this.setState({ loadingButtonDelete: true });

    axios.delete(`http://localhost:4000/api/v1/clients/${this.props.clientId}`).then( (response) => {
      this.setState({ loadingButtonDelete: false });
      toast.success("Client deleted!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      // Remove from state
      this.props.deleteClientFromState(this.props.clientId);
    }).catch( (err) => {
      this.setState({ loadingButtonDelete: false });
      if(err) toast.error("Could not delete client", {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    })
  }

  /**
  * Updates the client thats stored by this TableRow
  */
  updateClient(e) {
    e.preventDefault();
    var data = new FormData(e.target);

    // Handles the case where the address is not entered
    if(data.get("clientAddress").trim() === ''){
      data.set("clientAddress", "Not added");
    }

    // Handles the case where phone isnt inputted
    if(data.get("clientPhone").trim() === '') {
      data.set("clientPhone", "Not added");
    }

    var newClient = {
      code: data.get("clientCode"), name: data.get("clientName"),
      address: data.get("clientAddress"), phone_num: data.get("clientPhone")
    }

    this.setState({ loadingButton: true });

    axios.put(`http://localhost:4000/api/v1/clients/${this.props.clientId}`, newClient).then( (response) => {
      this.setState({ loadingButton: false });

      toast.success("Client updated!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });

      this.toggle();
      this.props.updateClientFromState(this.props.clientId, newClient);
    }).catch( (err) => {
      this.setState({ loadingButton: false });
      if(err) toast.error("Could not update client", {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    });
  }

  /**
  * Deletes the client thats stored by this TableRow
  */
  deleteEmployee(e) {
    this.setState({ loadingButtonDelete: true });
    axios.delete(`http://localhost:4000/api/v1/employees/${this.props.employeeId}`).then( (response) => {
      this.setState({ loadingButtonDelete: false });
      toast.success("Employee deleted!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      // Remove from state
      this.props.deleteEmployeeFromState(this.props.employeeId);
    }).catch( (err) => {
      this.setState({ loadingButtonDelete: false });
      if(err) toast.error("Could not delete employee! Please try again", {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    });
  }

  /*
  * Updates the employee thats stored by this TableRow
  */
  updateEmployee(e) {
    e.preventDefault();
    var data = new FormData(e.target);

    // Handles cases of empty fields being submitted
    if(data.get("employeeCode").trim() === '') data.set("employeeCode", "N/A");
    if(data.get("employeeRate").trim() === '') data.set("employeeRate", "N/A");
    if(data.get("employeeAddress").trim() === '') data.set("employeeAddress", "N/A");

    var newEmployee = {
      code: data.get("employeeCode"), name: data.get("employeeName"),
      position: data.get("employeePosition"), rate: data.get("employeeRate"),
      phone_number: data.get("employeePhone"), address: data.get("employeeAddress")
    }

    this.setState({ loadingButton: true });
    // Perform axios POST operation to API
    axios.put(`http://localhost:4000/api/v1/employees/${this.props.employeeId}`, newEmployee).then( (response) => {
      this.setState({ loadingButton: false });
      toast.success("Employee updated!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });

      this.toggle();
      this.props.updateEmployeeFromState(this.props.employeeId, newEmployee);
    }).catch( (err) => {
      this.setState({ loadingButton: false });
      if(err) toast.error("Could not update employee", {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    });
  }

  /**
  * Sets a particular invoice to paid status
  */
  togglePaid(e) {
    const data = this.props.data;
    data.paid = true;
    this.setState({ loadingButton: true });
    axios.put(`http://localhost:4000/api/v1/invoices/${data._id}`, data).then((response) => {
      this.setState({ loadingButton: false });
      this.props.history.push('/invoices');
    }).catch((err) => {
      this.setState({ loadingButton: false });
      if(err) toast.error("Could not mark paid!", {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    })
  }

  render() {
    switch (this.props.type) {
      case 'client':
        return (
          <tr>
            <td>{this.props.clientCode}</td>
            <td>{this.props.clientName}</td>
            <td>{this.props.clientAddress}</td>
            <td>{this.props.clientPhone}</td>

            <td>
              {/* Error Toast notification */}
              <Button outline className="fullWidthButton" color="info" onClick={this.toggle}>Edit</Button>
            </td>

            <Modal className="modal-primary" isOpen={this.state.editModal} toggle={this.toggle}>
              <ModalHeader>Edit Client Information</ModalHeader>

              <Form onSubmit={this.updateClient}>
                <ModalBody>
                  <FormGroup>
                    <Label>Client Code: </Label>
                    <Input type="text" name="clientCode" defaultValue={this.props.clientCode} />
                  </FormGroup>
                  <FormGroup>
                    <Label>Client Name: </Label>
                    <Input type="text" name="clientName" defaultValue={this.props.clientName} />
                  </FormGroup>
                  <FormGroup>
                    <Label>Client Address: </Label>
                    <Input type="text" name="clientAddress" defaultValue={this.props.clientAddress} />
                  </FormGroup>
                  <FormGroup>
                    <Label>Client Phone: </Label>
                    <Input type="number" name="clientPhone" defaultValue={this.props.clientPhone} />
                  </FormGroup>
                </ModalBody>

                <ModalFooter>
                  <div className="test">
                    <div className="floatLeft">
                      {
                        this.state.loadingButtonDelete && <Button outline color="danger" className="px-4"><Spinner name="circle" color="#e74c3c" fadeIn="none" /></Button>
                      }
                      {
                        !this.state.loadingButtonDelete && <Button outline color="danger" onClick={this.deleteClient}>Delete Client</Button>
                      }
                    </div>

                    <Button color="secondary" className="floatRight" onClick={this.toggle}>Cancel</Button>

                    {
                      this.state.loadingButton && <Button color="primary" className="floatRight paddingRight"><Spinner name="circle" color="white" fadeIn="none" /></Button>
                    }
                    {
                      !this.state.loadingButton && <Button color="primary" type="submit" className="floatRight paddingRight">Save Changes</Button>
                    }

                  </div>
                </ModalFooter>
              </Form>
            </Modal>
          </tr>
        );

      case "employee":
        return (
          <tr>
            <td>{this.props.employeeCode}</td>
            <td>{this.props.employeeName}</td>
            <td>{this.props.employeePosition}</td>
            <td>${this.props.employeeRate}</td>
            <td>{this.props.employeePhoneNumber}</td>
            <td>{this.props.employeeAddress}</td>
            <td><Button outline className="fullWidthButton" color="info" onClick={this.toggle}>Edit</Button></td>

            <Modal className="modal-primary" isOpen={this.state.editModal} toggle={this.toggle}>
              <ModalHeader>Edit Employee Information</ModalHeader>

              <Form onSubmit={this.updateEmployee}>
                <ModalBody>
                  <FormGroup>
                    <Label>Employee Code: </Label>
                    <Input type="text" name="employeeCode" defaultValue={this.props.employeeCode} />
                  </FormGroup>

                  <FormGroup>
                    <Label>Name: </Label>
                    <Input type="text" name="employeeName" defaultValue={this.props.employeeName} />
                  </FormGroup>

                  <FormGroup>
                    <Label>Position: </Label>
                    <Input type="text" name="employeePosition" defaultValue={this.props.employeePosition} />
                  </FormGroup>

                  <FormGroup>
                    <Label>Hourly Rate: </Label>
                    <Input type="number" name="employeeRate" defaultValue={this.props.employeeRate} />
                  </FormGroup>

                  <FormGroup>
                    <Label>Phone Number: </Label>
                    <Input type="number" name="employeePhone" defaultValue={this.props.employeePhoneNumber} />
                  </FormGroup>

                  <FormGroup>
                    <Label>Address: </Label>
                    <Input type="text" name="employeeAddress" defaultValue={this.props.employeeAddress} />
                  </FormGroup>
              </ModalBody>

              <ModalFooter>
                <div className="test">
                  <div className="floatLeft">
                    {
                      this.state.loadingButtonDelete && <Button outline color="danger" className="px-4"><Spinner name="circle" color="#e74c3c" fadeIn="none" /></Button>
                    }
                    {
                      !this.state.loadingButtonDelete && <Button outline color="danger" onClick={this.deleteEmployee}>Delete Employee</Button>
                    }

                  </div>

                  <Button color="secondary" className="floatRight" onClick={this.toggle}>Cancel</Button>

                  {
                    this.state.loadingButton && <Button color="primary" className="floatRight paddingRight"><Spinner name="circle" color="white" fadeIn="none" /></Button>
                  }
                  {
                    !this.state.loadingButton && <Button color="primary" type="submit" className="floatRight paddingRight">Save Changes</Button>
                  }

                </div>
              </ModalFooter>
            </Form>
            </Modal>
          </tr>
        );

      case "invoice":
        const data = this.props.data;
        return (
          <tr>
            <td>{data.inv_number}</td>
            <td>{data.client_name}</td>
            <td>{data.date}</td>
            {/* Paid button */}
            { data.paid == false && <td><Button outline className="fullWidthButton" color="info" onClick={this.togglePaid}>Mark Paid</Button></td> }
            { data.paid == true && <td><Button outline className="fullWidthButton" color="secondary">Paid</Button></td> }

            {/* Edit button */}
            {/* { data.paid == false && <td><Button outline className="fullWidthButton" color="info" onClick={this.toggle}>Edit</Button></td> } */}
            {/* { data.paid == true && <td><Button outline className="fullWidthButton" color="secondary" onClick={this.toggle}>Edit</Button></td> } */}

            {/* View Button */}
            <td>
              <Link
                to={{
                  pathname: "/invoices/createInvoice",
                  state: {
                    invoice: data
                  }
                }
              }>

                <Button outline className="fullWidthButton" color="info">View</Button>
              </Link>
            </td>



            <Modal className="modal-primary" isOpen={this.state.editModal} toggle={this.toggle}>
              <ModalHeader>Edit Invoice Information</ModalHeader>

              <ModalBody>
                {/* NEED TO TAKE INTO ACCOUNT THE EDITING OF THE ACTUAL INVOICE ORDER, NOT JUST THE CLIENT CREDENTIALS */}
                <Form onSubmit={this.handleSubmit}>
                  <FormGroup>
                    <Label>Invoice Number: </Label>
                    <Input type="text" name="clientCode" defaultValue={data.inv_number} />
                  </FormGroup>
                  <FormGroup>
                    <Label>Client Name: </Label>
                    <Input type="text" name="clientName" defaultValue={data.client_name} />
                  </FormGroup>
                  <FormGroup>
                    <Label>Date Created</Label>
                    <Input type="text" name="clientAddress" defaultValue={data.date} />
                  </FormGroup>
                </Form>
              </ModalBody>

              <ModalFooter>
                <Button color="primary" onClick={this.toggle}>Save Changes</Button>
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
              </ModalFooter>
            </Modal>
          </tr>
        );
    }

  }

}

export default TableRow;
