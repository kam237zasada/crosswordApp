import React from 'react';

import { connect } from 'react-redux';
import { getUser, userUpdate } from '../actions';
import { getCookie } from '../js'
import { baseURL } from '../apis';
import Message from './Message'



class Details extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            user:{},
            login: '',
            email: '',
            currentPassword: '',
            error: '',
            added: '',
            solved: '',
            approved: '',
            rejected:'',
            message: '',
            showMessage: false,
            isError: false
        }
    }

    componentDidMount = async () => {
        let token = getCookie("jwt_access");
        let id = getCookie('customerID');
        if(token) {
            try {
            await this.props.getUser(id, token);
            } catch(err) {
                return window.location.replace(`${baseURL}`)
            }
            this.setState({login: this.props.user.login});
            this.setState({email: this.props.user.email});
            this.setState({added: this.props.user.added.length});
            this.setState({solved: this.props.user.solved.length})
            let approved =0;
            let rejected =0;
            this.props.user.added.map( crossword => {
                if(crossword.isApproved) {
                    approved +=1;
                }
                else if(crossword.isRejected) {
                    rejected+=1
                }
            })
            this.setState({approved: approved});
            this.setState({rejected: rejected})
        }
        else {
            window.location.replace(`${baseURL}/login`)
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

    handleChange = async(e) => {
        this.setState({error: ''})
        switch(e.target.name) {
            case 'login':
            this.setState({login: e.target.value});
            break;
            case 'email':
            this.setState({email: e.target.value});
            break;
            case 'currentPassword':
            this.setState({currentPassword: e.target.value});
            break;
            default:
                break;
        }
    }

    handleUpdate = async e => {
        e.preventDefault();
        this.setState({error: ''})
        let token = getCookie("jwt_access");
        let id = getCookie('customerID')

        if(this.state.currentPassword==="") {
            return this.showMessage("You must type your current password to approve changes!", true)
        }
        try {
        await this.props.userUpdate(this.state.login, this.state.email, this.state.currentPassword, id, token)
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
                        <label>Email</label>
                        <input
                        type="email"
                        name="email"
                        value={this.state.email}
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
                        required
                        />
                        </div>
                        <button onClick={this.handleUpdate}className="form-button">UPDATE</button>
                    </div>
                </form>
                {this.state.error}

                <div>
                    Added crosswords: {this.state.added}
                </div>
                <div>
                    Approved crosswords: {this.state.approved}/{this.state.added}
                </div>
                <div>
                    Rejected crosswords: {this.state.rejected}/{this.state.added}
                </div>
                <div>
                    Solved crosswords: {this.state.solved}
                </div>
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
    { getUser, userUpdate }
    )(Details);