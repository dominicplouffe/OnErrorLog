import React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import "./styles/nav.css";
import "./styles/oel.css";

import Login from "./dashboard/pages/Login";
import Logout from "./dashboard/pages/Logout";
import Registration from "./dashboard/pages/Registration";
import AcceptInvite from "./dashboard/pages/AcceptInvite";
import AuthProvider from "./auth/AuthProvider";
import { DashboardRoute } from "./auth/AuthRoute";
import Ping from "./dashboard/pages/Pings";
import PingScreen from "./dashboard/pages/PingScreen";
import PingSummary from "./dashboard/pages/PingSummary";

import Pong from "./dashboard/pages/Pongs";
import PongScreen from "./dashboard/pages/PongScreen";
import PongSummary from "./dashboard/pages/PongSummary";

import Vitals from "./dashboard/pages/Vitals";
import VitalSummary from "./dashboard/pages/VitalSummary";

import Team from "./dashboard/pages/Team";
import Schedule from "./dashboard/pages/Schedule";

import { NewPing, NewPong } from "./dashboard/pages/NewPing";
import Profile from "./dashboard/pages/Profile";
import Failure from "./dashboard/pages/Failure";

import MetricConditionScreen from "./dashboard/pages/MetricConditionScreen";
import MetricConditionSummary from "./dashboard/pages/MetricConditionSummary";

import Dashboard from "./dashboard/pages/Dashboard";
import NewMonitor from "./dashboard/pages/NewMonitor";

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

const AppRoutes = () => {
  return (
    <Switch>
      <Route path="/auth">
        <AuthRoutes />
      </Route>

      <DashboardRoute path="/dashboard" component={Dashboard} exact={true} />

      <DashboardRoute
        path="/newmonitor"
        component={NewMonitor}
        exact={true}
        admin
      />

      <DashboardRoute path="/profile" component={Profile} exact={true} />
      <DashboardRoute path="/pings" component={Ping} />
      <DashboardRoute path="/pongs" component={Pong} />

      <DashboardRoute path="/team" component={Team} exact={true} admin />
      <DashboardRoute
        path="/schedule"
        component={Schedule}
        exact={true}
        admin
      />
      <DashboardRoute path="/ping" component={PingScreen} exact={true} admin />
      <DashboardRoute
        path="/ping/:id"
        component={PingScreen}
        exact={true}
        admin
      />
      <DashboardRoute path="/newping" component={NewPing} exact={true} admin />
      <DashboardRoute
        path="/ping/summary/:id"
        component={PingSummary}
        exact={true}
      />

      <DashboardRoute path="/newpong" component={NewPong} exact={true} admin />
      <DashboardRoute path="/pong" component={PongScreen} exact={true} admin />
      <DashboardRoute
        path="/pong/:id"
        component={PongScreen}
        exact={true}
        admin
      />
      <DashboardRoute
        path="/pong/summary/:id"
        component={PongSummary}
        exact={true}
      />

      <DashboardRoute path="/vitals" component={Vitals} exact={true} />
      <DashboardRoute
        path="/vitals/:id"
        component={VitalSummary}
        exact={true}
      />
      <DashboardRoute
        path="/vital/:instanceId/condition/:id"
        component={MetricConditionScreen}
        exact={true}
      />
      <DashboardRoute
        path="/vital/:instanceId/condition/summary/:id"
        component={MetricConditionSummary}
        exact={true}
      />

      <DashboardRoute exact path="/">
        <Redirect to="/dashboard" />
      </DashboardRoute>

      <DashboardRoute
        exact
        path="/failure/:id/:otype/:oid"
        component={Failure}
      />
    </Switch>
  );
};

const AuthRoute = ({ component: Component, ...props }) => {
  return <Component {...props} />;
};

const AuthRoutes = () => {
  return (
    <Switch>
      <AuthRoute path={`/auth/login`} component={Login} />
      <AuthRoute path={"/auth/logout"} component={Logout} />
      <AuthRoute path={"/auth/register"} component={Registration} />
      <AuthRoute path={`/auth/accept-invite`} component={AcceptInvite} />
    </Switch>
  );
};

export default App;
