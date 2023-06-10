import { useState, useEffect} from "react";
import Grid from "@mui/material/Unstable_Grid2/Grid2";
import { readCSV, toCSV } from "danfojs"
import { 
    MenuItem, Paper, Select, FormControl, 
    InputLabel, Typography, Button 
} from '@mui/material';

const mainChartStyle = {
    minHeight: '55vh', width: '100%'
}

const databasePreviewStyle = {
    minHeight: '20vh', width: '100%',
    mt: 2
}

const databaseTitleStyle = {
    textAlign: 'center',
    mt: 2,
    mb: 2
}

export function DatabaseAnnotation(){
    const [databaseFilename, setDatabaseFilename] = useState("");
    const [dataFrame, setDataFrame] = useState(null);
    const [xVariable, setXVariable] = useState(null);
    const [yVariable, setYVariable] = useState(null);
    
    useEffect(() => {
        var filename = localStorage.getItem("databaseFilename")
        if(filename)
            setDatabaseFilename(filename)
    })

    useEffect(() => {
        if(databaseFilename !== ""){
            window.electron.readDatabase(databaseFilename).then(fileContent => {
                var fileBlob = new Blob([fileContent])
                readCSV(fileBlob).then(df => {
                    setDataFrame(df)                    
                })
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [databaseFilename])

    useEffect(() => {
        if(dataFrame !== null && xVariable !== "" && yVariable !== ""){
            dataFrame.plot("preview-chart").line({
                config: { x: xVariable, y: yVariable },
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [xVariable, yVariable])

    const handleChangeXVariable = (event) => {
        setXVariable(event.target.value)
    }

    const handleChangeYVariable = (event) => {
        setYVariable(event.target.value)
    }

    return (
        <Grid container lg={12} md={12} sm={12} xs={12} spacing={2} pl={2}>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography variant="h4" sx={databaseTitleStyle}>{databaseFilename}</Typography>
            </Grid>
            <Grid item container lg={9} md={9} sm={9} xs={9}>
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
                    <Paper elevation={3} id='main-chart' sx={mainChartStyle}>
                    </Paper>
                </Grid>
                <Grid item lg={12}>
                    <Typography variant="p">Visualização da Base Anotada:</Typography>
                    <Paper elevation={3} sx={databasePreviewStyle}>

                    </Paper>
                </Grid>
            </Grid>
            <Grid item lg={3} md={3} sm={3} xs={3}>
                <Button 
                    variant='contained' color='primary'
                    // onClick={loadDatabase}
                    fullWidth
                    sx={{
                        height: "5rem"
                    }}
                >
                    Exportar Anotações
                </Button>
            </Grid>
        </Grid>
    )
}