import { ListItem, ListItemText } from "@mui/material";


export function VariableItem({name, dtypes}){

    return (
        <ListItem
            secondaryAction={dtypes}
            sx={{
                height: '4.063rem',
            }}
        >
            <ListItemText>
                {name}
            </ListItemText>
        </ListItem>
    )
}