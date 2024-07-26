import  { useEffect, useState } from 'react';

import PropTypes from 'prop-types';

import './LoadingScreen.css'; // Import CSS for styling

const LoadingScreen = ({ progress }) => {
  const [displayedProgress, setDisplayedProgress] = useState(0);

  useEffect(() => {
    // Smoothly update the displayed progress
    const interval = setInterval(() => {
      setDisplayedProgress((prev) => {
        if (prev < progress) {
          // Increment progress by 25% or reach the target
          return Math.min(prev + 25, progress);
        } else {
          clearInterval(interval); // Stop the interval when target is reached
          return prev;
        }
      });
    }, 300); // Update every 0.5 seconds

    return () => clearInterval(interval);
  }, [progress]);

  return (
    <div className="loading-screen">
      <div className="spinner"></div>
      <div className="progress">
        <div className="progress-bar" style={{ width: `${displayedProgress}%` }}></div>
      </div>
      <div className="percentage">{displayedProgress}%</div>
    </div>
  );
};

LoadingScreen.propTypes = {
  progress: PropTypes.number.isRequired
};

export default LoadingScreen;
