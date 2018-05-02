import React from 'react'

class Header extends React.Component {
    render(){
        return(
            <nav className="navbar">
                <div className="navbar-brand">
                    <a className="navbar-item" href="http://bulma.io">
                        {this.props.title}
                    </a>
                </div>
            </nav>
        )
    }
}

export default Header