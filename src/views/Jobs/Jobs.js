import React, { Component } from 'react';
import Order from '../../components/Table/Order';
import { NavLink } from 'react-router-dom';
import {
  Card, CardHeader, CardBody, Row, Col, Button,
  Table, Input, InputGroup, InputGroupAddon
} from 'reactstrap';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import Spinner from 'react-spinkit';

class Jobs extends Component {

  constructor(props) {
    super(props);

    this.state = {
      orders: [], currentOrderCount: 0, completedOrderCount: 0,
      loading: true, search: ''
    }

    this.setSearch = this.setSearch.bind(this);
    this.updateOrder = this.updateOrder.bind(this);
    this.getAllOrders = this.getAllOrders.bind(this);
    this.toggleCompleted = this.toggleCompleted.bind(this);
    this.deleteOrderFromState = this.deleteOrderFromState.bind(this);
  }

  componentDidMount() {
    this.getAllOrders();
  }

  /**
  * Retrieves all the invoices accociated with the business associated with the logged in user
  */
  getAllOrders() {
    axios.get("http://localhost:4000/api/v1/orders").then((data) => {
      var orders = [];
      var currentOrderCount = 0;
      var completedOrderCount = 0;

      data.data.orders.map( (order) => {
        var date = new Date(order.created);
        date = `${date.getDate()}/${date.getMonth() + 1}/${date.getFullYear()}`;
        order.created = date;

        orders.push(order);

        if(order.completed){
          completedOrderCount++;
        }else{
          currentOrderCount++;
        }
      });

      this.setState({ orders, currentOrderCount, completedOrderCount, loading: false });
    }).catch((err) => {
      if(err) console.log(err);
    })
  }

  /**
  * Deletes given order from application state
  */
  deleteOrderFromState(id, data) {
    var orders = this.state.orders;
    var filteredOrders = orders.filter( (order) => {
      return order._id !== id;
    });

    if(data.completed){
      this.setState( { orders: filteredOrders, completedOrderCount: this.state.completedOrderCount - 1 });
    }else{
      this.setState( { orders: filteredOrders, currentOrderCount: this.state.currentOrderCount - 1 });
    }
  }

  /**
  * Updates an existing order in local application state, Passed to Order Component
  */
  updateOrder(id, data) {
    var orders = this.state.orders;
    var index = orders.findIndex(x => x._id == id);
    orders[index] = data;

    toast.success("Order Updated!", {
      position: toast.POSITION.BOTTOM_RIGHT
    });

    this.setState({ orders });
  }

  /**
  * Toggles completed status on a order in local application state
  */
  toggleCompleted(id, status) {
    var orders = this.state.orders;

    var index = orders.findIndex(x => x._id == id);
    orders[index].completed = status;

    var completedOrderCount = this.state.completedOrderCount;
    if(status) completedOrderCount++;
    else completedOrderCount--;

    toast.success("Order Completed!", {
      position: toast.POSITION.BOTTOM_RIGHT
    });

    this.setState({ orders, completedOrderCount });
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
            <Col xs={{ size: 12 }} md={{ size: 4 }} lg={{ size: 4 }}>
              <Card>
                <CardBody>
                  <h3><i className="icon-drawer blue paddingRight" /> Current Orders: {this.state.currentOrderCount}</h3>
                </CardBody>
              </Card>
            </Col>

            <Col xs={{ size: 12 }} md={{ size: 4 }} lg={{ size: 4 }}>
              <Card>
                <CardBody>
                  <h3><i className="icon-drawer blue paddingRight" /> Completed Orders: {this.state.completedOrderCount}</h3>
                </CardBody>
              </Card>
            </Col>

            <Col xs={{ size: 12 }} md={{ size: 4 }} lg={{ size: 4 }}>
              <Card>
                <CardBody>
                  <NavLink to="/orders/newOrder">
                  <Button className="fullWidthButton" color="primary" onClick={this.toggle}>New Order</Button>
                </NavLink>
              </CardBody>
            </Card>
          </Col>
        </Row>

        <Card>
          <CardHeader>
            <Row>
              <Col xs="12" md="10" lg="10">
                <i className="fa fa-align-justify"></i> Orders
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
            {/* add, responsive prop to tag to make the table responsive */}

            <Table bordered>
              <thead>
                <tr>
                  <th>Client Name</th>
                  <th>Order List</th>
                  <th>Created</th>
                  <th>Options</th>
                </tr>
              </thead>

              <tbody>
                {/* If no search term is inputted display all stored data */}
                { this.state.search == '' &&
                  this.state.orders.map( (o) => {
                    return(
                      <Order key={o._id} type="order" data={o} toggleCompleted={this.toggleCompleted} updateOrder={this.updateOrder} deleteOrderFromState={this.deleteOrderFromState} />
                    )
                  })
                }

                {/* Display only if search term has been inputted */}
                { this.state.search != '' &&
                  // Filters by the given search term therefore real time searching without having to query the api again
                  this.state.orders.filter( (o) => {
                    return (
                      // Checks search term against all colum values to allow for more flexible searches
                      o.client_name.toLowerCase().includes(searchTerm) ||
                      o.created.includes(searchTerm)
                      // ( o.completed && searchTerm == 'completed' )
                    )
                  }).map( (o) => {
                    // console.log(o);
                    // if(o.client_name == '' && o.created == '') return (
                    //   <tr colSpan="4">
                    //     <td>No Search Results</td>
                    //   </tr>
                    // )
                    // else
                    return(
                      <Order key={o._id} type="order" data={o} toggleCompleted={this.toggleCompleted} updateOrder={this.updateOrder} deleteOrderFromState={this.deleteOrderFromState} />
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

export default Jobs;
