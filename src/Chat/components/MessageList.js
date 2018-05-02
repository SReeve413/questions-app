import React from 'react'
import Message from './Message'

import _ from 'lodash'

class MessageList extends React.Component {

    constructor(props) {
        super(props)

        this.state = {
            messages: []
        }

        let app = this.props.db.database().ref('messages')
        app.on('value', snapshot => {
            this.getData(snapshot.val())
        })
    }

    getData(values){
        let messageVal = values
        let messages = _(messageVal)
            .keys()
            .map(messageKey => {
                let cloned = _.clone(messageVal[messageKey])
                cloned.key = messageKey
                return cloned
            })
            .value()
        this.setState({
            messages: messages
        })
    }


    render() {
        let messageNodes = this.state.messages.map((message) => {
            return(
                <div className="card">
                    <div className="card-content">
                        <Message message= {message} />
                    </div>
                </div>
            )
        })

        return (
            <React.Fragment>
                {messageNodes}
            </React.Fragment>
        )
    }
}

export default MessageList