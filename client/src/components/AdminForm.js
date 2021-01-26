import React from 'react';
import { connect } from 'react-redux';
import { getCookie } from '../js';
import { getUsersByQuery, manageAdmin } from '../actions';
import Confirmation from './Confirmation'
import Message from './Message'

class AdminForm extends React.Component{
    constructor(props) {
        super(props)
        this.state = {
            query: '',
            error: '',
            users: [],
            confirm: false,
            user: '',
            userID: '',
            password: '',
            message: '',
            showMessage: false,
            isError: false
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

    handleSearch = async e => {
        e.preventDefault();
        this.setState({users: []})
        if(this.state.query=="") {
            return this.showMessage("You must type query condition", true)
        }
        try {
        await this.props.getUsersByQuery(this.state.query)
        await this.setState({users: this.props.users})

        } catch(err) {
            this.showMessage(err.response.data, true)
        }

    }

    handleConfirm = async e => {
        let target = e.target;
        await this.setState({user: target.name})
        await this.setState({userID: target.id})
        this.setState({confirm: true})
    }

    handleAppoint = async e => {
        e.preventDefault();
        let token = getCookie("jwt_access");
        try {
        await this.props.manageAdmin(this.state.userID, this.state.password, token, "add")
        this.props.showMessage(this.props.user);
        this.props.handleUpdate();

        } catch (err) {
            this.showMessage(err.response.data, true)
        }


    }

    handleClose = e => {
        e.preventDefault();
        this.setState({confirm: false})
    }

    handleChange = e => {
        this.setState({error: ''})
        switch(e.target.name) {
            case 'query':
                this.setState({query: e.target.value});
                break;
            case 'password':
                this.setState({password: e.target.value});
                break;
            default:
                break;
        }

    }

    renderUsers = () => {
        return this.state.users.map(user => {
            return <div className="query-users-element"><div>{user.login}</div> <button id={user._id} name={user.login} onClick={this.handleConfirm}className="form-button">+</button></div>
        })
    }

    render() {
        return (
            <>
            <form className="admin-form">
                <input
                name="query"
                placeholder="Search for users"
                onChange={this.handleChange}/>
                <button className="form-button" onClick={this.handleSearch}>SEARCH</button>
                {this.state.error}
            </form>
            {this.state.users.length>0 ? <div className="query-users-container">{this.renderUsers()}</div> : null}
            {this.state.confirm ? <Confirmation user={this.state.user} handleChange={this.handleChange} handleConfirm={this.handleAppoint} handleClose={this.handleClose} /> : null}
            {this.state.showMessage ? <Message message={this.state.message} isError={this.state.isError}/> : null}
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return { users: state.users, user: state.user };

};

export default connect(
    mapStateToProps,
    { getUsersByQuery, manageAdmin }
    )(AdminForm);
