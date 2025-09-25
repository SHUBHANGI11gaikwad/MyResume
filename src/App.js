import React, { useState, useEffect, useRef} from 'react';
import Chart from 'chart.js/auto';

// React functional component for the entire application
const App = () => {
    // State variables for UI interactions and data
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [flippedStates, setFlippedStates] = useState({}); // To manage project card flips
    const [activeNavLink, setActiveNavLink] = useState('about');
    // To store LLM-generated project summaries and their loading states
    const [projectSummaries, setProjectSummaries] = useState({}); 
    const [isLoadingProjectSummary, setIsLoadingProjectSummary] = useState({}); 
    // Resume data is now hardcoded directly
    const initialSkills = [
        'Python', 'Java', 'SQL', 'JavaScript', 'React', 'Dot Net', 'Spring Boot', 'ReactJS', 'HTML/CSS', 'Database Mgmt'
    ];
    const initialSkillProficiency = [79, 85, 80, 75, 80, 75, 75, 70, 90, 85];
    const initialProjects = [
        {
            id: 'weather-detection',
            title: 'Real Time Weather Detection',
            summary: 'A Python-based prototype application to predict atmospheric conditions and send notifications.',
            details: [
                'Developed a Python-based prototype for prediction.',
                'Implemented data processing and analysis techniques.',
                'Focused on real-time data handling and notifications.',
                'Showcases data pipeline and application development skills.',
            ]
        },
        {
            id: 'my-portfolio',
            title: 'My Portfolio',
            summary: 'A dynamic web application built with ReactJS to showcase personal and academic projects.',
            details: [
                'Built with ReactJS, HTML5, and CSS3.',
                'Demonstrates proficiency in front-end development.',
                'Focuses on clean UI and responsive layout design.',
                'Effective for project presentation and personal branding.',
            ]
        },
        {
            id: 'library-management',
            title: 'Library Management System',
            summary: 'A console-based system in C# with full CRUD operations for library management.',
            details: [
                'Backend logic built with core Java.',
                'A simple C# Console Application to manage a library database using SQL Server.',
                'This project demonstrates basic CRUD operations (Create, Read, Update, Delete/Search) from a console menu, suitable for learning, interviews, and university assessments.',
                'Utilized MySQL for database management.',
                'Implemented full CRUD (Create, Read, Update, Delete) operations.',
                'Solidified database interaction and application logic skills.',
            ]
        },
         {
            id: 'NotesApp',
            title: 'Notes Manager System',
            summary: 'A Next.js with full CRUD Operations for Notes-saas management.',
            details: [
                'Backend logic built with Next.js.',
              'Solidified database interaction and application logic skills.',
              'https://notes-saas-phi.vercel.app/',
            ]
        },
        {
            id: 'Employee CRUD Application',
            title: 'Employee Management System',
            summary: 'This is a simple full-stack web application built with ASP.NET Core Razor Pages to demonstrate basic CRUD (Create, Read, Update, Delete) operations.',
            details: [
              'Backend logic built with ASP.NET Core Razor Pages.',
              ' Solidified database interaction and application logic skills.',
              ' Create: Add a new employee to the database.',
              'Read: View a list of all employees and their details.',
              'Update: Edit the details of an existing employee.',
              'Delete: Remove an employee from the database.'
            ]
        }
    ];

    // Initialize resumeData directly with the hardcoded data
    const [resumeData] = useState({
        skills: initialSkills,
        skillProficiency: initialSkillProficiency,
        projects: initialProjects,
        aboutText: "Motivated Computer Engineer with a strong foundation in Java, Dot Net and SQL, seeking an entry-level opportunity as an Software engineer or AI Engineer. Eager to leverage analytical skills and project experience in real-time data processing and predictive modeling to contribute to innovative AI and data-driven solutions, gain exposure to live projects, and drive continuous professional growth."
    });

    // Ref for the Chart.js canvas element
    const chartRef = useRef(null);
    const chartInstance = useRef(null);

    // Derived data for LLM topics, updated when resumeData changes


    // Effect for initializing and destroying Chart.js instance
    useEffect(() => {
        if (!resumeData || !chartRef.current) return; // Wait for resumeData and chart ref

        if (chartInstance.current) {
            chartInstance.current.destroy();
        }

        const ctx = chartRef.current.getContext('2d');
        chartInstance.current = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: resumeData.skills,
                datasets: [{
                    label: 'Proficiency Level',
                    data: resumeData.skillProficiency,
                    backgroundColor: 'rgba(79, 70, 229, 0.8)',
                    borderColor: 'rgba(79, 70, 229, 1)',
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y',
                maintainAspectRatio: false,
                responsive: true,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 100,
                        ticks: {
                            display: false,
                        },
                         grid: {
                            display: false
                        }
                    },
                    y: {
                         ticks: {
                            color: '#1f2937',
                            font: {
                                size: 14,
                            }
                        },
                        grid: {
                            display: false
                        }
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            label: function(context) {
                                let value = context.raw;
                                let proficiency = '';
                                if (value >= 90) proficiency = 'Advanced';
                                else if (value >= 75) proficiency = 'Proficient';
                                else proficiency = 'Intermediate';
                                return `${proficiency}`;
                            }
                        }
                    }
                }
            }
        });

        return () => {
            if (chartInstance.current) {
                chartInstance.current.destroy();
            }
        };
    }, [resumeData]);

 
    // Effect for handling scroll-based active navigation link highlighting
    useEffect(() => {
        const sections = document.querySelectorAll('main section');
        const handleScroll = () => {
            let currentActive = 'about';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.scrollY >= sectionTop - 100 && window.scrollY < sectionTop + sectionHeight - 100) {
                    currentActive = section.id;
                }
            });
            setActiveNavLink(currentActive);
        };

        window.addEventListener('scroll', handleScroll);
        handleScroll();

        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const handleMenuToggle = () => {
        setShowMobileMenu(!showMobileMenu);
    };

    const handleFlipperClick = (projectId) => {
        setFlippedStates(prevState => ({
            ...prevState,
            [projectId]: !prevState[projectId]
        }));
    };



    const handleSummarizeProject = async (projectId, projectTitle, projectDetails) => {
        setIsLoadingProjectSummary(prevState => ({ ...prevState, [projectId]: true }));
        setProjectSummaries(prevState => ({ ...prevState, [projectId]: '' }));

        try {
            let chatHistory = [];
            // Modified prompt to request bullet points
            const prompt = `Generate a concise, impactful summary (under 80 words) of the following project for a technical recruiter. Highlight its key objective, technologies used, and main achievement in 2-3 bullet points.\n\nProject Title: ${projectTitle}\nDetails: ${projectDetails.join('\n')}`;
            chatHistory.push({ role: "user", parts: [{ text: prompt }] });
            const payload = { contents: chatHistory };
            const apiKey = "AIzaSyAQhO7wnLZVb2_1MaAglJ64fDmC69BIXbg";
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`;

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });
            const result = await response.json();

            if (result.candidates && result.candidates.length > 0 &&
                result.candidates[0].content && result.candidates[0].content.parts &&
                result.candidates[0].content.parts.length > 0) {
                const text = result.candidates[0].content.parts[0].text;
                setProjectSummaries(prevState => ({ ...prevState, [projectId]: text }));
            } else {
                setProjectSummaries(prevState => ({ ...prevState, [projectId]: 'Failed to generate summary.' }));
            }
        } catch (error) {
            console.error('Error fetching project summary:', error);
            setProjectSummaries(prevState => ({ ...prevState, [projectId]: 'Error generating summary.' }));
        } finally {
            setIsLoadingProjectSummary(prevState => ({ ...prevState, [projectId]: false }));
        }
    };
    // Helper function to render text with line breaks as paragraphs or list items
    const renderFormattedText = (text) => {
        if (!text) return null;
        const lines = text.split('\n').filter(line => line.trim() !== ''); // Filter out empty lines
        
        // Check if the text is a numbered list
        const isNumberedList = lines.every(line => /^\d+\.\s/.test(line.trim()));
        // Check if the text is a bulleted list (can be -, *, or •)
        const isBulletedList = lines.every(line => /^[*\-•]\s/.test(line.trim()));

        if (isNumberedList) {
            return (
                <ol className="formatted-list">
                    {lines.map((line, index) => (
                        // Remove the number and space from the start of the line for rendering
                        <li key={index}>{line.replace(/^\d+\.\s/, '')}</li>
                    ))}
                </ol>
            );
        } else if (isBulletedList) {
            return (
                <ul className="formatted-list">
                    {lines.map((line, index) => (
                        // Remove the bullet and space from the start of the line for rendering
                        <li key={index}>{line.replace(/^[*\-•]\s/, '')}</li>
                    ))}
                </ul>
            );
        } else {
            // Render as individual paragraphs for general multi-line text
            return (
                <div className="formatted-text-paragraphs">
                    {lines.map((line, index) => (
                        <p key={index}>{line}</p>
                    ))}
                </div>
            );
        }
    };


    return (
        <div className="app-container">
            <style>
                {`
                /* General Body and Container Styles */
                body {
                    font-family: 'Inter', sans-serif;
                    background-color: #fdfdfd;
                    color: #1f2937;
                    margin: 0;
                    padding: 0;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                .app-container {
                    /* Equivalent to Tailwind's antialiased */
                    font-smoothing: antialiased;
                    -webkit-font-smoothing: antialiased;
                    -moz-osx-font-smoothing: grayscale;
                }

                /* Header Styles */
                .header {
                    background-color: rgba(255, 255, 255, 0.8);
                    -webkit-backdrop-filter: blur(8px);
                    backdrop-filter: blur(8px);
                    position: sticky;
                    top: 0;
                    z-index: 50; /* Equivalent to z-50 */
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* Equivalent to shadow-sm */
                }

                .nav-container {
                    max-width: 1280px; /* Equivalent to max-w-7xl, container implies some max-width */
                    margin-left: auto;
                    margin-right: auto;
                    padding-left: 1.5rem; /* Equivalent to px-6 */
                    padding-right: 1.5rem; /* Equivalent to px-6 */
                    padding-top: 1rem; /* Equivalent to py-4 */
                    padding-bottom: 1rem; /* Equivalent to py-4 */
                    display: flex;
                    justify-content: space-between;
                    align-items: center;
                }

                .site-title {
                    font-size: 1.25rem; /* Equivalent to text-xl */
                    font-weight: bold; /* Equivalent to font-bold */
                    color: #1f2937; /* Equivalent to text-gray-800 */
                }

                .nav-links-desktop {
                    display: none; /* Equivalent to hidden */
                    align-items: center;
                    gap: 2rem; /* Equivalent to space-x-8 */
                }

                @media (min-width: 768px) { /* Equivalent to md breakpoint */
                    .nav-links-desktop {
                        display: flex; /* Equivalent to md:flex */
                    }
                }

                .nav-link {
                    color: #4b5563; /* Default text-gray-600 */
                    text-decoration: none;
                    transition: color 0.3s, border-bottom-color 0.3s;
                    border-bottom: 2px solid transparent;
                }

                .nav-link:hover, .nav-link.active {
                    color: #4f46e5; /* Equivalent to text-indigo-600 */
                    border-bottom-color: #4f46e5; /* Equivalent to border-indigo-600 */
                }

                .contact-button {
                    background-color: #4f46e5; /* Equivalent to bg-indigo-600 */
                    color: white; /* Equivalent to text-white */
                    padding: 0.5rem 1rem; /* Equivalent to px-4 py-2 */
                    border-radius: 0.375rem; /* Equivalent to rounded-md */
                    text-decoration: none;
                    transition: background-color 0.3s;
                }

                .contact-button:hover {
                    background-color: #4338ca; /* Equivalent to hover:bg-indigo-700 */
                }

                .mobile-menu-toggle {
                    display: block; /* Equivalent to md:hidden */
                    color: #4b5563; /* Equivalent to text-gray-700 */
                    border: none;
                    background: none;
                    cursor: pointer;
                }

                @media (min-width: 768px) {
                    .mobile-menu-toggle {
                        display: none; /* Equivalent to md:hidden */
                    }
                }

                .mobile-menu {
                    display: none; /* Equivalent to hidden */
                }

                .mobile-menu.active {
                    display: block; /* Equivalent to block */
                }

                @media (min-width: 768px) {
                    .mobile-menu.active {
                        display: none; /* Equivalent to md:hidden */
                    }
                }

                .mobile-menu a {
                    display: block;
                    padding: 0.5rem 1rem;
                    font-size: 0.875rem; /* Equivalent to text-sm */
                    color: #1f2937; /* Default text color */
                    text-decoration: none;
                }

                .mobile-menu a:hover {
                    background-color: #f3f4f6; /* Equivalent to hover:bg-gray-100 */
                }

                /* Section Styles */
                section {
                    padding-top: 5rem; /* Equivalent to py-20 */
                    padding-bottom: 5rem; /* Equivalent to py-20 */
                }
                @media (min-width: 768px) {
                    section {
                        padding-top: 8rem; /* Equivalent to md:py-32 */
                        padding-bottom: 8rem; /* Equivalent to md:py-32 */
                    }
                }
                section.bg-gray-50 {
                    background-color: #f9fafb; /* bg-gray-50 */
                }

                .section-container {
                    max-width: 1280px; /* container */
                    margin-left: auto;
                    margin-right: auto;
                    padding-left: 1.5rem; /* px-6 */
                    padding-right: 1.5rem; /* px-6 */
                    text-align: center; /* text-center */
                }

                .section-title {
                    font-size: 1.875rem; /* text-3xl */
                    font-weight: bold; /* font-bold */
                    text-align: center; /* text-center */
                    margin-bottom: 5rem; /* mb-2 */
                    color: #1f2937; /* text-gray-800 */
                }

                .section-description {
                    text-align: center; /* text-center */
                    color: #4b5563; /* text-gray-600 */
                    margin-bottom: 3rem; /* mb-12 */
                }

                /* About Section */
                .about-title {
                    font-size: 2.25rem; /* text-4xl */
                    font-weight: bold; /* font-bold */
                    margin-bottom: 1rem; /* mb-4 */
                    color: #1f2937; /* text-gray-800 */
                }
                @media (min-width: 768px) {
                    .about-title {
                        font-size: 3.75rem; /* md:text-6xl */
                    }
                }

                .about-text {
                    font-size: 1.125rem; /* text-lg */
                    color: #4b5563; /* text-gray-600 */
                    max-width: 48rem; /* max-w-3xl */
                    margin-left: auto;
                    margin-right: auto;
                }
                @media (min-width: 768px) {
                    .about-text {
                        font-size: 1.25rem; /* md:text-xl */
                    }
                }

                .social-links {
                    margin-top: 2rem; /* mt-8 */
                    display: flex;
                    justify-content: center;
                    gap: 1rem; /* space-x-4 */
                }

                .social-link {
                    color: #4f46e5; /* text-indigo-600 */
                    text-decoration: none;
                }

                .social-link:hover {
                    color: #4338ca; /* hover:text-indigo-800 */
                }

                .github-link {
                    color: #1f2937; /* text-gray-800 */
                }

                .github-link:hover {
                    color: #4b5563; /* hover:text-gray-600 */
                }

                .social-icon {
                    width: 2rem; /* w-8 */
                    height: 2rem; /* h-8 */
                }

                /* Skills Chart Container */
                .chart-container {
                    position: relative;
                    width: 100%;
                    max-width: 800px;
                    margin-left: auto;
                    margin-right: auto;
                    height: 400px;
                    max-height: 50vh;
                }
                @media (max-width: 768px) {
                    .chart-container {
                        height: 300px;
                        max-height: 60vh;
                    }
                }

                /* Explain Skill & LLM Section */
                .llm-section-card {
                    margin-top: 4rem; /* mt-16 */
                    max-width: 48rem; /* max-w-2xl */
                    margin-left: auto;
                    margin-right: auto;
                    padding: 1.5rem; /* p-6 */
                    background-color: white; /* bg-white */
                    border-radius: 0.5rem; /* rounded-lg */
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-lg */
                    border: 1px solid #e5e7eb; /* border border-gray-200 */
                }

                .llm-section-title {
                    font-size: 1.5rem; /* text-2xl */
                    font-weight: bold; /* font-bold */
                    text-align: center; /* text-center */
                    margin-bottom: 1.5rem; /* mb-6 */
                }

                .llm-section-intro {
                    text-align: center; /* text-center */
                    color: #4b5563; /* text-gray-600 */
                    margin-bottom: 2rem; /* mb-8 */
                }

                .llm-input-group {
                    display: flex;
                    flex-direction: column; /* flex-col */
                    align-items: center;
                    gap: 1rem; /* space-y-4 */
                }
                @media (min-width: 768px) {
                    .llm-input-group {
                        flex-direction: row; /* md:flex-row */
                        gap: 1rem; /* md:space-x-4 */
                        margin-bottom: 0; /* md:space-y-0 */
                    }
                }

                .llm-select, .llm-input {
                    display: block;
                    width: 100%; /* w-full */
                    padding: 0.5rem 1rem; /* px-4 py-2 */
                    border: 1px solid #d1d5db; /* border border-gray-300 */
                    border-radius: 0.375rem; /* rounded-md */
                    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05); /* shadow-sm */
                    color: #374151; /* text-gray-700 */
                }
                .llm-select:focus, .llm-input:focus {
                    outline: 2px solid transparent;
                    outline-offset: 2px;
                    border-color: #4f46e5; /* focus:ring-indigo-500 focus:border-indigo-500 */
                    box-shadow: 0 0 0 1px #4f46e5; /* Custom focus ring */
                }

                .llm-input {
                    flex-grow: 1; /* flex-grow */
                }
                @media (min-width: 768px) {
                    .llm-select, .llm-input {
                        width: auto; /* md:w-auto */
                    }
                }
                

                .llm-button {
                    width: 100%; /* w-full */
                    background-color: #4f46e5; /* bg-indigo-600 */
                    color: white;
                    padding: 0.5rem 1.5rem; /* px-6 py-2 */
                    border-radius: 0.375rem; /* rounded-md */
                    transition: background-color 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .llm-button:hover {
                    background-color: #4338ca; /* hover:bg-indigo-700 */
                }
                .llm-button:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .llm-button .spinner {
                    animation: spin 1s linear infinite;
                    border-radius: 50%;
                    height: 1.25rem; /* h-5 */
                    width: 1.25rem; /* w-5 */
                    border-bottom: 2px solid white;
                    margin-left: 0.5rem; /* ml-2 */
                }
                @keyframes spin {
                    from { transform: rotate(0deg); }
                    to { transform: rotate(360deg); }
                }

                .llm-output-display {
                    margin-top: 2rem; /* mt-8 */
                    padding: 1rem; /* p-4 */
                    background-color: #eef2ff; /* bg-indigo-50 */
                    border-radius: 0.375rem; /* rounded-md */
                    color: #1f2937; /* text-gray-800 */
                    font-size: 0.875rem; /* text-sm */
                    font-style: italic; /* italic */
                    border: 1px solid #c7d2fe; /* border border-indigo-200 */
                    display: block; /* block by default if content */
                    text-align: left; /* Ensure text alignment */
                }
                /* Additional styling for formatted text within LLM output displays */
                .formatted-text-paragraphs p, .formatted-list li {
                    margin-bottom: 0.5rem; /* space between points */
                    line-height: 1.4;
                }
                .formatted-list {
                    padding-left: 1.5rem; /* Indent lists */
                }
                .formatted-list li {
                    list-style-type: disc; /* Default bullet */
                }
                /* For numbered lists, override bullet if needed */
                ol.formatted-list li {
                    list-style-type: decimal;
                }


                .llm-output-display.hidden {
                    display: none;
                }

                .llm-error-message {
                    margin-top: 1rem; /* mt-4 */
                    padding: 1rem; /* p-4 */
                    background-color: #fee2e2; /* bg-red-100 */
                    border-radius: 0.375rem; /* rounded-md */
                    color: #991b1b; /* text-red-800 */
                    font-size: 0.875rem; /* text-sm */
                    display: block; /* block by default if error */
                    text-align: left; /* Ensure text alignment */
                }
                .llm-error-message.hidden {
                    display: none;
                }

                /* Project Cards */
                .project-grid {
                    display: grid;
                    gap: 5rem; /* gap-8 */
                }
                @media (min-width: 768px) {
                    .project-grid {
                        grid-template-columns: repeat(2, 1fr); /* md:grid-cols-2 */
                    }
                }
                @media (min-width: 1024px) { /* Equivalent to lg breakpoint */
                    .project-grid {
                        grid-template-columns: repeat(3, 1fr); /* lg:grid-cols-3 */
                    }
                }

                .project-card {
                    height: 15rem; /* h-80 */
                    position: relative;
                    perspective: 1000px; /* [perspective:1000px] */
                }

                .project-card-inner {
                    transition: transform 0.6s;
                    transform-style: preserve-3d;
                    width: 100%;
                    height: 100%;
                    position: absolute;
                }

                .project-card.flipped .project-card-inner {
                    transform: rotateY(180deg);
                }

                .project-card-front, .project-card-back {
                    -webkit-backface-visibility: hidden;
                    backface-visibility: hidden;
                    position: absolute;
                    width: 100%;
                    height: 100%;
                    background-color: white; /* bg-white */
                    border-radius: 0.5rem; /* rounded-lg */
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-lg */
                    padding: 1.5rem; /* p-6 */
                    display: flex;
                    flex-direction: column;
                    justify-content: space-between;
                    border: 1px solid #e5e7eb; /* border border-gray-200 */
                }

                .project-card-back {
                    transform: rotateY(180deg);
                    background-color: #4f46e5; /* bg-indigo-600 */
                    color: white;
                    overflow-y: auto; /* overflow-y-auto */
                    text-align: left; /* Added for alignment */
                }

                .project-card-title {
                    font-weight: bold; /* font-bold */
                    font-size: 1.25rem; /* text-xl */
                    margin-bottom: 0.5rem; /* mb-2 */
                    text-align: left; /* Set alignment for title */
                }

                .project-card-summary {
                    color: #374151; /* text-gray-700 */
                    font-size: 1rem; /* text-base */
                    text-align: left; /* Set alignment for summary */
                }

                .project-card-buttons {
                    display: flex;
                    flex-direction: column;
                    gap: 0.5rem; /* space-y-2 */
                    margin-top: 1rem; /* mt-4 */
                }

                .flipper-btn {
                    align-self: flex-start;
                    background-color: #e0e7ff; /* bg-indigo-100 */
                    color: #4f46e5; /* text-indigo-800 */
                    font-size: 0.875rem; /* text-sm */
                    font-weight: 600; /* font-semibold */
                    padding: 0.5rem 1rem; /* px-4 py-2 */
                    border-radius: 0.375rem; /* rounded-md */
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .flipper-btn:hover {
                    background-color: #c7d2fe; /* hover:bg-indigo-200 */
                }

                .summarize-btn {
                    align-self: flex-start;
                    background-color: #f3e8ff; /* bg-purple-100 */
                    color: #6d28d9; /* text-purple-800 */
                    font-size: 0.875rem; /* text-sm */
                    font-weight: 600; /* font-semibold */
                    padding: 0.5rem 1rem; /* px-4 py-2 */
                    border-radius: 0.375rem; /* rounded-md */
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.3s;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                }
                .summarize-btn:hover {
                    background-color: #e9d5ff; /* hover:bg-purple-200 */
                }
                .summarize-btn:disabled {
                    opacity: 0.7;
                    cursor: not-allowed;
                }
                .summarize-btn .spinner {
                    animation: spin 1s linear infinite;
                    border-radius: 50%;
                    height: 1rem; /* h-4 */
                    width: 1rem; /* w-4 */
                    border-bottom: 2px solid #6d28d9; /* border-purple-800 */
                    margin-left: 0.5rem; /* ml-2 */
                }

                .project-details-list {
                    list-style: disc;
                    list-style-position: inside;
                    font-size: 0.875rem; /* text-sm */
                    line-height: 1.5; /* space-y-2 */
                    margin-top: 0;
                    padding-left: 0;
                }

                .ai-summary-box {
                    margin-top: 1rem; /* mt-4 */
                    padding: 0.75rem; /* p-3 */
                    background-color: rgba(255, 255, 255, 0.2); /* bg-white/20 */
                    border-radius: 0.375rem; /* rounded-md */
                    color: white; /* text-white */
                    font-size: 0.75rem; /* text-xs */
                    text-align: left; /* Ensure alignment */
                }
                .ai-summary-box p {
                    margin: 0;
                }
                .ai-summary-box .font-semibold {
                    font-weight: 600;
                    margin-bottom: 0.25rem;
                }

                .back-btn {
                    margin-top: 1rem; /* mt-4 */
                    align-self: flex-start;
                    background-color: white;
                    color: #4f46e5; /* text-indigo-800 */
                    font-size: 0.875rem; /* text-sm */
                    font-weight: 600; /* font-semibold */
                    padding: 0.5rem 1rem; /* px-4 py-2 */
                    border-radius: 0.375rem; /* rounded-md */
                    border: none;
                    cursor: pointer;
                    transition: background-color 0.3s;
                }
                .back-btn:hover {
                    background-color: #e5e7eb; /* hover:bg-gray-200 */
                }

                /* Experience & Education Section */
                .timeline-container {
                    position: relative;
                    max-width: 48rem; /* max-w-2xl */
                    margin-left: auto;
                    margin-right: auto;
                }

                .timeline-line {
                    position: absolute;
                    left: 50%;
                    width: 2px; /* w-0.5 */
                    height: 100%;
                    background-color: #d1d5db; /* bg-gray-300 */
                    transform: translateX(-50%); /* -translate-x-1/2 */
                }

                .timeline-item {
                    position: relative;
                    margin-bottom: 2rem; /* mb-8 */
                }

                .timeline-circle {
                    position: absolute;
                    width: 1.5rem; /* w-6 */
                    height: 1.5rem; /* h-6 */
                    background-color: #6366f1; /* bg-indigo-500 */
                    border-radius: 50%; /* rounded-full */
                    left: 50%;
                    transform: translateX(-50%);
                    margin-top: 0.5rem; /* mt-2 */
                    border: 4px solid white; /* border-4 border-white */
                    box-sizing: border-box; /* Ensures padding/border inside width/height */
                }

                .timeline-content-left {
                    width: 100%;
                    text-align: right; /* md:text-right */
                }
                @media (min-width: 768px) {
                    .timeline-content-left {
                      width: calc(50% - 2rem); /* Reduced width to accommodate margin */
                      margin-right: 2rem; /* Added external spacing from the center line */
                      padding-left: 0; /* Removed conflicting padding */
                    }
                }

                .timeline-content-right {
                    width: 100%;
            
                }
                @media (min-width: 768px) {
                    .timeline-content-right {
                        width: 50%;
                        margin-left: auto; /* md:ml-auto */
                        padding-left: 26rem; /* Adjusted for wider screens */

                    }
                }

                .timeline-card {
                    background-color: white; /* bg-white */
                    padding: 1rem; /* p-4 */
                    border-radius: 0.5rem; /* rounded-lg */
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06); /* shadow-md */
                    border: 1px solid #e5e7eb; /* border */
                }

                .timeline-date {
                    color: #6b7280; /* text-gray-500 */
                    font-size: 0.875rem; /* text-sm */
                }

                .timeline-heading {
                    font-weight: bold; /* font-bold */
                    font-size: 1.125rem; /* text-lg */
                }

                .timeline-subheading {
                    color: #4b5563; /* text-gray-600 */
                }

                .timeline-description {
                    font-size: 0.875rem; /* text-sm */
                    margin-top: 0.5rem; /* mt-2 */
                }
                
                /* Specific LLM Section Button Colors (Interview, Cover Letter, Skill Improvement, Job Relevance, Resume Feedback) */
                .interview-btn {
                    background-color: #16a34a; /* bg-green-600 */
                }
                .interview-btn:hover {
                    background-color: #15803d; /* hover:bg-green-700 */
                }
                .interview-output {
                    background-color: #f0fdf4; /* bg-green-50 */
                    border-color: #dcfce7; /* border-green-200 */
                }

                .cover-letter-btn {
                    background-color: #2563eb; /* bg-blue-600 */
                }
                .cover-letter-btn:hover {
                    background-color: #1d4ed8; /* hover:bg-blue-700 */
                }
                .cover-letter-output {
                    background-color: #eff6ff; /* bg-blue-50 */
                    border-color: #dbeafe; /* border-blue-200 */
                }

                .skill-improvement-btn {
                    background-color: #ca8a04; /* bg-yellow-600 */
                }
                .skill-improvement-btn:hover {
                    background-color: #a16207; /* hover:bg-yellow-700 */
                }
                .skill-improvement-output {
                    background-color: #fffbeb; /* bg-yellow-50 */
                    border-color: #fef9c3; /* border-yellow-200 */
                }

                .job-relevance-btn {
                    background-color: #16a34a; /* bg-green-600 */
                }
                .job-relevance-btn:hover {
                    background-color: #15803d; /* hover:bg-green-700 */
                }
                .job-relevance-output {
                    background-color: #f0fdf4; /* bg-green-50 */
                    border-color: #dcfce7; /* border-green-200 */
                }

                .resume-feedback-btn {
                    background-color: #2563eb; /* bg-blue-600 */
                }
                .resume-feedback-btn:hover {
                    background-color: #1d4ed8; /* hover:bg-blue-700 */
                }
                .resume-feedback-output {
                    background-color: #eff6ff; /* bg-blue-50 */
                    border-color: #dbeafe; /* border-blue-200 */
                }


                /* Footer Styles */
                .footer {
                    background-color: #1f2937; /* bg-gray-800 */
                    color: white;
                    padding-top: 3rem; /* py-12 */
                    padding-bottom: 3rem; /* py-12 */
                }

                .footer-container {
                    max-width: 1280px; /* container */
                    margin-left: auto;
                    margin-right: auto;
                    padding-left: 1.5rem; /* px-6 */
                    padding-right: 1.5rem; /* px-6 */
                    text-align: center; /* text-center */
                }

                .footer-title {
                    font-size: 1.5rem; /* text-2xl */
                    font-weight: bold; /* font-bold */
                    margin-bottom: 1rem; /* mb-4 */
                }

                .footer-description {
                    max-width: 32rem; /* max-w-xl */
                    margin-left: auto;
                    margin-right: auto;
                    margin-bottom: 1.5rem; /* mb-6 */
                }

                .email-link {
                    background-color: #4f46e5; /* bg-indigo-600 */
                    color: white;
                    padding: 0.75rem 1.5rem; /* px-6 py-3 */
                    border-radius: 0.375rem; /* rounded-md */
                    text-decoration: none;
                    transition: background-color 0.3s;
                    display: inline-block;
                }

                .email-link:hover {
                    background-color: #4338ca; /* hover:bg-indigo-700 */
                }

                .copyright {
                    margin-top: 2rem; /* mt-8 */
                    color: #9ca3af; /* text-gray-400 */
                }
                `}
            </style>
            <header className="header">
                <nav className="nav-container">
                    <div className="site-title">Shubhangi Gaikwad</div>
                    
                    <div className="nav-links-desktop">
                        <a href="#about" className={`nav-link ${activeNavLink === 'about' ? 'active' : ''}`}>About</a>
                        <a href="#skills" className={`nav-link ${activeNavLink === 'skills' ? 'active' : ''}`}>Skills</a>
                        <a href="#projects" className={`nav-link ${activeNavLink === 'projects' ? 'active' : ''}`}>Projects</a>
                        <a href="#experience" className={`nav-link ${activeNavLink === 'experience' ? 'active' : ''}`}>Experience</a>
                        <a href="#contact" className="contact-button">Contact</a>
                    </div>
                    <div className="mobile-menu-toggle">
                        <button id="menu-btn" onClick={handleMenuToggle}>
                            <svg className="social-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7"></path></svg>
                        </button>
                    </div>
                </nav>
                <div id="mobile-menu" className={`mobile-menu ${showMobileMenu ? 'active' : ''}`}>
                    <a href="#about" onClick={handleMenuToggle}>About</a>
                    <a href="#skills" onClick={handleMenuToggle}>Skills</a>
                    <a href="#projects" onClick={handleMenuToggle}>Projects</a>
                    <a href="#experience" onClick={handleMenuToggle}>Experience</a>
                    <a href="#contact" onClick={handleMenuToggle}>Contact</a>
                </div>
            </header>

            <main>
                <section id="about" className="section">
                    <div className="section-container">
                        <h1 className="about-title">Software Developer & AI Engineer</h1>
                        <p className="about-text">{resumeData.aboutText}</p>
                        <div className="social-links">
                            <a href="https://linkedin.com/in/shubhangi-gaikwad-profile" target="_blank" rel="noopener noreferrer" className="social-link">
                                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path fillRule="evenodd" d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" clipRule="evenodd"/></svg>
                            </a>
                            <a href="https://github.com/SHUBHANGI11gaikwad?tab=repositories" target="_blank" rel="noopener noreferrer" className="social-link github-link">
                                <svg className="social-icon" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
                            </a>
                        </div>
                    </div>
                </section>

                <section id="skills" className="section bg-gray-50">
                    <div className="section-container">
                        <h2 className="section-title">Technical Skills</h2>
                        <p className="section-description">This chart provides a visual overview of my technical proficiencies across different domains. Hover over any bar to see the skill and my self-assessed level of expertise.</p>
                        <div className="chart-container">
                            <canvas ref={chartRef}></canvas>
                        </div>   
                    </div>
                </section>

                <section id="projects" className="section">
                    <div className="section-container">
                        <h2 className="section-title">Projects</h2>
                        <p className="section-description">Here are some of the key projects I've worked on. They demonstrate my ability to apply technical knowledge to solve real-world problems. Click on any card to see more details about the project's implementation and goals. You can also get an AI-powered summary for each project.</p>
                        <div className="project-grid">
                            {resumeData.projects.map(project => (
                                <div key={project.id} className={`project-card ${flippedStates[project.id] ? 'flipped' : ''}`}>
                                    <div className="project-card-inner">
                                        <div className="project-card-front">
                                            <div>
                                                <h3 className="project-card-title">{project.title}</h3>
                                                <p className="project-card-summary">{project.summary}</p>
                                            </div>
                                            <div className="project-card-buttons">
                                                <button 
                                                    className="flipper-btn" 
                                                    onClick={() => handleFlipperClick(project.id)}
                                                >
                                                    Learn More →
                                                </button>
                                                <button 
                                                    className="summarize-btn"
                                                    onClick={() => handleSummarizeProject(project.id, project.title, project.details)}
                                                    disabled={isLoadingProjectSummary[project.id]}
                                                >
                                                    {isLoadingProjectSummary[project.id] ? 'Summarizing...' : 'Summarize Project ✨'}
                                                    {isLoadingProjectSummary[project.id] && <div className="spinner"></div>}
                                                </button>
                                            </div>
                                        </div>
                                        <div className="project-card-back">
                                            <div>
                                                <h3 className="project-card-title">Project Details</h3>
                                                <ul className="project-details-list">
                                                    {project.details.map((detail, index) => (
                                                        <li key={index}>{detail}</li>
                                                    ))}
                                                </ul>
                                                {projectSummaries[project.id] && (
                                                    <div className="ai-summary-box">
                                                        <p className="font-semibold">AI Summary:</p>
                                                        {renderFormattedText(projectSummaries[project.id])}
                                                    </div>
                                                )}
                                            </div>
                                            <button 
                                                className="back-btn" 
                                                onClick={() => handleFlipperClick(project.id)}
                                            >
                                                ← Back
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section id="experience" className="section bg-gray-50">
                    <div className="section-container">
                        <h2 className="section-title">Experience & Education</h2>
                        <div className="timeline-container">
                            <div className="timeline-line"></div>
                            
                            <div className="timeline-item">
                                <div className="timeline-circle"></div>
                                <div className="timeline-content-left">
                                    <div className="timeline-card">
                                        <p className="timeline-date">March 2024 - April 2024</p>
                                        <h3 className="timeline-heading">Full Stack Developer Intern</h3>
                                        <p className="timeline-subheading">NovaNectar Services Pvt. Ltd.</p>
                                        <p className="timeline-description">Contributed to the enhancement of a Job Portal, applying full-stack development principles in a collaborative environment.</p>
                                    </div>
                                </div>
                            </div>

                            <div className="timeline-item">
                                <div className="timeline-circle"></div>
                                <div className="timeline-content-right">
                                    <div className="timeline-card">
                                        <p className="timeline-date">Graduated 2023</p>
                                        <h3 className="timeline-heading">Bachelor of Engineering, Computer Engineering</h3>
                                        <p className="timeline-subheading">Shri Chattrrapati Shivajiraje College of Engineering, Pune University</p>
                                        <p className="timeline-description">Achieved a final CGPA of 8.2.</p>
                                    </div>
                                </div>
                            </div>
                            <div className="timeline-item">
                                <div className="timeline-circle"></div>
                                <div className="timeline-content-left">
                                    <div className="timeline-card">
                                        <h3 className="timeline-heading">Java Full Stack Development</h3>
                                        <p className="timeline-subheading">Seed Infotech Institute, Pune</p>
                                        <p className="timeline-description">Completed a comprehensive certification course covering core and advanced Java, Spring Boot, and front-end technologies.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </main>
            
            <footer id="contact" className="footer">
                <div className="footer-container">
                    <h2 className="footer-title">Get In Touch</h2>
                    <p className="footer-description">I'm currently seeking new opportunities and am open to discussing how my skills can benefit your team. Feel free to reach out.</p>
                    <a href="mailto:shubhangigaikwad730@gmail.com" className="email-link">shubhangigaikwad730@gmail.com</a>
                    <div className="copyright">&copy; 2025 Shubhangi Gaikwad. Interactive Resume.</div>
                </div>
            </footer>
        </div>
    );
};

export default App;
