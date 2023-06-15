import { useEffect, useState } from 'react';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { toCSV } from "danfojs"
import {
    Table, TableHead, TableBody, TableRow, 
    TableCell, Typography, Button, FormControlLabel, Checkbox
} from '@mui/material';

const titleStyle = {
    backgroundColor: 'primary.main',
    color: '#FFF',
    mb: 2
}

export function AnnotationExport({dataFrame, qtdCols, open, handleClose}) {
    const [selectedColumns, setSelectedColumns] = useState(Array(qtdCols).fill(true))

    const handleExport = () => {
        var filtredColums = []
        const dialogConfig = {
            title: 'Exportando a Base',
            buttonLabel: 'Salvar'
        };
        var dfCols = dataFrame.columns

        for(var i = 0; i < selectedColumns.length; i++){
            if(selectedColumns[i])
                filtredColums.push(dfCols[i])
        }

        window.electron.openDialog('showSaveDialog', dialogConfig)
            .then(result => {
                if(!result.canceled)
                    window.electron.exportDatabase(result.filePath, toCSV(dataFrame.loc({columns: filtredColums})))
                        .then(response => {
                            alert(response.msg)
                            if(response.ok)
                                handleClose()
                        })
            });
    }
    
    const handleSelectColumn = (colIndex) => {
        var newSelected = selectedColumns
        newSelected[colIndex] = !newSelected[colIndex]
        setSelectedColumns(newSelected)
    }

    return (
        <Dialog
            maxWidth="lg"
            fullWidth
            open={open}
            onClose={handleClose}
        >
            <DialogTitle id="upload-database-dialog-title" sx={titleStyle}>
                <Typography variant="h5">Exportando a Base</Typography>
            </DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item lg={12}>
                    {
                        (dataFrame) && (
                            <Table>
                                <TableHead>
                                    <TableRow>
                                        {dataFrame.columns.map((element, index) => (
                                            <TableCell>
                                                <FormControlLabel
                                                    label={element}
                                                    control={
                                                        <Checkbox
                                                            checked={selectedColumns[index]}
                                                            onChange={() => handleSelectColumn(index)}
                                                        />
                                                    }
                                                />                                       
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody>
                                    {dataFrame.head(40).values.map(dataRow =>(
                                        <TableRow>
                                            {dataRow.map(element => (
                                                <TableCell>{element}</TableCell>
                                            ))}
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        )
                    }
                    </Grid>        
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button variant='contained' color='primary' onClick={handleExport}>
                    Exportar
                </Button>
            </DialogActions>
        </Dialog>
    )
}