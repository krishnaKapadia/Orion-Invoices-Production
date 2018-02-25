import React, { Component } from 'react';
import { Row, Col, Button, Form, FormGroup, Input, Label,
Modal, ModalHeader, ModalBody, ModalFooter, Table } from 'reactstrap';
import axios from 'axios';
import { ToastContainer , toast} from 'react-toastify';
import Spinner from 'react-spinkit';

class Order extends Component {
  constructor(props) {
    super(props)

    this.state = {
      editModal: false,
      completed: false,
      data: '',
      loadingButtonDelete: false,
      loadingButton: false
    }

    this.toggleEdit = this.toggleEdit.bind(this);
    this.toggleComplete = this.toggleComplete.bind(this);
    this.deleteOrder = this.deleteOrder.bind(this);
    this.editOrder = this.editOrder.bind(this);
    this.setOrderCode = this.setOrderCode.bind(this);
    this.setItemDesc = this.setItemDesc.bind(this);
    this.setItemCost = this.setItemCost.bind(this);
    this.setItemQuantity = this.setItemQuantity.bind(this);
    this.setClientName = this.setClientName.bind(this);
  }

  componentDidMount() {
    var data = Object.assign({}, this.props.data);
    this.setState({ data, completed: this.props.data.completed });
  }

  /**
  * Toggles edit modal
  */
  toggleEdit () {
    this.setState({
      editModal: !this.state.editModal
    })
  }

  /**
  * Toggles completed order status
  */
  toggleComplete() {
    this.props.data.completed = !this.props.data.completed;
    this.setState({ loadingButton: true });
    // Update via API
    axios.put(`http://localhost:4000/api/v1/orders/${this.props.data._id}`, this.props.data).then( (response) => {
      this.setState({ loadingButton: false });
      this.props.toggleCompleted(this.props.data._id, this.props.data.completed);
    }).catch((err) => {
      this.setState({ loadingButton: false });
      if(err) toast.error("Could not save updated order " + err, {
        position: toast.POSITION.BOTTOM_RIGHT
      });
    })
  }

  /**
  * Deletes the associated order
  */
  deleteOrder() {
    this.setState({ loadingButtonDelete: true });
    axios.delete(`http://localhost:4000/api/v1/orders/${this.props.data._id}`).then( (response) => {
      this.setState({ loadingButtonDelete: false });
      toast.success("Order deleted!", {
        position: toast.POSITION.BOTTOM_RIGHT
      });
      // Removes from application state
      this.props.deleteOrderFromState(this.props.data._id, this.props.data);
    }).catch( (err) => {
      this.setState({ loadingButtonDelete: false });
      if(err) toast.error("Could not delete order! Please try again. " + err, {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    });
  }

  /**
  * Edits the associated order
  */
  editOrder(o) {
    o.preventDefault();
    this.setState({ loadingButton: true });
    axios.put(`http://localhost:4000/api/v1/orders/${this.props.data._id}`, this.state.data).then( (response) => {
      this.setState({ loadingButton: false });
      this.toggleEdit();
      this.props.updateOrder(this.props.data._id, this.state.data);
    }).catch((err) => {
      this.setState({ loadingButton: false });
      if(err) toast.error("Could not save updated order " + err, {
        position: toast.POSITION.BOTTOM_RIGHT
      })
    });
  }

  /**
  * Sets order code of the order
  */
  setOrderCode(e) {
    var data = this.state.data;
    data.code = e.target.value;
    this.setState({ data });
  }

  /**
  * Sets client name of the order
  */
  setClientName(e) {
    var data = this.state.data;
    data.client_name = e.target.value;
    this.setState({ data });
  }

  /**
  * Sets item desc based off item array position and value
  */
  setItemDesc(id, e) {
    const desc = e.target.value;
    var data = this.state.data;
    data.items[id].desc = desc;
    this.setState({ data });
  }

  /**
  * Sets item quantity based off item array position and value
  */
  setItemQuantity(id, e) {
    const quantity = e.target.value;
    var data = this.state.data;
    data.items[id].quantity = quantity;
    this.setState({ data });
  }

  /**
  * Sets item price based off item array position and value
  */
  setItemCost(id, e) {
    const price = parseFloat(e.target.value);
    var data = this.state.data;
    data.items[id].price = price;
    this.setState({ data });
  }

  render() {
    const data = this.props.data;
    var count = -1;

    return (
      <tr>
          <td>{data.client_name}</td>
          <td>
            <ul>
              {
                data.items.map( (order) => {
                  return (
                    <li key={order._id}>{`${order.desc} x ${order.quantity} at $${order.price}`}</li>
                  )
                })
              }
            </ul>
          </td>
          <td>{data.created}</td>
          <td>
            <Row>
              <Col className="topButton">
                {this.state.completed && <Button outline className="fullWidthButton" color="primary blue" onClick={this.toggleEdit}>Edit</Button>}
                {!this.state.completed && <Button className="fullWidthButton" color="primary white" onClick={this.toggleEdit}>Edit</Button>}
              </Col>
            </Row>

            <Row>
              <Col>
                {this.state.completed && <Button outline className="fullWidthButton" color="secondary blue" onClick={this.toggleComplete}>Completed</Button>}
                {!this.state.completed && <Button className="fullWidthButton" color="secondary white" onClick={this.toggleComplete}>Mark Completed</Button>}              </Col>
            </Row>
          </td>

          <Modal className="modal-primary" isOpen={this.state.editModal} toggle={this.toggleEdit}>
            <ModalHeader>Edit Order Information</ModalHeader>

            <Form onSubmit={this.editOrder}>
              <ModalBody>
                <FormGroup>
                  <Label>Order Code: </Label>
                  <Input type="text" name="orderCode" defaultValue={data.code}
                    onChange={(e) => this.setOrderCode(e)}/>
                </FormGroup>

                <FormGroup>
                  <Label>Client Name: </Label>
                  {/* TODO: CHANGE LATER TO BE A SELECTABLE LIST OF CLIENTS */}
                  <Input type="text" name="clientName" onChange={(e) => this.setClientName(e)} defaultValue={data.client_name} />
                </FormGroup>

                <FormGroup>
                  {/* TODO: ADD THE ABILITY TO ADD ORDER LIST ITEMS WITHIN THE MODAL AND ALSO REMOVE */}
                  <Label><b>Order List</b></Label>
                  <Table>
                    <thead>
                      <tr>
                        <th>Description</th>
                        <th>Quantity</th>
                        <th>Cost Per Item</th>
                      </tr>
                    </thead>

                    <tbody>
                      {
                        data.items.map( (item) => {
                          count++
                          return(
                            <tr key={item._id}>
                              <td><Input onChange={(e) => this.setItemDesc(count, e)} name="itemDesc" type="text" defaultValue={item.desc} /></td>
                              <td><Input onChange={(e) => this.setItemQuantity(count, e)} name="itemQuantity" type="number" defaultValue={item.quantity} /></td>
                              <td><Input onChange={(e) => this.setItemCost(count, e)} name="itemCost" type="number" step="0.01" defaultValue={item.price} /></td>
                            </tr>
                          )
                        })
                      }
                    </tbody>
                  </Table>
                </FormGroup>

                <FormGroup>
                  <Label>Created: </Label>
                  <Input type="text" name="created" value={data.created} disabled />
                </FormGroup>
              </ModalBody>

              <ModalFooter>
                <div className="test">
                  <div className="floatLeft">
                    {
                      this.state.loadingButtonDelete && <Button outline color="danger" className="px-4"><Spinner name="circle" color="#e74c3c" fadeIn="none" /></Button>
                    }
                    {
                      !this.state.loadingButtonDelete && <Button outline color="danger" onClick={this.deleteOrder}>Delete Order</Button>
                    }
                  </div>

                  <Button color="secondary" className="floatRight" onClick={this.toggleEdit}>Cancel</Button>

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
          {/* <ToastContainer /> */}
      </tr>
    );
  }

}

export default Order;
