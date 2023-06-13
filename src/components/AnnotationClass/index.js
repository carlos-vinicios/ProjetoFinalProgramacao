import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import { 
    Grid, MenuItem, Select, FormControl, 
    InputLabel, Typography, Button, TextField, IconButton 
} from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';

import { MultiValueTextField } from '../MultiValueTextField';

const titleStyle = {
    backgroundColor: 'primary.main',
    color: '#FFF',
    mb: 2
}

export function AnnotionClass({open, handleClose, classes, addNewClass, removeClass}){
    const [selectedClass, setSelectedClass] = useState('');
    const [className, setClassName] = useState('');
    const [dtype, setDtype] = useState('');
    const [categories, setCategories] = useState([]);
    
    const dtypes = ["Categórico", "Booleano"]

    const resetToDefault = () => {
        setSelectedClass('')
        setClassName('')
        setDtype('')
        setCategories([])
    }

    const handleSave = () => {
        if(categories.length <= 0){
            alert("É necessário adicionar ao menos uma categoria")
            return
        }
        addNewClass(className, dtype, categories)
        resetToDefault()
        handleClose();
    }

    const handleChangeDtype = (event) => {
        setDtype(event.target.value);
        if(event.target.value === "Booleano"){
            setCategories([1, 0])
        }
    }

    const handleChangeSelectedClass = (event) => {
        if(event.target.value !== "newClass"){
            const classData = classes[event.target.value]
            setClassName(event.target.value)
            setDtype(classData.type)
            setCategories(classData.categories)
            setSelectedClass(event.target.value)
        }else
            resetToDefault()
    }

    const handleCategoriesAdd = (values) => {
        setCategories(values)
    }

    const removeClassAndClose = () => {
        removeClass(selectedClass)
        resetToDefault()
        handleClose();
    }

    return (
        <Dialog
            maxWidth="sm"
            fullWidth
            open={open}
            onClose={handleClose}
        >
            <DialogTitle id="new-class-dialog-title" sx={titleStyle}>
                <Typography variant="h5">Adicionando uma Nova Classe</Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={3}>
                    <Grid item container lg={12}>
                        <Grid item lg={11}>
                            <FormControl fullWidth>
                                <InputLabel id="class-select-label">Classes:</InputLabel>
                                <Select
                                    labelId="class-select-label"
                                    id="class-select"
                                    value={selectedClass}
                                    label="class"
                                    onChange={handleChangeSelectedClass}
                                >
                                    <MenuItem value='newClass'>Nova Classe</MenuItem>
                                    {
                                        Object.keys(classes).map(element => (
                                            <MenuItem value={element}>{element}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={1}>
                            <IconButton 
                                edge="end" aria-label="remove-class" 
                                variant="contained" color="error"
                                onClick={removeClassAndClose}
                                disabled={!selectedClass}
                            >
                                <DeleteIcon />
                            </IconButton>
                        </Grid>
                    </Grid>
                    <Grid item lg={12}>
                        <TextField 
                            id="class-label"
                            label="Nome da Classe"
                            fullWidth
                            value={className}
                            onChange={(e) => setClassName(e.target.value)}
                        />
                    </Grid>
                    <Grid item lg={12}>
                        <FormControl fullWidth>
                            <InputLabel id="variable-type-select-label">Tipo de Variável:</InputLabel>
                            <Select
                                labelId="variable-type-select-label"
                                id="variable-type-select"
                                value={dtype}
                                label="variable-type"
                                onChange={handleChangeDtype}
                            >
                                {
                                    dtypes.map(element => (
                                        <MenuItem value={element}>{element}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    {dtype === "Categórico" && (
                        <Grid item lg={12}>
                            <InputLabel id="categories-input-label">Categórias:</InputLabel>
                            <MultiValueTextField value={categories} changeCallback={handleCategoriesAdd} />
                        </Grid>    
                    )}
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='primary' onClick={handleSave}>
                    Salvar
                </Button>
            </DialogActions>
        </Dialog>
    )
}