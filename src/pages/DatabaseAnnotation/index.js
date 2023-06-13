import { useState, useEffect} from "react";
import { useNavigate } from "react-router-dom";
import { readCSV } from "danfojs"
import { 
    MenuItem, Paper, Select, FormControl, 
    InputLabel, Typography, Button, Table, TableHead, 
    TableCell, TableRow, TableBody, IconButton, List,
    TextField, Grid, ListItem
} from '@mui/material';

import EditIcon from '@mui/icons-material/Edit';
import ArrowBackIosIcon from '@mui/icons-material/ArrowBackIos';
import { AnnotionClass } from "../../components/AnnotationClass";

const mainChartStyle = {
    minHeight: '55vh', width: '100%'
}

const databasePreviewStyle = {
    minHeight: '20vh', width: '100%',
    maxHeight: '20vh', overflow: 'auto',
    mt: 2
}

const databaseTitleStyle = {
    textAlign: 'center',
    mt: 2, mb: 2
}

const selectedPointListStyle = {
    maxHeight: '30vh', overflow: 'auto',
    height: '30vh',
    border: '1px solid #ccc',
    borderRadius: '10px',
}

const commentsStyle = {
    height: '10vh'
}

const selectedItemsStyle = {
    lineHeight: '1.5',
}

const backButtonStyle = {
    position: 'absolute',
    top: '1rem', left: '1rem'
}

export function DatabaseAnnotation(){
    const navigate = useNavigate();

    const [databaseFilename, setDatabaseFilename] = useState("");
    const [dataFrame, setDataFrame] = useState(null);
    const [newClassOpen, setNewClassOpen] = useState(false);

    const [xVariable, setXVariable] = useState("");
    const [yVariable, setYVariable] = useState("");
    
    const [classes, setClasses] = useState({});
    const [renderedClasses, setRenderedClasses] = useState([]);
    const [dataClass, setDataClass] = useState("");
    const [selectedPoints, setSelectedPoints] = useState([]);
    const [coments, setComents] = useState("");
    
    const mainPlot = window.document.getElementById("main-chart");

    useEffect(() => {
        if(mainPlot && xVariable && yVariable && dataFrame){
            mainPlot.on('plotly_selected', function(data){
                setSelectedPoints(data.points)
            });
        }
    })

    useEffect(() => {
        var filename = localStorage.getItem("databaseFilename")
        if(filename)
            setDatabaseFilename(filename)
    }, [])

    useEffect(() => {
        if(databaseFilename !== ""){
            window.electron.readDatabase(databaseFilename).then(fileContent => {
                var fileBlob = new Blob([fileContent])
                readCSV(fileBlob).then(df => {
                    setDataFrame(df)
                })
            })
            window.electron.readClasses(databaseFilename).then(classes => {
                setClasses(classes)
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [databaseFilename])

    useEffect(() => {
        if(dataFrame !== null && xVariable !== "" && yVariable !== ""){
            dataFrame.plot("main-chart").scatter({
                config: { x: xVariable, y: yVariable },
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps 
    }, [xVariable, yVariable])

    useEffect(() => {
        var classLabels = []
        if(Object.keys(classes).length > 0){
            for(const key in classes)
                for(var cat_index in classes[key].categories)
                    classLabels.push(`${key} - ${classes[key].categories[cat_index]}`)
            setRenderedClasses(classLabels)
        }
    }, [classes])

    const handleChangeXVariable = (event) => {
        setXVariable(event.target.value)
    }

    const handleChangeYVariable = (event) => {
        setYVariable(event.target.value)
    }

    const createPreviewTable = () => {
        if(dataFrame !== null){
            var head = dataFrame.head(10)
            return (
                <Table>
                    <TableHead>
                        <TableRow>
                            {head.columns.map(element => (
                                <TableCell>{element}</TableCell>
                            ))}
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {head.values.map(dataRow =>(
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
    }

    const renderSelectedPoints = () => {
        if(selectedPoints.length > 0){
            return (
                selectedPoints.map(point => (
                    <ListItem>
                        <Typography variant="p" sx={selectedItemsStyle}>
                            <b>{xVariable}</b>: {point.x}<br></br>
                            <b>{yVariable}</b>: {point.y}
                        </Typography>
                    </ListItem>
                ))
            )
        }
    
    }

    const backToMainPage = () => {
        navigate('/main-window')
    }

    const openDialogNewClass = () => {
        setNewClassOpen(true);
    }

    const closeDialogNewClass = () => {
        setNewClassOpen(false);
    }

    const newClass = (className, dtype, categories) => {
        var newClasses = {...classes}
        newClasses[className] = {
            type: dtype,
            categories: categories
        }
        setClasses(newClasses)
        window.electron.saveClasses(newClasses, databaseFilename).then(r => console.log(r))
    }

    const removeClass = (classToRemove) => {
        var newClasses = {...classes}
        delete newClasses[classToRemove]
        setClasses(newClasses)
        window.electron.saveClasses(newClasses, databaseFilename).then(r => console.log(r))
    }

    const handleChangeDataClass = (event) => {
        setDataClass(event.target.value)
    }

    return (
        <Grid container lg={12} md={12} sm={12} xs={12} spacing={2} pl={2}>
            <IconButton 
                edge="end" aria-label="add-new-class" 
                variant="contained" color="primary"
                sx={backButtonStyle}
                onClick={backToMainPage}
            >
                <ArrowBackIosIcon />
            </IconButton>
            <Grid item lg={12} md={12} sm={12} xs={12}>
                <Typography variant="h4" sx={databaseTitleStyle}>{databaseFilename}</Typography>
            </Grid>
            <Grid item container lg={9} md={9} sm={9} xs={9} spacing={2}>
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
                    <Paper elevation={3} sx={databasePreviewStyle} id='table-view'>
                        {createPreviewTable()}
                    </Paper>
                </Grid>
            </Grid>
            <Grid item container lg={3} md={3} sm={3} xs={3} spacing={2}>
                <Grid item container lg={12} md={12} sm={12} xs={12} spacing={2}>
                    <Grid item lg={10} md={10} sm={10} xs={10}>
                        <FormControl fullWidth>
                            <InputLabel id="class-select-label">Classe</InputLabel>
                            <Select
                                labelId="class-select-label"
                                id="class-select"
                                value={dataClass}
                                label="class-select"
                                onChange={handleChangeDataClass}
                                >
                                {
                                    dataFrame !== null && renderedClasses.map(element => (
                                        <MenuItem value={element}>{element}</MenuItem>
                                    ))
                                }
                            </Select>
                        </FormControl>
                    </Grid>
                    <Grid item lg={2}>
                        <IconButton 
                            edge="end" aria-label="add-new-class" 
                            variant="contained" color="primary"
                            onClick={openDialogNewClass}
                        >
                            <EditIcon />
                        </IconButton>
                    </Grid>
                    <Grid item lg={12}>
                        <Typography variant="h6">Pontos Selecionados:</Typography>
                        <List sx={selectedPointListStyle}>
                            {renderSelectedPoints()}
                        </List>
                    </Grid>
                    <Grid item lg={12}>
                        <TextField
                            id="comments-text-area"
                            label="Comentários"
                            multiline
                            fullWidth
                            maxRows={10}
                            inputProps={{
                                style: commentsStyle,
                            }}
                        />
                    </Grid>
                </Grid>
                <Grid item lg={12}>
                    <Button 
                        variant='contained' color='primary'
                        // onClick={exportDatabase}
                        fullWidth
                        sx={{
                            height: "5rem"
                        }}
                    >
                        Exportar Anotações
                    </Button>
                </Grid>
            </Grid>
            <AnnotionClass 
                open={newClassOpen} 
                handleClose={closeDialogNewClass} 
                classes={classes}
                addNewClass={newClass}
                removeClass={removeClass}
            />
        </Grid>
    )
}