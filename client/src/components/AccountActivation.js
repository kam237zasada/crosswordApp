import React from 'react';
import { connect } from 'react-redux';
import { activateAccount } from '../actions';
import { baseURL } from '../apis'

class AccountActivation extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error: '',
            loaded: false,
            message: ''
        }
    }
    
    componentDidMount = async () => {
        try {
            await this.props.activateAccount(this.props.match.params.id, this.props.match.params.token);
            this.setState({message: this.props.user})
        } catch(err) {
            this.setState({error: err.response.data})
        }
        this.setState({loaded: true})
    }

    render(){

        const error = (
            <div className="content-container">{this.state.error}</div>
        )

        const content = (
            <div className="content-container">{this.state.message} You can just <a href={`${baseURL}/login`}><button className="form-button">SIGN IN!</button></a></div>
        )

        const isError = (
            <div className="flex">{this.state.error==='' ? content : error }</div>
        )
        return(
            <div>{this.state.loaded ? isError : null}</div>
        )
    }
}

const mapStateToProps = (state) => {
    return { user: state.user };

};

export default connect(
    mapStateToProps,
    { activateAccount }
    )(AccountActivation);