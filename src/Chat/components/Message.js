import React from 'react'

class Message extends React.Component {





    render() {

        return (
            <React.Fragment>
                {this.props.message.user}: {this.props.message.message}

            </React.Fragment>
        )

    }


}

export default Message