import React from 'react';
import { connect } from 'react-redux';
import { getUnapprovedCrosswords, getAdmins, manageAdmin, getUserById, getUser } from '../actions';
import { getCookie, getDate } from '../js';
import AdminForm from './AdminForm';
import Confirmation from './Confirmation';
import Message from './Message'
import { baseURL } from '../apis';

class AccountAdministration extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            section: 'admins',
            unapr: [],
            admins: [],
            empty:'',
            add: false,
            update: false,
            userID: '',
            user: '',
            confirm: false,
            password: '',
            message: '',
            showMessage: false,
            fetchedUser: {},
            details: false,
            userDateCr: '',
            isError: false,
            adminsError: ''
        }
    }

    componentDidUpdate = async () => {
        let token = getCookie('jwt_access')
        if(this.state.update) {
            try {
            await this.props.getAdmins(token);
            this.setState({admins: this.props.users})
            } catch(err) {
                this.setState({empty: err.response.data})
            }
            this.setState({update: false})
        }
    }

    componentDidMount = async () => {
        let token = getCookie('jwt_access');
        let id = getCookie('customerID')
    
        if(token) {
            try {
                await this.props.getUser(id, token);
                if(this.props.user.isAdmin===false) {
                    return window.location.replace(`${baseURL}`)
                }
            } catch(err) {
                return window.location.replace(`${baseURL}/login`)
            }
        }
        try {
            await this.props.getUnapprovedCrosswords(token);
        this.setState({unapr: this.props.crosswords});
        } catch (err) {
            this.setState({empty: err.response.data})
        }

        try {
            await this.props.getAdmins(token);
            this.setState({admins: this.props.users})
        } catch (err) {
        this.setState({adminsError: err.response.data})
    }

    }

    renderCrosswords = () => {
        if(this.state.unapr.length>0) {
        return this.state.unapr.map( crossword => {
            let date = getDate(new Date(crossword.dateCreated));
            return (
                <a href={`/admin/crossword/${crossword.ID}`} className="crossword-bar">
                    <div>#{crossword.ID}</div> 
                    <div>{crossword.values.length} x {crossword.values[0].length}</div>
                    <div> added by {crossword.addedBy.login}</div> 
                    <div>Date added: {date}</div>
        </a>
            )
        })
    } else {
        return <div>{this.state.empty}</div>
    }
    }

    handleConfirm = async e => {
        let target = e.target;
        await this.setState({userID: target.id});
        await this.setState({user: target.name});
        this.setState({confirm: true})
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

    handleDetails = async e => {
        e.preventDefault();
        let token = getCookie('jwt_access');
        try {
            await this.props.getUserById(e.target.id, token);
        } catch(err) {
            return window.location.replace(`${baseURL}`)
        }
        this.setState({section: ''});
        this.setState({details: true})
        this.setState({fetchedUser: this.props.user})
        let date = new Date(this.props.user.dateCreated);
        let string = getDate(date);
        this.setState({userDateCr: string})
    }

    renderAdmins = (handleConfirm, handleDetails) => {

        return this.state.admins.map( admin => {
            let date = new Date(admin.dateCreated)
            let string = getDate(date)

            return (
                <tr>
                    <td>{admin.login}</td>
                    <td>{admin.email}</td>
                    <td>{string}</td>
                    <td><button name={admin.login} id={admin._id} onClick={handleConfirm} className="form-button"><i name={admin.login} id={admin._id} onClick={handleConfirm} className="fas fa-trash-alt"></i></button><button name={admin.login} id={admin._id} onClick={handleDetails} className="form-button"><i name={admin.login} id={admin._id} onClick={handleDetails} className="fas fa-info-circle"></i></button></td>
                </tr>
            )
        })
    }

    handleSection = e => {
        this.setState({section: e.target.name})
        this.setState({details: false})
    }

    handleClose = e => {
        e.preventDefault();
        this.setState({confirm: false})
    }

    handleChange = e => {
        switch(e.target.name) {
            case 'password':
                this.setState({password: e.target.value})
        }
    }

    handleDelete = async e => {
        e.preventDefault();
        let token = getCookie("jwt_access")
        try {
        await this.props.manageAdmin(this.state.userID, this.state.password, token, "delete")
        this.setState({confirm: false});
        this.setState({update: true});
        this.showMessage(this.props.user)
        } catch(err) {
            this.showMessage(err.response.data, true)
        }
    }

    handleAdd = () =>  {
        if(this.state.add) {
        this.setState({add: false})
        } else {
            this.setState({add: true})
        }
    }

    handleBack = () => {
        this.setState({details: false})
        this.setState({section: "admins"});
    }

    render() {
        return(
            <>
            <div className="section-menu-container">
                {this.state.section==="approve" ? 
                <button onClick={this.handleSection} name="approve"className="section-menu-element-active">Crosswords to approve</button> :
                <button onClick={this.handleSection} name="approve"className="section-menu-element">Crosswords to approve</button>}
                {this.state.section==="admins" ?
                <button onClick={this.handleSection} name="admins" className="section-menu-element-active">Admins</button> :
                <button onClick={this.handleSection} name="admins" className="section-menu-element">Admins</button>}
            </div>
            <div className="section-content">
                {this.state.section==="approve" ? 
                    <div className="type-container">
                        {this.renderCrosswords()}
                    </div> :
                 null}
                {this.state.section==="admins" ? 
                <div>
                    <button style={{width: "auto", fontSize: "20px"}}className="form-button" onClick={this.handleAdd}><i className="fas fa-user-plus"></i></button>
                    {this.state.add ? <AdminForm showMessage={this.showMessage} handleUpdate={() => {this.setState({update:true}); this.setState({add: false})}}/> : null}
                    <table className="render-table">
                        <thead>
                                <tr>
                                    <th>Login</th>
                                    <th>Email</th>
                                    <th>Date created</th>
                                    <th>Action</th>
                                </tr>
                                </thead>
                                <tbody>
                                <>{this.state.adminsError==='' ? <>{this.renderAdmins(this.handleConfirm, this.handleDetails)}</> : <>{this.state.adminsError}</>} </>
                                </tbody>
                    </table>
                </div> 
                : null}
                {this.state.details ? <div className="details-container">
                    <button className="form-button" onClick={this.handleBack}><i className="fas fa-chevron-left"></i></button>
                    <div>Login: {this.state.fetchedUser.login}</div>
                    <div>E-mail: {this.state.fetchedUser.email}</div>
                    <div>Approved crosswords: {this.props.user.approved.length}</div>
                    <div>Crosswords added: {this.props.user.added.length}</div>
                    <div>Date created: {this.state.userDateCr}</div>
                    </div> : null}
                {this.state.confirm ? <Confirmation user={this.state.user} handleChange={this.handleChange} handleConfirm={this.handleDelete} handleClose={this.handleClose}/> : null}
                {this.state.showMessage ? <Message message={this.state.message} isError={this.state.isError} /> : null}
            </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return { crosswords: state.crosswords, users: state.users, user: state.user };

};

export default connect(
    mapStateToProps,
    { getUnapprovedCrosswords, getAdmins, manageAdmin, getUserById, getUser }
    )(AccountAdministration);