import React from 'react';
import { connect } from 'react-redux';
import { reviewCrossword } from '../actions';
import { getCookie } from '../js';
import Message from './Message'


class RatingForm extends React.Component {
    constructor(props) {
        super(props);
        this.state ={
            _id: props._id,
            showMessage: false,
            isReviewed: props.isReviewed,
            rating: props.rating,
            message: ''
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

    handleEnter = e => {
        let currentStar = e.target.attributes.mark.value
        let element = document.getElementsByClassName("stars-container");
        let stars = Array.from(element[0].children);
        stars.map(star => {
            if(currentStar>=star.attributes.mark.value) {
                star.style.color="gold";
            }
        })
    }
    handleLeave = e => {
        let element = document.getElementsByClassName("stars-container");
        let stars = Array.from(element[0].children);
        stars.map(star => {
                star.style.color="black";
        })
    }

    handleRating = async e => {
        let token = getCookie("jwt_access");
        if(!token) { return this.setState({error: "You have to be signed in if you want to add your rating."})}
        try {
            await this.props.reviewCrossword(this.state._id, e.target.attributes.mark.value, token);
            this.showMessage(this.props.crossword);
            setTimeout(function() {
                window.location.reload()
            }, 3000)
        } catch(err) {
            this.showMessage(err.response.data, true)
        }

    }

    renderStars = () => {
        let array = [1, 2, 3, 4, 5];
        return array.map(element => {
            if(this.state.rating>=element) {
                return <i style={{color: "gold"}}className="fas fa-star"></i>
            } else {
                return <i className="far fa-star"></i>
            }
        })
    }

    render() {

        const isReviewed = (
            <><h3>You have added your rating to this crossword. Thank you!</h3>
                <div className="stars-container">
                    <div>Your rating: {this.state.rating}/5</div>{this.renderStars()}
                </div></>
        )
        const toReview = (
            <><h3>What is your rating of this crossword?</h3>
                <div className="stars-container">
                <i mark="1" onClick={this.handleRating} onMouseEnter={this.handleEnter} onMouseLeave={this.handleLeave} className="far fa-star rate-star star1"></i>
                <i mark="2" onClick={this.handleRating} onMouseEnter={this.handleEnter} onMouseLeave={this.handleLeave} className="far fa-star rate-star star2"></i>
                <i mark="3" onClick={this.handleRating} onMouseEnter={this.handleEnter} onMouseLeave={this.handleLeave} className="far fa-star rate-star star3"></i>
                <i mark="4" onClick={this.handleRating} onMouseEnter={this.handleEnter} onMouseLeave={this.handleLeave} className="far fa-star rate-star star4"></i>
                <i mark="5" onClick={this.handleRating} onMouseEnter={this.handleEnter} onMouseLeave={this.handleLeave} className="far fa-star rate-star star5"></i>
                </div></>
        )

        return(
            <div className="rate-container">
                {this.state.isReviewed ? isReviewed : toReview}
                {this.state.showMessage ? <Message message={this.state.message} isError={this.state.isError}/> : null}
            </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { crossword: state.crossword, user: state.user };

};

export default connect(
    mapStateToProps,
    { reviewCrossword }
    )(RatingForm);