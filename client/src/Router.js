import React, { Suspense } from "react";
import { BrowserRouter, Switch, Route } from "react-router-dom";
import Loader from "./components/Loader";
import { CssBaseline } from "@mui/material";
import Restaurant from "./components/Restaurant";

//imports are lazy loaded for better performance and to reduce size of bundle.
const HomePage = React.lazy(() => import("./pages/HomePage"));
const Login = React.lazy(() => import("./containers/Login"));
const Register = React.lazy(() => import("./containers/Register"));
const QueAns = React.lazy(() => import("./containers/QueAns"));
const Cipher = React.lazy(() => import("./containers/Cipher"));
const Chat = React.lazy(() => import("./containers/Chat"));
const Visualization = React.lazy(() => import("./containers/Visualization"));

function Router() {
  return (
    <>
      <CssBaseline />
      <BrowserRouter>
        <Suspense fallback={<Loader />}>
          <Switch>
            <Route
              exact
              path="/home"
              render={() => {
                return <HomePage />;
              }}
            />
            <Route
              exact
              path="/"
              render={() => {
                return <Login />;
              }}
            />
            <Route
              exact
              path="/register"
              render={() => {
                return <Register />;
              }}
            />
            <Route
              exact
              path="/queans"
              render={() => {
                return <QueAns />;
              }}
            />
            <Route
              exact
              path="/cipher"
              render={() => {
                return <Cipher />;
              }}
            />
            <Route
              exact
              path="/chatroom"
              render={() => {
                return <Chat />;
              }}
            />

            <Route
              exact
              path="/restaurant"
              render={() => {
                return <Restaurant />;
              }}
            />

            <Route
              exact
              path="/visualization"
              render={() => {
                return <Visualization />;
              }}
            />
          </Switch>
        </Suspense>
      </BrowserRouter>
    </>
  );
}

export default Router;
