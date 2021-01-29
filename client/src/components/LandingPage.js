import React from 'react';
import { connect } from 'react-redux';
import { sendMail } from '../actions';
import Message from './Message';


class LandingPage extends React.Component{
    constructor(props) {
        super(props)
        this.state={
            name: '',
            email: '',
            message: '',
            emailMessage: '',
            signsLeft: 1000
        }
    }

    handleChange = e => {
        switch(e.target.name) {
            case 'name':
                this.setState({name: e.target.value});
                break;
            case 'email':
                this.setState({email: e.target.value});
                break;
            case 'emailMessage': 
                this.setState({emailMessage: e.target.value});
                this.setState({signsLeft: 1000-e.target.value.length})
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

    handleMail = async e => {
        e.preventDefault();
        try {
            await this.props.sendMail(this.state.name, this.state.email, this.state.emailMessage);
            this.showMessage(this.props.mail)
            this.setState({name: ''});
            this.setState({email: ''});
            this.setState({emailMessage: ''});
        } catch(err) {
            console.log(err)
            // this.showMessage(err.response.data, true)
        }
    }

    render() {
        return(
            <div className="landing-container">
                <section id="first">
                    <div>
                        <img className="image" alt="crossword" src="./crosswords.png"></img>
                    </div>
                    <div>
                        <h2>Crosswords App!</h2>
                        <p>The best crosswords in the world! Add your own crossword, solve many crosswords from users all over the world. Four different difficulties.</p>
                        <a href="/login" ><button className="form-button">JOIN US NOW!</button></a>
                    </div>
                </section>
                <section id="second">
                    <div className="commentary-container">
                        <p className="commentary"><i>This is something that I was looking for many years! Many crosswords in one place!</i></p>
                        <p>Bryan, 24, England, London</p>
                    </div>
                    <div className="commentary-container">
                        <p className="commentary"><i>It is incredible that I can create my own crossword and anybody in the world can solve them!</i></p>
                        <p>Lalima, 31, India, Delhi</p>
                    </div>
                    <div className="commentary-container">
                        <p className="commentary"><i>Brilliant site! When I discovered Crossword App, my life turns 180 degrees!</i></p>
                        <p>Robert, 21, Poland, Wroclaw</p>
                    </div>
                </section>
                <section id="three">
                    <h2>Three simple steps to add crossword!</h2>
                    <div className="steps">
                    <div className="step-container">
                            <div className="step-number">1</div>
                            <p>Create an account in Crossword App <a href="/login">HERE</a>.</p>
                        </div>
                        <div className="step-container">
                            <div className="step-number">2</div>
                            <p>Sign in and create a crossword!</p>
                        </div>
                        <div className="step-container">
                            <div className="step-number">3</div>
                            <p>Wait until your crossword will be approved by Administrator.</p>
                        </div>
                    </div>
                </section>
                <section id="four">
                    <div className="address">
                    <i className="fas fa-id-card"></i>
                        <p>Crossword App</p>
                        <p>00-000 City</p>
                        <p>Example Street 2</p>
                        <p>Telephone: 000-000-000</p>
                    </div>
                    <div className="contact-form">
                        <form className="form">
                            <div className="form-container">
                            <h2>Contact us</h2>
                                <div className="form-field">
                                    <input
                                    type="text"
                                    name="name"
                                    onChange={this.handleChange}
                                    placeholder="Type your name..."
                                    />
                                </div>
                                <div className="form-field">
                                    <input
                                    type="email"
                                    name="email"
                                    onChange={this.handleChange}
                                    placeholder="Type your email..."
                                    />
                                </div>
                                <div className="form-field">
                                    <textarea
                                    name="emailMessage"
                                    cols="40"
                                    rows="10"
                                    onChange={this.handleChange}
                                    placeholder="Type your message/question..."
                                    maxLength="1000"
                                    />
                                    <>{this.state.signsLeft===1000 ? null : <label className="mini-label">{this.state.signsLeft}</label>}</>
                                </div>
                            </div>
                            <button onClick={this.handleMail}className="form-button">SEND</button>
                        </form>
                    </div>
                </section>                
                {this.state.showMessage ? <Message message={this.state.message} isError={this.state.isError}/> : null}
            </div>
        )
    }

}

const mapStateToProps = (state) => {
    return { mail: state.mail };

};

export default connect(
    mapStateToProps,
    { sendMail }
    )(LandingPage);