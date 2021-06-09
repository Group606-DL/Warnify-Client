import "./App.css";
import { Navbar } from "./components/nav-bar/nav-bar";
import { UploadFile } from "./components/upload-file/upload-file";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import TopMovies from "./components/TopMovies";
import About from "./components/About";

const App = () => {
  return (
    <BrowserRouter>
      <div className="App">
        <Navbar />
        <div className="App-Body">
          <Switch>
            <Route exact path="/">
              <TopMovies />
            </Route>
            <Route exact path="/topMovies">
              <TopMovies />
            </Route>
            <Route exact path="/upload">
              <UploadFile />
            </Route>
            <Route ex path="/about">
              <About />
            </Route>
          </Switch>
        </div>
      </div>
      <div className="App-Background" />
    </BrowserRouter>
  );
};

export { App };
