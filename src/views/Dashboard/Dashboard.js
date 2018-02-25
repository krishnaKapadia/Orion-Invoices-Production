import React, { Component } from 'react';
import TaskTable from '../../components/Tasks/TaskTable';
import LineGraph from '../../components/Graphs/LineGraph';
import { NavLink } from 'react-router-dom';
import {
  Row,
  Col,
  Card,
  CardHeader,
  CardBody,
  CardFooter,
  Table,
} from 'reactstrap';
import axios from 'axios';
import Spinner from 'react-spinkit';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';

class Dashboard extends Component {

  constructor(props) {
    super(props);

    this.state = {
      clientSize: 0,
      invoiceSize: 0,
      orderSize: 0,
      loading: true,
      orders: ''
    }

    // Sets the axios header to always send user credentials with every request
    // axios.defaults.headers.common['user_credentials'] = ;
    this.getDataSizes = this.getDataSizes.bind(this);
  }

  componentDidMount() {
    this.getDataSizes();
  }

  /**
  * Gets the lengths of clients, invoices and orders array from api
  */
  getDataSizes() {
    var clientSize = 0;
    var invoiceSize = 0;
    var orderSize = 0;

    axios.defaults.headers.common['company_id'] = this.props.currentUserCredentials.company_id;

    axios.all([
      axios.get('http://localhost:4000/api/v1/clients'),
      axios.get('http://localhost:4000/api/v1/invoices'),
      axios.get('http://localhost:4000/api/v1/orders')
    ]).then(axios.spread( (clients, invoices, orders) => {
      clientSize = clients.data.clients.length;
      invoiceSize = invoices.data.invoices.length;
      orderSize = orders.data.orders.length;

      this.setState({ clientSize, invoiceSize, orderSize, loading: false, orders: orders.data.orders });
    })).catch( (err) => {
      console.log(err);
    })
  }

  render() {
    if(this.state.loading) {
      return(
        <div className="animated fadeIn darken">
          <Spinner fadeIn='none' className="loadingSpinner" name="folding-cube" color="#1abc9c" />
        </div>
      );
    }else{
      return (
        <div className="animated fadeIn">

          <Row>
            {/* <Col xs="12" md="3" lg="3">
              <Card class="cardButton">
                <CardBody>
                  <h2><i className="icon-people blue paddingRight" /> New Invoice</h2>
                </CardBody>
              </Card>
            </Col> */}

            <Col xs="12" md="4" lg="4">
              <Card>
                <NavLink to="/clients" className="linkCard">
                  <CardBody className="dataLoadingContainer">
                    <h2><i className="icon-people blue paddingRight" /> Clients: {this.state.clientSize}</h2>
                  </CardBody>
                </NavLink>
              </Card>
            </Col>

            <Col xs="12" md="4" lg="4">
              <Card>
                <NavLink to="/invoices" className="linkCard">
                  <CardBody>
                    <h2><i className="icon-docs blue paddingRight" /> Invoices : {this.state.invoiceSize}</h2>
                  </CardBody>
                </NavLink>
              </Card>
            </Col>

            <Col xs="12" md="4" lg="4">
              <Card>
                <NavLink to="/orders" className="linkCard">
                  <CardBody>
                    <h2><i className="icon-drawer blue paddingRight" /> Orders: {this.state.orderSize}</h2>
                  </CardBody>
                </NavLink>
              </Card>
            </Col>

          </Row>

          <Row>
            <Col xs="12" md="8" lg="8">
              {/* Graph of the number of jobs/orders completed per day, for 30 days */}
              <LineGraph data={this.state.orders} />
            </Col>

            <Col xs="12" md="4" lg="4">
              <TaskTable />
            </Col>
          </Row>

        </div>
      )
    }
  }
}

/**
* Sets props to be accessed by the Login component from redux
* global state, Variables & Objects
*/
function mapStateToProps(state) {
  return {
    currentUserCredentials: state.currentUserCredentials
  }
}


export default connect(mapStateToProps)(Dashboard);
