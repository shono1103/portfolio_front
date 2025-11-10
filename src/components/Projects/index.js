import { useEffect, useState } from 'react'

import { faCode, faCodeBranch, faExternalLinkAlt } from '@fortawesome/free-solid-svg-icons'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import Loader from 'react-loaders'

import { projectsApi } from '../../common/apiClient'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

// Projects data - fallback in case API is unavailable
const DEFAULT_PROJECTS = []

const Projects = () => {
	const projectsArray = 'Projects'.split('')
	const [letterClass, setLetterClass] = useState('text-animate')
	const [filter, setFilter] = useState('All')
	const [projects, setProjects] = useState(DEFAULT_PROJECTS)
	const [isLoadingProjects, setIsLoadingProjects] = useState(true)

	useEffect(() => {
		const timer = setTimeout(() => {
			setLetterClass('text-animate-hover')
		}, 2000)
		return () => clearTimeout(timer)
	}, [])

	useEffect(() => {
		let isMounted = true

		const fetchProjects = async () => {
			try {
				const apiProjects = await projectsApi.list()
				if (!isMounted) return

				if (Array.isArray(apiProjects) && apiProjects.length > 0) {
					setProjects(apiProjects)
				} else {
					setProjects(DEFAULT_PROJECTS)
				}
			} catch (error) {
				console.error('Failed to load projects from API', error)
				if (isMounted) {
					setProjects(DEFAULT_PROJECTS)
				}
			} finally {
				if (isMounted) {
					setIsLoadingProjects(false)
				}
			}
		}

		fetchProjects()

		return () => {
			isMounted = false
		}
	}, [])

	// Get unique categories for filtering
	const categories = ['All', ...new Set(projects.map(project => project.category))]

	// Filter projects based on selected category
	const filteredProjects = filter === 'All'
		? projects
		: projects.filter(project => project.category === filter)

	return (
		<>
			<div className="container projects-page">
				<div className="text-zone">
					<h1>
						<AnimatedLetters
							letterClass={letterClass}
							strArray={projectsArray}
							idx={15}
						/>
					</h1>
					<p>
						A showcase of my technical projects spanning various domains including
						backend development, data visualization, blockchain, and DevOps. Each project
						represents a solution to real-world challenges.
					</p>

					{/* Category Filter */}
					<div className="filter-container">
						{categories.map(category => (
							<button
								key={category}
								className={`filter-btn ${filter === category ? 'active' : ''}`}
								onClick={() => setFilter(category)}
							>
								{category}
							</button>
						))}
					</div>
				</div>

				<div className="projects-container">
					<div className="projects-grid">
						{filteredProjects.map((project, index) => (
							<div key={project.id} className="project-card" style={{ animationDelay: `${index * 0.1}s` }}>
								{/* Project Images Section - with provision for multiple images */}
								{project.images && project.images.length > 0 && (
									<div className="project-images">
										<div className="image-carousel">
											{project.images.map((image, idx) => (
												<img key={idx} src={image} alt={`${project.title} ${idx + 1}`} />
											))}
										</div>
									</div>
								)}

								<div className="project-content">
									<div className="project-header">
										<div className="project-meta">
											<span className="category">{project.category}</span>
											<span className="year">{project.year}</span>
											<span className={`status ${project.status.toLowerCase()}`}>
												{project.status}
											</span>
										</div>
										<h3 className="project-title">{project.title}</h3>
										<p className="company">{project.company}</p>
									</div>

									<p className="project-description">{project.description}</p>

									<div className="project-features">
										<h4>Key Features:</h4>
										<ul>
											{project.features.map((feature, idx) => (
												<li key={idx}>{feature}</li>
											))}
										</ul>
									</div>

									<div className="technologies">
										{project.technologies.map((tech, idx) => (
											<span key={idx} className="tech-tag">{tech}</span>
										))}
									</div>

									<div className="project-links">
										{project.githubUrl && (
											<a href={project.githubUrl} target="_blank" rel="noreferrer" className="project-link">
												<FontAwesomeIcon icon={faCodeBranch} />
												<span>Code</span>
											</a>
										)}
										{project.liveUrl && (
											<a href={project.liveUrl} target="_blank" rel="noreferrer" className="project-link">
												<FontAwesomeIcon icon={faExternalLinkAlt} />
												<span>Live Demo</span>
											</a>
										)}
										{project.isPrivate && (
											<span className="private-indicator">
												<FontAwesomeIcon icon={faCode} />
												<span>Private Project</span>
											</span>
										)}
									</div>
								</div>
							</div>
						))}
					</div>
				</div>
			</div>
			{isLoadingProjects && <Loader type="pacman" />}
		</>
	)
}

export default Projects
