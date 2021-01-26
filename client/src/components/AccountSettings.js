import React from 'react';
import Details from './Details'
import ChangePassword from './ChangePassword'
import { baseURL } from '../apis'
import { getCookie } from '../js'
import { connect } from 'react-redux';
import { getUser } from '../actions'

class AccountSettings extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            section: "details"
        }
    }

    componentDidMount = async () => {
        let token = getCookie("jwt_access")
            try {
                await this.props.getUser(token)
            } catch(err) {
                return window.location.replace(`${baseURL}/login`)
            }
    }

    handleSection = e => {
        this.setState({section: e.target.name})
    }

    render() {

        return(
            <>
            <div className="section-menu-container">
                {this.state.section==="details" ? 
                <button onClick={this.handleSection} name="details"className="section-menu-element-active">Account details</button> :
                <button onClick={this.handleSection} name="details"className="section-menu-element">Account details</button>}
                {this.state.section==="password" ?
                <button onClick={this.handleSection} name="password" className="section-menu-element-active">Change password</button> :
                <button onClick={this.handleSection} name="password" className="section-menu-element">Change password</button>}
            </div>
            <div className="section-content">
                {this.state.section==="details" ? <Details/> : null}
                {this.state.section==="password" ? <ChangePassword/> : null}

            </div>
            </>
        )
    }
}

const mapStateToProps = (state) => {
    return { user: state.user };

};

export default connect(
    mapStateToProps,
    { getUser }
    )(AccountSettings);