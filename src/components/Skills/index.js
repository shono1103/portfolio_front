import { useEffect, useState } from 'react'

import Loader from 'react-loaders'

import WordCloud from './wordcloud'
import AnimatedLetters from '../AnimatedLetters'
import './index.scss'

const Skills = () => {
	const [letterClass, setLetterClass] = useState('text-animate')

	const skillsArray = 'Skills'.split('')

	useEffect(() => {
		const timer = setTimeout(() => {
			setLetterClass('text-animate-hover')
		}, 2000)
		return () => clearTimeout(timer)
	}, [])

	return (
		<>
			<div className="container skills-page">
				<div className="text-zone">
					<h1>
						<AnimatedLetters
							letterClass={letterClass}
							strArray={skillsArray}
							idx={15}
						/>
						<br />
					</h1>
					<p>
						フロントエンドでは React を中心に、バックエンドでは FastAPI を用いて
						API 設計からデータの流れまで一貫して構築しています。Docker Compose による
						コンテナ化を通して、開発環境と本番環境の整合性を保ちながら、再現性の高い
						デプロイを実現しています。
					</p>
					<p>
						コードの美しさと再利用性を重視しつつ、Linux やシステム設計の知識を活かして
						FHS や systemd、Cloudflare Tunnel などの仕組みを取り入れ、運用までを見据えた
						開発を行っています。小さな改善を継続し、課題を分解・自動化することで、
						技術と体験が自然に結びつくプロダクトを目指しています。
					</p>
				</div>

				<div className="tagcloud-wrap">
					<WordCloud />
				</div>
			</div>

			<Loader type="pacman" />
		</>
	)
}

export default Skills
