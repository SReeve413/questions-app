import React from 'react'

import firebase, {snapshotToArray} from '../../firebase.js'



class MessageList extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            messages: [],
            users: []

        }
        this.removeMessage = this.removeMessage.bind(this)
        this.addUserToQuestionArray = this.addUserToQuestionArray.bind(this)
        this.updateUserToAnswered = this.updateUserToAnswered.bind(this)

    }



    removeMessage(messageId) {
        const messageRef = firebase.database().ref(`/messages/${messageId}`);
        messageRef.remove()
    }

    addUserToQuestionArray(messageId){
        const messageRef = firebase.database().ref(`/messages/${messageId}/users`);
        console.log(this.state.users.filter(name => name === this.props.props.profile.given_name).length);
        console.log(this.props.props.profile.given_name);
        console.log('test', this.state.messages[messageId]);


        let userArray = [];

        messageRef.on('value',function(snapshot) {
            userArray = snapshotToArray(snapshot);
        })

        console.log(userArray)
        if(userArray.filter(user => user.user === this.props.props.profile.given_name).length === 0){
            console.log('user', userArray)
            messageRef.push({
                user: this.props.props.profile.given_name,
                answered: false

            })
        }
        console.log(userArray)
    }

    updateUserToAnswered(messageId){
        const messageRef = firebase.database().ref(`/messages/${messageId}/users`);

        let userArray = [];

        messageRef.on('value',function(snapshot) {
            userArray = snapshotToArray(snapshot);
        })

        console.log(this.props.props.profile.given_name);
        let [filteredArray] = userArray.filter(user => user.user === this.props.props.profile.given_name)

        console.log(filteredArray);

        if (filteredArray){
            const userRef = firebase.database().ref(`/messages/${messageId}/users/${filteredArray.key}`);
            userRef.update({"answered": true});



        }
        // if(userArray.filter(user => user.user === this.props.props.profile.given_name).length === 0){
        //     console.log('user', userArray)
        //     messageRef.push({
        //         user: this.props.props.profile.given_name,
        //
        //
        //     })
        // }
    }



    componentDidMount() {

        const messagesRef = firebase.database().ref('messages');
        messagesRef.on('value', (snapshot) => {
            let messages = snapshot.val();
            let newState = [];
            let newUsers = [];

            for (let message in messages) {
                for (let user in messages[message].users){
                    newUsers.push({
                        id: user,
                        user: messages[message].users[user].user
                    })

                }

                newState.push({
                    id: message,
                    text: messages[message].text,
                    user: messages[message].user,
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
        // console.log('state', this.state)

        return (
            <React.Fragment>
                <div>

                    {this.state.messages.map((message) => {
                        return (

                            <div key={message.id}>

                                {message.user === this.props.props.profile.given_name ?
                                    <button onClick={() => this.removeMessage(message.id)}>Remove</button>
                                    : <button onClick={() => this.addUserToQuestionArray(message.id)}> Same </button>}

                                &nbsp;&nbsp;&nbsp;&nbsp;
                                {message.user}: {message.text}
                                &nbsp;&nbsp;&nbsp;&nbsp;

                                <button onClick={() => this.updateUserToAnswered(message.id)}>Ans</button>
                                <button onClick={() => this.removeMessage(message.id)}>Remove Item</button>

                                {/*{console.log('message',message)}*/}
                                {/*{console.log('this', this)}*/}


                            </div>
                        )

                    })}

                </div>
            </React.Fragment>
        )
    }
}

export default MessageList