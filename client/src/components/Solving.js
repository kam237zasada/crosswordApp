import React from 'react';
import { getCrossword, getUser, saveCrossword, solveCrossword, addTry } from '../actions';
import { getCookie, compareNumbers } from '../js';
import { connect } from 'react-redux';
import Blank from './Blank'
import Message from './Message';
import RatingForm from './RatingForm'
import { baseURL } from '../apis'


function QuestionsAcross({showRange, questions}) {
    return questions.map( question => {
        if(question.type==="across") {
            let q = `A${question.number}`
        return (
        <div onClick={showRange.bind(null, q)} id={`A${question.number}`} className="single-question"><p>{question.number}. {question.text}</p></div>
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
                    <input readOnly={true} type="text" className="field" value={element.value}></input>
        <div className="question-number">{element.number}</div>
                </div>
            </td>
        )
    })

    

}

function QuestionsDown({showRange, questions}) {
    return questions.map( question => {
        if(question.type==="down") {
            let q = `D${question.number}`
        return (
            <div onClick={showRange.bind(null, q)} id={`D${question.number}`} className="single-question"><p>{question.number}. {question.text}</p></div>
        )
        } else return null
    })
}
function RenderColumns({moveCursor, showRange, handleChange, columns, isSolved}) {
    return columns.map(element => {
    
        if(element.value!=="blank"){
            if(isSolved) {
                return <td>
            <div className="field-container" id={element.name}>
                <input readOnly="true" value={element.value} onChange={handleChange.bind()} type="text" maxLength="1" name={element.name} className="field"></input>
                {element.question!=="" ? <div id={element.name} className="question-number">{element.question}</div> : null}
                {element.password!=="" ? <div id={element.name} className="password-number">{element.password}</div> : null}
                </div>
                </td>
            } else {
            return <td>
            <div className="field-container"  onClick={showRange.bind(null, element.questionRange)} id={element.name}>
                <input value={element.value} onKeyUp={moveCursor.bind()} onChange={handleChange.bind()} type="text" maxLength="1" name={element.name} className="field"></input>
                {element.question!=="" ? <div id={element.name} className="question-number">{element.question}</div> : null}
                {element.password!=="" ? <div id={element.name} className="password-number">{element.password}</div> : null}
                </div>
                </td>
            }
        } else {
            return <td>
            <div className="field-container" id={element.name} style={{backgroundColor: "black"}}>
                </div>
                </td>
        }
    })
        
}

class Solving extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            loaded: false,
            crossword: [],
            solution: false,
            crosswordID: '',
            crossword_id: '',
            isSolved: false,
            blank: false,
            currentQuestion: '',
            currentRange: [],
            showMessage: false,
            isError: false,
            token: null,
            showRating: false,
            isReviewed: false,
            rating: 0
        }
    }

    async componentDidMount() {
        let token = getCookie("jwt_access");
        let id = getCookie('customerID');
        if(token) {
            try {
            await this.props.getUser(id, token);
            this.setState({token: token})
            } catch(err) {
                return window.location.replace(`${baseURL}`)
            }
        }
        
        try {
            await this.props.getCrossword(this.props.match.params.id);
        } catch(err) {
            return this.setState({blank: true})
        }
        this.setState({crossword_id: this.props.crossword._id})
        this.setState({questions: this.props.crossword.questions});
        this.setState({crosswordID: this.props.crossword.ID});
        if(!this.props.crossword.isApproved) {
            return this.setState({blank: true})
        }
        if(!this.props.crossword) {
            return this.setState({blank: true})
        }
        if(token) {
            this.props.user.solved.map( solved => {
            if(solved._id==this.props.crossword._id) {
                this.setState({isSolved: true});
                this.setState({showRating: true})
            }
        })
        }
        let crossword;
        if(this.state.isSolved===false) {
        crossword = this.props.crossword.values.map( column => {
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
        await this.props.addTry(this.props.crossword._id)
        this.setState({crossword: crossword});
    } else {
        this.setState({crossword: this.props.crossword.values})
        this.props.user.reviewed.map(crossword => {
            if(crossword._id===this.state.crossword_id) {
                this.setState({isReviewed: true})
                this.setState({rating: crossword.rating})
            }
        })
    }

        if(token) {
        this.props.user.tries.map( tried => {
            if(tried._id==this.state.crossword_id) {
                this.setState({crossword: tried.values})
            }
        })
    }
        this.setState({loaded: true});
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

    renderRows = (moveCursor, showRange, change, crossword, isSolved) => {
        let cross = crossword;
        return crossword.map( function callback(row, index){
            return(
            <tr key={index}>
               <RenderColumns moveCursor={moveCursor} showRange={showRange} handleChange={change} columns={cross[index]} isSolved={isSolved} key={index}/>
            </tr>
            )
        })
            
    }

    handleChange = e => {
        let crossword = this.state.crossword;
        crossword.map( element => {
            element.map(field => {
                if(field.name===e.target.name) {
                    field.value=e.target.value.toUpperCase();
                }
            })
        });
        this.setState({crossword: crossword})
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


    handleSave = async () => {
        let token = getCookie("jwt_access")
        let id = getCookie('customerID')
        this.setState({error:''})
        try {
            await this.props.saveCrossword(this.state.crossword_id, this.state.crossword, id, token);
            this.showMessage(this.props.crossword)
        } catch(err) {
            this.setState({error: err.response.data})
        }
    }

    handleSolve = async () => {
        let token = getCookie("jwt_access")
        let isEmpty = false;
        this.state.crossword.map( row => {
            row.map(field => {
                if(field.value==="") {
                    isEmpty = true;
                }
            })
        })
        if(isEmpty) {
            return this.showMessage("You cannot solve crossword without filling every single cell!", true)
        }
        this.setState({error:''})
        try {
            await this.props.solveCrossword(this.state.crossword_id, this.state.crossword, token);
            this.showMessage(this.props.crossword)
            setTimeout(function() {
                window.location.reload();
            }, 3000)
        } catch(err) {
            this.showMessage(err.response.data, true)
        }

    }

    moveCursor = async e => {
        let currentRange= this.state.currentRange;
        let index = currentRange.indexOf(e.target.name);
        if(index+1<currentRange.length || e.keyCode===8){
            if(e.keyCode!==8 && e.keyCode!==18 && e.keyCode!==17 && e.keyCode!==16 && e.keyCode!==46) {
                    document.getElementById(currentRange[index+1]).firstChild.focus();
            }
            if(e.keyCode===8) {
                if(index>0) {
                        document.getElementById(currentRange[index-1]).firstChild.focus();
                }
            }
        }

    }



    render() {

        const content = (
            <div className="flex column">
                <h2 className="crossword-header">Crossword #{this.state.crosswordID}</h2>
                <div className="table-container">
                    <table className="table">
                        <tbody>
                            {this.renderRows(this.moveCursor, this.showRange, this.handleChange, this.state.crossword, this.state.isSolved)}
                        </tbody>
                    </table>
                </div>
                <div className="under-table-container">
            <div className="questions-container">
                <div className="margin flex column"><h4 className="questions">ACROSS</h4>
                <QuestionsAcross showRange={this.showRange} questions={this.state.questions}/>
                </div>
                <div className="margin flex column"><h4 className="questions">DOWN</h4>
                <QuestionsDown showRange={this.showRange} questions={this.state.questions}/>
                </div>
            </div>
            </div>
            <div className="solution-container">
                <table className="table">
                    <tbody>
                        <tr><Solution crossword={this.state.crossword}/></tr>
                    </tbody>
                </table>
            </div>
            <div className="button-container">
            
            {this.state.token&&!this.state.isSolved ? <button onClick={this.handleSave} className="form-button">SAVE</button> : null}
            {this.state.isSolved ? <h3>You solved this crossword! Congratulations!</h3> : <button onClick={this.handleSolve} className="form-button">SOLVE</button>}
            </div>

            {this.state.showRating ? <RatingForm _id={this.state.crossword_id} isReviewed={this.state.isReviewed} rating={this.state.rating} /> : null}

            {this.state.error}
            </div>
        )
        const loading = (
            <div>{this.state.loaded ? content : <div>Loading</div>}</div>
        )
        return (
            <>{this.state.blank ? <Blank/> : loading}
            {this.state.showMessage ? <Message message={this.state.message} isError={this.state.isError}/> : null}</>

        )
    }

}

const mapStateToProps = (state) => {
    return { crossword: state.crossword, user: state.user };

};

export default connect(
    mapStateToProps,
    { getCrossword, getUser, saveCrossword, solveCrossword, addTry }
    )(Solving);