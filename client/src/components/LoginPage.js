import React from 'react'
import { connect } from 'react-redux';
import { userLogin, addUser } from '../actions';
import { baseURL } from '../apis/index';

class LoginPage extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            login: '',
            password: '',
            confirmPassword: '',
            email: '',
            switcher: 1,
            error:''

        }
    }

    handleSwitcher = e => {
        this.setState({error: ''})
        switch(e.target.name) {
            case 'signin':
                this.setState({switcher:1});
                break;
            case 'signup':
                this.setState({switcher:2});
                break;
            default:
                break;
        }
    }

    handleChange = e => {
        this.setState({error: ''})
        switch(e.target.name) {
            case 'login':
                this.setState({login: e.target.value});
                break;
            case 'password':
                this.setState({password: e.target.value});
                break;
            case 'confirmPassword': 
                this.setState({confirmPassword: e.target.value});
                break;
            case 'email':
                this.setState({email: e.target.value});
                break;
            default:
                break;
        }
    }

    handleSignIn = async e => {
        e.preventDefault();
        try {
            await this.props.userLogin(this.state.login, this.state.password);
                window.location.replace(`${baseURL}`)  
        } catch (err) {
            this.setState({error: err.response.data});
        }
    }

    handleSignUp = async e => {
        e.preventDefault();
        try {
            await this.props.addUser(this.state.login, this.state.password, this.state.confirmPassword, this.state.email);
            window.location.replace(`${baseURL}/activate-now/${this.props.user._id}`)
        } catch (err) {
            this.setState({error: err.response.data});
        }
    }

    render() {

        const login = (
            <form className="form" id="login-form">
                    <div className="form-container">
                        <div className="form-field">
                        <label>Login</label>
                        <input
                        type="text"
                        name="login"
                        value={this.state.login}
                        onChange={this.handleChange}
                        required
                        />
                        </div>
                        <div className="form-field">
                        <label>Password</label>
                        <input
                        type="password"
                        name="password"
                        onChange={this.handleChange}
                        value={this.state.password}
                        required
                        />
                        </div>
                        <button onClick={this.handleSignIn} className="form-button">SIGN IN</button>
                        <a className="hover" href={`${baseURL}/login-problems`}>Have problems with sign in?</a>
                    </div>
                </form>
        )

        const register = (
            <form className="form" id="login-form">
                    <div className="form-container">
                        <div className="form-field">
                        <label>Login</label>
                        <input
                        type="text"
                        name="login"
                        onChange={this.handleChange}
                        required
                        value={this.state.login}
                        />
                        </div>
                        <div className="form-field">
                        <label>Password</label>
                        <input
                        type="password"
                        name="password"
                        value={this.state.password}
                        onChange={this.handleChange}
                        required
                        />
                        </div>
                        <div className="form-field">
                        <label>Confirm Password</label>
                        <input
                        type="password"
                        name="confirmPassword"
                        onChange={this.handleChange}
                        required
                        />
                        <div className="form-field">
                        <label>Email</label>
                        <input
                        type="email"
                        name="email"
                        value={this.state.email}
                        onChange={this.handleChange}
                        required
                        />
                        </div>
                        </div>
                        <button onClick={this.handleSignUp}className="form-button">SIGN UP</button>
                    </div>
                </form>
        )
        return(
            <div className="container">
            <div className="content-container">
                <div className="login-switcher">
                    {this.state.switcher===1 ? <button className="button-active" name="signin" onClick={this.handleSwitcher}>SIGN IN</button> : <button name="signin" onClick={this.handleSwitcher}>SIGN IN</button>}
                    {this.state.switcher===2 ? <button className="button-active" name="signup" onClick={this.handleSwitcher}>CREATE ACCOUNT</button> : <button name="signup" onClick={this.handleSwitcher}>CREATE ACCOUNT</button>}
                </div>
                {this.state.switcher===1 ? login : register}
                {this.state.error}
            </div>
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { user: state.user };

};

export default connect(
    mapStateToProps,
    { userLogin, addUser }
    )(LoginPage);
