import { useState, useEffect } from 'react';
import { Button, Typography, Grid } from '@mui/material';
import List from '@mui/material/List';

import { DatabaseItem } from '../../components/DatabaseItem';
import { UploadDatabase } from '../../components/UploadDatabase';
import AlertDialog from '../../components/AlertDialog';

const databaseListStyle = { 
    bgcolor: 'background.paper',
    borderRadius: '10px',
    border: '1px solid #d3d3d3',
    width: '99%',
    height: '86vh',
    maxHeight: '86vh',
    ml: 2
}

const headerTitleStyle = {
    textAlign: "center",
    m: 2
}

export function MainWindow() {
    const [databases, setDatabases] = useState([])
    const [uploadOpen, setUploadOpen] = useState(false)
    const [filePath, setFilePath] = useState("")

    const [deleteDialog, setDeleteDialog] = useState({open: false, databaseName: ""});

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
                if(!result.canceled){
                    setFilePath(result.filePaths[0]);
                    setUploadOpen(true)
                }
            });
    }
    
    const closeUploadDatabase = () => {
        setUploadOpen(false);
        listDatabases()
    }

    const deleteDatabaseFile = () => {
        if(deleteDialog.databaseName === ""){
            console.log("Falha na remoção do arquivo, nome da base não informado")
            return
        }
         
        window.electron.deleteDatabase(deleteDialog.databaseName).then(response => {
            if(response.ok)
                listDatabases()
            
            setDeleteDialog({open: false, databaseName: ""})
            alert(response.msg)
        })
    }
    
    const handleDeleteDatabase = (databaseName) => {
        setDeleteDialog({open: true, databaseName})
    }

    const handleCloseDeleteDialog = (option) => {
        if(option){
            deleteDatabaseFile()
        }
        setDeleteDialog({open: false, databaseName: ""})
    }

    return (
        <Grid container spacing={2}>
            <Grid item lg={12}>
                <Typography variant='h3' sx={headerTitleStyle}>Sistema de Análise de Curvas</Typography>
            </Grid>
            <Grid item lg={10}>
                <List sx={databaseListStyle}>
                    {databases.map(database => (
                        <DatabaseItem 
                            databaseName={database} 
                            deleteCallback={handleDeleteDatabase}
                            key={database}
                        />
                    ))}
                </List>
            </Grid>
            <Grid item lg={2}>
                <Button 
                    variant='contained' color='primary'
                    onClick={loadDatabase}
                    fullWidth
                    sx={{
                        height: "5rem"
                    }}
                    data-testid="loadDatabaseButton"
                >
                    Carregar Base
                </Button>
            </Grid>
            <UploadDatabase filePath={filePath} open={uploadOpen} handleClose={closeUploadDatabase} />
            <AlertDialog 
                title="Remover base de dados"
                description="Vocé tem certeza que deseja remover esta base de dados?" 
                open={deleteDialog.open} 
                handleClose={handleCloseDeleteDialog}
            />
        </Grid>
    )
}