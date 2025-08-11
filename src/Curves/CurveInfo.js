import React from 'react';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardHeader from '@mui/material/CardHeader';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import DeleteIcon from '@mui/icons-material/Delete';

class CurveInfo extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      curves: props.data,
      editClick: props.editHandler,
    };
  }

  BtnClick = (event, index) => {
    this.props.editHandler(index);
    console.log('edit index =', index);
  }

  updateTwist = () => {


  }

  render() {

    let info = [];

    let btn = {
      width: '15px',
      height: '15px',
      display: 'block',
    }

    let curveData = {
      fontSize: "13.5px",
      padding: "1px 1px 1px 1px",
      textAlign: "center",
    }

    let cardsubheading = {
      margin: "1px 1px 4px 1px",
      padding: "0px 0px 0px 0px",
    }

    let curveHeading = {
      fontSize: "13.5px",
      padding: "1px 1px 1px 1px",
      textAlign: "center",
      color: "black",
      fontWeight: 400,
      fontFamily: "Roboto, Helvetica, Arial, sans-serif"
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


    {
      this.props.data.map((curve, index) => {

        let cardRow;
        if (index % 2 === 0) {
          cardRow = {
            backgroundColor: 'lightgrey',
          }
        } else {
          cardRow = {
            backgroundColor: 'white',
          }
        }

        let i = (
          <Grid container style={cardRow} key={curve.key}>

            <Grid item xs style={curveData}>{curve.name}</Grid>
            <Grid item xs style={curveData}>{curve.draft.toFixed(1)}</Grid>
            <Grid item xs style={curveData}>{curve.camber.toFixed(3)}</Grid>
            <Grid item xs style={curveData}>{curve.twist.toFixed(1)}</Grid>
            <Grid item xs style={curveData}>{curve.EntryAngle.toFixed(0)}</Grid>
            <Grid item xs style={curveData}>{curve.ExitAngle.toFixed(0)}</Grid>
            <Grid item xs style={curveData}>{curve.frontPercent ? curve.frontPercent.toFixed(1) : " "}</Grid>
            <Grid item xs style={curveData}>{curve.backPercent ? curve.backPercent.toFixed(1) : " "}</Grid>

          </Grid>
        );
        info.push(i);
      })
    };



    let header = (
      <Grid container style={cardsubheading}>

        <Grid item xs style={curveHeading}>Stripe</Grid>
        <Grid item xs style={curveHeading}>Draft</Grid>
        <Grid item xs style={curveHeading}>Camber</Grid>
        <Grid item xs style={curveHeading}>Twist</Grid>
        <Grid item xs style={curveHeading}>Entry</Grid>
        <Grid item xs style={curveHeading}>Exit</Grid>
        <Grid item xs style={curveHeading}>Front%</Grid>
        <Grid item xs style={curveHeading}>Back%</Grid>

      </Grid>
    );



    return (
      <div style={{ marginBottom: "10px" }}>
        <Card style={{ card }}>
          <div style={cardheadr}>Curve data</div>
          <CardContent style={cardbody}>
            {header}
            {info}
          </CardContent>
        </Card>
      </div>
    );
  }
}

export default CurveInfo;