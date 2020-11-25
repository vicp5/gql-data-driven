import React, { useState } from 'react';
import { Button, Modal, Icon } from 'semantic-ui-react';

function ButtonModal({ children, title, description, icon }) {
    const [ open, setOpen ] = useState(false);
  
    return (
      <Modal
        onClose={() => setOpen(false)}
        onOpen={() => setOpen(true)}
        open={open}
        trigger={
          <Button
            floated="right"
            icon
            labelPosition="left"
            primary
            size="small"
          >
            <Icon name={icon} />
            { title }
          </Button>
        }
      >
        <Modal.Header>{ title }</Modal.Header>
          <Modal.Content>
            <Modal.Description>
              { description }
            </Modal.Description>
            { children }
          </Modal.Content>
      </Modal>
    );
  }

  export default ButtonModal;