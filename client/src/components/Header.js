import React from 'react';
import { getCookie, setCookie } from '../js/index';
import { connect } from 'react-redux';
import { getUser, userSignOut, getRandomCrossword } from '../actions';
import { baseURL } from '../apis';
import Message from './Message'

const Profile = ({user, enter, leave, signOut}) => {
    if(!user.login) {
    return(
        <a name="signin" href="/login"><div onMouseEnter={enter.bind()} onMouseLeave={leave.bind()} name="signin" className="header-element"><i name="signin" className="fas fa-user"></i><div name="signin" id="text-signin">Sign in</div></div></a>
    )
    } else {
        
        return(
            <><a name="create" href="/create"><div onMouseEnter={enter.bind()} onMouseLeave={leave.bind()} name="create" className="header-element"><i name="create" className="fas fa-pencil-alt"></i><div name="create" id="text-create">Create</div></div></a>
            <a name="account" href="/account"><div onMouseEnter={enter.bind()} onMouseLeave={leave.bind()} name="account" className="header-element"><i name="account" className="fas fa-user-cog"></i><div id="text-account" name="account">Account</div></div></a>
            <div name="signout" onMouseEnter={enter.bind()} onMouseLeave={leave.bind()} onClick={signOut.bind(null)}className="header-element"><i name="signout" className="fas fa-power-off"></i><div name="signout" id="text-signout">Sign Out</div></div></>
        )
        
    }
}
class Header extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            user: {},
            loaded: false,
            message: '',
            showMessage: false
        }
    }

    async componentDidMount() {
        const token = getCookie("jwt_access");
        const id = getCookie('customerID')
        if(token) {
        try {
            await this.props.getUser(id, token)
            this.setState({user: this.props.user});
        } catch(err) {
            setCookie('customerID', "", 0.00001);
            setCookie('jwt_access', "", 0.00001);
            return window.location.replace(`${baseURL}`)
        }
    }
        this.setState({loaded: true})

        
    }

    handleEnter = e => {
        let name = e.target.attributes.name.value
        let div = document.getElementById(`text-${name}`)
        div.style.display="block"
    }

    handleLeave = e => {
        let name = e.target.attributes.name.value
        let div = document.getElementById(`text-${name}`)
        div.style.display="none"

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

    getRandom = async () => {
        try {
        await this.props.getRandomCrossword();
        window.location.replace(`${baseURL}/crosswords/${this.props.crossword.ID}`)
        } catch(err) {
            this.showMessage(err.response.data, true)
        }
    }

    handleSignOut = async () => {
        await this.props.userSignOut();
        window.location.replace(`${baseURL}`);
    }

    render() {

        return(
            <>{this.state.loaded ? <div className="header-container">
                <a name="home" href="/"><div name="home" onMouseLeave={this.handleLeave} onMouseEnter={this.handleEnter}className="header-element"><i name="home" className="fas fa-home"></i><div name="home" id="text-home">Home</div></div></a>
                <a name="random" onClick={this.getRandom}><div name="random" onMouseLeave={this.handleLeave} onMouseEnter={this.handleEnter}className="header-element"><i name="random" className="fas fa-dice"></i><div name="random" id="text-random">Random</div></div></a>
                <a name="crosswords" href="/crosswords"><div name="crosswords" onMouseLeave={this.handleLeave} onMouseEnter={this.handleEnter} className="header-element"><i name="crosswords" className="fas fa-chess-board"></i><div name="crosswords" id="text-crosswords">Crosswords</div></div></a>
                <Profile user={this.state.user} enter={this.handleEnter} leave={this.handleLeave} signOut={this.handleSignOut}/>
            </div> : null}
            {this.state.showMessage ? <Message message={this.state.message} isError={this.state.isError}/> : null}</>
        )
    }
}

const mapStateToProps = (state) => {
    return { user: state.user, crossword: state.crossword };

};

export default connect(
    mapStateToProps,
    { getUser, userSignOut, getRandomCrossword }
    )(Header);