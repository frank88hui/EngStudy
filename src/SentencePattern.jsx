import React, { useState, useRef } from 'react'
import { Link } from 'react-router-dom'
import './SentencePattern.css'

// 句型数据
const sentencePatterns = [
  {
    id: 1,
    pattern: 'I can ____',
    meaning: '我能____',
    examples: [
      { sentence: 'I can sing.', translation: '我能唱歌。' },
      { sentence: 'I can dance.', translation: '我能跳舞。' },
      { sentence: 'I can swim.', translation: '我能游泳。' }
    ],
    practiceType: 'fill',
    options: ['sing', 'dance', 'swim', 'run']
  },
  {
    id: 2,
    pattern: 'Do you like ____?',
    meaning: '你喜欢____吗？',
    examples: [
      { sentence: 'Do you like apples?', translation: '你喜欢苹果吗？' },
      { sentence: 'Do you like dogs?', translation: '你喜欢狗吗？' },
      { sentence: 'Do you like milk?', translation: '你喜欢牛奶吗？' }
    ],
    practiceType: 'fill',
    options: ['apples', 'dogs', 'milk', 'rice']
  },
  {
    id: 3,
    pattern: 'This is my ____',
    meaning: '这是我的____',
    examples: [
      { sentence: 'This is my book.', translation: '这是我的书。' },
      { sentence: 'This is my pen.', translation: '这是我的笔。' },
      { sentence: 'This is my friend.', translation: '这是我的朋友。' }
    ],
    practiceType: 'fill',
    options: ['book', 'pen', 'friend', 'school']
  },
  {
    id: 4,
    pattern: 'I have a ____',
    meaning: '我有一个____',
    examples: [
      { sentence: 'I have a cat.', translation: '我有一只猫。' },
      { sentence: 'I have a ball.', translation: '我有一个球。' },
      { sentence: 'I have a bag.', translation: '我有一个书包。' }
    ],
    practiceType: 'fill',
    options: ['cat', 'ball', 'bag', 'pencil']
  },
  {
    id: 5,
    pattern: 'What is this? It is a ____',
    meaning: '这是什么？这是一个____',
    examples: [
      { sentence: 'What is this? It is a chair.', translation: '这是什么？这是一把椅子。' },
      { sentence: 'What is this? It is a table.', translation: '这是什么？这是一张桌子。' },
      { sentence: 'What is this? It is a window.', translation: '这是什么？这是一扇窗户。' }
    ],
    practiceType: 'fill',
    options: ['chair', 'table', 'window', 'door']
  }
]

function SentencePattern() {
  const [currentPatternIndex, setCurrentPatternIndex] = useState(0)
  const [selectedOption, setSelectedOption] = useState('')
  const [isAnswered, setIsAnswered] = useState(false)
  const [isCorrect, setIsCorrect] = useState(false)
  const [score, setScore] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioWave, setAudioWave] = useState([])
  const [showHint, setShowHint] = useState(false)
  
  const currentPattern = sentencePatterns[currentPatternIndex]
  
  // 发音功能
  const pronounceSentence = (sentence) => {
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
      
      const utterance = new SpeechSynthesisUtterance(sentence)
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
  
  // 检查答案
  const checkAnswer = () => {
    if (!selectedOption) return
    
    // 简单的答案检查逻辑，实际应用中可能需要更复杂的判断
    const isCorrectAnswer = currentPattern.options.includes(selectedOption)
    setIsCorrect(isCorrectAnswer)
    setIsAnswered(true)
    
    if (isCorrectAnswer) {
      setScore(prev => prev + 10)
    }
  }
  
  // 下一个句型
  const nextPattern = () => {
    if (currentPatternIndex < sentencePatterns.length - 1) {
      setCurrentPatternIndex(prev => prev + 1)
    } else {
      // 回到第一个句型
      setCurrentPatternIndex(0)
    }
    resetPractice()
  }
  
  // 上一个句型
  const prevPattern = () => {
    if (currentPatternIndex > 0) {
      setCurrentPatternIndex(prev => prev - 1)
    } else {
      // 到最后一个句型
      setCurrentPatternIndex(sentencePatterns.length - 1)
    }
    resetPractice()
  }
  
  // 重置练习状态
  const resetPractice = () => {
    setSelectedOption('')
    setIsAnswered(false)
    setIsCorrect(false)
    setShowHint(false)
  }
  
  // 显示提示
  const showHintHandler = () => {
    setShowHint(true)
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
          <Link to="/sentence" className="nav-btn active">
            📝 句型训练
          </Link>
          <Link to="/test" className="nav-btn">
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
      <div className="sentence-pattern-container">
      <div className="pattern-header">
        <h2>句型训练</h2>
        <div className="score-display">
          <span className="score-icon">🏆</span>
          <span className="score-value">{score}</span>
        </div>
      </div>
      
      <div className="pattern-card">
        <div className="pattern-info">
          <h3 className="pattern-text">{currentPattern.pattern}</h3>
          <p className="pattern-meaning">{currentPattern.meaning}</p>
          
          <div className="pronounce-container">
            <button 
              className={`pronounce-btn ${isSpeaking ? 'speaking' : ''}`}
              onClick={() => pronounceSentence(currentPattern.pattern.replace('____', 'something'))}
              aria-label="播放句型发音"
            >
              🔊
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
        </div>
        
        <div className="examples-section">
          <h4>例句：</h4>
          <div className="examples-list">
            {currentPattern.examples.map((example, index) => (
              <div key={index} className="example-item">
                <div className="example-sentence">
                  {example.sentence}
                  <button 
                    className="example-pronounce-btn"
                    onClick={() => pronounceSentence(example.sentence)}
                    aria-label="播放例句发音"
                  >
                    🔊
                  </button>
                </div>
                <div className="example-translation">{example.translation}</div>
              </div>
            ))}
          </div>
        </div>
        
        <div className="practice-section">
          <h4>练习：</h4>
          <div className="practice-content">
            {currentPattern.practiceType === 'fill' && (
              <div className="fill-practice">
                <p className="practice-pattern">{currentPattern.pattern}</p>
                <div className="options-container">
                  {currentPattern.options.map((option, index) => (
                    <button
                      key={index}
                      className={`option-btn ${selectedOption === option ? 'selected' : ''} ${isAnswered ? (isCorrect && selectedOption === option ? 'correct' : !isCorrect && selectedOption === option ? 'incorrect' : '') : ''}`}
                      onClick={() => setSelectedOption(option)}
                      disabled={isAnswered}
                    >
                      {option}
                    </button>
                  ))}
                </div>
                
                <div className="practice-actions">
                  <button 
                    className="hint-btn"
                    onClick={showHintHandler}
                    disabled={isAnswered || showHint}
                  >
                    💡 提示
                  </button>
                  <button 
                    className="check-btn"
                    onClick={checkAnswer}
                    disabled={isAnswered || !selectedOption}
                  >
                    检查答案
                  </button>
                </div>
                
                {showHint && (
                  <div className="hint-message">
                    提示：选择一个合适的单词填入空格
                  </div>
                )}
                
                {isAnswered && (
                  <div className={`feedback-message ${isCorrect ? 'correct' : 'incorrect'}`}>
                    {isCorrect ? '✅ 回答正确！' : '❌ 回答错误，请再试一次。'}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
      
      <div className="pattern-navigation">
        <button 
          onClick={prevPattern}
          aria-label="上一个句型"
        >
          上一个
        </button>
        <span>{currentPatternIndex + 1} / {sentencePatterns.length}</span>
        <button 
          onClick={nextPattern}
          aria-label="下一个句型"
        >
          下一个
        </button>
      </div>
      </div>
      <footer className="App-footer">
        <p>© 2026 521词小学英语口语学习应用</p>
      </footer>
    </div>
  )
}

export default SentencePattern