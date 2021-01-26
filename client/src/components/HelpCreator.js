import React from 'react';

function HelpCreator() {
    return (
        <div className="help-container">
            <div>
                If you want to add blank value (black field) just click on blank button and select whick fields have to be blank
            </div>
            <div>
                If you want to add question mark to crossword just click on question button and select question number from drop-down list in proper field
            </div>
            <div>
                If you want to add solution mark to crossword just click on solution button and select solution number from drop-down list in proper field
            </div>
            <div>
                If you want to add a question just click Add question button and type question and number and select type of it in form. In addition you have to select range of question, you will do this by selecting checboxes in proper fields which belongs to question.
            </div>
        </div>
    )
}

export default HelpCreator