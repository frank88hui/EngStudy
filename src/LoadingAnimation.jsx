import React from 'react'
import './LoadingAnimation.css'

function LoadingAnimation({ isLoading, children }) {
  if (isLoading) {
    return (
      <div className="loading-container">
        <div className="loading-content">
          <div className="loading-spinner">
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
            <div className="spinner-circle"></div>
          </div>
          <h2 className="loading-text">正在加载单词...</h2>
          <div className="loading-word">521词</div>
        </div>
      </div>
    )
  }

  return children
}

export default LoadingAnimation