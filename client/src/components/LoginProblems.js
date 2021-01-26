import React from 'react';
import { connect } from 'react-redux';
import { passwordReminder, resendActivation } from '../actions'


class LoginProblems extends React.Component {

    constructor(props) {
        super(props);
        this.state = {
            email: '',
            message: ''
        }
    }

    handleChange = e => {
        this.setState({message: ''})
        if(e.target.name==="email") {
            this.setState({email: e.target.value})
        }
    }

    handleForgot = async e => {
        e.preventDefault();
        this.setState({message: ''})
        if(this.state.email==='') {
            return this.setState({message: 'You have to type your email!'})
        }
        try {
            await this.props.passwordReminder(this.state.email);
            this.setState({message: this.props.user})
        } catch(err) {
            return this.setState({message: err.response.data})
        }

    }

    handleResend = async e => {
        e.preventDefault();
        this.setState({message: ''});
        if(this.state.email==='') {
            return this.setState({message: 'You have to type your email!'})
        }
        try {
            await this.props.resendActivation(this.state.email);
            this.setState({message: this.props.user})
        } catch(err) {
            return this.setState({message: err.response.data})
        }

    }

    render() {
        return (
            <div className="container">
                <div className="content-container"> 
                    <form className="form">
                        <div className="form-container">
                            <div className="form-field">
                                <label>Type your email and choose an action</label>
                                <input
                                type="text"
                                required="true"
                                name="email"
                                placeholder="Type your email"
                                onChange={this.handleChange}
                                />
                            </div>
                            <div className="flex">
                                <button onClick={this.handleForgot} className="form-button">FORGOT PASSWORD</button>
                                <button onClick={this.handleResend} className="form-button">RESEND ACTIVATION</button>
                            </div>
                        </div>
                    </form>
                    {this.state.message}
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
    { passwordReminder, resendActivation }
    )(LoginProblems);