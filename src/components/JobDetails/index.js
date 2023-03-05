import {Component} from 'react'
import Cookies from 'js-cookie'
import Loader from 'react-loader-spinner'

import {BsStarFill, BsBriefcaseFill, BsBoxArrowUpRight} from 'react-icons/bs'
import {HiLocationMarker} from 'react-icons/hi'
import SimilarJobCard from '../similarJobCard'

import Header from '../Header'
import './index.css'

const apiStatusConsonents = {
  initial: 'INITIAL',
  success: 'SUCCESS',
  failure: 'FAILURE',
  pending: 'PENDING',
}

class JobDetails extends Component {
  state = {
    apiStatus: apiStatusConsonents.failure,
    jobDetails: {},
    lifeAtCompany: {},
    skills: [],
    similarJobs: [],
  }

  componentDidMount = () => {
    this.getJobFullDetails()
  }

  getJobFullDetails = async () => {
    this.setState({apiStatus: apiStatusConsonents.pending})
    const {match} = this.props
    const {params} = match
    const {id} = params

    const jwtToken = Cookies.get('jwt_token')

    const apiUrl = `https://apis.ccbp.in/jobs/${id}`
    const options = {
      headers: {
        Authorization: `Bearer ${jwtToken}`,
      },
      method: 'GET',
    }

    const response = await fetch(apiUrl, options)

    const data = await response.json()

    if (response.ok === true) {
      const updatedData = {
        jobDetails: data.job_details,
        similarJobs: data.similar_jobs,
      }

      const {jobDetails, similarJobs} = updatedData
      const updatedJobDetails = {
        companyLogoUrl: jobDetails.company_logo_url,
        companyWebsiteUrl: jobDetails.company_website_url,
        employmentType: jobDetails.employment_type,
        id: jobDetails.id,
        jobDescription: jobDetails.job_description,
        lifeAtCompany: jobDetails.life_at_company,
        location: jobDetails.location,
        packagePerAnnum: jobDetails.package_per_annum,
        rating: jobDetails.rating,
        skills: jobDetails.skills,
        title: jobDetails.title,
      }

      const {lifeAtCompany, skills} = updatedJobDetails

      const updatedLifeAtCompany = {
        description: lifeAtCompany.description,
        imageUrl: lifeAtCompany.image_url,
      }

      const updatedSkills = skills.map(eachItem => ({
        imageUrl: eachItem.image_url,
        name: eachItem.name,
      }))

      const updatedSimilarJobs = similarJobs.map(eachItem => ({
        companyLogoUrl: eachItem.company_logo_url,
        employmentType: eachItem.employment_type,
        id: eachItem.id,
        jobDescription: eachItem.job_description,
        location: eachItem.location,
        rating: eachItem.rating,
        title: eachItem.title,
      }))

      this.setState({
        jobDetails: updatedJobDetails,
        lifeAtCompany: updatedLifeAtCompany,
        skills: updatedSkills,
        apiStatus: apiStatusConsonents.success,
        similarJobs: updatedSimilarJobs,
      })
    } else {
      this.setState({apiStatus: apiStatusConsonents.failure})
    }
  }

  JobDetailsSuccessView = () => {
    const {jobDetails, lifeAtCompany, skills, similarJobs} = this.state

    const {
      companyLogoUrl,
      companyWebsiteUrl,
      employmentType,
      jobDescription,
      location,
      packagePerAnnum,
      rating,
      title,
    } = jobDetails

    const {description, imageUrl} = lifeAtCompany

    const {match} = this.props
    const {params} = match
    const {id} = params
    return (
      <>
        <div className="job-details-success-container">
          <div className="logo-heading-rating-card">
            <img
              className="comp-logo-img"
              src={companyLogoUrl}
              alt="job details company logo"
            />
            <div className="">
              <h1 className="job-title">{title}</h1>
              <div className="icon-and-rating-card">
                <BsStarFill color="gold" />
                <p className="rating-number">{rating} </p>
              </div>
            </div>
          </div>
          <div className="location-type-package-card">
            <div className="location-type-card">
              <HiLocationMarker />
              <p className="location-text">{location}</p>
              <BsBriefcaseFill />
              <p className="type-text">{employmentType}</p>
            </div>
            <p className="">{packagePerAnnum}</p>
          </div>
          <hr className="hr-line-2" />
          <div className="job-description-card">
            <div className="success-description-card">
              <h1 className="job-description-heading">Description</h1>

              <a className="visit-link" href={companyWebsiteUrl}>
                <p className="visit-text">Visit</p>
                <BsBoxArrowUpRight className="" />
              </a>
            </div>
            <p className="job-description-text">{jobDescription}</p>
          </div>
          <div className="">
            <h1 className="job-description-heading">Skills</h1>
            <ul className="skills-card">
              {skills.map(eachItem => (
                <li className="single-skill-card" key={eachItem.name}>
                  <img
                    className="skill-img"
                    src={eachItem.imageUrl}
                    alt={eachItem.name}
                  />
                  <p className="">{eachItem.name}</p>
                </li>
              ))}
            </ul>
            <div className="">
              <h1 className="job-description-heading">Life at Company</h1>
              <p className="">{description}</p>
              <img
                className="company-life-img"
                src={imageUrl}
                alt="life at company"
              />
            </div>
          </div>
        </div>
        <div className="similar-jobs-card">
          <h1 className="similar-jobs-headinga">Similar Jobs</h1>
          <ul>
            {similarJobs.map(eachItem => (
              <SimilarJobCard jobDetails={eachItem} key={eachItem.id} />
            ))}
          </ul>
        </div>
      </>
    )
  }

  JobDetailsFailureView = () => {
    const {apiStatus} = this.state
    return (
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
          onClick={this.getJobFullDetails}
        >
          Retry
        </button>
      </div>
    )
  }

  renderLoader = () => (
    <div className="loader-container" data-testid="loader">
      <Loader type="ThreeDots" color="#ffffff" height="50" width="50" />
    </div>
  )

  renderJobDetails = () => {
    const {apiStatus} = this.state
    switch (apiStatus) {
      case apiStatusConsonents.success:
        return this.JobDetailsSuccessView()
      case apiStatusConsonents.failure:
        return this.JobDetailsFailureView()
      case apiStatusConsonents.pending:
        return this.renderLoader()
      default:
        return null
    }
  }

  render() {
    return (
      <div className="jobDetails-card">
        <Header />
        <div className="job-details-card">{this.renderJobDetails()}</div>
      </div>
    )
  }
}

export default JobDetails
