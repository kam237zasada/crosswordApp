import React from 'react';
import { connect } from 'react-redux';
import { resetPassword } from '../actions'

class PasswordReset extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            password: '',
            confirmPassword: '',
            message: ''
        }
    }

    handleChange = e => {
        this.setState({message: ''})
        switch(e.target.name) {
            case 'password':
                this.setState({password: e.target.value})
                break;
            case 'confirmPassword':
                this.setState({confirmPassword: e.target.value});
                break;
            default:
                break;
        }
    }

    resetPassword = async e => {
        e.preventDefault();
        try {
            await this.props.resetPassword(this.props.match.params.id, this.props.match.params.token, this.state.password, this.state.confirmPassword);
            this.setState({message: this.props.user});
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
                                <label>New password</label>
                                <input
                                type="password"
                                required="true"
                                name="password"
                                onChange={this.handleChange}
                                />
                            </div>
                            <div className="form-field">
                                <label>Confirm new password</label>
                                <input
                                type="password"
                                required="true"
                                name="confirmPassword"
                                onChange={this.handleChange}
                                />
                            </div>
                                <button onClick={this.resetPassword} className="form-button">SEND</button>
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
    { resetPassword }
    )(PasswordReset);