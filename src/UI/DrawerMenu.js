import React from 'react';

import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import HomeIcon from '@mui/icons-material/Home';
import MailIcon from '@mui/icons-material/Mail';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Typography from '@mui/material/Typography';

const styles = {
  list: {
    width: 250,
  },
  fullList: {
    width: 'auto',
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
  heading: {
    padding: '5px 16px 0px 15px',
    marginBottom: '-10px',
  }
};

class DrawerMenu extends React.Component {
  constructor(props) {
    super(props);
  }
  state = {
    top: false,
    left: false,
    bottom: false,
    right: false,
  };

  toggleDrawer = (side, open) => () => {
    this.setState({
      [side]: open,
    });
  };

  render() {
    return (
      <div>
        <IconButton style={{ zIndex: 2 }} onClick={this.toggleDrawer('left', true)} sx={{ marginLeft: -1.5, marginRight: 2.5 }} color="inherit" aria-label="Menu">
          <MenuIcon />
        </IconButton>

        <Drawer open={this.state.left} onClose={this.toggleDrawer('left', false)}>
          <div
            tabIndex={0}
            role="button"
            onClick={this.toggleDrawer('left', false)}
            onKeyDown={this.toggleDrawer('left', false)}
          >
            <List>
              <ListItem onClick={null}>
                <ListItemIcon>{<InboxIcon />}</ListItemIcon>
                <ListItemText primary={'Home'} />
              </ListItem>
              <ListItem onClick={null}>
                <ListItemIcon>{<InboxIcon />}</ListItemIcon>
                <ListItemText primary={'Settings'} />
              </ListItem>
            </List>
          </div>
        </Drawer>
      </div>
    );
  }
}


DrawerMenu.propTypes = {
  // classes: PropTypes.object.isRequired, // No longer needed with MUI v5
};

export default DrawerMenu;