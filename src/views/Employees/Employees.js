import React, { Component } from 'react';
import TableRow from "../../components/Table/TableRow";
import { Table, Row, Col, Card, CardHeader, CardBody, Button,
Modal, ModalHeader, ModalBody, ModalFooter,
Form, FormGroup, Input, InputGroup, InputGroupAddon, Label } from 'reactstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'react-spinkit';

class Employees extends Component {
  constructor(props){
    super(props)

    this.state = {
      addEmployeeModal: false, employees: [], totalEmployees: '0',
      loading: true, loadingButton: false, search: ''
    }

    this.toggle = this.toggle.bind(this);
    this.setSearch = this.setSearch.bind(this);
    this.addEmployee = this.addEmployee.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.deleteEmployee = this.deleteEmployee.bind(this);
    this.updateEmployee = this.updateEmployee.bind(this);
    this.getAllEmployees = this.getAllEmployees.bind(this);
  }

  componentDidMount() {
    this.getAllEmployees();
  }

  /*
  * Retrieves all employees from API via axios
  */
  getAllEmployees() {
    axios.get("http://localhost:4000/api/v1/employees").then( (data) => {
      var employees = [];
      var employeeCount = 0;

      data.data.employees.map( (employee) => {
        employees.push({
          id: employee._id,
          code: employee.code, name: employee.name,
          position: employee.position, rate: employee.rate,
          phone_number: employee.phone_number, address: employee.address
        });
        employeeCount++;
      });

      this.setState({ employees, employeeCount, loading: false });
    }).catch( (err) => {
      this.setState({ loading: false });
      if(err) toast.error("Could not get all Employees", {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    })
  }

  /**
  * Add employee to the API and to local state
  */
  addEmployee(data) {
    var newEmployee = {
      code: data.get("employeeCode"), name: data.get("employeeName"),
      position: data.get("employeePosition"), rate: data.get("employeeRate"),
      phone_number: data.get("employeePhone"), address: data.get("employeeAddress")
    }

    this.setState({ loadingButton: true });

    // Perform axios POST operation to API
    axios.post("http://localhost:4000/api/v1/employees", newEmployee).then( (response) => {
      /**
       * Adds to local state to improve performace and removing the need to reload
         after submittion to get new database data
      */
      var employees = this.state.employees;
      newEmployee.id = response.data.employee._id;

      employees.push(newEmployee);
      this.setState({ employees, employeeCount: this.state.employeeCount + 1, loadingButton: false });

      // Dismisses the modal
      this.toggle();

      toast.success("Employee added!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }).catch( (err) => {
      if(err) {
        this.setState({ loadingButton: false });
        toast.error("Employee could not be added! Please try again" + err, {
          position: toast.POSITION.BOTTOM_RIGHT
        });
      }
    });

  }

  /**
  * Updates the particular employee in the state, Passed to TableRow
  */
  updateEmployee(id, data) {
    var employees = this.state.employees;
    var employee = employees.find( (e) => {
      return e.id === id;
    });

    data.id = id;
    employee = data;

    var foundIndex = employees.findIndex(x => x.id ==id);
    employees[foundIndex] = employee;
    this.setState( { employee });
  }

  /**
  * Removes the particular employee from the state, called from TableRow
  */
  deleteEmployee(id) {
    var employees = this.state.employees;
    var filteredEmployees = employees.filter( (employee) => {
      return employee.id !== id;
    });

    this.setState( { employees: filteredEmployees, employeeCount: this.state.employeeCount - 1 });
  }

  /*
  * Handles the submittion of the modal and delegates to add employee
  */
  handleSubmit(e) {
    e.preventDefault();

    // Creates an object containing form data and delegates addition to addEmployee function
    const data = new FormData(e.target);

    // Handles cases of empty fields being submitted
    if(data.get("employeeCode").trim() === '') data.set("employeeCode", "N/A");
    if(data.get("employeeRate").trim() === '') data.set("employeeRate", "N/A");
    if(data.get("employeeAddress").trim() === '') data.set("employeeAddress", "N/A");

    this.addEmployee(data);

  }

  /*
  * Shows/Hides the add employee modal
  */
  toggle() {
    this.setState({
      addEmployeeModal: !this.state.addEmployeeModal
    })
  }

  /**
  * Sets the search term
  */
  setSearch(e) {
    this.setState({ search: e.target.value });
  }

  render() {
    var searchTerm = this.state.search.toLowerCase();

    if(this.state.loading) {
      return(
        <div className="animated fadeIn darken">
          <Spinner fadeIn='none' className="loadingSpinner" name="folding-cube" color="#1abc9c" />
        </div>
      );
    }else {
      return (
        <div className="animated fadeIn">
          <ToastContainer />

          <Row>
            <Col xs="12" md="4" lg="4">
              <Card>
                <CardBody>
                  <h3><i className="icon-people blue paddingRight" /> Employees: {this.state.employeeCount}</h3>
                </CardBody>
              </Card>
            </Col>

            <Col xs="0" md="4" lg="4">
              {/* Empty */}
            </Col>

            <Col xs="12" md="4" lg="4">
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      <Button className="fullWidthButton" color="primary" onClick={this.toggle}>Add Employee</Button>
                    </Col>
                  </Row>
                </CardBody>
              </Card>
            </Col>

          </Row>

          <Card>
            <CardHeader>
              <Row>
                <Col xs="12" md="10" lg="10">
                  <i className="fa fa-align-justify"></i> Employees
                </Col>
                <Col>
                  <InputGroup>
                    <Input placeholder="Search..." onChange={this.setSearch} />
                    <InputGroupAddon addontype="append"><i className="fa fa-search"></i></InputGroupAddon>
                  </InputGroup>
                </Col>
              </Row>
            </CardHeader>

            <CardBody>
              <Table responsive hover bordered>
                <thead>
                  <tr>
                    <th>Code</th>
                    <th>Employee Name</th>
                    <th>Position</th>
                    <th>Hourly Rate</th>
                    <th>Phone Number</th>
                    <th>Address</th>
                    <th>Options</th>
                  </tr>
                </thead>

                <tbody>
                  {/* If no search term is inputted display all stored data */}
                  {
                    this.state.search == '' &&
                    this.state.employees.map( (e) => (
                      <TableRow key={e.id} type="employee" employeeId={e.id} employeeCode={e.code} employeeName={e.name}
                        employeePosition={e.position} employeeRate={e.rate} employeePhoneNumber={e.phone_number}
                        employeeAddress={e.address} deleteEmployeeFromState={this.deleteEmployee}
                        updateEmployeeFromState={this.updateEmployee}
                      />
                    ))
                  }

                  {/* Display only if search term has been inputted */}
                  { this.state.search != '' &&
                    // Filters by the given search term therefore real time searching without having to query the api again
                    this.state.employees.filter((e) => {
                      return (
                        // Checks search term against all colum values to allow for more flexible searches
                        e.code.toLowerCase().includes(searchTerm) ||
                        e.name.toLowerCase().includes(searchTerm) ||
                        e.position.toLowerCase().includes(searchTerm) ||
                        e.address.toLowerCase().includes(searchTerm) ||
                        e.rate.includes(searchTerm) ||
                        e.phone_number.includes(searchTerm)
                      )
                    }).map( (e) => (
                      <TableRow key={e.id} type="employee" employeeId={e.id} employeeCode={e.code} employeeName={e.name}
                        employeePosition={e.position} employeeRate={e.rate} employeePhoneNumber={e.phone_number}
                        employeeAddress={e.address} deleteEmployeeFromState={this.deleteEmployee}
                        updateEmployeeFromState={this.updateEmployee}
                      />
                    ))
                  }

                </tbody>
              </Table>
            </CardBody>
          </Card>



          <Modal className="modal-primary" isOpen={this.state.addEmployeeModal} toggle={this.toggle}>
            <ModalHeader>Add New Employee</ModalHeader>

            <Form onSubmit={this.handleSubmit}>
              <ModalBody>
                <FormGroup>
                  <Label>Employee Code: </Label>
                  <Input type="text" name="employeeCode" />
                </FormGroup>

                <FormGroup>
                  <Label>Full name: </Label>
                  <Input type="text" name="employeeName" required />
                </FormGroup>

                <FormGroup>
                  <Label>Position: </Label>
                  <Input type="text" name="employeePosition" required />
                </FormGroup>

                <FormGroup>
                  <Label>Hourly Rate: </Label>
                  <Input type="number" name="employeeRate" step="0.01"/>
                </FormGroup>

                <FormGroup>
                  <Label>Phone Number: </Label>
                  <Input type="number" name="employeePhone" required />
                </FormGroup>

                <FormGroup>
                  <Label>Address: </Label>
                  <Input type="text" name="employeeAddress" />
                </FormGroup>

              </ModalBody>

              <ModalFooter>
                {
                  this.state.loadingButton &&  <Button color="primary" className="px-4"><Spinner name="circle" color="white" fadeIn="none" /></Button>
                }
                {
                  !this.state.loadingButton &&  <Button color="primary" type="submit">Add Employee</Button>
                }
                <Button color="secondary" onClick={this.toggle}>Cancel</Button>
              </ModalFooter>
            </Form>
          </Modal>

        </div>
      );
    }
  }

}

export default Employees;
