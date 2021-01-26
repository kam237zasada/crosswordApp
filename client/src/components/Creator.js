import React from 'react'
import { connect } from 'react-redux';
import { addCrossword, getUser } from '../actions';
import { getCookie, compareNumbers } from '../js';
import { baseURL } from '../apis'
import RenderNumbers from './RenderNumbers'
import HelpCreator from './HelpCreator'


function QuestionsAcross({questions, handleDelete}) {
    return questions.map( question => {
        if(question.type==="across") {
        return (
        <div className="single-question"><p>{question.number}. {question.text}</p><button onClick={handleDelete.bind(null, question)}className="question-button">X</button></div>
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

function QuestionsDown({questions, handleDelete}) {
    return questions.map( question => {
        if(question.type==="down") {
        return (
            <div className="single-question"><p>{question.number}. {question.text}</p><button onClick={handleDelete.bind(null, question)}className="question-button">X</button></div>
        )
        } else return null
    })
}

function RenderColumns({handleChange, handleClick, setQuestion, setPassword, columns, questionState, passwordState, questionForm}) {
    return columns.map(element => {
    
        if(element.value!=="blank"){
            return <td>
            <div className="field-container" onClick={handleClick.bind(null, element.name)} id={element.name}>
                <input onChange={handleChange.bind()} type="text" maxLength="1" value={element.value} name={element.name} className="field"></input>
                {questionState ?
                    <select onChange={setQuestion.bind()} id={element.name} className="question-select">
                        <option value=""></option>
                    <RenderNumbers/>
                </select> :
                    null
                }
                    
                {passwordState ? 
                <select onChange={setPassword.bind()} id={element.name} className="password-select">
                <option value=""></option>
                    <RenderNumbers/>
                </select> :
                null
            }
                {questionForm ? 
                <input
                id={element.name}
                className="question-range"
                type="checkbox"
                /> :
                null
                }
                <div id={element.name} className="question-number" style={{visibility: "none"}}></div>
                <div id={element.name} className="password-number" style={{visibility: "none"}}></div>
                </div>
                </td>
        } else {
            return <td>
            <div className="field-container" onClick={handleClick.bind(null, element.name)}id={element.name}>
            <input onChange={handleChange.bind()} type="text" maxLength="1" value="" name={element.name} className="field disabled"></input>
                </div>
                </td>
        }
    })
        
}

class Creator extends React.Component {
    constructor(props) {
        super(props)
        this.state={
            crossWord:[],
            across: props.across,
            down: props.down,
            question: false, 
            password: false,
            blank: false,
            error: "",
            questionForm: false,
            questionType: '',
            questionNumber: '',
            questionText: '',
            questions: [],
            addQuestion: true,
            solution: [],
            userId: '',
            showHelp: false
        }
    }

    componentDidMount = async () => {
        let token = getCookie("jwt_access");

        try {
            await this.props.getUser(token);
        } catch(err) {
            return window.location.replace(`${baseURL}/login`)
        }
        if(this.props.user) {
        let crossWord = []
        for(let i =0; i<this.state.down; i++) {
            let number = Number(this.state.across);
                crossWord[i] = new Array(number)
                for(let y=0; y<crossWord[i].length;y++) {
                    let letter=i+65;
                    let number = y+1;
                    crossWord[i][y] = {
                        name: String.fromCharCode(letter)+number.toString(),
                        value: "",
                        password: "",
                        question: "",
                    questionRange: []}
                }
        }

        let userId = getCookie("customerID");
        this.setState({userId: userId});
        this.setState({crossWord: crossWord})
    } else {
        window.location.replace(`${baseURL}/login`)
    }
    }

    handleChange = async e => {
        let crossword = this.state.crossWord;
        crossword.map( element => {
            element.map(field => {
                if(field.name===e.target.name) {
                    field.value=e.target.value.toUpperCase();
                }
            })
        });
        await this.setState({crossWord: crossword})
        console.log(this.state.crossWord)

    }

    handleQuestionChange = e => {
        switch(e.target.name) {
            case 'question-number':
                this.setState({questionNumber: e.target.value})
                break;
            case 'question-text':
                this.setState({questionText: e.target.value});
                break;
            case 'question-type':
                this.setState({questionType: e.target.value});
                break;
            default:
                break;
        }
    }



    renderRows = (change, click, question, password, stateQuestion, statePassword, questionForm) => {
        let cross = this.state.crossWord;
        return this.state.crossWord.map( function callback(row, index){
            return(
            <tr key={index}>
               <RenderColumns handleChange={change} handleClick={click} setQuestion={question} setPassword={password} columns={cross[index]} questionState={stateQuestion} passwordState={statePassword} questionForm={questionForm} key={index}/>
            </tr>
            )
        })
            
    }

    compareNumbers(a,b) {
        return a.number-b.number
    }

    setQuestion = e => {

        this.state.crossWord.map( element => {
            element.map( field => {
                if(field.name===e.currentTarget.id) {
                    field.question=e.currentTarget.value
                }
            })
        })
        let divs = Array.from(document.getElementsByClassName("question-number"));
        divs.map( div => {
            if(div.id===e.currentTarget.id) {
                div.innerHTML=e.currentTarget.value
            }
        })
        
    }

    setPassword = e => {
        let solution = this.state.solution;
        this.state.crossWord.map( element => {
            element.map( field => {
                if(field.name===e.currentTarget.id) {
                    field.password=e.currentTarget.value
                }
                if(field.password!=="") {
                    solution.push({
                        number: field.password,
                        value: field.value
                    })
                }
            })
        })
        solution.sort(this.compareNumbers);

        this.setState({solution: solution})

        let divs = Array.from(document.getElementsByClassName("password-number"));
        divs.map( div => {
            if(div.id===e.currentTarget.id) {
                div.innerHTML=e.currentTarget.value
            }
        })
    }

    save = async () => {
        this.state.crossWord.map( column => {
            column.map( field => {
                if (field.value==="") {
                    return this.setState({error: "Wszystkie pola muszą zostać wypełnione!"})
                }
            })
        })
        let array = [];
        this.state.crossWord.map(column => {
            column.map( field => {
                if(field.password!=="") {
                    array.push({
                        value: field.value,
                        number: field.password
                    })
                }
            })
        });

        array.sort(this.compareNumbers);


        try {
        await this.props.addCrossword(this.state.crossWord, this.state.questions, array, this.state.userId )
        } catch (err) {
            return this.setState({error: err.response.data})
        }
    }

    handleClick = e => {
        let field = document.getElementById(e)


        if(this.state.blank) {
            for ( let item of field.childNodes) {
                let value = item.attributes.class.value.split(' ')
                console.log(value)
                if(item.tagName==="INPUT" && !value.includes("disabled")) {
                    console.log("enabled")

                    item.setAttribute("class", "field disabled")
                    item.style.backgroundColor="black"
                    item.value=""
                    for(let i=0; i<this.state.crossWord.length;i++){
                        this.state.crossWord[i].map( element => {
                            if(e===element.name) {
                                element.value="blank";
                                element.question="";
                                element.password="";
                            }
                        })
                    }
                } else if(item.tagName==="INPUT" && value.includes("disabled")) {
                    console.log("disabled")
                    item.removeAttribute('disabled')
                    item.setAttribute("class", "field")
                    item.style.backgroundColor="white";
                    for(let i=0; i<this.state.crossWord.length;i++){
                        this.state.crossWord[i].map( element => {
                            if(e===element.name) {
                                element.value=""
                            }
                        })
                    }
                }
            }
        }         
    }

    handleEdit = e => {
        this.setState({questionForm: false})
        if(this.state.blank || this.state.question || this.state.password) {
            this.setState({blank: false})
            this.setState({question: false})
            this.setState({password: false})
            let question= Array.from(document.getElementsByClassName("question-select"));
                question.map( select => {
                    select.style.visibility="hidden";         
                })
                let password= Array.from(document.getElementsByClassName("password-select"));
                password.map( select => {
                    select.style.visibility="hidden";         
                })
            let buttons = Array.from(document.getElementsByClassName("edit-button"));
            buttons.map( button => {
                button.setAttribute("class", "edit-button")
                // button.style.backgroundColor="white";
                // button.style.color="#1665CD";
            })
            return
        } else {

        this.setState({blank: false})
        this.setState({question: false})
        this.setState({password: false})

        switch(e.target.name) {
            case 'blank':
                this.setState({blank: true});
                let blank = document.getElementById("blank-button");
                blank.setAttribute("class", "edit-button button-active");
                break;
            case 'question':
                this.setState({question: true});
                
                let questionButton = document.getElementById("question-button");
                questionButton.setAttribute("class", "edit-button button-active");
                break;
            case 'password':
                this.setState({password: true});
                
                let passwordButton = document.getElementById("password-button");
                passwordButton.setAttribute("class", "edit-button button-active");
                break;
            default:
                break;
        }
        }


    }

    handleQuestion = () => {
        this.setState({questionForm: true})
        this.setState({blank: false})
        this.setState({question: false})
        this.setState({password: false})
        let buttons = Array.from(document.getElementsByClassName("edit-button"));
            buttons.map( button => {
                button.setAttribute("class", "edit-button")
            })
    }


    addQuestion = async () => {
        this.setState({error:""})
        this.setState({addQuestion: true})
        if(this.state.questionType==="") {
            return this.setState({error: "Select type of question!"})
        }
        if(this.state.questionText==="") {
            return this.setState({error: "You must write question!"})
        }
        if(isNaN(this.state.questionNumber) || this.state.questionNumber==="") {
            return this.setState({error: "Question number is not a number."})
        }
        await this.state.questions.map( question => {
            if (this.state.questionNumber===question.number && this.state.questionType===question.type) {
                this.setState({error: "Question with this number already exists!"})
                this.setState({addQuestion: false})
            }
        })
        if(this.state.addQuestion) {
        let questions = this.state.questions;

        const question = {
            number: this.state.questionNumber,
            text: this.state.questionText,
            type: this.state.questionType
        };
        let checkboxes = document.getElementsByClassName("question-range");
        let array = Array.from(checkboxes);
        let range = [];
        array.map( checkbox => {
            if(checkbox.checked) {
                range.push(checkbox.id)
            }
        })
        if(range.length===0) {
            return this.setState({error: "You have to set up question range!"})
        }
        let crossword = this.state.crossWord;
        range.map(x => {
            crossword.map( row => {
                row.map(field => {
                    if(field.name===x) {
                        if(this.state.questionType==="across") {
                            field.questionRange.push(`A${this.state.questionNumber}`)

                        } else if(this.state.questionType==="down") {
                            field.questionRange.push(`D${this.state.questionNumber}`)
                        }
                    } 
                })
            })
        })
        questions.push(question)
        questions.sort(this.compareNumbers);
        this.setState({questions: questions});
        this.setState({crossWord: crossword})
        this.setState({questionForm: false})
        
        // array.map(element => {
        //     element.checked=false
        //     element.style.visibility="hidden"
        // })
        
    } else return

    }

    renderQuestions = () => {
        this.state.questions.map( question => {
            return <p>{question.number}. {question.text}</p>
        })
    }

    handleDeleteQuestion = e => {
        let questions = this.state.questions;
        this.state.questions.map( (question, element) => {
            if(question.type===e.type && question.number===e.number) {
                questions.splice(element,1)
            }
        })

        this.setState({questions:questions})
    }

    closeHelp = () => {
        this.setState({showHelp: false});
        const mask = document.getElementById("mask");
        mask.remove()

    }

    handleSolution = e => {
        console.log("e");
    }

    showHelp = () => {
        const root = document.getElementById("root");
        const mask = document.createElement("div");
        mask.setAttribute("id", "mask");
        root.after(mask);
        this.setState({showHelp: true})
    }

    render() {

        const showHelp = (
            <div className="help-container">
                <button onClick={this.closeHelp}style={{alignSelf: "flex-end"}} className="form-button">Close</button>
            <div>
                If you want to add blank value (black field) just click on <button className="edit-button">BLANK</button> and select whick fields have to be blank
            </div>
            <div>
                If you want to add question mark to crossword just click on <button className="edit-button">QUESTION</button> and select question number from drop-down list in proper field
            </div>
            <div>
                If you want to add solution mark to crossword just click on <button className="edit-button">SOLUTION</button> button and select solution number from drop-down list in proper field
            </div>
            <div>
                If you want to add a question just click <button className="form-button">Add question</button> button and type question and number and select type of it in form. In addition you have to select range of question, you will do this by selecting checkboxes in proper fields which belongs to question.
            </div>
        </div>
            )

        return  (

        <div className="content">
        <div className="table-container">
        <button className="form-button" onClick={this.showHelp}>HELP</button>
            <div className="edit-panel-container">
                <button className="edit-button" id="blank-button" name="blank" onClick={this.handleEdit}>BLANK</button>
                <button className="edit-button" id="password-button" name="password" onClick={this.handleEdit}>SOLUTION</button>
                <button className="edit-button" id="question-button" name="question" onClick={this.handleEdit}>QUESTION</button>
            </div>
            <table className="table">
                <tbody>
                {this.renderRows(this.handleChange, this.handleClick, this.setQuestion, this.setPassword, this.state.question, this.state.password, this.state.questionForm)}
                </tbody>
            </table>
        </div>
        <div className="under-table-container">
        <div className="questions-editor-container">
                <button onClick={this.handleQuestion}className="form-button">Add question</button>
                {this.state.questionForm ? <div className="form-container">
                <label>Question number</label>
                <input type="number"
                name="question-number"
                onChange={this.handleQuestionChange}
                />
                <label>Question</label>
                <input type="text"
                name="question-text"
                onChange={this.handleQuestionChange}
                />
                <label>Type</label>
                <select name="question-type" onChange={this.handleQuestionChange}>
                    <option value=""></option>
                    <option value="across">ACROSS</option>
                    <option value="down">DOWN</option>
                </select>
                <button onClick={this.addQuestion} className="form-button">ADD</button>
                </div> : null}
            </div>
            <div className="questions-container">
                <div>ACROSS</div>
                <QuestionsAcross questions={this.state.questions} handleDelete={this.handleDeleteQuestion}/>
                <div>DOWN</div>
                <QuestionsDown questions={this.state.questions} handleDelete={this.handleDeleteQuestion}/>
            </div>
            <div className="solution-container">
                <table className="table">
                    <tbody>
                        <tr><Solution crossword={this.state.crossWord}/></tr>
                    </tbody>
                </table>
            </div>
            <button className="form-button" onClick={this.save}>SAVE</button>
            {this.state.error}
        </div>
        {this.state.showHelp ? showHelp : null}
        </div>
        )
    }
}

const mapStateToProps = (state) => {
    return { crossword: state.crossword, user: state.user };

};

export default connect(
    mapStateToProps,
    { addCrossword, getUser }
    )(Creator);