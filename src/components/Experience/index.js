import { useEffect, useState } from 'react'

import { faBriefcase } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loader from 'react-loaders'

import { jobsApi } from '../../common/apiClient'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

const jobExperience = []

const Experience = () => {
	const experienceArray = 'Experience'.split('')
	const [letterClass, setLetterClass] = useState('text-animate')
	const [jobsExperience, setJobsExperience] = useState(jobExperience)
	const [isLoadingJobs, setIsLoadingJobs] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setLetterClass('text-animate-hover')
		}, 2000)
		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		let isMounted = true

		const fetchJobs = async () => {
			try {
				const apiJobs = await jobsApi.list()
				if (!isMounted) return

				if (Array.isArray(apiJobs) && apiJobs.length > 0) {
					setJobsExperience(apiJobs)
				} else {
					setJobsExperience(jobExperience)
				}
			} catch (error) {
				console.error('Failed to load job experience from API', error)
				if (isMounted) {
					setJobsExperience(jobExperience)
				}
			} finally {
				if (isMounted) {
					setIsLoadingJobs(false)
				}
			}
		}

		fetchJobs()

		return () => {
			isMounted = false
		}
	}, [])

	return (
		<>
			<div className="container experience-page">
				<div className="text-zone">
					<h1>
						<AnimatedLetters
							letterClass={letterClass}
							strArray={experienceArray}
							idx={15}
						/>
					</h1>
					<p>
						My professional journey spans across various industries and technologies,
						from defense systems to trading platforms and social media applications.
						Each role has contributed to my growth as a versatile software engineer.
					</p>
				</div>

				<div className="experience-container">
					<div className="timeline">
						{jobsExperience.map((jobItem, index) => (
							<div key={jobItem.id} className={`timeline-item ${index % 2 === 0 ? 'left' : 'right'}`}>
								<div className="timeline-marker">
									<FontAwesomeIcon icon={faBriefcase} />
								</div>
								<div className="timeline-content">
									<div className="job-header">
										<h3 className="company-name">
											<a href={jobItem.companyUrl} target="_blank" rel="noreferrer">
												{jobItem.company}
											</a>
										</h3>
										<h4 className="position">{jobItem.position}</h4>
										<div className="job-meta">
											<span className="duration">{jobItem.duration}</span>
											<span className="location">{jobItem.location}</span>
										</div>
									</div>
									<ul className="achievements">
										{jobItem.achievements.map((achievement, idx) => (
											<li key={idx}>{achievement}</li>
										))}
									</ul>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			{isLoadingJobs && <Loader type="pacman" />}
		</>
	)
}

export default Experience
