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
      <div className="header-card">
        <Link to="/" className="nav-link">
          <h1 className="header-heading">Home</h1>
        </Link>
        <Link to="/jobs" className="nav-link">
          <h1 className="header-heading">Jobs</h1>
        </Link>
      </div>
      <button className="logout-btn" type="button" onClick={onLogout}>
        Logout
      </button>
      <div className="sm-links">
        <Link to="/" className="nav-link">
          <AiFillHome size="30" className="icon-styles" />
        </Link>
        <Link to="/jobs" className="nav-link">
          <BsBriefcaseFill size="30" className="icon-styles" />
        </Link>

        <FiLogOut size="30" className="icon-styles" onClick={onLogout} />
      </div>
    </nav>
  )
}

// AiFillHome  BsBriefcaseFill MdOutlineLogout
export default withRouter(Header)
