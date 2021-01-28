import React from 'react';
import { getCrossword, getUser, approveCrossword } from '../actions';
import { getCookie, compareNumbers } from '../js';
import { connect } from 'react-redux';
import { baseURL } from '../apis';
import Message from './Message'
import Loader from './Loader'


function QuestionsAcross({showRange, questions}) {
    return questions.map( question => {
        let q = `A${question.number}`
        if(question.type==="across") {
        return (
        <div className="single-question" onClick={showRange.bind(null, q)} id={`A${question.number}`}><p>{question.number}. {question.text}</p></div>
        )
        } else return null
    })
}

function Solution({crossword}) {
    let array=[]
    crossword.map(column => {
        column.map( field => {
            if(field.password!=="") {
                array.push({
                    value: field.value,
                    number: field.password
                })
            }
        })
    })

    array.sort(compareNumbers);

    return array.map( element => {
        return (
            <td>
                <div className="field-container">
                    <input readOnly="true" type="text" className="field" value={element.value}></input>
        <div className="question-number">{element.number}</div>
                </div>
            </td>
        )
    })

    

}

function QuestionsDown({showRange, questions}) {
    return questions.map( question => {
        let q = `D${question.number}`
        if(question.type==="down") {
        return (
            <div className="single-question" onClick={showRange.bind(null, q)} id={`D${question.number}`}><p>{question.number}. {question.text}</p></div>
        )
        } else return null
    })
}
function RenderColumns({moveCursor, showRange, handleChange, columns}) {
    return columns.map(element => {
    
        if(element.value!=="blank"){
            return <td>
            <div className="field-container" onKeyUp={moveCursor.bind()} onClick={showRange.bind(null, element.questionRange)} id={element.name}>
                <input value={element.value} onChange={handleChange.bind()} type="text" maxLength="1" name={element.name} className="field"></input>
                {element.question!=="" ? <div id={element.name} className="question-number">{element.question}</div> : null}
                {element.password!=="" ? <div id={element.name} className="password-number">{element.password}</div> : null}
                </div>
                </td>
        } else {
            return <td>
            <div className="field-container" id={element.name} style={{backgroundColor: "black"}}>
                </div>
                </td>
        }
    })
        
}

function RenderSolvedColumns({moveCursor, showRange, columns}) {
    return columns.map(element => {
    
        if(element.value!=="blank"){
            return <td>
            <div className="field-container" onKeyUp={moveCursor.bind()} onClick={showRange.bind(null, element.questionRange)} id={element.name}>
                <input value={element.value} type="text" maxLength="1" name={element.name} readOnly="true" className="field"></input>
                {element.question!=="" ? <div id={element.name} className="question-number">{element.question}</div> : null}
                {element.password!=="" ? <div id={element.name} className="password-number">{element.password}</div> : null}
                </div>
                </td>
        } else {
            return <td>
            <div className="field-container" id={element.name} style={{backgroundColor: "black"}}>
                </div>
                </td>
        }
    })
        
}

class CrosswordAdmin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            crossword: [],
            crosswordSolved: [],
            solution: false,
            crosswordID: '',
            empty: false,
            rejMsg: '',
            rejectMessage: false,
            isError: false
        }
    }

    async componentDidMount() {
        let token = getCookie("jwt_access");
        let id = getCookie('customerID');
        if(token) {
            try {
                await this.props.getUser(id, token);
            } catch(err) {
                return window.location.replace(`${baseURL}`)
            }
        }
        if(this.props.user.isAdmin) {
            try {
        await this.props.getCrossword(this.props.match.params.id);
        if(this.props.crossword.isApproved || this.props.crossword.isRejected) {
            this.setState({empty: true})
        }
        this.setState({crosswordSolved: this.props.crossword.values})
        let crossword = this.props.crossword.values.map( column => {
            return column.map(field => {
                if(field.value!=="blank") {
                    return {
                        name: field.name,
                        value: "",
                        password: field.password,
                        question: field.question,
                        questionRange: field.questionRange
                    }
                } else {
                    return {
                        name: field.name,
                        value: field.value,
                        question: field.question,
                        password: field.password
                    }
                }
            })
        })
        this.setState({crossword: crossword});
        this.setState({questions: this.props.crossword.questions});
        this.setState({crosswordID: this.props.crossword.ID});
            } catch(err) {
                this.setState({empty: true})
            }
            this.setState({loaded: true});

        }
        else {
            if(!token) {
            window.location.replace(`${baseURL}/login`)
            } 
            else {
                window.location.replace(`${baseURL}`)
            }
        }


    }

    handleChange = e => {
        let crossword = this.state.crossword;
        crossword.map( element => {
            element.map(field => {
                if(field.name===e.target.name) {
                    field.value=e.target.value;
                }
            })
        });
        this.setState({crossword: crossword})

    }

    handleTextArea = e => {
        switch(e.target.name) {
            case 'rej-msg':
                this.setState({rejMsg: e.target.value});
                break;
            default:
                break;
        }
    }

    colorQuestion = (question) => {
        let questions = document.getElementsByClassName('single-question');
            let arr = Array.from(questions);
            arr.map((element, index) => {
                if(element.id===question) {
                    questions[index].style.color="green"
                } else {
                    questions[index].style.color="black"

                }
            })
    }
    

    renderRows = (moveCursor, showRange, change, solution, crossword) => {
        let cross = crossword;
        return crossword.map( function callback(row, index){
            return(
            <tr key={index}>
               {solution ? 
               <RenderSolvedColumns moveCursor={moveCursor} showRange={showRange} columns={cross[index]} key={index}/> :
               <RenderColumns moveCursor={moveCursor} showRange={showRange} handleChange={change} columns={cross[index]} key={index}/>}
            </tr>
            )
        })
            
    }
    showRange = e => {
        let array = e;
        let question;
        if(Array.isArray(array)) {
            if(array.length===2) {
                if(this.state.currentQuestion!==array[0]) {
                this.setState({currentQuestion: array[0]})
                question=array[0]
                } else {
                    this.setState({currentQuestion: array[1]})
                    question=array[1];
                }
            } else {
                this.setState({currentQuestion: array[0]})
            question=array[0]
            }
            
        } else {
            this.setState({currentQuestion: e})
            question = e    
        }
        this.colorQuestion(question)


        let crossword = this.state.crossword;

        crossword.map(row=> {
            row.map(field=> {
                if(field.value!=="blank") {
                let input = document.getElementById(field.name).firstChild;
                input.style.backgroundColor="white";
                input.removeAttribute("readOnly")
                }
            })
        })
        let range = []

        crossword.map(row => {
            row.map(field => {
                if(field.value!=="blank") {
                if(field.questionRange.indexOf(question) !== -1) {
                    let div = document.getElementById(field.name);
                    let input = div.firstChild;
                    input.style.backgroundColor="green";
                    range.push(field.name)
                } else {
                    let div = document.getElementById(field.name);
                    let input = div.firstChild;
                    input.setAttribute("readOnly", "true")
                }
            }
            })
        })
        this.setState({currentRange: range})
        
    }

    moveCursor = async e => {
        let index = this.state.currentRange.indexOf(e.target.name);
        if(index+1<this.state.currentRange.length || e.keyCode===8){
            if(e.keyCode!==8 && e.keyCode!==18 && e.keyCode!==17 && e.keyCode!==16 && e.keyCode!==46) {
        document.getElementById(this.state.currentRange[index+1]).firstChild.focus();
            }
            if(e.keyCode===8) {
                if(index>0) {
                document.getElementById(this.state.currentRange[index-1]).firstChild.focus();
                }
            }
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

    handleView = () => {
        if(this.state.solution) {
            this.setState({solution: false});
            console.log("false")
        } else {
            this.setState({solution: true})
            console.log("true")
        }
    }

    handleApprove = async e => {
        e.preventDefault();
        let token = getCookie("jwt_access");
        try {
            await this.props.approveCrossword(this.state.crosswordID, "approve", "", token);
            this.showMessage(this.props.crossword)
        } catch (err) {
            this.showMessage(err.response.data, true)
        }
    }

    handleReject = async e => {
        e.preventDefault();
        let token = getCookie("jwt_access");
        try {
            await this.props.approveCrossword(this.state.crosswordID, "reject", this.state.rejMsg, token);
            this.showMessage(this.props.crossword)
            this.setState({rejectMessage: false})
        } catch (err) {
            this.showMessage(err.response.data, true)
        }

    }

    handleMessage = async e => {
        e.preventDefault();
        this.setState({rejectMessage: true})
    }

    handleClose = e => {
        e.preventDefault();
        this.setState({rejectMessage: false})
    }

    render() {


        const empty = (
            <div>Oops! It looks like there's no crossword here!</div>
        )

        const content = (
            <div className="flex column">
                <button className="form-button" onClick={this.handleView}>CHANGE VIEW</button>
                <div className="table-container">
                    <table className="table">
                        <tbody>
        {this.state.solution ? <>{this.renderRows(this.moveCursor, this.showRange, this.handleChange, this.state.solution, this.state.crosswordSolved)}</> : <>{this.renderRows(this.moveCursor, this.showRange, this.handleChange, this.state.solution, this.state.crossword)}</>} 
                        </tbody>
                    </table>
                </div>
                <div className="under-table-container">
            <div className="questions-container flex">
                <div className="margin flex column"><h4 className="questions">ACROSS</h4>
                <QuestionsAcross showRange={this.showRange} questions={this.state.questions}/>
                </div>
                
                <div className="margin flex column"><h4 className="questions">DOWN</h4>
                <QuestionsDown showRange={this.showRange} questions={this.state.questions}/>
                </div>
                
            </div>
            <div className="solution-container">
                <table className="table">
                    <tbody>
                        <tr><Solution crossword={this.state.crossword}/></tr>
                    </tbody>
                </table>
            </div>
            <button onClick={this.handleApprove} className="form-button">APPROVE</button>
            <button onClick={this.handleMessage} className="form-button">REJECT</button>
            {this.state.error}
        </div>
            </div>
        )
        const isEmpty = (
            <>{this.state.empty ? empty : content}</>
        )

        const rejectMessage = (
            <div className="confirmation-container">
            <div className="confirmation-header">
                <p>Rejection message</p>
            </div>
            <div className="confirmation-content">
                <form id="confirm-form">
                    <div className="form-container">
                        <label>Your message</label>
                        <div className="form-field">
                            <textarea
                            name="rej-msg"
                            col="20"
                            rows="5"
                            onChange={this.handleTextArea}
                            placeholder="Tell the creator of this crossword why are you rejecting it."
                            />
                        </div>
                    </div>
                    <button onClick={this.handleReject} className="form-button"><i className="fas fa-check"></i></button> 
                    <button onClick={this.handleClose} style={{backgroundColor: "red"}} className="form-button"><i className="fas fa-times"></i></button>
                </form>
            </div>
        </div>
        )
        return (
            <>{this.state.loaded ? isEmpty : <Loader/>}
            {this.state.showMessage ? <Message message={this.state.message} isError={this.state.isError}/> : null}
            {this.state.rejectMessage ? rejectMessage : null}</>
        )
    }
}

const mapStateToProps = (state) => {
    return { crossword: state.crossword, user: state.user };

};

export default connect(
    mapStateToProps,
    { getCrossword, getUser, approveCrossword }
    )(CrosswordAdmin);