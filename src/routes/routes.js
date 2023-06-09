import { Route, Routes, BrowserRouter } from "react-router-dom";
import { MainWindow } from "../pages/mainWindow";
// import history from '../history';

function RoutesIndex() {
    return (
        <BrowserRouter>
            {/* <Routes history={history}> */}
            <Routes>
                <Route 
                    path="/" 
                    element={
                        <MainWindow />
                    }
                />
                <Route
                    path="main-window"
                    element={
                        <MainWindow />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesIndex;