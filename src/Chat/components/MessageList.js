import React from 'react'

import firebase, {snapshotToArray} from '../../firebase.js'


class MessageList extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            messages: [],
            users: []

        }
        this.removeQuestion = this.removeQuestion.bind(this)
        this.addUserToQuestionArray = this.addUserToQuestionArray.bind(this)
        this.updateUserToAnswered = this.updateUserToAnswered.bind(this)

    }

    removeQuestion(questionId) {
        const questionsRef = firebase.database().ref(`/questions/${questionId}`);
        questionsRef.remove()
    }

    addUserToQuestionArray(questionId) {
        const questionRef = firebase.database().ref(`/questions/${questionId}/users`);
        let userArray = [];

        questionRef.on('value', function (snapshot) {
            userArray = snapshotToArray(snapshot);
        })


        if (userArray.filter(user => user.email === this.props.props.profile.email).length === 0) {
            console.log('user', userArray)
            questionRef.push({
                user: this.props.props.profile.given_name,
                email: this.props.props.profile.email,
                answered: false

            })
        }
        console.log(userArray)
    }

    updateUserToAnswered(questionId) {
        const questionRef = firebase.database().ref(`/questions/${questionId}/users`);

        let userArray = [];
        questionRef.on('value', function (snapshot) {
            userArray = snapshotToArray(snapshot);
        })

        let [filteredArray] = userArray.filter(user => user.email === this.props.props.profile.email)

        if (filteredArray) {
            const userRef = firebase.database().ref(`/questions/${questionId}/users/${filteredArray.key}`);
            userRef.update({"answered": true});
        }
    }

    componentDidMount() {

        const messagesRef = firebase.database().ref('questions');
        messagesRef.on('value', (snapshot) => {
            let questions = snapshot.val();
            let newState = [];
            let newUsers = [];

            for (let question in questions) {
                for (let user in questions[question].users) {
                    newUsers.push({
                        id: user,
                        user: questions[question].users[user].user
                    })

                }

                newState.push({
                    id: question,
                    text: questions[question].text,
                    user: questions[question].user,
                    users: newUsers
                })
                newUsers = [];
            }
            this.setState({
                messages: newState,
                users: newUsers
            })
        })

    }

    render() {
        return (
            <React.Fragment>
                <div>

                    {this.state.messages.map((question) => {
                        return (

                            <div key={question.id}>

                                {question.user === this.props.props.profile.given_name ?
                                    <button onClick={() => this.removeQuestion(question.id)}>Remove</button>
                                    : <button onClick={() => this.addUserToQuestionArray(question.id)}> Same </button>}

                                &nbsp;&nbsp;&nbsp;&nbsp;
                                {question.user}: {question.text}
                                &nbsp;&nbsp;&nbsp;&nbsp;

                                <button onClick={() => this.updateUserToAnswered(question.id)}>Ans</button>
                                &nbsp;&nbsp;&nbsp;&nbsp;
                                <button onClick={() => this.removeQuestion(question.id)}>Remove</button>

                            </div>
                        )
                    })}

                </div>
            </React.Fragment>
        )
    }
}

export default MessageList