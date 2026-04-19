import React, { useState, useEffect, useRef } from 'react'
import { Routes, Route, Link, Navigate } from 'react-router-dom'
import './App.css'
import LoadingAnimation from './LoadingAnimation'
import HomePage from './HomePage'
import SceneDialogue from './SceneDialogue'
import SentencePattern from './SentencePattern'
import Gamification from './Gamification'
import TestModule from './TestModule'
import StudyPlan from './StudyPlan'
import StudyReport from './StudyReport'
import { wordsData } from './data'

import WordLearning from './WordLearning'
import Favorites from './Favorites'
import DifficultWords from './DifficultWords'
import ErrorBoundary from './ErrorBoundary'

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<ErrorBoundary><HomePage /></ErrorBoundary>} />
        <Route path="/words" element={<ErrorBoundary><WordLearning /></ErrorBoundary>} />
        <Route path="/dialogue" element={<ErrorBoundary><SceneDialogue /></ErrorBoundary>} />
        <Route path="/sentence" element={<ErrorBoundary><SentencePattern /></ErrorBoundary>} />
        <Route path="/test" element={<ErrorBoundary><TestModule wordsData={wordsData} onTestComplete={(result) => {
          // 测试完成后的处理逻辑
          console.log('测试结果:', result);
        }} /></ErrorBoundary>} />
        <Route path="/studyplan" element={<ErrorBoundary><StudyPlan /></ErrorBoundary>} />
        <Route path="/favorites" element={<ErrorBoundary><Favorites /></ErrorBoundary>} />
        <Route path="/difficult" element={<ErrorBoundary><DifficultWords /></ErrorBoundary>} />
        <Route path="/report" element={<ErrorBoundary><StudyReport /></ErrorBoundary>} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App