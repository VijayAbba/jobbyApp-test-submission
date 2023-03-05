import {Component} from 'react'
import Loader from 'react-loader-spinner'
import Cookies from 'js-cookie'
import {BsSearch} from 'react-icons/bs'
import Header from '../Header'

import JobCard from '../JobCard'
import './index.css'

const salaryRangesList = [
  {
    salaryRangeId: '1000000',
    label: '10 LPA and above',
  },
  {
    salaryRangeId: '2000000',
    label: '20 LPA and above',
  },
  {
    salaryRangeId: '3000000',
    label: '30 LPA and above',
  },
  {
    salaryRangeId: '4000000',
    label: '40 LPA and above',
  },
]

const employmentTypesList = [
  {
    label: 'Full Time',
    employmentTypeId: 'FULLTIME',
  },
  {
    label: 'Part Time',
    employmentTypeId: 'PARTTIME',
  },
  {
    label: 'Freelance',
    employmentTypeId: 'FREELANCE',
  },
  {
    label: 'Internship',
    employmentTypeId: 'INTERNSHIP',
  },
]

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
    typesOfEmployment: [],
    salaryRange: '',
    searchText: '',
  }

  componentDidMount() {
    this.getProfileDetails()
    this.getJobsDetails()
  }

  getJobsDetails = async () => {
    this.setState({jobsStatus: apiStatusConsonents.pending})
    const {typesOfEmployment, salaryRange, searchText} = this.state
    const newTypesOfEmployment = typesOfEmployment
    const joinedNewTypesOfEmployment = newTypesOfEmployment.join()
    console.log(joinedNewTypesOfEmployment)
    const jwtToken = Cookies.get('jwt_token')
    const apiUrl2 = `https://apis.ccbp.in/jobs?employment_type=${joinedNewTypesOfEmployment}&minimum_package=${salaryRange}&search=${searchText}`
    console.log(apiUrl2)
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl2, options)

    const data = await response.json()

    if (response.ok === true) {
      const {jobs, total} = data
      console.log(jobs)
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
  }

  onChangeRadio = event => {
    this.setState({salaryRange: event.target.value}, this.getJobsDetails)
  }

  onFullTime = event => {
    const targetId = event.target.id
    const {typesOfEmployment} = this.state

    const newArray = typesOfEmployment.filter(eachItem => eachItem !== targetId)

    if (event.target.checked === true) {
      this.setState(
        {typesOfEmployment: [...typesOfEmployment, targetId]},
        this.getJobsDetails,
      )
    } else {
      this.setState({typesOfEmployment: newArray}, this.getJobsDetails)
    }
  }

  salaryRangCard = () => (
    <div className="">
      <h1 className="types-of-employment-heading">Salary Range</h1>
      <ul>
        {salaryRangesList.map(eachItem => (
          <li className="check-box-card" key={eachItem.salaryRangeIds}>
            <input
              id={eachItem.salaryRangeId}
              className=""
              type="radio"
              name="package"
              value={eachItem.salaryRangeId}
              onChange={this.onChangeRadio}
            />
            <label htmlFor={eachItem.salaryRangeId}>{eachItem.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  typeOfEmployment = () => (
    <div className="type-of-employment-card">
      <h1 className="types-of-employment-heading">Type of Employment</h1>
      <ul>
        {employmentTypesList.map(eachItem => (
          <li className="check-box-card" key={eachItem.employmentTypeId}>
            <input
              id={eachItem.employmentTypeId}
              className=""
              type="checkbox"
              onChange={this.onFullTime}
            />
            <label htmlFor={eachItem.employmentTypeId}>{eachItem.label}</label>
          </li>
        ))}
      </ul>
    </div>
  )

  jobsListCard = () => {
    const {jobsData} = this.state

    if (jobsData.length === 0) {
      return (
        <div className="no-jobs-card">
          <img
            className="no-jobs-img"
            src="https://assets.ccbp.in/frontend/react-js/no-jobs-img.png"
            alt="no jobs"
          />

          <h1 className="no-jobs-heading">No Jobs Found</h1>
          <p className="no-jobs-">
            We Could not find any jobs. Try other filters.
          </p>
        </div>
      )
    }

    return (
      <div className="jobs-list-card">
        <ul className="jobs-ul-card">
          {jobsData.map(eachItem => (
            <JobCard jobDetails={eachItem} key={eachItem.id} />
          ))}
        </ul>
      </div>
    )
  }

  jobsListFailure = () => (
    <div className="jobs-failure-card">
      <img
        className="failure-view-img"
        src="https://assets.ccbp.in/frontend/react-js/failure-img.png"
        alt="failure view"
      />
      <h1 className="jobs-failure-heading">Oops! Something Went Wrong</h1>
      <p className="jobs-failure-para">
        We cannot seem to find the page you are looking for.
      </p>
      <button
        className="failure-retry-btn"
        type="button"
        onClick={this.getJobsDetails}
      >
        Retry
      </button>
    </div>
  )

  profileCard = () => {
    const {profileData} = this.state
    const {name, profileImageUrl, shortBio} = profileData
    return (
      <div className="profile-success-card">
        <img
          className="profile-success-avatar"
          src={profileImageUrl}
          alt="profile"
        />
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

  onSearchEnter = event => {
    if (event.key === 'Enter') {
      this.getJobsDetails()
    }
  }

  onSaveSearch = event => {
    this.setState({searchText: event.target.value})
  }

  searchInputField = () => (
    <div className="search-card">
      <input
        className="search-input"
        type="search"
        onChange={this.onSaveSearch}
        onKeyDown={this.onSearchEnter}
        placeholder="Search"
      />
      <button
        className=""
        type="button"
        data-testid="searchButton"
        onClick={this.getJobsDetails}
      >
        <BsSearch size="40" className="search-icon" />
      </button>
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
        return this.jobsListFailure()
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
          <div className="profile-card-two">{this.typeOfEmployment()}</div>
          <hr className="hr-line" />
          <div className="profile-card-two">{this.salaryRangCard()}</div>
          {this.renderJobsList()}
        </div>
      </div>
    )
  }
}

export default Jobs
