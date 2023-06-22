import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';

export default function AlertDialog({title, description, open, handleClose}) {

    const handleConfirm = () => {
        handleClose(true);
    }

    const handleCancel = () => {
        handleClose(false);
    }

    return (
        <Dialog
            open={open}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {title}
            </DialogTitle>
            <DialogContent>
            <DialogContentText id="alert-dialog-description">
                {description}
            </DialogContentText>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleCancel}>Cancelar</Button>
            <Button onClick={handleConfirm} autoFocus>
                Confirmar
            </Button>
            </DialogActions>
        </Dialog>
    );
}