import {BsStarFill, BsBriefcaseFill} from 'react-icons/bs'
import {HiLocationMarker} from 'react-icons/hi'
import './index.css'

const SimilarJobCard = props => {
  const {jobDetails} = props
  const {
    companyLogoUrl,
    employmentType,
    id,
    title,
    jobDescription,
    location,
    rating,
  } = jobDetails

  return (
    <li className="single-job-item">
      <div className="card-link">
        <div className="logo-heading-rating-card">
          <img
            className="comp-logo-img"
            src={companyLogoUrl}
            alt="similar job company logo"
          />
          <div className="">
            <h1 className="job-title">{title}</h1>
            <div className="icon-and-rating-card">
              <BsStarFill color="gold" />
              <p className="rating-number">{rating} </p>
            </div>
          </div>
        </div>

        <div className="job-description-card">
          <h1 className="job-description-heading">Description</h1>
          <p className="job-description-text">{jobDescription}</p>
        </div>

        <div className="location-type-package-card">
          <div className="location-type-card">
            <HiLocationMarker />
            <p className="location-text">{location}</p>
            <BsBriefcaseFill />
            <p className="type-text">{employmentType}</p>
          </div>
        </div>
      </div>
    </li>
  )
}

export default SimilarJobCard
