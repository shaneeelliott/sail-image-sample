import React, { useState } from 'react';
import { 
  DialogContent, 
  DialogTitle, 
  List, 
  ListItem, 
  ListItemText,
  Card,
  CardContent,
  Box
} from '@mui/material';

interface StripeSelectorProps {
  dialog: {
    handleClose: () => void;
  };
  sailImage: any;
  app: any;
}

const StripeSelector: React.FC<StripeSelectorProps> = ({ dialog, sailImage, app }) => {
  const [state, setState] = useState({
    sail: '',
    type: 0,
    Stripes: ["25%", "50%", "75%", "87%", "Head"],
    mainIndex: 0,
    name: 'hai',
    labelWidth: 0,
    open: false,
  });

  const handleListItemClick = (event: React.MouseEvent, sail: string) => {
    // Check if curve with this stripe name already exists
    const existingCurve = app.state.curves.find((curve: any) => curve.name.includes(sail));
    if (existingCurve) {
      // You could show an alert here if needed
      console.log('Curve with this stripe already exists!');
      return;
    }

    // Save the curve with the stripe name
    sailImage.saveCurve(sail);
    dialog.handleClose();
  };

  const stripes = state.Stripes.map((stripe, index) => {
    const disabled = app.state.curves.find((curve: any) => curve.name.includes(stripe));
    
    return (
      <ListItem
        key={index}
        disabled={disabled}
        button
        onClick={(event) => handleListItemClick(event, stripe)}
      >
        <ListItemText primary={stripe} />
      </ListItem>
    );
  });

  return (
    <div>
      <DialogTitle id="form-dialog-title">Select Stripe.</DialogTitle>
      <DialogContent>
        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
          <Card sx={{ minWidth: 200 }}>
            <CardContent>
              <List component="nav">
                {stripes}
              </List>
            </CardContent>
          </Card>
        </Box>
      </DialogContent>
    </div>
  );
};

export default StripeSelector;
