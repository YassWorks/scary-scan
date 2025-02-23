import { Link } from "react-router-dom";

export const Navbar = () => {
    return (
        <nav id="nav">
            <Link to="/">Home</Link> | <Link to="/history">History</Link>
        </nav>
    );
};
