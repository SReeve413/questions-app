import history from '../history';
import auth0 from 'auth0-js';
import {AUTH_CONFIG} from './auth0-variables';
import firebase, {snapshotToArray} from '../firebase'

import Rebase from '../configuration/firebase'

export default class Auth {
    auth0 = new auth0.WebAuth({
        domain: AUTH_CONFIG.domain,
        clientID: AUTH_CONFIG.clientId,
        redirectUri: AUTH_CONFIG.callbackUrl,
        audience: `https://${AUTH_CONFIG.domain}/userinfo`,
        responseType: 'token id_token',
        scope: 'openid profile email'
    });

    userProfile;

    constructor() {
        this.login = this.login.bind(this);
        this.logout = this.logout.bind(this);
        this.handleAuthentication = this.handleAuthentication.bind(this);
        this.isAuthenticated = this.isAuthenticated.bind(this);
        this.getAccessToken = this.getAccessToken.bind(this);
        this.getProfile = this.getProfile.bind(this);
    }

    login() {
        this.auth0.authorize();
    }

    async parseHash() {
        return new Promise((resolve, reject) => {
            this.auth0.parseHash((err, result) => {
                if(err) return reject(err)
                return resolve(result)
            })
        })
    }

    async handleAuthentication() {
        const authResult = await this.parseHash()
        if (authResult && authResult.accessToken && authResult.idToken) {
            await this.setSession(authResult)
            const users = await Rebase.fetch('users', {
                context: this,
                asArray: true,
            })
            console.log(authResult);
            console.log(users);
            // const usersRef = firebase.database().ref('/users')
            if (users.filter(user => user.sub === authResult.idTokenPayload.sub).length === 0) {
                console.log('user', users)
                const updatedUser = await Rebase.push('users', { data: {
                        name: authResult.idTokenPayload.name,
                        email:authResult.idTokenPayload.email,
                        sub:authResult.idTokenPayload.sub,
                    }})
                console.log(updatedUser);

                // usersRef.push({
                //     name: authResult.idTokenPayload.name,
                //     email:authResult.idTokenPayload.email,
                //     sub:authResult.idTokenPayload.sub
                // })

            }
                return history.replace('/home')

        }



        // this.auth0.parseHash((err, authResult) => {
        //     if (authResult && authResult.accessToken && authResult.idToken) {
        //         this.setSession(authResult);
        //
        //         const usersRef = firebase.database().ref('/users').once('value');
        //         console.log('testing' , usersRef);
        //         let usersArray = [];
        //         usersRef.on('value', function (snapshot) {
        //             usersArray = snapshotToArray(snapshot);
        //         })
        //         console.log(usersArray)
        //         if (usersArray.filter(user => user.sub === authResult.idTokenPayload.sub).length === 0) {
        //             console.log('user', usersArray)
        //             usersRef.push({
        //                 name: authResult.idTokenPayload.name,
        //                 email:authResult.idTokenPayload.email,
        //                 sub:authResult.idTokenPayload.sub
        //             })
        //         }
        //
        //         console.log('authresult', authResult)
        //
        //         history.replace('/home');
        //     } else if (err) {
        //         history.replace('/home');
        //         console.log(err);
        //         alert(`Error: ${err.error}. Check the console for further details.`);
        //     }
        // });
    }

    async setSession(authResult) {
        // Set the time that the access token will expire at
        let expiresAt = JSON.stringify((authResult.expiresIn * 1000) + new Date().getTime());
        localStorage.setItem('access_token', authResult.accessToken);
        localStorage.setItem('id_token', authResult.idToken);
        localStorage.setItem('expires_at', expiresAt);
        // navigate to the home route
        // history.replace('/home');
    }

    getAccessToken() {
        const accessToken = localStorage.getItem('access_token');
        if (!accessToken) {
            throw new Error('No access token found');
        }
        return accessToken;
    }

    getProfile(cb) {
        let accessToken = this.getAccessToken();
        this.auth0.client.userInfo(accessToken, (err, profile) => {
            if (profile) {
                this.userProfile = profile;
            }
            cb(err, profile);
        });
    }

    logout() {
        // Clear access token and ID token from local storage
        localStorage.removeItem('access_token');
        localStorage.removeItem('id_token');
        localStorage.removeItem('expires_at');
        // navigate to the home route
        history.replace('/home');
    }

    isAuthenticated() {
        // Check whether the current time is past the
        // access token's expiry time
        let expiresAt = JSON.parse(localStorage.getItem('expires_at'));
        return new Date().getTime() < expiresAt;
    }
}
