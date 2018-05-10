import React, {Component} from 'react';
import {Panel, ControlLabel, Glyphicon} from 'react-bootstrap';
import './Profile.css';
import NewClassroom from '../Chat/components/NewClassroom'
import JoinClassroom from '../Chat/components/JoinClassroom'


class Profile extends Component {

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



    render() {
        const {profile} = this.state;
        return (
            <div className="container">

                <NewClassroom profile={profile}/>

                <JoinClassroom profile={profile}/>

                <div className="profile-area">
                    <h1>{profile.name}</h1>
                    <Panel header="Profile">
                        <img src={profile.picture} alt="profile"/>
                        <div>
                            <ControlLabel><Glyphicon glyph="user"/> Nickname</ControlLabel>
                            <h3>{profile.nickname}</h3>
                        </div>

                        <pre>{JSON.stringify(profile, null, 2)}</pre>
                    </Panel>
                </div>
            </div>
        );
    }
}

export default Profile;
