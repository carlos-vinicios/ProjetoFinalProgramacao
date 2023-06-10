import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { readCSV, toCSV } from "danfojs"
import { 
    List, MenuItem, Paper, Select, FormControl, 
    InputLabel, Typography, Button 
} from '@mui/material';
import { VariableItem } from '../VariableItem';
import { DTYPES } from '../../utils/dtypes';

const sectionHeadersStyle = {
    textAlign: 'center'
}

const previewChartStyle = {
    minHeight: '60vh', width: '100%'
}

const titleStyle = {
    backgroundColor: 'primary.main',
    color: '#FFF',
    mb: 2
}

export function UploadDatabase({filePath, open, handleClose}) {
    const [dataFrame, setDataFrame] = useState(null)
    const [xVariable, setXVariable] = useState("")
    const [yVariable, setYVariable] = useState("")

    useEffect(() => {
        if(filePath !== ""){
            window.electron.readDatabase(filePath).then(fileContent => {
                var fileBlob = new Blob([fileContent])
                readCSV(fileBlob).then(df => {
                    setDataFrame(df)                    
                })
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [filePath])

    useEffect(() => {
        if(dataFrame !== null && xVariable !== "" && yVariable !== ""){
            dataFrame.plot("preview-chart").line({
                config: { x: xVariable, y: yVariable },
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [xVariable, yVariable])

    const changeDtype = (name, value) => {
        try {
            setDataFrame(dataFrame.asType(name, value))
        } catch (error) {
            //TODO: emitir um alerta visual para o usuário
            console.log("Casting error:", error)
        }
    }

    const dtypeSelector = (name, value) => {
        return (
            <Select
                id={"variable-"+name}
                value={value}
                label={"Type selector "+value}
                onChange={(event) => changeDtype(name, event.target.value)}
                sx={{minWidth: "7rem"}}
            >
                {DTYPES.map(element => (
                    <MenuItem value={element}>{element}</MenuItem>
                ))}
            </Select>
        )
    }

    const handleChangeXVariable = (event) => {
        setXVariable(event.target.value)
    }

    const handleChangeYVariable = (event) => {
        setYVariable(event.target.value)
    }

    const handleSave = () => {
        var pathSplit = filePath.split('/')
        var filename = pathSplit[pathSplit.length-1]
        window.electron.saveDatabase(filename, toCSV(dataFrame)).then(response => {
            if(response.ok)
                handleClose()
            else
                console.log(response.msg)
        })
    }
    
    return (
        <Dialog
            maxWidth="lg"
            fullWidth
            open={open}
            onClose={handleClose}
        >
            <DialogTitle id="upload-database-dialog-title" sx={titleStyle}>
                <Typography variant="h5">Carregando uma Nova Base</Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item lg={6}>
                        <Typography variant="h6" fullWidth sx={sectionHeadersStyle}>Variáveis</Typography>
                    </Grid>        
                    <Grid item lg={6}>
                        <Typography variant="h6" fullWidth sx={sectionHeadersStyle}>Pré-Visualização</Typography>
                    </Grid>                   
                    <Grid item lg={6}>
                        <Paper elevation={3} sx={{maxHeight: "666px"}}>
                            <List>
                                {
                                    dataFrame !== null && dataFrame.columns.map(element => (
                                        <VariableItem 
                                            name={element} 
                                            dtypes={
                                                dtypeSelector(
                                                    element, 
                                                    dataFrame.dtypes[dataFrame.columns.indexOf(element)]
                                            )} 
                                        />
                                    ))
                                }
                            </List>
                        </Paper>
                    </Grid>
                    <Grid item container lg={6} spacing={2}>
                        <Grid item lg={6}>
                            <FormControl fullWidth>
                                <InputLabel id="x-axis-select-label">Eixo X:</InputLabel>
                                <Select
                                    labelId="x-axis-select-label"
                                    id="x-axis-select"
                                    value={xVariable}
                                    label="x-axis-variable"
                                    onChange={handleChangeXVariable}
                                >
                                    {
                                        dataFrame !== null && dataFrame.columns.map(element => (
                                            <MenuItem value={element}>{element}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={6}>
                            <FormControl fullWidth>
                                <InputLabel id="y-axis-select-label">Eixo Y:</InputLabel>
                                <Select
                                    labelId="y-axis-select-label"
                                    id="y-axis-select"
                                    value={yVariable}
                                    label="y-axis-variable"
                                    onChange={handleChangeYVariable}
                                >
                                    {
                                        dataFrame !== null && dataFrame.columns.map(element => (
                                            <MenuItem value={element}>{element}</MenuItem>
                                        ))
                                    }
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item lg={12}>
                            <Paper elevation={3} id='preview-chart' sx={previewChartStyle}>
                            </Paper>
                        </Grid>
                    </Grid>
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