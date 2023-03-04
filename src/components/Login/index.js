import {Component} from 'react'
import {Redirect} from 'react-router-dom'
import Cookies from 'js-cookie'
import './index.css'

class Login extends Component {
  state = {
    username: '',
    password: '',
    errMsg: '',
    showSubmitError: false,
  }

  onSuccessApi = jwtToken => {
    const {history} = this.props
    Cookies.set('jwt_token', jwtToken, {expires: 30})
    this.setState({username: '', password: ''})
    history.replace('/')
  }

  onFailureApi = errMsg => {
    this.setState({errMsg, showSubmitError: true, username: '', password: ''})
  }

  onChangeUserName = event => {
    this.setState({username: event.target.value})
  }

  onChangePassword = event => {
    this.setState({password: event.target.value})
  }

  onSubmit = async event => {
    event.preventDefault()
    const {username, password} = this.state
    const userDetails = {username, password}
    const apiUrl = 'https://apis.ccbp.in/login'
    const options = {
      method: 'POST',
      body: JSON.stringify(userDetails),
    }
    const response = await fetch(apiUrl, options)
    const data = await response.json()

    if (response.ok === true) {
      this.onSuccessApi(data.jwt_token)
    } else {
      console.log('called')
      this.onFailureApi(data.error_msg)
    }
  }

  render() {
    const {username, password, showSubmitError, errMsg} = this.state
    const jwtToken = Cookies.get('jwt_token')

    if (jwtToken !== undefined) {
      return <Redirect to="/" />
    }

    return (
      <div className="login-container">
        <form className="login-card" onSubmit={this.onSubmit}>
          <div className="logo-card">
            <img
              className="login-logo-img"
              src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
              alt="website logo"
            />
          </div>
          <label htmlFor="userName">USERNAME</label>
          <input
            onChange={this.onChangeUserName}
            value={username}
            id="userName"
            className="input-styles"
            type="text"
            placeholder="Username"
          />
          <label htmlFor="password">PASSWORD</label>
          <input
            onChange={this.onChangePassword}
            value={password}
            id="password"
            className="input-styles"
            type="password"
            placeholder="Password"
          />
          <button className="login-btn" type="submit">
            Login
          </button>
          {showSubmitError && <p className="err-msg">*{errMsg}</p>}
        </form>
      </div>
    )
  }
}

export default Login
