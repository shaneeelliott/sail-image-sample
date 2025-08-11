import React from 'react';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';

class Comments extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      comments: "",
    };
  }

  handleChange = (event) => {
    //this.setState({comments: event.target.value});
    this.props.app.setState({ comments: event.target.value });
  }



  render() {

    let info = null;

    let comments = this.props.app.state.comments;

    let container1 = {
      padding: "3px",
      margin: "3px",
      width: "fit-content",
      borderRadius: "4px",
      backgroundColor: "#dadada"
    }

    let textf = {
      width: "50px",
      border: '0px',
      borderRadius: '4px',
      textAlign: 'center',
      fontFamily: 'sans-serif',
      fontSize: "13.5px"
    }

    let btn = {
      height: '18px',
      display: 'block',
    }

    let cardheadr = {
      fontSize: "15px",
      padding: "4px 4px 4px 10px",
      color: "#3f51b5",
      textAlign: "center",
      fontWeight: " 500",
    }

    let cardbody = {
      padding: "2px 4px 2px 4px"
    }

    let card = {
      margin: '0px 0px 5px 0px',
      boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 12px 0px, rgba(0, 0, 0, 0.2) 0px 6px 12px 0px'
    }

    info = (
      <Card style={{ card }}>
        <div style={cardheadr}>Comments</div>
        <Grid container direction="column" justifyContent="center" alignItems="center" style={{ padding: '5px' }}>
          <TextField
            id="filled-dense-multiline"
            style={{ marginTop: "0px" }}
            type="text"
            rows="3"
            fullWidth
            variant="outlined"
            multiline
            rowsMax="3"
            value={comments}
            onChange={this.handleChange}
          />
        </Grid>
      </Card>
    );

    return (
      <div>
        {info}
      </div>
    );
  }
}

export default Comments;