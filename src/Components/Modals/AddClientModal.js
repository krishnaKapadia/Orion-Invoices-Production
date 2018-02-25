import React, { Component } from 'react';
import {
  Button, Modal, ModalHeader, ModalBody, ModalFooter, Form, FormGroup, Input, Label
} from 'reactstrap';
class AddClientModal extends Component {
  constructor(props) {
    super(props);

    this.state = {
      editModal: false,
    }

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    this.setState({
      editModal: !this.state.editModal
    })
  }

  render() {
    return (
      <Modal className="modal-primary" isOpen={this.state.editModal} toggle={this.toggle}>
        <ModalHeader>Add new client</ModalHeader>

        <ModalBody>
          <Form>
            <FormGroup>
              <Label>Client Code: </Label>
              <Input type="text" name="clientCode" />
            </FormGroup>
            <FormGroup>
              <Label>Client Name: </Label>
              <Input type="text" name="clientName"/>
            </FormGroup>
            <FormGroup>
              <Label>Client Address: </Label>
              <Input type="text" name="clientAddress"/>
            </FormGroup>
            <FormGroup>
              <Label>Client Phone: </Label>
              <Input type="number" name="clientPhone"/>
            </FormGroup>
          </Form>
        </ModalBody>

        <ModalFooter>
          <Button color="primary" onClick={this.toggle}>Save Changes</Button>
          <Button color="secondary" onClick={this.toggle}>Cancel</Button>
        </ModalFooter>
      </Modal>
    );
  }

}

export default AddClientModal;
