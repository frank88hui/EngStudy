import React, { useState, useEffect } from 'react'
import './App.css'

// 模拟521个英语单词数据，按类别分类
const wordsData = [
  {
    category: '水果',
    words: [
      { id: 1, word: 'apple', meaning: '苹果', example: 'I eat an apple every day.', phonetic: 'ˈæpl' },
      { id: 2, word: 'banana', meaning: '香蕉', example: 'Bananas are yellow.', phonetic: 'bəˈnɑːnə' },
      { id: 3, word: 'orange', meaning: '橙子', example: 'I like orange juice.', phonetic: 'ˈɔːrɪndʒ' },
      { id: 4, word: 'grape', meaning: '葡萄', example: 'Grapes are sweet.', phonetic: 'ɡreɪp' },
      { id: 5, word: 'watermelon', meaning: '西瓜', example: 'Watermelon is refreshing.', phonetic: 'ˈwɔːtərmelən' }
    ]
  },
  {
    category: '动物',
    words: [
      { id: 6, word: 'cat', meaning: '猫', example: 'The cat is black.', phonetic: 'kæt' },
      { id: 7, word: 'dog', meaning: '狗', example: 'The dog is barking.', phonetic: 'dɔːɡ' },
      { id: 8, word: 'bird', meaning: '鸟', example: 'The bird is singing.', phonetic: 'bɜːrd' },
      { id: 9, word: 'fish', meaning: '鱼', example: 'The fish is swimming.', phonetic: 'fɪʃ' },
      { id: 10, word: 'rabbit', meaning: '兔子', example: 'The rabbit is hopping.', phonetic: 'ˈræbɪt' }
    ]
  },
  {
    category: '食物',
    words: [
      { id: 11, word: 'egg', meaning: '鸡蛋', example: 'I have an egg for breakfast.', phonetic: 'eɡ' },
      { id: 12, word: 'bread', meaning: '面包', example: 'I eat bread every morning.', phonetic: 'bred' },
      { id: 13, word: 'milk', meaning: '牛奶', example: 'I drink milk every day.', phonetic: 'mɪlk' },
      { id: 14, word: 'rice', meaning: '米饭', example: 'I eat rice for lunch.', phonetic: 'raɪs' },
      { id: 15, word: 'meat', meaning: '肉', example: 'I like meat.', phonetic: 'miːt' }
    ]
  }
]

// 模拟学习进度数据
const initialProgress = {
  totalWords: 15,
  learnedWords: 0,
  categories: {
    '水果': 0,
    '动物': 0,
    '食物': 0
  }
}

function App() {
  const [words, setWords] = useState(wordsData)
  const [currentCategory, setCurrentCategory] = useState(0)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [showMeaning, setShowMeaning] = useState(false)
  const [progress, setProgress] = useState(initialProgress)
  const [learnedWords, setLearnedWords] = useState(new Set())

  // 获取当前分类的单词列表
  const currentWords = words[currentCategory].words
  // 获取当前单词
  const currentWord = currentWords[currentWordIndex]

  // 发音功能
  const pronounceWord = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(currentWord.word)
      utterance.lang = 'en-US'
      speechSynthesis.speak(utterance)
    }
  }

  // 标记单词为已学习
  const markAsLearned = () => {
    const newLearnedWords = new Set(learnedWords)
    newLearnedWords.add(currentWord.id)
    setLearnedWords(newLearnedWords)

    // 更新学习进度
    const newProgress = {
      ...progress,
      learnedWords: newLearnedWords.size,
      categories: {
        ...progress.categories,
        [words[currentCategory].category]: words[currentCategory].words.filter(
          word => newLearnedWords.has(word.id)
        ).length
      }
    }
    setProgress(newProgress)
  }

  // 下一个单词
  const nextWord = () => {
    if (currentWordIndex < currentWords.length - 1) {
      setCurrentWordIndex(currentWordIndex + 1)
    } else {
      // 如果当前分类已完成，切换到下一个分类
      if (currentCategory < words.length - 1) {
        setCurrentCategory(currentCategory + 1)
        setCurrentWordIndex(0)
      } else {
        // 所有分类已完成，回到第一个分类
        setCurrentCategory(0)
        setCurrentWordIndex(0)
      }
    }
    setShowMeaning(false)
  }

  // 上一个单词
  const prevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(currentWordIndex - 1)
    } else {
      // 如果是当前分类的第一个单词，切换到上一个分类的最后一个单词
      if (currentCategory > 0) {
        setCurrentCategory(currentCategory - 1)
        setCurrentWordIndex(words[currentCategory - 1].words.length - 1)
      } else {
        // 已经是第一个分类的第一个单词，切换到最后一个分类的最后一个单词
        setCurrentCategory(words.length - 1)
        setCurrentWordIndex(words[words.length - 1].words.length - 1)
      }
    }
    setShowMeaning(false)
  }

  // 切换分类
  const changeCategory = (index) => {
    setCurrentCategory(index)
    setCurrentWordIndex(0)
    setShowMeaning(false)
  }

  return (
    <div className="App">
      <header className="App-header">
        <h1>521词小学英语口语</h1>
        <div className="progress-section">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${(progress.learnedWords / progress.totalWords) * 100}%` }}
            ></div>
          </div>
          <p className="progress-text">
            学习进度: {progress.learnedWords} / {progress.totalWords} 单词
          </p>
        </div>
      </header>
      <main className="App-main">
        {/* 分类选择 */}
        <div className="category-selector">
          {words.map((category, index) => (
            <button
              key={category.category}
              className={`category-btn ${index === currentCategory ? 'active' : ''}`}
              onClick={() => changeCategory(index)}
            >
              {category.category} ({progress.categories[category.category]}/{category.words.length})
            </button>
          ))}
        </div>

        {/* 单词卡片 */}
        <div className="word-card">
          <div className="word-display">
            <div className="word-header">
              <h2>{currentWord.word}</h2>
              <span className="phonetic">{currentWord.phonetic}</span>
              <button className="pronounce-btn" onClick={pronounceWord}>
                🔊
              </button>
            </div>
            {showMeaning && (
              <div className="word-details">
                <p className="meaning">{currentWord.meaning}</p>
                <p className="example">{currentWord.example}</p>
                <button 
                  className="learned-btn" 
                  onClick={markAsLearned}
                  disabled={learnedWords.has(currentWord.id)}
                >
                  {learnedWords.has(currentWord.id) ? '已学习' : '标记为已学习'}
                </button>
              </div>
            )}
          </div>
          <div className="word-actions">
            <button onClick={() => setShowMeaning(!showMeaning)}>
              {showMeaning ? '隐藏含义' : '显示含义'}
            </button>
            <div className="navigation">
              <button onClick={prevWord}>上一个</button>
              <span>{currentWordIndex + 1} / {currentWords.length}</span>
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