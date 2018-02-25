import React, { Component } from 'react';
import {
  Row, Col, Card, CardHeader, CardBody, CardFooter,
  Table, Input, Button, Form
} from 'reactstrap';
import { NavLink, withRouter } from 'react-router-dom';
import { formatToPrice } from '../../Utils/utils';
import moment from 'moment';
import axios from 'axios';
import PrintProvider, { Print, NoPrint } from 'react-easy-print';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { setLogin, setCurrentUserCredentials } from '../../Redux/Actions/index';
import { ToastContainer, toast } from 'react-toastify';
import PropTypes from 'prop-types';
import {persistStore} from 'redux-persist';

class NewInvoice extends Component {

  // Endpoint to send to API: clientName, number, address and items object, containing objects for each item.
  // eg:
  /*
    clientName: "Bill",
    clientCode: "1974"
    address: "123 temp drive",
    items [
      { key: 1, orderNumber: "AB89", desc: "Item 1", quantity: 10, unitPrice: 4.50, totalPrice: 45.0 },
      { key: 2, orderNumber: "ZX24", desc: "Item 2", quantity: 50, unitPrice: 6.50, totalPrice: 325 }
    ],
    itemCount: 2,
    subtotal: 12.50,
    tax_rate: 15,
    total: 15.50,
    paid: false //False by default must be marked true after paid

    On Form Submit, this object will be sent to API for storage

    Possible methods:
      - Directly send to API and therefore when the user navigates to the order page, it will have to do a fetch request every time.
      - Get redux to do it while simulaniously updating its local state therefore not needed to fetch on every visit to the page.

    Currently will use first option, but will explore redux at a later date as it is faster as components will access local store and API calls will only be made when that store is changed
  */

  constructor(props) {
    super(props);

    this.state = {
      clientName: "",
      clientCode: "",
      clientAddress: "",
      items: [],
      itemCount: 0,
      subtotal: 0,
      tax: 0,
      total: 0,
    }

    this.addItem             = this.addItem.bind(this);
    this.removeItem          = this.removeItem.bind(this);
    this.setItemDesc         = this.setItemDesc.bind(this);
    this.updateTotals        = this.updateTotals.bind(this);
    this.setClientCode       = this.setClientCode.bind(this);
    this.setClientName       = this.setClientName.bind(this);
    this.setItemQuantity     = this.setItemQuantity.bind(this);
    this.setclientAddress    = this.setclientAddress.bind(this);
    this.setItemUnitPrice    = this.setItemUnitPrice.bind(this);
    this.setItemOrderNumber  = this.setItemOrderNumber.bind(this);
    this.submitInvoiceToAPI  = this.submitInvoiceToAPI.bind(this);
  }

  componentDidMount() {
    this.addItem();

    this.setState({ inv_number: this.props.currentUserCredentials.inv_number });
  }

  // Adds a new empty item to the invoice table
  addItem() {
    var items = this.state.items;

    var newItem = {
      key: this.state.itemCount, code: "", desc: "", quantity: "",
      price: 0, totalPrice: ""
    }
    items.push(newItem);

    // Increment the key value
    var itemCount = this.state.itemCount + 1;

    this.setState( { items, itemCount });
  }

  // Removes the last item row in the invoice table
  removeItem() {
    var items = this.state.items;

    if(items.length > 1) {
      items.pop();
      const itemCount = this.state.itemCount - 1;

      this.setState( { items, itemCount } );
    }
  }

// SETTERS

  //Sets the client code, stored in state
  setClientCode(e) {
    var clientCode = this.state.clientCode;
    clientCode = e.target.value;
    this.setState({clientCode});
  }

  // Sets the client name, stored in state
  setClientName(e) {
    var clientName = this.state.clientName;
    clientName = e.target.value;
    this.setState({clientName});
  }

  // Sets the clients address, stored in state
  setclientAddress(e) {
    const address = e.target.value;
    var clientAddress = this.state.clientAddress;
    clientAddress = address;

    this.setState( { clientAddress } );
  }

  // Sets the Order Number of an item, stored in items array object
  setItemOrderNumber(id, e) {
    const code = e.target.value;
    var items = this.state.items;
    items[id].code  = code;

    this.setState( { items });
  }

  // Sets the Description of an item, stored in items array object
  setItemDesc(id, e) {
    const desc = e.target.value;
    var items = this.state.items;
    items[id].desc = desc;

    this.setState( { items } );
  }

  // Sets the quantity of an item, stored in items array object
  // Also sets the total price item state
  setItemQuantity(id, e) {
    const quantity = e.target.value;
    var items = this.state.items;
    items[id].quantity = quantity;

    if(items[id].unitPrice !== "") {
      const totalPrice = items[id].unitPrice * quantity;
      items[id].totalPrice = totalPrice;
    }

    this.setState( { items } );

    // Updates the totals
    this.updateTotals();
  }

  // Sets the unit price of an item, stored in the items array object.
  // Also sets the total price item state
  setItemUnitPrice(id, e) {
    const price = e.target.value;
    var items = this.state.items;
    items[id].price = price;

    if(items[id].quantity !== '') {
      const totalPrice = items[id].quantity * price;
      items[id].totalPrice = totalPrice;
    }

    this.setState( { items } );

    // Update the totals
    this.updateTotals();
  }

  // Updates the overall totals on the invoice including, subtotal, tax and overall total
  updateTotals() {
    var currentTotal = 0;

    for(var i = 0; i < this.state.items.length; i++) {
      currentTotal = currentTotal + this.state.items[i].totalPrice;
    }

    // subtotal
    var subtotal = this.state.subtotal;
    subtotal = currentTotal;

    // tax amount
    const tax = subtotal * 0.15

    // all together total including tax
    const total = subtotal + tax;

    this.setState( { subtotal, tax, total } );
  }

  // Submits the invoice to the API
  submitInvoiceToAPI(e) {
    e.preventDefault();
    var data = this.state;
    var items = [];

    data.items.map((d) => {
      items.push({
        code: d.code, desc: d.desc, quantity: d.quantity, price: parseFloat(d.price)
      });
    });

    if(this.props.currentUserCredentials.inv_number) data.inv_number = parseFloat(this.props.currentUserCredentials.inv_number);
    // console.log(this.props.currentUserCredentials);
    var newInvoice = {
      inv_number: parseFloat(data.inv_number), client_code: data.clientCode, client_name: data.clientName,
      client_address: data.clientAddress, subtotal: data.subtotal, tax_rate: data.tax,
      total: data.total, items
    }

    var props = this.props;

    // Post to API via axios
    axios.post("http://localhost:4000/api/v1/invoices", newInvoice).then( (response) => {
      this.setState({ newInvoice });

      toast.success("Invoice created!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    }).catch( (err) => {
      if(err) {
        console.log(err);
        toast.error("Invoice could not be created, please try again. " + err, {
          position: toast.POSITION.BOTTOM_RIGHT
        })
        // success = false;
      }
    });
    // console.log(this.props.history);
    // this.props.history.push('/invoices');
  }

  // TODO: After create invocie is submitted, state is not updated with the new invoice, requires route refresh
  render() {
    /**
    * If the state prop is passed then view only mode is shown,
    * otherwise show empty invoice that is editable
    */
    if(typeof this.props.location.state !== "undefined" || typeof this.state.newInvoice !== "undefined") {
      const data = (typeof this.state.newInvoice !== "undefined") ? this.state.newInvoice : this.props.location.state.invoice;
      const items = data.items;

      return (
        <div>
          <ToastContainer />
          <Row>
            <Col xs="12" md="12" lg="9">
              <Card className="animated fadeIn invoiceCard">
                <CardHeader className="noPrint">
                  <h3>Invoice</h3>
                </CardHeader>
                <CardBody>
                  <Form>
                    <div className="invoice-container">
                      {/* Invoice */}
                      <Row className="invoiceHeader">
                        <Col md="8">
                          <img src={require('../../Assets/logo.png')} alt="Amba Logo" />
                        </Col>

                        <Col className="rightBox" md="4">
                          <h5 className="bold">Tax Invoice</h5>
                          <p>Invoice #: {data.inv_number} <br />
                          Created: {moment(data.date, 'DD-MM-YYYY').format('LL')} <br />
                          <b>Due: {moment(data.date, 'DD-MM-YYYY').add(15, 'days').format('LL')}</b></p>
                        </Col>
                      </Row>

                      <Row className="invoiceClientDetails">
                        {/* Client Details */}
                        <Col md="4">
                          <h5 className="bold">To:</h5>
                          <h5>{data.client_name}</h5>
                          {data.client_address && <h5>{data.client_address}</h5> }
                        </Col>

                        <Col md="4">
                          {/* Spacing purposes only */}
                        </Col>

                        {/* Client details in terms of our payment numbers */}
                        <Col className="rightBox" md="4">
                          <h5 className="bold">Details:</h5>
                          {/* <Input required value={data.client_code} className="invoiceInput" type="text" id="clientCode" name="clientCode"/> */}
                          <p>Client Code: <b>{data.client_code}</b><br />
                          <b>GST Num: 85-105-434</b><br />
                          Our account for direct crediting<br />
                          <b>06-0507-0052045-00</b></p>
                        </Col>
                      </Row>

                      <Row className="invoiceTableRow">
                        <Col>
                          {/* Table */}
                          <Table className="invoiceTable" size="md">
                            <thead>
                              <tr>
                                <th>Order #</th>
                                <th width="30%">Description</th>
                                <th width="15%">Quantity</th>
                                <th width="15%">Unit Price</th>
                                <th width="20%">Sub total</th>
                              </tr>
                            </thead>
                            <tbody>

                              {items.map( (i) => (
                                <tr key={i._id}>
                                  <td><p key={i._id}>{i.code}</p></td>
                                  <td><p key={i._id}>{i.desc}</p></td>
                                  <td><p key={i._id}>{i.quantity}</p></td>
                                  <td><p key={i._id}>{formatToPrice(i.price)}</p></td>
                                  <td><p key={i._id}>{formatToPrice(parseFloat(i.price) * parseFloat(i.quantity))}</p></td>
                                </tr>
                              ))}

                              <tr>
                                <td></td>
                                <td></td>
                                <td> {/* Spacer */} </td>

                                <td colSpan="2">
                                  <Table bordered>
                                    <tbody>
                                      <tr>
                                        <td>
                                          <Row className="totals">
                                            <Col md="6">Subtotal:</Col>
                                            <Col md="6">{formatToPrice(data.subtotal)}</Col>
                                          </Row>
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>
                                          <Row className="totals">
                                            <Col md="6">Tax(15%):</Col>
                                            <Col md="6">{formatToPrice(data.tax_rate)}</Col>
                                          </Row>
                                        </td>
                                      </tr>

                                      <tr>
                                        <td>
                                          <Row className="totals">
                                            <Col md="6">Total:</Col>
                                            <Col md="6">{formatToPrice(data.total)}</Col>
                                          </Row>
                                        </td>
                                      </tr>
                                    </tbody>
                                  </Table>
                                </td>
                              </tr>

                            </tbody>
                          </Table>
                        </Col>
                      </Row>

                      <div className="invoiceFooter">
                        <Row>
                          {/* Our Contact Details */}
                          <Col className="leftBox" md="4">
                            <h4>Contact Us:</h4>
                            <p>Phone: 04-939-1711 <br />
                            Fax: 04-939-1712 <br />
                            Email: amba@xtra.co.nz</p>
                          </Col>

                          <Col md="3">
                            {/* Spacing purposes only */}
                          </Col>

                          <Col className="rightBox" md="5">
                            <h4>Address:</h4>
                            <p>19-21 Jackson Street <br />
                            Petone, Wellington <br />
                            6035</p>
                          </Col>
                        </Row>

                        <Row>
                          <Col>
                            <div className="footer">
                              <h5>All totals are final and non-negotiable. Payments must be made by the specified due date
                                with no exceptions. Unpaid accounts will incur late payment fees & collection costs</h5>
                              </div>

                            </Col>
                          </Row>

                        </div>


                      </div>
                    </Form>
                  </CardBody>
                </Card>
              </Col>

              <Col xs="12" md="12" lg="3" className="noPrint">
                <Card>
                  <CardHeader>Options</CardHeader>
                  <CardBody>
                    <Row>
                      <Col xs="12" md="12" lg="12">
                        <NavLink to="/invoices">
                          <Button outline className="fullWidthButton topButton" color="primary">Back</Button>
                        </NavLink>
                      </Col>

                      {/* Print Button */}
                      <Col xs="12" md="12" lg="12">
                        <Button outline className="fullWidthButton topButton" color="info" onClick={() => { window.print(); return false;}}>Print</Button>
                      </Col>
                    </Row>

                  </CardBody>
                </Card>
              </Col>
            </Row>
          </div>
        );

    } else {
      return (
        <Row>
          <ToastContainer />
          <Col xs="12" md="12" lg="9">
            <Card className="animated fadeIn invoiceCard">
              <CardHeader>
                <h3>Invoice</h3>
              </CardHeader>

              <CardBody>
                <Form id="invoiceForm" onSubmit={this.submitInvoiceToAPI}>
                  <div className="invoice-container">
                    {/* Invoice */}
                    <Row className="invoiceHeader">
                      <Col md="8">
                        <img src={require('../../Assets/logo.png')} alt="Amba Logo" />
                      </Col>

                      <Col className="rightBox" md="4">
                        <h5 className="bold">Tax Invoice</h5>
                        <p>Invoice #: {this.state.inv_number} <br />
                          Created: {moment().format('LL')} <br />
                          Due: {moment().add(15, 'days').format('LL')}</p>
                      </Col>
                    </Row>

                    <Row className="invoiceClientDetails">
                      {/* Client Details */}
                      <Col md="4">
                        <h5 className="bold">To:</h5>
                        <Input required className="invoiceInput" onChange={this.setClientName} type="text" id="clientName" name="clientName" placeholder="Enter the clients name" />
                        <Input className="invoiceInput" onChange={this.setclientAddress} type="textarea" id="clientAddress" name="clientAddress" placeholder="Enter the clients address" />
                        {/* <Input className="invoiceInput" type="text" id="clientSuburb" placeholder="Enter the clients suburb" /> */}
                        {/* <Input className="invoiceInput" type="text" id="clientCountry" placeholder="Enter the clients Country" /> */}
                      </Col>

                      <Col md="4">
                        {/* Spacing purposes only */}
                      </Col>

                      {/* Client details in terms of our payment numbers */}
                      <Col className="rightBox" md="4">
                        <h5 className="bold">Details:</h5>
                        <Input required onChange={this.setClientCode} className="invoiceInput" type="text" id="clientCode" name="clientCode" placeholder="Client Number"/>
                        <b>GST Num: 85-105-434</b>
                        <p>Our account for direct crediting<br />
                        <b>06-0507-0052045-00</b></p>
                      </Col>
                    </Row>

                    <Row className="invoiceTableRow">
                      <Col>
                        {/* Table */}
                        <Table className="invoiceTable" size="md">
                          <thead>
                            <tr>
                              <th>Order #</th>
                              <th width="30%">Description</th>
                              <th width="15%">Quantity</th>
                              <th width="15%">Unit Price</th>
                              <th width="20%">Sub total</th>
                            </tr>
                          </thead>
                          <tbody>

                            {this.state.items.map( (i) => (
                              <tr key={i.key}>
                                <td><Input required className="tableInput" key={i.key} onChange={(e) => this.setItemOrderNumber(i.key, e)} type="text" name="code" placeholder="Order Number" /></td>
                                <td><Input required className="tableInput" key={i.key} onChange={(e) => this.setItemDesc(i.key, e)} type="text" name="desc" placeholder="Description" /></td>
                                <td><Input required className="tableInput" key={i.key} onChange={(e) => this.setItemQuantity(i.key, e)} type="number" name="quantity" placeholder="Quantity"/></td>
                                <td><Input required className="tableInput" key={i.key} onChange={(e) => this.setItemUnitPrice(i.key, e)} type="number" step="0.01" name="price" placeholder="Unit Price"/></td>
                                <td width="5%">{ i.totalPrice !== "" ? <p>{formatToPrice(i.totalPrice)}</p> : <p>$0.00</p> }</td>
                                {/* <td><Button className="glyphicon-remove" color="danger" onClick={this.removeRow}>Remove Item</Button></td> */}
                              </tr>
                            ))}

                            <tr>
                              <td><Button className="fullWidthButton" color="primary" onClick={this.addItem}> + </Button></td>
                              <td><Button className="fullWidthButton" color="danger" onClick={this.removeItem}> - </Button></td>
                              <td> {/* Spacer */} </td>

                              <td colSpan="2">
                                <Table bordered>
                                  <tbody>
                                    <tr>
                                      <td>
                                        <Row className="totals">
                                          <Col md="6">Subtotal:</Col>
                                          <Col md="6">{formatToPrice(this.state.subtotal)}</Col>
                                        </Row>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td>
                                        <Row className="totals">
                                          <Col md="6">Tax(15%):</Col>
                                          <Col md="6">{formatToPrice(this.state.tax)}</Col>
                                        </Row>
                                      </td>
                                    </tr>

                                    <tr>
                                      <td>
                                        <Row className="totals">
                                          <Col md="6">Total:</Col>
                                          <Col md="6">{formatToPrice(this.state.total)}</Col>
                                        </Row>
                                      </td>
                                    </tr>
                                  </tbody>
                                </Table>
                              </td>
                            </tr>

                          </tbody>
                        </Table>
                      </Col>
                    </Row>

                  <div className="invoiceFooter">
                    <Row>
                      {/* Our Contact Details */}
                      <Col className="leftBox" md="4">
                        <h4>Contact Us:</h4>
                          <p>Phone: 04-939-1711 <br />
                          Fax: 04-939-1712 <br />
                          Email: amba@xtra.co.nz</p>
                      </Col>

                      <Col md="3">
                        {/* Spacing purposes only */}
                      </Col>

                      <Col className="rightBox" md="5">
                        <h4>Address:</h4>
                        <p>19-21 Jackson Street <br />
                        Petone, Wellington <br />
                        6035</p>
                      </Col>
                    </Row>

                    <Row>
                      <Col>
                        <div className="footer">
                          <h5>All totals are final and non-negotiable. Payments must be made by the specified due date
                          with no exceptions. Unpaid accounts will incur late payment fees & collection costs</h5>
                        </div>

                      </Col>
                    </Row>

                  </div>


                  </div>
                </Form>
              </CardBody>
            </Card>
          </Col>

          <Col xs="12" md="12" lg="3">
            <Card>
              <CardHeader>Options</CardHeader>
              <CardBody>
                <Row>
                  <Col>
                    <Button type="submit" form="invoiceForm" className="fullWidthButton" color="primary">Save Invoice</Button>
                  </Col>

                  <Col>
                    <NavLink to="/invoices">
                      <Button outline className="fullWidthButton" color="danger">Cancel</Button>
                    </NavLink>
                  </Col>
                </Row>
              </CardBody>
            </Card>
          </Col>
        </Row>
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
    isLoggedIn: state.isLoggedIn,
    currentUserCredentials: state.currentUserCredentials,
    _persist: state.persist
  }
}

/**
* Sets action functions to be used by the Login component through props
* Functions
*/
function mapDispatchToProps(dispatch) {
  // When setLogin is called, result is passed to all reducers
  return bindActionCreators({ setLogin: setLogin, setCurrentUserCredentials: setCurrentUserCredentials  }, dispatch);
}

NewInvoice.contextTypes = {
  store: PropTypes.object
};

export default withRouter(connect(mapStateToProps, mapDispatchToProps)(NewInvoice));
