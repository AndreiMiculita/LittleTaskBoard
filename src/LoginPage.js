import React, { Component } from 'react'
import AuthService from './Services/AuthService'
import { Navigate } from 'react-router-dom'
import { ToastContainer } from 'react-toastify';

class LoginPage extends Component {

    constructor() {
        super()
        this.Auth = new AuthService()
        this.state = {
            username: '',
            password: '',
            redirectToReferrer: false
        }
    }

    handleChange = e => {
        this.setState({ [e.target.name]: e.target.value })
    }

    handleFormSubmit = e => {
        e.preventDefault()

        this.Auth.login(this.state.username, this.state.password)
            .then(res => {
                this.setState({ redirectToReferrer: true })
            })
            .catch(err => {
                alert(err)
            })
    }

    render() {
        if (this.state.redirectToReferrer) {
            return <Navigate to="/" />
        }

        return (
            <>
                <ToastContainer />
                <div className="login">
                    <h1>Log in</h1>
                    <form onSubmit={this.handleFormSubmit}>
                        <input
                            type="text"
                            name="username"
                            placeholder="Username"
                            value={this.state.username}
                            onChange={this.handleChange}
                            required
                        />
                        <br />
                        <input
                            type="password"
                            name="password"
                            placeholder="Password"
                            value={this.state.password}
                            onChange={this.handleChange}
                            required
                        />
                        <br />
                        <input type="submit" value="Submit" />
                    </form>
                    <p>
                        <a href="/forgotpassword">Forgot password?</a>
                    </p>
                    <p>
                        Don't have an account? <a href="/register">Register</a>
                    </p>
                </div>
            </>
        )
    }
}

export default LoginPage;