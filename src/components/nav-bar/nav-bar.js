import { Link } from "react-router-dom";
import "./nav-bar.css";
import logo from "../../assets/logo.png";

const Navbar = () => {
  return (
    <div className="Navbar">
      <img className="logo" src={logo} />
      <div className="nav-items">
        <Link className="nav-item-link" to="/topMovies">
          <div className="nav-item">Movies</div>
        </Link>
        <Link className="nav-item-link" to="/upload">
          <div className="nav-item">Upload Video</div>
        </Link>
        <Link className="nav-item-link" to="/about">
          <div className="nav-item">About</div>
        </Link>
      </div>
    </div>
  );
};

export { Navbar };
