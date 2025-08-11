import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
// Note: moment.js is not installed - using native Date instead

class ImageData extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      name: '',
      imageTime: '',
    };
  }

  updateInfo = (info) => {
    //console.log(info);
    let newDateTime;
    try {
      // Try to parse the date using native Date
      const dt = new Date(info.DateTimeOriginal);
      if (!isNaN(dt.getTime())) {
        newDateTime = dt;
      } else {
        // Try alternative format
        const parts = info.DateTimeOriginal.split(/[: ]/);
        if (parts.length >= 6) {
          newDateTime = new Date(parts[0], parts[1] - 1, parts[2], parts[3], parts[4], parts[5]);
        } else {
          newDateTime = new Date();
        }
      }
    } catch (error) {
      newDateTime = new Date();
    }

    const formattedTime = newDateTime.toISOString().slice(0, 19).replace('T', ' ');
    this.setState({
      name: info.Name,
      imageTime: formattedTime
    });
  }

  updateTime = (dateTime) => {
    this.setState({ imageTime: dateTime });
    this.props.app.setState({ imageTime: dateTime });
    this.props.app.loginforef.updateTime();
  }


  render() {

    const { project, isImage } = this.props.app.state;

    let info = null;

    let container1 = {
      padding: "2px",
      margin: "3px",
      borderRadius: "4px",
      backgroundColor: "#dadada"
    }

    let container2 = {
      padding: "2px",
      margin: "3px 0px",
      borderRadius: "4px",
      backgroundColor: "#dadada"
    }

    let textf = {
      flexGrow: 1,
      border: '0px',
      borderRadius: '4px',
      textAlign: 'center',
      fontFamily: 'sans-serif',
      fontSize: "13.5px"
    }

    let textf2 = {
      flexGrow: 1,
      border: '0px',
      borderRadius: '4px',
      textAlign: 'center',
      fontFamily: 'sans-serif',
      fontSize: "13.5px"
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

    let sail = (this.props.sail);

    if (isImage) {
      info = (
        <div style={{ marginBottom: "10px" }}>
          <Card style={{ card }}>
            <div style={cardheadr}>Image Info</div>
            <CardContent style={cardbody}>
              <Grid container direction="column" justifyContent="center" alignItems="center">
                <Grid container direction="row" justifyContent="center" alignItems="center" style={container1}>
                  <Typography color='textPrimary' variant='body2' align="center" style={{ padding: '0px 6px 0px 3px', fontSize: "13.5px" }}>
                    Image:
                  </Typography>
                  <input value={this.state.name} id="first" name="first" type="text" size="12" style={textf} />
                </Grid>

                <Grid container spacing={1}>
                  <Grid item xs={6}>
                    <Grid container direction="row" justifyContent="center" alignItems="center" style={container2}>
                      <Typography color='textPrimary' variant='body2' align="center" style={{ padding: '0px 6px 0px 3px', fontSize: "13.5px" }}>
                        Image Time:
                      </Typography>
                      <input value={this.state.imageTime} id="first" name="first" type="text" size="12" style={textf2} />
                    </Grid>
                  </Grid>
                  <Grid item xs={6}>
                    <Grid container direction="row" justifyContent="center" alignItems="center" style={container2}>
                      <Typography color='textPrimary' variant='body2' align="center" style={{ padding: '0px 6px 0px 3px', fontSize: "13.5px" }}>
                        Sail:
                      </Typography>
                      <input value={sail} id="first" name="first" type="text" size="12" style={textf2} />
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </CardContent>
          </Card>
        </div>
      );
    }

    return (
      <div>
        {info}
      </div>
    );
  }
}

export default ImageData;