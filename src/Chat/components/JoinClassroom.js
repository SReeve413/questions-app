import React from 'react'
import firebase from '../../firebase.js'
import trim from "trim";
import {snapshotToArray} from "../../firebase";
import Rebase from '../../configuration/firebase'


class JoinClassroom extends React.Component {
    constructor(props) {
        super(props)
        this.handleChange = this.handleChange.bind(this)
        this.handleSubmit = this.handleSubmit.bind(this)
        this.state = {
            classroomName: '',
            classCode: '',
            user: '',

        }
    }

    // Lets the value in the text box to the message
    handleChange(e) {
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    async handleSubmit(e) {
        e.preventDefault();
        const classrooms = await Rebase.fetch('classrooms', {
            context: this,
            asArray: true,
        })

        const joinRoom = {
            classroomName: this.state.classroomName,
            classCode: this.state.classCode,
        };
        let [room] = classrooms.filter(theRoom => theRoom.classroomName === joinRoom.classroomName && theRoom.classCode === joinRoom.classCode)
        let users = await Rebase.fetch(`classrooms/${room.key}/inClass`, {
            context: this,
            asArray: true,
        })
        let user = users.filter(user => user.email  === this.props.profile.email)

        console.log('room', room)
        console.log('user', user)
        if (room && user.length === 0) {
            let returnUser = Rebase.push(`classrooms/${room.key}/inClass`,{ data: {
                    user: this.props.profile.name,
                    email:this.props.profile.email,
                    teacher: false,
                    aid: false,
                }})
            let users = await Rebase.fetch('users', {
                context: this,
                asArray: true,
            })

            console.log('user', users)


            let [currentUser] = users.filter(user => user.email === this.props.profile.email)

            console.log('current', currentUser);

            let userClassrooms = await Rebase.push(`users/${currentUser.key}/classes`, {
                data: {
                    classroom: joinRoom.classroomName,
                    classKey: room.key,
                }})
            console.log(userClassrooms)


            this.setState({
                classroomName: '',
                classCode: ''
            })


        } else {
            this.setState({
                classroomName: 'Already in that Class',
                classCode: ''
            })
        }
    }


    render() {

        return (

            <React.Fragment>
                <form onSubmit={this.handleSubmit}>
                    <p>New Classroom Name:</p>
                    <input type="text" name="classroomName" value={this.state.classroomName}
                           placeholder="New Classroom Name?" onChange={this.handleChange} required/>
                    <p>Password:</p>
                    <input type="text" name="classCode" value={this.state.classCode}
                           placeholder="Classroom Code" onChange={this.handleChange} required/>

                    <br/>
                    <br/>
                    <button type='submit'> Join Classroom</button>

                </form>
            </React.Fragment>
        )
    }

}

export default JoinClassroom