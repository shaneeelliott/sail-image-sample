import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';


class LogData extends React.Component {
  constructor(props) {
    super(props);

    let data = [];

    this.state = {
      name: '',
      data: data,
      loading: false,
      filedata: false,
      startTime: false,
      endTime: false,
      searchTime: false,
    };
  }

  stoploading = () => {
    this.setState({ loading: false });
  }

  BtnClick = (event, index) => {

  }

  componentDidUpdate() {

  }

  render() {

    let info = null;

    const { isImage } = this.props.app.state;
    const { data, name, loading, startTime, endTime, searchTime } = this.state;
    const { imageTime } = this.props.app.state;

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
      padding: "2px 4px 4px 4px"
    }

    let card = {
      margin: '0px 0px 5px 0px',
      boxShadow: 'rgba(0, 0, 0, 0.2) 0px 8px 12px 0px, rgba(0, 0, 0, 0.2) 0px 6px 12px 0px'
    }

    if (data.length > 0) {
      info = (
        <Grid container direction="column" justifyContent="center" alignItems="center">

          <Grid container justifyContent={'center'} alignItems={'center'} style={{ paddingBottom: '8px' }}>
            {data.map((variable, index) => (
              <Grid container direction="row" justifyContent="center" alignItems="center" style={container1}>
                <Typography color='textPrimary' variant='body2' align="center" style={{ padding: '0px 6px 0px 3px', fontSize: "12px" }}>
                  {variable.name}
                </Typography>
                <input value={variable.value} id="first" name="first" type="text" size="12" style={textf} />
              </Grid>
            ))}

          </Grid>
        </Grid>
      );
    } else {
      info = (
        <Grid container direction="column" justifyContent="center" alignItems="center">
          <Typography color='textPrimary' variant='body2' align="center">
            No data available.
          </Typography>
        </Grid>
      );
    }

    return (
      <div style={{ marginBottom: "10px" }}>
        <Card style={{ card }}>
          <div style={cardheadr}>Log Data</div>
          <CardContent style={cardbody}>
            {info}
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default LogData;