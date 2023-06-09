import ListItem from '@mui/material/ListItem';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import IconButton from '@mui/material/IconButton';
import ListItemText from '@mui/material/ListItemText';

import FolderIcon from '@mui/icons-material/Folder';
import DeleteIcon from '@mui/icons-material/Delete';

export function DatabaseItem({databaseName, deleteCallback}) {

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