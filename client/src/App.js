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
// import { useContext } from "react";

function App() {
  // const userContext = useContext(localStorage.getItem('user'))

  return (
    <Router>
      <Switch>
        {/* <userContext.Provider value={userContext}> */}
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          <Route exact path="/chat" component={Chat} />
        {/* </userContext.Provider> */}
      </Switch>
    </Router>
  );
}

export default App;
