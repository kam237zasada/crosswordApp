import React from 'react';
import { connect } from 'react-redux';
import { getAppCrosswords, getUser } from '../actions';
import { getCookie, setCookie } from '../js';
import CrByType from './CrByType';

class Crosswords extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            crosswords: [],
            beginner: [],
            semiAdvanced: [],
            advanced: [],
            expert: [],
            showCrosswords: false,
            current: [],
            error: ''
        }
    }

    componentDidMount = async () => {
        let token = getCookie("jwt_access");
        let id = getCookie('customerID');
        try {
            await this.props.getAppCrosswords(token);
        } catch(err) {
            return this.setState({error: err.response.data})
        }
        if(token) {
        try {
            await this.props.getUser(id, token);
            this.setState({user: this.props.user})
        } catch(err) {
            setCookie('customerID', "", 0.00001);
            setCookie('jwt_access', "", 0.00001);
            return 
        }
        }
        this.setState({crosswords: this.props.crosswords})
        const crosswords = this.state.crosswords

        if(token) {
            
                if(this.props.user.solved.length>0) {
                    this.props.user.solved.map(solved => {
                        let isSolved = false
                        for(let prop in crosswords) {

                        crosswords[prop].map( crossword => {
                            isSolved=false
                        if(crossword._id==solved._id) {
                            isSolved=true

                        }
                        if(isSolved===true) {
                            crossword.solved=true;
                        } else {
                            if(crossword.solved!==true) {
                                crossword.solved = false
                            }
                        }
                    })
                }
                
                })
                } else {
                }
            }
        
        
        this.setState({crosswords: crosswords})
        this.setState({beginner: crosswords.beginner})
        this.setState({semiAdvanced: crosswords.semiAdvanced})
        this.setState({advanced: crosswords.advanced})
        this.setState({expert: crosswords.expert})
    
    }


    handleBack = () => {
        this.setState({current: []})
        this.setState({showCrosswords: false})
    }

    handleClick = async e => {
        switch(e.target.id) {
            case "Beginner":
                await this.setState({current: this.state.beginner});
                break;
            case "Semi-Advanced":
                await this.setState({current: this.state.semiAdvanced});
                break;
            case "Advanced":
                await this.setState({current: this.state.advanced});
                break;
            case "Expert":
                await this.setState({current: this.state.expert});
                break;
            default:
                break;
        }

        if(this.state.current.length>0) {
            this.setState({showCrosswords: true})

        }

    }

    renderCrosswords = (handleClick, ...param) => {
        let crosswords = param;
        let difficults = ["Beginner", "Semi-Advanced", "Advanced", "Expert"]
            return crosswords.map(function(type, index) {
                let solved =0;
                    type.map (crossword => {
                        
                        if(crossword.solved===true) {
                            solved+=1;
                        }
                        
                    })
                    let percent = 0
                    if(solved>0) {
                        let x = solved/type.length * 100;
                        percent = Number(Math.round(x, 'e+0') + 'e-0');

                    }

                return (
                        <div className="card-container" id={difficults[index]} onClick={handleClick}>
                            <p className="frame-header">{difficults[index]}</p> 
                            <p className="solved-number">Solved: {solved}/{type.length}</p>
                            <div className="ui progress" data-percent={percent}>
                                <div className="bar" style={{transitionDuration: "300ms", width:`${percent}%`, height: "100%"}}>
                                    <div className="progress" style={{color: "black"}}>{percent}%</div>
                                </div> 
                            </div>
                        </div>
                )
                })
        
    }

    render() {

        const types = (
            <div className="crosswords-container">{this.renderCrosswords(this.handleClick, this.state.beginner, this.state.semiAdvanced, this.state.advanced, this.state.expert)}</div>
        )

        const crosswords = (
            <div className="crosswords">
                <div className="form-button" onClick={this.handleBack} style={{width: "100px"}}>BACK</div>
                <div className="type-container"><CrByType crosswords={this.state.current} user={this.state.user}/></div>
            </div>
        )

        const content = (
            <>{this.state.showCrosswords ? crosswords : types}</>
        )
        const error = (
            <>{this.state.error}</>
        )

        
        return (
            <>{this.state.error!=='' ? error : content}</>
        )
    }
}

const mapStateToProps = (state) => {
    return { crosswords: state.crosswords, user: state.user };

};

export default connect(
    mapStateToProps,
    { getAppCrosswords, getUser }
    )(Crosswords);