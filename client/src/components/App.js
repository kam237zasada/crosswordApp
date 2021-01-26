import React from 'react';
import { BrowserRouter as Router, Route, Switch } from 'react-router-dom';
import LandingPage from './LandingPage';
import CrosswordCreator from './CrosswordCreator';
import LoginPage from './LoginPage';
import Header from './Header';
import Account from './Account';
import CrosswordAdmin from './CrosswordAdmin';
import Crosswords from './Crosswords'
import Solving from './Solving'
import AccountActivation from './AccountActivation';
import MailRequired from './MailRequired';
import LoginProblems from './LoginProblems';
import PasswordReset from './PasswordReset';
import './index.css';


const App = () => {
    return (
        <>
        <Header/>
    <Router>
        <Switch>
            <Route path="/" exact component={LandingPage}/>
            <Route path="/create" exact component={CrosswordCreator}/>
            <Route path="/login" exact component={LoginPage}/>
            <Route path="/account" exact component={Account}/>
            <Route path="/account/:section" exact component={Account}/>
            <Route path="/admin/crossword/:id" exact component={CrosswordAdmin}/>
            <Route path="/crosswords" exact component={Crosswords}/>
            <Route path="/crosswords/:id" exact component={Solving}/>
            <Route path="/activation/:id/:token" exact component={AccountActivation}/>
            <Route path="/activate-now/:id" exact component={MailRequired}/>
            <Route path="/login-problems" exact component={LoginProblems}/>
            <Route path="/password-reset/:id/:token" exact component={PasswordReset}/>
        </Switch>
    </Router>
    </>
    );

};

export default App;