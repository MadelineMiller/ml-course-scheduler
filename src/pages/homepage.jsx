import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";

import Logo from "../components/common/logo";
import Footer from "../components/common/footer";
import NavBar from "../components/common/navBar";

import INFO from "../data/user";

import "./styles/homepage.css";
import Scheduler from "../components/homepage/scheduler";
import ReactMarkdown from "react-markdown";

const MarkdownRenderer = ({ markdown }) => {
    return <ReactMarkdown>{markdown}</ReactMarkdown>;
};

const Homepage = ({ generate, loading, output }) => {
    const [stayLogo, setStayLogo] = useState(false);
    const [logoSize, setLogoSize] = useState(80);
    const [oldLogoSize, setOldLogoSize] = useState(80);

    useEffect(() => {
        window.scrollTo(0, 0);
    }, []);

    useEffect(() => {
        const handleScroll = () => {
            let scroll = Math.round(window.pageYOffset, 2);

            let newLogoSize = 80 - (scroll * 4) / 10;

            if (newLogoSize < oldLogoSize) {
                if (newLogoSize > 40) {
                    setLogoSize(newLogoSize);
                    setOldLogoSize(newLogoSize);
                    setStayLogo(false);
                } else {
                    setStayLogo(true);
                }
            } else {
                setLogoSize(newLogoSize);
                setStayLogo(false);
            }
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, [logoSize, oldLogoSize]);

    console.log(output);
    const logoStyle = {
        display: "flex",
        position: stayLogo ? "fixed" : "relative",
        top: stayLogo ? "3vh" : "auto",
        zIndex: 999,
        border: stayLogo ? "1px solid white" : "none",
        borderRadius: stayLogo ? "50%" : "none",
        boxShadow: stayLogo ? "0px 4px 10px rgba(0, 0, 0, 0.25)" : "none",
    };

    // const renderTable = () => {
    //     if (loading || output === "") return null;

    //     let parsedOutput;
    //     try {
    //         // Replace single quotes with double quotes and parse the string
    //         const sanitizedOutput = output.replace(/'/g, '"');
    //         parsedOutput = JSON.parse(sanitizedOutput);
    //     } catch (error) {
    //         console.error("Failed to parse output:", error);
    //         return <p>Error parsing data.</p>;
    //     }

    //     const formattedData = [];
    //     let quarter = 1;

    //     // Group data into rows with "Quarter Number", "Class 1", and "Class 2"
    //     for (let i = 0; i < parsedOutput.length; i += 2) {
    //         formattedData.push({
    //             quarter: quarter++,
    //             class1: parsedOutput[i] || "-", // Default to "-" if no data
    //             class2: parsedOutput[i + 1] || "-", // Default to "-" if no data
    //         });
    //     }

    //     return (
    //         <table
    //             border="1"
    //             style={{ width: "100%", borderCollapse: "collapse" }}
    //         >
    //             <thead>
    //                 <tr>
    //                     <th>Quarter Number</th>
    //                     <th>Class 1</th>
    //                     <th>Class 2</th>
    //                 </tr>
    //             </thead>
    //             <tbody>
    //                 {formattedData.map((row) => (
    //                     <tr key={row.quarter}>
    //                         <td>{row.quarter}</td>
    //                         <td>{row.class1}</td>
    //                         <td>{row.class2}</td>
    //                     </tr>
    //                 ))}
    //             </tbody>
    //         </table>
    //     );
    // };

    return (
        <React.Fragment>
            <Helmet>
                <title>{INFO.main.title}</title>
            </Helmet>

            <div className="page-content">
                <NavBar active="home" />
                <div className="content-wrapper">
                    <div className="homepage-logo-container">
                        <div style={logoStyle}>
                            <Logo width={logoSize} link={false} />
                        </div>
                    </div>

                    <div className="homepage-container">
                        <div className="homepage-first-area">
                            <div className="homepage-first-area-left-side">
                                <div className="title homepage-title">
                                    {INFO.homepage.title}
                                </div>

                                <div className="subtitle homepage-subtitle">
                                    {INFO.homepage.description}
                                </div>
                            </div>

                            <div className="homepage-first-area-right-side">
                                <div className="homepage-image-container">
                                    <div className="homepage-image-wrapper">
                                        <img
                                            src="homepage.jpg"
                                            alt="about"
                                            className="homepage-image"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className="homepage-projects">
                            <Scheduler generate={generate} />
                            {loading ? (
                                <div className="loading-bar">Loading...</div>
                            ) : (
                                output && (
                                    <div className="output">
                                        <MarkdownRenderer markdown={output} />
                                    </div>
                                )
                            )}
                        </div>

                        <div className="page-footer">
                            <Footer />
                        </div>
                    </div>
                </div>
            </div>
        </React.Fragment>
    );
};

export default Homepage;
