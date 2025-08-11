import React from 'react';
import PropTypes from 'prop-types';
import { styled } from '@mui/material/styles';
import Bar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import DrawerMenu from './DrawerMenu';
import Avatar from '@mui/material/Avatar';
import Grid from '@mui/material/Grid';

const styles = {
  rootbar: {
    width: '100%',
    flexGrow: 1,
    zIndex: 2,
    display: "flex"
  },
  grow: {
    flexGrow: 1,
  },
  menuButton: {
    marginLeft: -12,
    marginRight: 20,
  },
};

class AppBar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      projectName: '',
    };

  }


  render() {
    return (
      <Bar position="static" style={{ color: "#fff", backgroundColor: "#3f51b5" }}>
        <Toolbar variant="dense">
          <DrawerMenu app={this.props.app}></DrawerMenu>
          <Typography variant="subtitle1" color="inherit" sx={{ flexGrow: 1 }}>
            {this.props.projectName}
          </Typography>
        </Toolbar>
      </Bar>
    );
  }
}

AppBar.propTypes = {
  // classes: PropTypes.object.isRequired, // No longer needed with MUI v5
};

export default AppBar;