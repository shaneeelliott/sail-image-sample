import React from 'react';
import { styled } from '@mui/material/styles';
import Button from '@mui/material/Button';
import Snackbar from '@mui/material/Snackbar';
import IconButton from '@mui/material/IconButton';
import CloseIcon from '@mui/icons-material/Close';

class SimpleSnackbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false,
      setOpen: false,
      duration: 5000,
      text: "",
    };
  }

  handleOpen = (text) => {
    this.setState({ open: true, text: text, duration: null });
  }

  handleClose = (event) => {
    this.setState({ open: false })
  }

  lastMsg = (event) => {
    this.setState({ duration: 2000 })
  }


  render() {
    const close = { padding: "8px" }
    const { open, setOpen, text, duration } = this.state;

    return (
      <div>
        <Snackbar
          anchorOrigin={{
            vertical: 'bottom',
            horizontal: 'left',
          }}
          open={open}
          autoHideDuration={duration}
          onClose={this.handleClose}
          ContentProps={{
            'aria-describedby': 'message-id',
          }}
          message={<span id="message-id">{text}</span>}
          action={[
            <IconButton
              key="close"
              aria-label="close"
              color="inherit"
              style={close}
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>,
          ]}
        />
      </div>
    );
  }
}

export default SimpleSnackbar

