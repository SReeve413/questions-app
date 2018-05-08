import React, {Component} from 'react';
import trim from 'trim'
import firebase from '../../firebase'


class MessageBox extends Component {
    constructor(props){
        super(props)
        this.onChange = this.onChange.bind(this)
        this.onKeyUp = this.onKeyUp.bind(this)
        this.state = {
            text: '',
            user: this.props,

        }
    }

    // Lets the value in the text box to the message
    onChange(e){
        this.setState({
            text: e.target.value
        })
    }



    // Push message and what user is logged in up to Firebase
    onKeyUp(e){
        if(e.keyCode === 13 && trim(e.target.value) !== ''){
            e.preventDefault()
            let dbCon = firebase.database().ref('/questions')
            let newPostRef = dbCon.push({
                text: trim(e.target.value),
                user: this.props.props.profile.given_name,
                email: this.props.props.profile.email,
                users:{}
            })

            let newPost = firebase.database().ref(`/questions/${newPostRef.key}/users`)
           newPost.push({
                user: this.props.props.profile.given_name,
                email: this.props.props.profile.email,
                answered: false
            })

            this.setState({
                text: ''
            })
        }
    }



    render() {

        return (
            <form>
            <textarea
                className="textarea"
                placeholder="Type a message"
                cols="100"
                onChange ={this.onChange}
                onKeyUp ={this.onKeyUp}
                value ={this.state.text}>
              </textarea>
            </form>
        )
    }
}

export default MessageBox