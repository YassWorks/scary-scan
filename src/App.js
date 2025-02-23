import "./App.css";
import { Navbar } from "./Navbar";
import { Home } from "./pages/home/Home";
import { History } from "./pages/history/History";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

function App() {
    return (
        <Router>
            <Navbar />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/history" element={<History />} />
            </Routes>
        </Router>
    );
}

export default App;
