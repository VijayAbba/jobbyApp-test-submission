import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'
import './index.css'

const apiStatusConsonents = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  pending: 'PENDING',
}

class Jobs extends Component {
  state = {
    profileStatus: apiStatusConsonents.initial,
    jobsStatus: apiStatusConsonents.initial,
    jobsData: [],
    profileData: {},
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getJobsDetails = async () => {
    this.setState({jobsStatus: apiStatusConsonents.pending})

    const jwtToken = Cookies.get('jwt_token')
    const apiUrl =
      'https://apis.ccbp.in/jobs?employment_type=FULLTIME,PARTTIME&minimum_package=1000000&search='
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch(apiUrl, options)

    const data = await response.json()

    if (response.ok === true) {
      const {jobs, total} = data

      const updatedJobsData = jobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        packagePerAnnum: eachItem.package_per_annum,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      console.log(updatedJobsData)

      this.setState({
        jobsData: updatedJobsData,
        jobsStatus: apiStatusConsonents.success,
      })
    } else {
      this.setState({jobsStatus: apiStatusConsonents.failure})
    }
  }

  getProfileDetails = async () => {
    this.setState({profileStatus: apiStatusConsonents.pending})

    const jwtToken = Cookies.get('jwt_token')

    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }
    const response = await fetch('https://apis.ccbp.in/profile', options)

    const data = await response.json()

    if (response.ok === true) {
      const profileData = data.profile_details
      const updatedProfileData = {
        name: profileData.name,
        profileImageUrl: profileData.profile_image_url,
        shortBio: profileData.short_bio,
      }

      this.setState({
        profileData: updatedProfileData,
        profileStatus: apiStatusConsonents.success,
      })
    } else {
      this.setState({profileStatus: apiStatusConsonents.failure})
    }
    // console.log(response)
  }

  jobsListCard = () => {
    const {jobsData} = this.state
    return (
      <div className="">
        {jobsData.map(eachItem => (
          <li>{eachItem.title}</li>
        ))}
      </div>
    )
  }

  jobsListFailure = () => {
    const {jobsData} = this.state
    return (
      <div className="">
        <h1 className="">Failure</h1>
      </div>
    )
  }

  profileCard = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-success-card">
        <img className="profile-success-avatar" src={profileImageUrl} alt="" />
        <h1 className="profile-success-name">{name}</h1>
        <p className="profile-success-bio">{shortBio}</p>
      </div>
    )
  }

  profileFailureView = () => (
    <div className="">
      <button
        className="profile-retry-btn"
        type="button"
        onClick={this.getProfileDetails}
      >
        Retry
      </button>
    </div>
  )

  searchInputField = () => (
    <div className="search-card">
      <input className="search-input" type="search" placeholder="Search" />
      <BsSearch size="40" className="search-icon" />
    </div>
  )

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderProfileView = () => {
    const {profileStatus} = this.state

    switch (profileStatus) {
      case apiStatusConsonents.success:
        return this.profileCard()
      case apiStatusConsonents.failure:
        return this.profileFailureView()
      case apiStatusConsonents.pending:
        return this.renderLoader()
      default:
        return null
    }
  }

  renderJobsList = () => {
    const {jobsStatus} = this.state

    switch (jobsStatus) {
      case apiStatusConsonents.success:
        return this.jobsListCard()
      case apiStatusConsonents.failure:
        return this.profileFailureView()
      case apiStatusConsonents.pending:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="app-container">
        <Header />
        <div className="jobs-container">
          {this.searchInputField()}
          <div className="profile-card">{this.renderProfileView()}</div>
          <hr className="hr-line" />
          <hr className="hr-line" />
          {this.jobsListCard()}
        </div>
      </div>
    )
  }
}

export default Jobs
