import React, { useState, useEffect } from 'react'
import './App.css'

// 模拟521个英语单词数据
const wordsData = [
  { id: 1, word: 'apple', meaning: '苹果', example: 'I eat an apple every day.' },
  { id: 2, word: 'banana', meaning: '香蕉', example: 'Bananas are yellow.' },
  { id: 3, word: 'cat', meaning: '猫', example: 'The cat is black.' },
  { id: 4, word: 'dog', meaning: '狗', example: 'The dog is barking.' },
  { id: 5, word: 'egg', meaning: '鸡蛋', example: 'I have an egg for breakfast.' },
  // 可以根据需要添加更多单词
]

function App() {
  const [words, setWords] = useState(wordsData)
  const [currentWord, setCurrentWord] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)

  const nextWord = () => {
    setCurrentWord((prev) => (prev + 1) % words.length)
    setShowMeaning(false)
  }

  const prevWord = () => {
    setCurrentWord((prev) => (prev - 1 + words.length) % words.length)
    setShowMeaning(false)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>521词小学英语口语</h1>
      </header>
      <main className="App-main">
        <div className="word-card">
          <div className="word-display">
            <h2>{words[currentWord].word}</h2>
            {showMeaning && (
              <div className="word-details">
                <p className="meaning">{words[currentWord].meaning}</p>
                <p className="example">{words[currentWord].example}</p>
              </div>
            )}
          </div>
          <div className="word-actions">
            <button onClick={() => setShowMeaning(!showMeaning)}>
              {showMeaning ? '隐藏含义' : '显示含义'}
            </button>
            <div className="navigation">
              <button onClick={prevWord}>上一个</button>
              <span>{currentWord + 1} / {words.length}</span>
              <button onClick={nextWord}>下一个</button>
            </div>
          </div>
        </div>
      </main>
      <footer className="App-footer">
        <p>© 2026 521词小学英语口语学习应用</p>
      </footer>
    </div>
  )
}

export default App