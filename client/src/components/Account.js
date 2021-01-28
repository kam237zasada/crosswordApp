import React from 'react';
import { getCookie } from '../js';
import AccountCrosswords from './AccountCrosswords';
import AccountSettings from './AccountSettings';
import AccountAdministration from './AccountAdministration';
import { connect } from 'react-redux';
import { getUser } from '../actions';
import { baseURL } from '../apis';


class Account extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {
                _id: '000',
                isAdmin: false,
                loaded: false
            }
        }
    }

    componentDidMount = async () => {
        let token = getCookie("jwt_access");
        let id = getCookie('customerID');
        if(token) {
            try {
                await this.props.getUser(id, token)
                this.setState({user: this.props.user})
                this.setState({isAdmin: this.props.user.isAdmin});
            } catch(err) {
                return window.location.replace(`${baseURL}/login`)
            }
        } else {
            return window.location.replace(`${baseURL}/login`)
        }

        this.setState({loaded: true})


        
    }

    handleLeave = () => {
        let divs = document.getElementsByClassName("menu-element-text");

        let array = Array.from(divs)

        array.map( div => {
            div.style.display="none";
        })

    }

    handleHover = () => {
        let divs = document.getElementsByClassName("menu-element-text");

        let array = Array.from(divs)

        array.map( div => {
            div.style.display="block";
        })
    }

    render() {

        const adminPanel = (
            <>{this.props.match.params.section==="administration" ? <a href="/account/administration"><div className="menu-element-active"><i className="fas fa-user-shield"></i><div className="menu-element-text"> Administration</div></div></a> : <a href="/account/administration"><div className="menu-element"><i className="fas fa-user-shield"></i><div className="menu-element-text"> Administration</div></div></a>}</>
        )

        const content = (
            <div className="account-container">
                <div onMouseEnter={this.handleHover} onMouseLeave={this.handleLeave} className="menu-container">
                    {this.props.match.params.section==="crosswords" ? <a href="/account/crosswords"><div className="menu-element-active"><i className="fas fa-chess-board"></i> <div className="menu-element-text"> Crosswords</div></div></a> : <a href="/account/crosswords"><div className="menu-element"><i className="fas fa-chess-board"></i> <div className="menu-element-text"> Crosswords</div></div></a>}
                    {this.props.match.params.section==="settings" ? <a href="/account/settings"><div className="menu-element-active"><i className="fas fa-cog"></i><div className="menu-element-text"> Settings</div></div></a> : <a href="/account/settings"><div className="menu-element"><i className="fas fa-cog"></i><div className="menu-element-text"> Settings</div></div></a>}
                    {this.state.isAdmin ? adminPanel : null}
                </div>
                <div className="content-account">
                    {this.props.match.params.section==="crosswords" ? <AccountCrosswords user={this.state.user}/> : null}
                    {this.props.match.params.section==="settings" ? <AccountSettings user={this.state.user}/> : null}
                    {this.props.match.params.section==="administration" ? <AccountAdministration user={this.state.user}/> : null}
                </div>
            </div>
        )

        return(
            <>{this.state.loaded ? content : null}</>
        )
    }
}

const mapStateToProps = (state) => {
    return { user: state.user };

};

export default connect(
    mapStateToProps,
    { getUser }
    )(Account);