import React, { useState } from 'react';
import { Dialog, DialogContent, DialogTitle } from '@mui/material';
import { blue } from '@mui/material/colors';
import StripeSelector from './StripeSelector';

interface StripeDialogProps {
  open: boolean;
  onClose: (value?: string) => void;
  sailImage: any;
  app: any;
}

interface StripeDialogState {
  activeStep: number;
  maxWidth: 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  data: {
    Mainsails: any[];
    Headsails: any[];
    Asyms: any[];
    Other: any[];
  };
}

const StripeDialog: React.FC<StripeDialogProps> = ({ open, onClose, sailImage, app }) => {
  const [state, setState] = useState<StripeDialogState>({
    activeStep: 0,
    maxWidth: 'xs',
    data: {
      Mainsails: [],
      Headsails: [],
      Asyms: [],
      Other: [],
    }
  });

  const handleClose = () => {
    onClose();
  };

  const handleListItemClick = (value: string) => {
    onClose(value);
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      disableEscapeKeyDown={true}
      aria-labelledby="stripe-dialog-title"
    >
      <StripeSelector 
        dialog={{ handleClose }}
        sailImage={sailImage}
        app={app}
      />
    </Dialog>
  );
};

export default StripeDialog;
