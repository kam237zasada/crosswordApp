import React from 'react';
import { connect } from 'react-redux';
import { resendActivation } from '../actions'

class MailRequired extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            error:""
        }
    }

    handleSend = async () => {
        try {
            await this.props.resendActivation(this.props.match.params.id);
        } catch(err) {
            this.setState({error: err.response.data})
        }

    }

    render() {
        return (
            <div className="content-container">
                You have to activate your account. You should receive a message from our system to mailbox with you have registered.
                When you did not receive any message please check your SPAM or just <button onClick={this.handleSend} className="form-button">SEND</button> it another time.
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { crossword: state.crossword, user: state.user };

};

export default connect(
    mapStateToProps,
    { resendActivation }
    )(MailRequired);