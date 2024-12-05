'use client';

import React from 'react';
import styles from '../styles/About.module.css';

function AboutPage() {
    return (
        <div className={styles['global-background']}>
            <div className={styles['content-container']}>
                <h1 className={styles['header']}>About Us</h1>
                <p className={styles['description']}>
                    Welcome to GeoAI! We are a team of team of students and professors from the University of San Francisco who are passionate about the intersection of geospatial technology and artificial intelligence. GeoAI was developed as part of the Fall 2024 offering of the course CS 490: Senior Team.
                </p>
                <p className={styles['description']}>
                    Here are the members of our team:
                </p>

                <div className={styles['team-container']}>
                    <h2 className={styles['section-header']}>Group 1 Students</h2>
                    <div className={styles['team-row']}>
                        <div className={styles['team-member']}>
                            <img src="https://via.placeholder.com/150" alt="Student 1" className={styles['team-photo']} />
                            <h3 className={styles['team-name']}>John Doe</h3>
                            <p className={styles['team-info']}>Computer Science Major, Class of 2025</p>
                        </div>
                        <div className={styles['team-member']}>
                            <img src="https://via.placeholder.com/150" alt="Student 2" className={styles['team-photo']} />
                            <h3 className={styles['team-name']}>Jane Smith</h3>
                            <p className={styles['team-info']}>Computer Science Major, Class of 2025</p>
                        </div>
                        <div className={styles['team-member']}>
                            <img src="https://via.placeholder.com/150" alt="Student 3" className={styles['team-photo']} />
                            <h3 className={styles['team-name']}>Bob Johnson</h3>
                            <p className={styles['team-info']}>Computer Science Major, Class of 2025</p>
                        </div>
                    </div>

                    <h2 className={styles['section-header']}>Group 2 Students</h2>
                    <div className={styles['team-row']}>
                        <div className={styles['team-member']}>
                            <img src="https://via.placeholder.com/150" alt="Student 4" className={styles['team-photo']} />
                            <h3 className={styles['team-name']}>Alice Williams</h3>
                            <p className={styles['team-info']}>Data Science Major, Class of 2025</p>
                        </div>
                        <div className={styles['team-member']}>
                            <img src="https://via.placeholder.com/150" alt="Student 5" className={styles['team-photo']} />
                            <h3 className={styles['team-name']}>David Lee</h3>
                            <p className={styles['team-info']}>Data Science Major, Class of 2025</p>
                        </div>
                        <div className={styles['team-member']}>
                            <img src="https://via.placeholder.com/150" alt="Student 6" className={styles['team-photo']} />
                            <h3 className={styles['team-name']}>Emily Chen</h3>
                            <p className={styles['team-info']}>Data Science Major, Class of 2025</p>
                        </div>
                    </div>

                    <h2 className={styles['section-header']}>Professors</h2>
                    <div className={styles['team-row']}>
                        <div className={styles['team-member']}>
                            <img src="https://via.placeholder.com/150" alt="Professor 1" className={styles['team-photo']} />
                            <h3 className={styles['team-name']}>Dr. Sarah Kim</h3>
                            <p className={styles['team-info']}>Assistant Professor of Computer Science</p>
                        </div>
                        <div className={styles['team-member']}>
                            <img src="https://via.placeholder.com/150" alt="Professor 2" className={styles['team-photo']} />
                            <h3 className={styles['team-name']}>Dr. Michael Chen</h3>
                            <p className={styles['team-info']}>Associate Professor of Data Science</p>
                        </div>
                    </div>

                    <h2 className={styles['section-header']}>Collaborators</h2>
                    <div className={styles['team-row']}>
                        <div className={styles['team-member']}>
                            <img src="https://via.placeholder.com/150" alt="Collaborator 1" className={styles['team-photo']} />
                            <h3 className={styles['team-name']}>Lisa Wang</h3>
                            <p className={styles['team-info']}>GIS Analyst, City of San Francisco</p>
                        </div>
                        <div className={styles['team-member']}>
                            <img src="https://via.placeholder.com/150" alt="Collaborator 2" className={styles['team-photo']} />
                            <h3 className={styles['team-name']}>Mark Nguyen</h3>
                            <p className={styles['team-info']}>Data Scientist, Google AI</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AboutPage;