import React, { Component } from 'react';
import TableRow from "../../components/Table/TableRow";
import {
  Row, Col, Card, CardHeader,  CardBody, Button, Table,
  Modal, ModalHeader, ModalBody, ModalFooter, Form, Input, FormGroup, Label,
  InputGroup, InputGroupAddon
} from 'reactstrap';
import { NavLink } from 'react-router-dom';
import axios from 'axios';
import Spinner from 'react-spinkit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setCurrentUserCredentials } from '../../Redux/Actions/index';

class Invoices extends Component {

  constructor(props) {
    super(props);

    this.state = {
      invoices: [], invoiceCount: 0, loading: true, search: ''
    }

    this.setSearch = this.setSearch.bind(this);
    this.getAllInvoices = this.getAllInvoices.bind(this);
  }

  componentDidMount() {
    this.getAllInvoices();
  }

  /**
  * Retrieves all the invoices accociated with the business associated with the logged in user
  */
  getAllInvoices() {
    axios.get("http://localhost:4000/api/v1/invoices").then( (data) => {
      var invoices = [];
      var invoiceCount = 0;
      var inv_number = data.data.invoices[0].inv_number;

      data.data.invoices.map( (invoice) => {
        var date = new Date(invoice.date);
        date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        invoice.date = date;
        invoices.push(
          invoice
          // id: invoice._id, inv_number: invoice.inv_number,
          // client_code: invoice.client_code, client_name: invoice.client_name,
          // client_address: invoice.client_address, subtotal: invoice.subtotal,
          // tax_rate: invoice.tax_rate, total: invoice.total, items: invoice.items
        );
        invoiceCount++;
      });
      // Set new inv_number in global redux state
      var user_credentials = this.props.currentUserCredentials;
      user_credentials.inv_number = parseFloat(inv_number) + 1;
      this.props.setCurrentUserCredentials(user_credentials);

      this.setState({ invoices, invoiceCount, loading: false });
    }).catch( (err) => {
      this.setState({ loading: false });
      if(err) console.log(err);
    });
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
          <Row>
            <Col xs={{ size: 12 }} md={{ size: 4 }} lg={{ size: 4 }}>

              <Card>
                <CardBody>
                  <h3><i className="icon-bubble blue paddingRight" /> Invoices: {this.state.invoiceCount}</h3>
                </CardBody>
              </Card>
            </Col>

            <Col xs={{ size: 0 }} md={{ size: 4 }} lg={{ size: 4 }}>
              {/* EMPTY */}
            </Col>

            <Col xs={{ size: 12 }} md={{ size: 4 }} lg={{ size: 4 }}>
              <Card>
                <CardBody>
                  <Row>
                    <Col>
                      <NavLink to="/invoices/createInvoice">
                        <Button className="fullWidthButton" color="primary" onClick={this.toggle}>Create Invoice</Button>
                      </NavLink>
                    </Col>

                  {/* <Col>
                    <Button outline className="fullWidthButton" color="danger">Remove Invoice</Button>
                  </Col> */}
                  </Row>
                </CardBody>
              </Card>
            </Col>

          </Row>

          <Card>
            <CardHeader>
              <Row>
                <Col xs="12" md="10" lg="10">
                  <i className="fa fa-align-justify"></i> Invoices
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
              <Table hover responsive bordered>
                <thead>
                  <tr>
                    <th>Invoice Number</th>
                    <th>Client Name</th>
                    <th>Date Created</th>
                    <th>Paid</th>
                    <th>Options</th>
                  </tr>
                </thead>

                <tbody>
                  {/* If no search term is inputted display all stored data */}
                  { this.state.search == '' &&
                    this.state.invoices.map( (e) => {
                      return(
                        <TableRow key={e._id} type="invoice" data={e} togglePaid={this.togglePaid}/>
                      )
                    })
                  }

                  {/* Display only if search term has been inputted */}
                  { this.state.search != '' &&
                    // Filters by the given search term therefore real time searching without having to query the api again
                    this.state.invoices.filter( (i) => {
                      return (
                        // Checks search term against all colum values to allow for more flexible searches
                        String(i.inv_number).includes(searchTerm) ||
                        i.client_name.toLowerCase().includes(searchTerm) ||
                        i.date.includes(searchTerm)
                      )
                    }).map( (e) => {
                      return(
                        <TableRow key={e._id} type="invoice" data={e} togglePaid={this.togglePaid}/>
                      )
                    })
                  }
                </tbody>

              </Table>
            </CardBody>
          </Card>

        </div>
      );
    }
  }

}

/**
* Sets props to be accessed by the Login component from redux
* global state, Variables & Objects
*/
function mapStateToProps(state) {
  return {
    currentUserCredentials: state.currentUserCredentials,
  }
}

/**
* Sets action functions to be used by the Login component through props
* Functions
*/
function mapDispatchToProps(dispatch) {
  // When setLogin is called, result is passed to all reducers
  return bindActionCreators({ setCurrentUserCredentials: setCurrentUserCredentials  }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Invoices);
