import './App.css';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";
import Login from './component/login/Login';
import Register from './component/register/Register';
import Chat from './component/chat/Chat';

import 'antd/dist/antd.css';
import { StateMachineProvider, createStore } from 'little-state-machine';
import user from './component/store/user';


createStore(user);

function App() {

  return (
    <Router>
      <StateMachineProvider>
        <Switch>
          {/* <userContext.Provider value={userContext}> */}
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/chat" component={Chat} />

          {/* </userContext.Provider> */}
        </Switch>
      </StateMachineProvider>
    </Router>
  );
}

export default App;
