import React, { useState, useEffect, useRef } from 'react'
import { Link } from 'react-router-dom'
import './TestModule.css'

function TestModule({ wordsData, onTestComplete }) {
  const [testMode, setTestMode] = useState('listening') // 'listening', 'fill', 'spelling'
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [answers, setAnswers] = useState([])
  const [selectedWords, setSelectedWords] = useState([])
  const [showResults, setShowResults] = useState(false)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioWave, setAudioWave] = useState([])
  const [userAnswer, setUserAnswer] = useState('')
  const [timeLeft, setTimeLeft] = useState(10)
  const [isTimerRunning, setIsTimerRunning] = useState(false)
  
  const inputRef = useRef(null)
  const timerRef = useRef(null)

  // 准备测试数据
  useEffect(() => {
    prepareTestData()
  }, [testMode])

  // 准备测试数据
  const prepareTestData = () => {
    // 从所有单词中随机选择10个
    const allWords = wordsData.flatMap(category => category.words)
    const shuffled = allWords.sort(() => 0.5 - Math.random())
    const testWords = shuffled.slice(0, 10)
    setSelectedWords(testWords)
    setCurrentQuestion(0)
    setScore(0)
    setAnswers([])
    setShowResults(false)
    setUserAnswer('')
    setTimeLeft(10)
    setIsTimerRunning(false)
  }

  // 开始测试
  const startTest = () => {
    setCurrentQuestion(0)
    setScore(0)
    setAnswers([])
    setShowResults(false)
    setUserAnswer('')
    setTimeLeft(10)
    setIsTimerRunning(true)
  }

  // 发音功能
  const pronounceWord = (word) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      
      // 生成音频波形动画数据
      let animationId = null
      
      const generateWave = () => {
        const wave = Array.from({ length: 8 }, () => Math.random() * 10 + 2)
        setAudioWave(wave)
        if (isSpeaking) {
          animationId = requestAnimationFrame(generateWave)
        }
      }
      
      generateWave()
      
      const utterance = new SpeechSynthesisUtterance(word)
      utterance.lang = 'en-US'
      utterance.onend = () => {
        setIsSpeaking(false)
        setAudioWave([])
        if (animationId) {
          cancelAnimationFrame(animationId)
        }
      }
      speechSynthesis.speak(utterance)
    }
  }

  // 处理答案提交
  const handleAnswer = (userAnswer) => {
    const currentWord = selectedWords[currentQuestion]
    const isCorrect = userAnswer.toLowerCase() === currentWord.word.toLowerCase()
    
    if (isCorrect) {
      setScore(prev => prev + 10)
    }
    
    setAnswers(prev => [...prev, {
      word: currentWord,
      userAnswer,
      isCorrect
    }])
    
    // 下一题或结束测试
    if (currentQuestion < selectedWords.length - 1) {
      setCurrentQuestion(prev => prev + 1)
      setUserAnswer('')
      setTimeLeft(10)
    } else {
      setShowResults(true)
      setIsTimerRunning(false)
      if (onTestComplete) {
        onTestComplete({
          score,
          totalQuestions: selectedWords.length,
          correctAnswers: answers.filter(a => a.isCorrect).length + (isCorrect ? 1 : 0),
          answers: [...answers, {
            word: currentWord,
            userAnswer,
            isCorrect
          }]
        })
      }
    }
  }

  // 处理听音辨词选项点击
  const handleListeningOption = (option) => {
    handleAnswer(option)
  }

  // 处理选词填空选项点击
  const handleFillOption = (option) => {
    handleAnswer(option)
  }

  // 处理拼写测试提交
  const handleSpellingSubmit = () => {
    handleAnswer(userAnswer)
  }

  // 生成听音辨词的选项
  const generateListeningOptions = () => {
    const currentWord = selectedWords[currentQuestion]
    const allWords = wordsData.flatMap(category => category.words)
    const otherWords = allWords.filter(word => word.id !== currentWord.id)
    const shuffled = otherWords.sort(() => 0.5 - Math.random())
    const options = [currentWord.word, ...shuffled.slice(0, 3).map(word => word.word)].sort(() => 0.5 - Math.random())
    return options
  }

  // 生成选词填空的句子
  const generateFillSentence = () => {
    const currentWord = selectedWords[currentQuestion]
    const sentence = currentWord.example
    const word = currentWord.word
    const replacedSentence = sentence.replace(word, '___')
    return replacedSentence
  }

  // 生成选词填空的选项
  const generateFillOptions = () => {
    const currentWord = selectedWords[currentQuestion]
    const allWords = wordsData.flatMap(category => category.words)
    const otherWords = allWords.filter(word => word.id !== currentWord.id)
    const shuffled = otherWords.sort(() => 0.5 - Math.random())
    const options = [currentWord.word, ...shuffled.slice(0, 3).map(word => word.word)].sort(() => 0.5 - Math.random())
    return options
  }

  // 计时器
  useEffect(() => {
    if (isTimerRunning && timeLeft > 0) {
      timerRef.current = setTimeout(() => {
        setTimeLeft(prev => prev - 1)
      }, 1000)
    } else if (timeLeft === 0 && currentQuestion < selectedWords.length - 1) {
      // 时间到，自动进入下一题
      setAnswers(prev => [...prev, {
        word: selectedWords[currentQuestion],
        userAnswer: '',
        isCorrect: false
      }])
      setCurrentQuestion(prev => prev + 1)
      setUserAnswer('')
      setTimeLeft(10)
    } else if (timeLeft === 0 && currentQuestion === selectedWords.length - 1) {
      // 时间到，测试结束
      setShowResults(true)
      setIsTimerRunning(false)
      if (onTestComplete) {
        onTestComplete({
          score,
          totalQuestions: selectedWords.length,
          correctAnswers: answers.filter(a => a.isCorrect).length,
          answers: [...answers, {
            word: selectedWords[currentQuestion],
            userAnswer: '',
            isCorrect: false
          }]
        })
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [isTimerRunning, timeLeft, currentQuestion, selectedWords.length, score, answers, onTestComplete])

  // 当切换到拼写测试时，自动聚焦输入框
  useEffect(() => {
    if (testMode === 'spelling' && inputRef.current) {
      inputRef.current.focus()
    }
  }, [testMode, currentQuestion])

  // 渲染测试模式选择
  const renderTestModeSelection = () => (
    <div className="test-mode-selection">
      <h2>选择测试模式</h2>
      <div className="mode-buttons">
        <button 
          className="mode-btn" 
          onClick={() => setTestMode('listening')}
          aria-label="听音辨词测试"
        >
          👂 听音辨词
        </button>
        <button 
          className="mode-btn" 
          onClick={() => setTestMode('fill')}
          aria-label="选词填空测试"
        >
          📝 选词填空
        </button>
        <button 
          className="mode-btn" 
          onClick={() => setTestMode('spelling')}
          aria-label="拼写测试"
        >
          ✏️ 拼写测试
        </button>
      </div>
      <button 
        className="start-test-btn" 
        onClick={startTest}
        aria-label="开始测试"
      >
        🚀 开始测试
      </button>
    </div>
  )

  // 渲染听音辨词测试
  const renderListeningTest = () => {
    if (selectedWords.length === 0 || currentQuestion >= selectedWords.length) return null
    
    const currentWord = selectedWords[currentQuestion]
    if (!currentWord) return null
    
    try {
      const options = generateListeningOptions()
      if (!Array.isArray(options)) return null
      
      return (
        <div className="test-container">
          <div className="test-header">
            <h2>听音辨词测试</h2>
            <div className="test-progress">
              <span>问题 {currentQuestion + 1} / {selectedWords.length}</span>
              <span className="timer">⏰ {timeLeft}s</span>
            </div>
          </div>
          
          <div className="listening-test">
            <div className="listen-section">
              <h3>听单词发音，选择正确的单词</h3>
              <button 
                className={`listen-btn ${isSpeaking ? 'speaking' : ''}`}
                onClick={() => pronounceWord(currentWord.word)}
                aria-label="播放单词发音"
              >
                🔊 播放发音
              </button>
              {isSpeaking && (
                <div className="audio-wave" aria-label="正在播放发音">
                  {audioWave.map((height, index) => (
                    <div 
                      key={index} 
                      className="wave-bar" 
                      style={{ height: `${height}px` }}
                    ></div>
                  ))}
                </div>
              )}
            </div>
            
            <div className="options-section">
              {options.map((option, index) => (
                <button
                  key={index}
                  className="option-btn"
                  onClick={() => handleListeningOption(option)}
                  aria-label={`选择选项 ${index + 1}: ${option}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    } catch (error) {
      console.error('Error rendering listening test:', error)
      return null
    }
  }

  // 渲染选词填空测试
  const renderFillTest = () => {
    if (selectedWords.length === 0 || currentQuestion >= selectedWords.length) return null
    
    const currentWord = selectedWords[currentQuestion]
    if (!currentWord) return null
    
    try {
      const sentence = generateFillSentence()
      const options = generateFillOptions()
      if (!Array.isArray(options)) return null
      
      return (
        <div className="test-container">
          <div className="test-header">
            <h2>选词填空测试</h2>
            <div className="test-progress">
              <span>问题 {currentQuestion + 1} / {selectedWords.length}</span>
              <span className="timer">⏰ {timeLeft}s</span>
            </div>
          </div>
          
          <div className="fill-test">
            <div className="sentence-section">
              <h3>选择正确的单词填空</h3>
              <p className="sentence">{sentence}</p>
            </div>
            
            <div className="options-section">
              {options.map((option, index) => (
                <button
                  key={index}
                  className="option-btn"
                  onClick={() => handleFillOption(option)}
                  aria-label={`选择选项 ${index + 1}: ${option}`}
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        </div>
      )
    } catch (error) {
      console.error('Error rendering fill test:', error)
      return null
    }
  }

  // 渲染拼写测试
  const renderSpellingTest = () => {
    if (selectedWords.length === 0 || currentQuestion >= selectedWords.length) return null
    
    const currentWord = selectedWords[currentQuestion]
    if (!currentWord) return null
    
    try {
      return (
        <div className="test-container">
          <div className="test-header">
            <h2>拼写测试</h2>
            <div className="test-progress">
              <span>问题 {currentQuestion + 1} / {selectedWords.length}</span>
              <span className="timer">⏰ {timeLeft}s</span>
            </div>
          </div>
          
          <div className="spelling-test">
            <div className="spelling-section">
              <h3>听单词发音，拼写出正确的单词</h3>
              <button 
                className={`listen-btn ${isSpeaking ? 'speaking' : ''}`}
                onClick={() => pronounceWord(currentWord.word)}
                aria-label="播放单词发音"
              >
                🔊 播放发音
              </button>
              {isSpeaking && (
                <div className="audio-wave" aria-label="正在播放发音">
                  {audioWave.map((height, index) => (
                    <div 
                      key={index} 
                      className="wave-bar" 
                      style={{ height: `${height}px` }}
                    ></div>
                  ))}
                </div>
              )}
              
              <div className="input-section">
                <input
                  ref={inputRef}
                  type="text"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="请输入单词..."
                  aria-label="输入单词拼写"
                />
                <button 
                  className="submit-btn"
                  onClick={handleSpellingSubmit}
                  aria-label="提交答案"
                >
                  ✅ 提交
                </button>
              </div>
            </div>
          </div>
        </div>
      )
    } catch (error) {
      console.error('Error rendering spelling test:', error)
      return null
    }
  }

  // 渲染测试结果
  const renderResults = () => {
    try {
      if (!Array.isArray(answers) || answers.length === 0) return null
      
      const correctCount = answers.filter(a => a.isCorrect).length
      const accuracy = (correctCount / answers.length) * 100
      
      return (
        <div className="results-container">
          <h2>测试结果</h2>
          <div className="score-card">
            <div className="score-display">
              <span className="score-number">{score}</span>
              <span className="score-label">得分</span>
            </div>
            <div className="stats">
              <div className="stat-item">
                <span className="stat-number">{correctCount}</span>
                <span className="stat-label">正确</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{answers.length - correctCount}</span>
                <span className="stat-label">错误</span>
              </div>
              <div className="stat-item">
                <span className="stat-number">{accuracy.toFixed(0)}%</span>
                <span className="stat-label">正确率</span>
              </div>
            </div>
          </div>
          
          <div className="answers-review">
            <h3>答案回顾</h3>
            {answers.map((answer, index) => {
              if (!answer || !answer.word) return null
              return (
                <div 
                  key={index} 
                  className={`answer-item ${answer.isCorrect ? 'correct' : 'incorrect'}`}
                >
                  <div className="answer-header">
                    <span className="answer-number">问题 {index + 1}</span>
                    <span className={`answer-status ${answer.isCorrect ? 'correct' : 'incorrect'}`}>
                      {answer.isCorrect ? '✅ 正确' : '❌ 错误'}
                    </span>
                  </div>
                  <div className="answer-details">
                    <p><strong>单词：</strong>{answer.word.word} ({answer.word.meaning})</p>
                    <p><strong>你的答案：</strong>{answer.userAnswer || '未回答'}</p>
                    <button 
                      className="review-listen-btn"
                      onClick={() => pronounceWord(answer.word.word)}
                      aria-label="播放单词发音"
                    >
                      🔊 听发音
                    </button>
                  </div>
                </div>
              )
            })}
          </div>
          
          <div className="result-actions">
            <button 
              className="restart-btn"
              onClick={startTest}
              aria-label="重新测试"
            >
              🔄 重新测试
            </button>
            <button 
              className="change-mode-btn"
              onClick={() => setShowResults(false)}
              aria-label="更换测试模式"
            >
              🔀 更换模式
            </button>
          </div>
        </div>
      )
    } catch (error) {
      console.error('Error rendering results:', error)
      return null
    }
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>521词小学英语口语</h1>
        
        {/* 导航栏 */}
        <div className="navigation-bar">
          <Link to="/" className="nav-btn">
            🏠 首页
          </Link>
          <Link to="/words" className="nav-btn">
            📚 单词学习
          </Link>
          <Link to="/dialogue" className="nav-btn">
            💬 场景对话
          </Link>
          <Link to="/sentence" className="nav-btn">
            📝 句型训练
          </Link>
          <Link to="/test" className="nav-btn active">
            🧪 单词测试
          </Link>
          <Link to="/studyplan" className="nav-btn">
            📅 学习计划
          </Link>
          <Link to="/favorites" className="nav-btn">
            ❤️ 收藏
          </Link>
          <Link to="/difficult" className="nav-btn">
            📖 生词本
          </Link>
          <Link to="/report" className="nav-btn">
            📊 学习报告
          </Link>
        </div>
      </header>
      <div className="test-module">
        {!showResults ? (
          isTimerRunning ? (
            testMode === 'listening' ? renderListeningTest() :
            testMode === 'fill' ? renderFillTest() :
            renderSpellingTest()
          ) : (
            renderTestModeSelection()
          )
        ) : (
          renderResults()
        )}
      </div>
      <footer className="App-footer">
        <p>© 2026 521词小学英语口语学习应用</p>
      </footer>
    </div>
  )
}

export default TestModule