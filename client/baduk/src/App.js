import Daeguk from './component/Daeguk';
import Header from './component/Header';
import Main from './component/Main';
import EmptyPage from './component/EmptyPage';
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
    return (
        
        <BrowserRouter>
            <Header />
            <Routes>
                <Route exact path="/" element={<Main />} />
                <Route exact path="/daeguk" element={<Daeguk />} />
                <Route path="*" element={<EmptyPage />} />
            </Routes>
        </BrowserRouter>

    );
}

export default App;