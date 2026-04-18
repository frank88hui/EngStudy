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

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/words" element={<WordLearning />} />
        <Route path="/dialogue" element={<SceneDialogue />} />
        <Route path="/sentence" element={<SentencePattern />} />
        <Route path="/test" element={<TestModule wordsData={wordsData} onTestComplete={(result) => {
          // 测试完成后的处理逻辑
          console.log('测试结果:', result);
        }} />} />
        <Route path="/studyplan" element={<StudyPlan />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/difficult" element={<DifficultWords />} />
        <Route path="/report" element={<StudyReport />} />
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </div>
  )
}

export default App