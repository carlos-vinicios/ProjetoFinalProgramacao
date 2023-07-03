import { render, screen, act, waitFor } from '@testing-library/react'
import { MainWindow } from '../pages/mainWindow';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';
import { readCSV } from "danfojs"

test("Main Window renders successfully", async () => {
    const mockedLoadDatabase = jest.fn(() => Promise.resolve([]));
    const originalWindow = { ...window };
    window.electron = {
        "loadDatabases": mockedLoadDatabase
    };

    await act( async () => render(<MainWindow/>));
    
    const titleElement = screen.getByText(/Sistema de Análise de Curvas/i);

    expect(titleElement).toBeInTheDocument();

    window = originalWindow;
})

test("Main Window renders with database successfully", async () => {
    // const mockedUsedNavigate = jest.fn();

    // jest.mock('react-router-dom', () => ({
    //     ...jest.requireActual('react-router-dom'),
    //     useNavigate: () => mockedUsedNavigate,
    // }));

    const mockedLoadDatabase = jest.fn(() => Promise.resolve([
        "WELL-00001_20170201020207.csv"
    ]));

    const originalWindow = { ...window };
    window.URL = {
        createObjectURL: jest.fn()
    };
    window.electron = {
        "loadDatabases": mockedLoadDatabase
    };
    
    await act( async () => render(
        <BrowserRouter>
            <MainWindow/>
        </BrowserRouter>
    ));
    
    const titleElement = screen.getByText(/Sistema de Análise de Curvas/i);
    const databaseElement = screen.getByText(/WELL-00001_20170201020207.csv/i);

    expect(titleElement).toBeInTheDocument();
    expect(databaseElement).toBeInTheDocument();
    
    window = originalWindow;
})

jest.mock('danfojs', () => ({
    readCSV: jest.fn()
}));

test("Main Window load database clicked successfully", async () => {
    const mockedLoadDatabase = jest.fn(() => Promise.resolve([]));
    const mockReadDatabase = jest.fn(() => Promise.resolve("t1,t2,t3\nt1,t2,t3\n"));
    const mockedOpenDialog = jest.fn(() => Promise.resolve({
                                                    canceled: false, 
                                                    filePaths: ["/home/teste.csv"]
                                                }));
                                                
    readCSV.mockReturnValue(Promise.resolve({
        columns: ["t1", "t2", "t3"], 
        values: ['t1', 't2', 't3'],
        dtypes: ['int32', 'int32', 'int32']
    }));
                                                
    const originalWindow = { ...window };
    window.electron = {
        "loadDatabases": mockedLoadDatabase,
        "openDialog": mockedOpenDialog,
        "readDatabase": mockReadDatabase
    };
    
    await act( async () => {
        render(<MainWindow/>)
    });
    
    await act( async () => {
        const openDialog = await waitFor(() => screen.getByRole('button'));
        await userEvent.click(openDialog)
    })

    expect(mockedOpenDialog).toHaveBeenCalled();
    
    window = originalWindow;
})

test("Main Window delete database clicked successfully", async () => {
    const mockedLoadDatabase = jest.fn(() => Promise.resolve([
        "WELL-00001_20170201020207.csv"
    ]));

    const originalWindow = { ...window };
    window.electron = {
        "loadDatabases": mockedLoadDatabase
    };
    
    await act( async () => render(
        <BrowserRouter>
            <MainWindow/>
        </BrowserRouter>
    ));

    await act( async () => {
        const openDialog = await waitFor(() => screen.getByLabelText(/delete/i));
        await userEvent.click(openDialog)
    })

    const deleteMessage = screen.getByText(/Vocé tem certeza que deseja remover esta base de dados?/i);
    expect(deleteMessage).toBeInTheDocument();

    window = originalWindow;
})
