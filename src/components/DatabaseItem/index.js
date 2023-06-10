import MuiListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { withStyles } from '@mui/styles';
import { useNavigate } from "react-router-dom";

import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

const ListItem = withStyles({
    root: {
      "&:hover": {
        cursor: 'pointer',
        backgroundColor: "rgba(0,0,0,0.1)",
        "& .MuiListItemIcon-root": {
          color: "white"
        }
      }
    },
    selected: {

    }
})(MuiListItem);

export function DatabaseItem({databaseName, deleteCallback}) {
    const navigate = useNavigate();

    const openDatabaseAnnotation = () => {
        localStorage.setItem('databaseFilename', databaseName);
        navigate('database-annotation')
    }

    return (
        <ListItem
            secondaryAction={
                <IconButton 
                    edge="end" aria-label="delete" 
                    variant="contained" color="error"
                    onClick={() => {deleteCallback(databaseName)}}
                >
                    <DeleteIcon />
                </IconButton>
            }
            onClick={openDatabaseAnnotation}
        >
            <ListItemAvatar>
                <Avatar>
                    <FolderIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                primary={databaseName}
            />
        </ListItem>
    )
}