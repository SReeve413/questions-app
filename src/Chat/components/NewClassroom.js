import React from 'react'
import firebase from '../../firebase.js'
import trim from "trim";



class NewClassroom extends React.Component {
    constructor(props){
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
    handleChange(e){
        this.setState({
            [e.target.name]: e.target.value
        })
    }


    handleSubmit(e) {
        e.preventDefault();
        const classroomRef = firebase.database().ref('classrooms');
        const classroom = {
            classroomName: this.state.classroomName,
            classCode: this.state.classCode,
        };
        if (trim(classroom.classroomName) !== '' && trim(classroom.classCode) !== '') {
            let room = classroomRef.push(classroom)
            let roomRef = firebase.database().ref(`classrooms/${room.key}/inClass`)
            roomRef.push({
                user: this.props.profile.name,
                email:this.props.profile.email,
                teacher: true,
                aid: true,

            })
            this.setState({
                classroomName: '',
                classCode: ''
            })
        }
    }


    render(){

        return(
            <React.Fragment>
                <form onSubmit = {this.handleSubmit}>
                    <p>New Classroom Name:</p>
                    <input type="text" name="classroomName" value ={this.state.classroomName}
                           placeholder="New Classroom Name?" onChange={this.handleChange} required/>
                    <p>Password:</p>
                    <input type="text" name="classCode"  value ={this.state.classCode}
                           placeholder="Classroom Code" onChange={this.handleChange} required />

                    <br/>
                    <br/>
                    <button type='submit'> Create Classroom </button>

                </form>
            </React.Fragment>
        )
    }

}

export default NewClassroom