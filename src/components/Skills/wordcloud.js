import React, { useEffect, useRef, useState } from 'react'

import TagCloud from 'TagCloud'

import { skillsApi } from '../../common/apiClient'

const DEFAULT_SKILLS = []

const options = {
	radius: 300,
	// animation speed
	// slow, normal, fast
	maxSpeed: 'fast',
	initSpeed: 'fast',
	// 0 = top
	// 90 = left
	// 135 = right-bottom
	direction: 135,
	// interact with cursor move on mouse out
	keep: true,
}

const WordCloud = () => {
	const containerRef = useRef(null)
	const tagCloudInstance = useRef(null)
	const [skills, setSkills] = useState([])

	useEffect(() => {
		let isMounted = true

		const fetchSkills = async () => {
			try {
				const apiSkills = await skillsApi.list()
				if (isMounted) {
					setSkills(Array.isArray(apiSkills) ? apiSkills : DEFAULT_SKILLS)
				}
			} catch (error) {
				console.error('Failed to load skills from API', error)
				if (isMounted) {
					setSkills(DEFAULT_SKILLS)
				}
			}
		}

		fetchSkills()

		return () => {
			isMounted = false
		}
	}, [])

	useEffect(() => {
		if (!containerRef.current || skills.length === 0) {
			return
		}

		if (tagCloudInstance.current?.destroy) {
			tagCloudInstance.current.destroy()
		}

		tagCloudInstance.current = TagCloud(containerRef.current, skills, options)

		return () => {
			if (tagCloudInstance.current?.destroy) {
				tagCloudInstance.current.destroy()
				tagCloudInstance.current = null
			}
		}
	}, [skills])

	return (
		<div className="main">
			<span className="content" ref={containerRef}></span>
		</div>
	)
}

export default WordCloud
