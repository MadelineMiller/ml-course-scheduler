import React, { useEffect } from "react";
import { Helmet } from "react-helmet";

import NavBar from "../components/common/navBar";
import Footer from "../components/common/footer";
import Logo from "../components/common/logo";
import Article from "../components/timeline/article";

import INFO from "../data/user";

import "./styles/articles.css";

const Timeline = () => {
	useEffect(() => {
		window.scrollTo(0, 0);
	}, []);

	return (
		<React.Fragment>
			<Helmet>
				<title>{`Articles | ${INFO.main.title}`}</title>
			</Helmet>

			<div className="page-content">
				<NavBar active="articles" />
				<div className="content-wrapper">
					<div className="articles-logo-container">
						<div className="articles-logo">
							<Logo width={46} />
						</div>
					</div>

					<div className="articles-main-container">
						<div className="title articles-title">
							📅 Project Timeline
						</div>

						<div className="subtitle articles-subtitle">
							Over the 10 weeks of class, we went from ideation to
							finished project using this timeline.
						</div>

						<div className="articles-container">
							<div className="articles-wrapper">
									<div
										className="articles-article"
									>
										<Article
											date="11/20/2024"
											title="Worked on website"
											description="Lorem ipsum whatever description of what we all did"
										/>
                                        <Article
											date="11/20/2024"
											title="Worked on AI"
											description="Lorem ipsum whatever description of what we all did"
										/>
                                        <Article
											date="11/20/2024"
											title="Worked on prompting"
											description="Lorem ipsum whatever description of what we all did"
										/>
									</div>
							</div>
						</div>
					</div>
					<div className="page-footer">
						<Footer />
					</div>
				</div>
			</div>
		</React.Fragment>
	);
};

export default Timeline;
