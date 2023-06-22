import { useNavigate } from "react-router-dom";
import MuiListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';
import { styled } from '@mui/system';

import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

const ListItem = styled(MuiListItem)({
    "&:hover": {
        cursor: 'pointer',
        backgroundColor: "rgba(0,0,0,0.1)",
        "& .MuiListItemIcon-root": {
            color: "white"
        }
    }
});

export function DatabaseItem({databaseName, deleteCallback}) {
    const navigate = useNavigate();

    const openDatabaseAnnotation = () => {
        localStorage.setItem('databaseFilename', databaseName);
        navigate('/database-annotation')
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
        >
            <ListItemAvatar
                onClick={openDatabaseAnnotation}
            >
                <Avatar>
                    <FolderIcon />
                </Avatar>
            </ListItemAvatar>
            <ListItemText
                onClick={openDatabaseAnnotation}
                primary={databaseName}
            />
        </ListItem>
    )
}