import { Route, Routes, BrowserRouter } from "react-router-dom";
import { MainWindow } from "../pages/mainWindow";
import { DatabaseAnnotation } from "../pages/DatabaseAnnotation";
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
                <Route
                    path="database-annotation"
                    element={
                        <DatabaseAnnotation />
                    }
                />
            </Routes>
        </BrowserRouter>
    );
}

export default RoutesIndex;