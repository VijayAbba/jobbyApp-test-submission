import {withRouter, Link} from 'react-router-dom'
import Cookies from 'js-cookie'

import {AiFillHome} from 'react-icons/ai'
import {BsBriefcaseFill} from 'react-icons/bs'
import {FiLogOut} from 'react-icons/fi'

import './index.css'

const Header = props => {
  const {n} = props
  //   console.log(n)
  const onLogout = () => {
    Cookies.remove('jwt_token')
    const {history} = props
    history.replace('/login')
  }

  return (
    <nav className="header-container">
      <Link to="/" className="nav-link">
        <img
          className="logo-img"
          src="https://assets.ccbp.in/frontend/react-js/logo-img.png"
          alt="website logo"
        />
      </Link>
      <ul className="header-card">
        <li>
          <Link to="/" className="nav-link">
            <h1 className="header-heading">Home</h1>
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="nav-link">
            <h1 className="header-heading">Jobs</h1>
          </Link>
        </li>
      </ul>
      <button className="logout-btn" type="button" onClick={onLogout}>
        Logout
      </button>
      <ul className="sm-links">
        <li>
          <Link to="/" className="nav-link">
            <AiFillHome size="30" className="icon-styles" />
          </Link>
        </li>
        <li>
          <Link to="/jobs" className="nav-link">
            <BsBriefcaseFill size="30" className="icon-styles" />
          </Link>
        </li>
        <li>
          <FiLogOut size="30" className="icon-styles" onClick={onLogout} />
        </li>
      </ul>
    </nav>
  )
}

// AiFillHome  BsBriefcaseFill MdOutlineLogout
export default withRouter(Header)
