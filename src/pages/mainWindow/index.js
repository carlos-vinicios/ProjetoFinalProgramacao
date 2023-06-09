import { useState, useEffect } from 'react';
import Grid from '@mui/material/Unstable_Grid2'; // Grid version 2
import { Button, Typography } from '@mui/material';
import List from '@mui/material/List'

import { DatabaseItem } from '../../components/DatabaseItem';
import { UploadDatabase } from '../../components/UploadDatabase';

const databaseListStyle = { 
    bgcolor: 'background.paper',
    borderRadius: '10px',
    border: '1px solid #d3d3d3',
    margin: 2,
    minHeight: "300px"
}

export function MainWindow() {
    const [databases, setDatabases] = useState([])
    const [uploadOpen, setUploadOpen] = useState(false)
    const [filePath, setFilePath] = useState("")
    
    const listDatabases = () => {
        window.electron.loadDatabases().then(databases => {
            setDatabases(databases)
        })
    }

    useEffect(() => {
        listDatabases()
    }, [])

    const loadDatabase = async () => {
        const dialogConfig = {
            title: 'Selecione um arquivo',
            buttonLabel: 'Selecionar',
            properties: ['openFile']
        };
        window.electron.openDialog('showOpenDialog', dialogConfig)
            .then(result => {
                setFilePath(result.filePaths[0]);
                setUploadOpen(true)
            });
    }
    
    const closeUploadDatabase = () => {
        setUploadOpen(false);
        listDatabases()
    }

    const handleDeleteDatabase = (databaseName) => {
        window.electron.deleteDatabase(databaseName).then(response => {
            if(response.ok){
                listDatabases()
            }
            console.log(response)
        })
    }

    return (
        <Grid container justifyContent='center' alignItems='center'>
            <Typography variant='h3'>Sistema de Análise de Curvas</Typography>
            <Grid item lg={10}>
                <List sx={databaseListStyle}>
                    {databases.map(database => (
                        <DatabaseItem 
                            databaseName={database} 
                            deleteCallback={handleDeleteDatabase}
                        />
                    ))}
                </List>
            </Grid>
            <Grid item lg={2} spacing={2}>
                <Button 
                    variant='contained' color='primary'
                    onClick={loadDatabase}
                    fullWidth
                    sx={{
                        height: "5rem"
                    }}
                >
                    Carregar Base
                </Button>
            </Grid>
            <UploadDatabase filePath={filePath} open={uploadOpen} handleClose={closeUploadDatabase} />
        </Grid>
    )
}