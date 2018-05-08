import React, {Component} from 'react';
import MessageList from './components/MessageList'
import MessageBox from './components/MessageBox'
import Header from './components/Header'
import firebase from '../firebase'

class Chat extends Component {
    // constructor(props) {
    //     super(props)
    // }

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