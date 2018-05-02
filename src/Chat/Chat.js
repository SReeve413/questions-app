import React, {Component} from 'react';
import MessageList from './components/MessageList'
import MessageBox from './components/MessageBox'
import Header from './components/Header'
import firebase from 'firebase'


class Chat extends Component {
    constructor(props) {
        super(props)
        const config = {
            apiKey: "AIzaSyCi-FJPhilRhEpsTN7dltOQdvxC9PqELBY",
            authDomain: "fir-chat-169e0.firebaseapp.com",
            databaseURL: "https://fir-chat-169e0.firebaseio.com",
            projectId: "fir-chat-169e0",
            storageBucket: "",
            messagingSenderId: "489203017475"
        };
        if (!firebase.apps.length) {
            firebase.initializeApp(config);
        }
        // firebase.initializeApp(config);
    }

    componentWillMount() {
        this.setState({profile: {}});
        const {userProfile, getProfile} = this.props.auth;
        if (!userProfile) {
            getProfile((err, profile) => {
                this.setState({profile});
            });
        } else {
            this.setState({profile: userProfile});
        }
    }


    render(){

        return(
            <React.Fragment>
                <Header title="Simple Firebase App"/>
                <div className="columns">
                    <div className="column is-3">Questions</div>
                    <br/>
                    <div className="column is-6">
                         <MessageList db={firebase} props={this.state}/>
                    </div>
                </div>
                <br/>
                <br/>
                <div className="columns">
                    <div className="column is-3">Input</div>
                    <br/>
                    <div className="column is-6">
                        <MessageBox db={firebase} props={this.state}/>
                    </div>
                </div>
            </React.Fragment>
        )

    }

}

export default Chat;