import React from 'react';
import { connect } from 'react-redux';
import { getUser, passwordUpdate } from '../actions';
import { getCookie } from '../js'
import { baseURL } from '../apis';
import Message from './Message'



class ChangePassword extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user:{},
            newPassword: '',
            confirmNewPassword: '',
            currentPassword: '',
            error: '',
            message: '',
            showMessage: false
        }
    }

    componentDidMount = async () => {
        let token = getCookie("jwt_access");
        let id = getCookie('customerID')
        if(token) {
            await this.props.getUser(id, token);
        }
        else {
            window.location.replace(`${baseURL}/login`)
        }
    }

    handleChange = async(e) => {
        this.setState({error: ''})
        switch(e.target.name) {
            case 'newPassword':
            this.setState({newPassword: e.target.value});
            break;
            case 'confirmNewPassword':
            this.setState({confirmNewPassword: e.target.value});
            break;
            case 'currentPassword':
            this.setState({currentPassword: e.target.value});
            break;
            default:
                break;
        }
    }

    showMessage = async (message, isError) => {
        this.setState({message: message});
        if(isError) {
        this.setState({isError: isError})
        } else {
        
        this.setState({isError: false})
        }
        this.setState({showMessage: true});
        setTimeout( () => {
            this.setState({showMessage: false})
            this.setState({message: ''})
        }, 5000);
    }

    handleUpdate = async e => {
        e.preventDefault();
        this.setState({error: ''})
        let token = getCookie("jwt_access");
        let id = getCookie('customerID');

        if(this.state.currentPassword==="") {
            return this.showMessage("You must type your current password to approve changes!", true)
        }
        try {
        await this.props.passwordUpdate(this.state.newPassword, this.state.confirmNewPassword, this.state.currentPassword, id, token)
        this.showMessage(this.props.user)
        } catch (err) {
            return this.showMessage(err.response.data, true)
        }
    }

    render() {

        return (
            <div className="details-section">
                <form className="form" id="update-form">
                    <div className="form-container">
                        <div className="form-field">
                        <label>New Password</label>
                        <input
                        type="password"
                        name="newPassword"
                        onChange={this.handleChange}
                        placeholder="Type your new password..."
                        required
                        />
                        </div>
                        <div className="form-field">
                        <label>Confirm New Password</label>
                        <input
                        type="password"
                        name="confirmNewPassword"
                        placeholder="Confirm your new password..."
                        onChange={this.handleChange}
                        required
                        />
                        </div>
                        <div className="form-field">
                        <label>Current password</label>
                        <input
                        type="password"
                        name="currentPassword"
                        onChange={this.handleChange}
                        placeholder="Type your current password..."
                        required
                        />
                        </div>
                        <button onClick={this.handleUpdate}className="form-button">UPDATE</button>
                    </div>
                </form>
                {this.state.error}
                {this.state.showMessage ? <Message message={this.state.message} isError={this.state.isError}/> : null}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { user: state.user };

};

export default connect(
    mapStateToProps,
    { getUser, passwordUpdate }
    )(ChangePassword);