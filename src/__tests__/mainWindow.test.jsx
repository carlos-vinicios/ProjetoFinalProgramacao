import { render, screen, act, waitFor } from '@testing-library/react'
import { MainWindow } from '../pages/mainWindow';
import { BrowserRouter } from 'react-router-dom';
import userEvent from '@testing-library/user-event';

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

test("Main Window load database clicked successfully", async () => {
    const mockedLoadDatabase = jest.fn(() => Promise.resolve([]));
    const mockedOpenDialog = jest.fn(() => Promise.resolve({
                                                    canceled: false, 
                                                    filePaths: ["/home/teste.csv"]
                                                }));

    const originalWindow = { ...window };
    window.electron = {
        "loadDatabases": mockedLoadDatabase,
        "openDialog": mockedOpenDialog
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
