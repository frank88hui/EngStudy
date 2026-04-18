import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import LoadingAnimation from './LoadingAnimation'

// 模拟521个英语单词数据，按类别分类
const wordsData = [
  {
    category: '水果',
    icon: '🍎',
    color: '#FF6B6B',
    words: [
      { id: 1, word: 'apple', meaning: '苹果', example: 'I eat an apple every day.', phonetic: 'ˈæpl', icon: '🍎' },
      { id: 2, word: 'banana', meaning: '香蕉', example: 'Bananas are yellow.', phonetic: 'bəˈnɑːnə', icon: '🍌' },
      { id: 3, word: 'orange', meaning: '橙子', example: 'I like orange juice.', phonetic: 'ˈɔːrɪndʒ', icon: '🍊' },
      { id: 4, word: 'grape', meaning: '葡萄', example: 'Grapes are sweet.', phonetic: 'ɡreɪp', icon: '🍇' },
      { id: 5, word: 'watermelon', meaning: '西瓜', example: 'Watermelon is refreshing.', phonetic: 'ˈwɔːtərmelən', icon: '🍉' }
    ]
  },
  {
    category: '动物',
    icon: '🐶',
    color: '#4ECDC4',
    words: [
      { id: 6, word: 'cat', meaning: '猫', example: 'The cat is black.', phonetic: 'kæt', icon: '🐱' },
      { id: 7, word: 'dog', meaning: '狗', example: 'The dog is barking.', phonetic: 'dɔːɡ', icon: '🐶' },
      { id: 8, word: 'bird', meaning: '鸟', example: 'The bird is singing.', phonetic: 'bɜːrd', icon: '🐦' },
      { id: 9, word: 'fish', meaning: '鱼', example: 'The fish is swimming.', phonetic: 'fɪʃ', icon: '🐟' },
      { id: 10, word: 'rabbit', meaning: '兔子', example: 'The rabbit is hopping.', phonetic: 'ˈræbɪt', icon: '🐰' }
    ]
  },
  {
    category: '食物',
    icon: '🍕',
    color: '#FFD166',
    words: [
      { id: 11, word: 'egg', meaning: '鸡蛋', example: 'I have an egg for breakfast.', phonetic: 'eɡ', icon: '🥚' },
      { id: 12, word: 'bread', meaning: '面包', example: 'I eat bread every morning.', phonetic: 'bred', icon: '🍞' },
      { id: 13, word: 'milk', meaning: '牛奶', example: 'I drink milk every day.', phonetic: 'mɪlk', icon: '🥛' },
      { id: 14, word: 'rice', meaning: '米饭', example: 'I eat rice for lunch.', phonetic: 'raɪs', icon: '🍚' },
      { id: 15, word: 'meat', meaning: '肉', example: 'I like meat.', phonetic: 'miːt', icon: '🥩' }
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

// 成就数据
const achievements = [
  {
    id: 'first_word',
    name: '第一次尝试',
    description: '学习第一个单词',
    icon: '🌟',
    requiredWords: 1,
    unlocked: false
  },
  {
    id: 'beginner',
    name: '初学者',
    description: '学习5个单词',
    icon: '🏆',
    requiredWords: 5,
    unlocked: false
  },
  {
    id: 'intermediate',
    name: '中级学习者',
    description: '学习10个单词',
    icon: '🎖️',
    requiredWords: 10,
    unlocked: false
  },
  {
    id: 'master',
    name: '单词大师',
    description: '学习所有单词',
    icon: '👑',
    requiredWords: 15,
    unlocked: false
  }
]

// 分类成就
const categoryAchievements = [
  {
    id: 'fruit_master',
    name: '水果专家',
    description: '学习所有水果单词',
    icon: '🍎',
    category: '水果',
    requiredWords: 5,
    unlocked: false
  },
  {
    id: 'animal_master',
    name: '动物专家',
    description: '学习所有动物单词',
    icon: '🐶',
    category: '动物',
    requiredWords: 5,
    unlocked: false
  },
  {
    id: 'food_master',
    name: '食物专家',
    description: '学习所有食物单词',
    icon: '🍕',
    category: '食物',
    requiredWords: 5,
    unlocked: false
  }
]

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [words, setWords] = useState(wordsData)
  const [currentCategory, setCurrentCategory] = useState(0)
  const [currentWordIndex, setCurrentWordIndex] = useState(0)
  const [isFlipped, setIsFlipped] = useState(false)
  const [progress, setProgress] = useState(initialProgress)
  const [learnedWords, setLearnedWords] = useState(new Set())
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioWave, setAudioWave] = useState([])
  const [unlockedAchievements, setUnlockedAchievements] = useState([])
  const [showAchievement, setShowAchievement] = useState(false)
  const [currentAchievement, setCurrentAchievement] = useState(null)
  const [unlockedCategoryAchievements, setUnlockedCategoryAchievements] = useState([])
  
  // 使用ref存储wordCard元素引用
  const wordCardRef = useRef(null)

  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  // 获取当前分类的单词列表
  const currentWords = words[currentCategory].words
  // 获取当前单词
  const currentWord = currentWords[currentWordIndex]

  // 发音功能
  const pronounceWord = () => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      
      // 生成音频波形动画数据 - 优化性能
      let animationId = null
      
      const generateWave = () => {
        // 预生成波形数据，减少计算量
        const wave = Array.from({ length: 8 }, () => Math.random() * 10 + 2)
        setAudioWave(wave)
        if (isSpeaking) {
          animationId = requestAnimationFrame(generateWave)
        }
      }
      
      generateWave()
      
      const utterance = new SpeechSynthesisUtterance(currentWord.word)
      utterance.lang = 'en-US'
      utterance.onend = () => {
        setIsSpeaking(false)
        setAudioWave([])
        // 清理动画帧，避免内存泄漏
        if (animationId) {
          cancelAnimationFrame(animationId)
        }
      }
      speechSynthesis.speak(utterance)
    }
  }

  // 检查并解锁成就
  const checkAchievements = (newProgress) => {
    // 检查全局成就
    achievements.forEach(achievement => {
      if (!unlockedAchievements.includes(achievement.id) && 
          newProgress.learnedWords >= achievement.requiredWords) {
        setUnlockedAchievements(prev => [...prev, achievement.id])
        setCurrentAchievement(achievement)
        setShowAchievement(true)
        setTimeout(() => setShowAchievement(false), 3000)
      }
    })

    // 检查分类成就
    categoryAchievements.forEach(achievement => {
      if (!unlockedCategoryAchievements.includes(achievement.id) && 
          newProgress.categories[achievement.category] >= achievement.requiredWords) {
        setUnlockedCategoryAchievements(prev => [...prev, achievement.id])
        setCurrentAchievement(achievement)
        setShowAchievement(true)
        setTimeout(() => setShowAchievement(false), 3000)
      }
    })
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

    // 检查成就
    checkAchievements(newProgress)
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
    setIsFlipped(false)
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
    setIsFlipped(false)
  }

  // 手势支持
  useEffect(() => {
    let touchStartX = 0
    let touchEndX = 0

    const handleTouchStart = (e) => {
      touchStartX = e.changedTouches[0].screenX
    }

    const handleTouchEnd = (e) => {
      touchEndX = e.changedTouches[0].screenX
      handleSwipe()
    }

    const handleSwipe = () => {
      const swipeThreshold = 50
      if (touchEndX < touchStartX - swipeThreshold) {
        // 向左滑动，下一个单词
        nextWord()
      } else if (touchEndX > touchStartX + swipeThreshold) {
        // 向右滑动，上一个单词
        prevWord()
      }
    }

    // 添加触摸事件监听器
    const wordCard = wordCardRef.current
    if (wordCard) {
      wordCard.addEventListener('touchstart', handleTouchStart)
      wordCard.addEventListener('touchend', handleTouchEnd)
    }

    return () => {
      // 清理事件监听器
      if (wordCard) {
        wordCard.removeEventListener('touchstart', handleTouchStart)
        wordCard.removeEventListener('touchend', handleTouchEnd)
      }
    }
  }, [currentWordIndex, currentCategory, currentWords.length, words.length])

  // 切换分类
  const changeCategory = (index) => {
    setCurrentCategory(index)
    setCurrentWordIndex(0)
    setIsFlipped(false)
  }

  return (
    <LoadingAnimation isLoading={isLoading}>
      <div className="App" style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
        <header className="App-header">
          <h1>521词小学英语口语</h1>
          <div className="progress-section">
            <div className="progress-container">
              <div className="progress-bar" role="progressbar" aria-valuenow={progress.learnedWords} aria-valuemin="0" aria-valuemax={progress.totalWords} aria-label="学习进度">
                <div 
                  className="progress-fill" 
                  style={{ width: `${(progress.learnedWords / progress.totalWords) * 100}%` }}
                >
                  <div className="progress-glow"></div>
                </div>
                <div className="progress-emoji">
                  {progress.learnedWords === 0 ? '😴' : 
                   progress.learnedWords < 5 ? '😊' : 
                   progress.learnedWords < 10 ? '😃' : 
                   progress.learnedWords < 15 ? '🤩' : '🎉'}
                </div>
              </div>
              <p className="progress-text" role="status" aria-live="polite">
                学习进度: {progress.learnedWords} / {progress.totalWords} 单词
              </p>
              <div className="progress-percentage" aria-label={`学习进度 ${Math.round((progress.learnedWords / progress.totalWords) * 100)}%`}>
                {Math.round((progress.learnedWords / progress.totalWords) * 100)}%
              </div>
            </div>
          </div>
        </header>
        
        {/* 成就通知 */}
        {showAchievement && currentAchievement && (
          <div className="achievement-notification" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="achievement-icon">{currentAchievement.icon}</div>
            <div className="achievement-content">
              <h3>🎉 新成就解锁！</h3>
              <h4>{currentAchievement.name}</h4>
              <p>{currentAchievement.description}</p>
            </div>
          </div>
        )}
        <main className="App-main">
          {/* 分类选择 */}
          <div className="category-selector" role="radiogroup" aria-label="选择单词分类">
            {words.map((category, index) => (
              <button
                key={category.category}
                className={`category-btn ${index === currentCategory ? 'active' : ''}`}
                onClick={() => changeCategory(index)}
                onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); changeCategory(index); } }}
                style={{ '--category-color': category.color }}
                role="radio"
                aria-checked={index === currentCategory}
                aria-label={`${category.category}分类，已学习${progress.categories[category.category]}/${category.words.length}个单词`}
                tabIndex="0"
              >
                <span className="category-icon">{category.icon}</span>
                <span className="category-name">{category.category}</span>
                <div className="category-progress" role="progressbar" aria-valuenow={progress.categories[category.category]} aria-valuemin="0" aria-valuemax={category.words.length} aria-label={`${category.category}分类学习进度`}>
                  <div 
                    className="category-progress-bar" 
                    style={{ 
                      width: `${(progress.categories[category.category] / category.words.length) * 100}%` 
                    }}
                  ></div>
                </div>
                <span className="category-count">
                  {progress.categories[category.category]}/{category.words.length}
                </span>
              </button>
            ))}
          </div>

          {/* 单词卡片 */}
          <div 
            ref={wordCardRef}
            className={`word-card ${isFlipped ? 'flipped' : ''}`} 
            onClick={() => setIsFlipped(!isFlipped)}
            role="button"
            aria-pressed={isFlipped}
            aria-label={`单词卡片：${currentWord.word}，点击翻转`}
            tabIndex="0"
            onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setIsFlipped(!isFlipped); } }}
          >
            <div className="card-inner">
              {/* 卡片正面 */}
              <div className="card-front" aria-hidden={isFlipped}>
                <div className="word-icon">{currentWord.icon}</div>
                <div className="word-header">
                  <h2>{currentWord.word}</h2>
                  <span className="phonetic" aria-label={`发音：${currentWord.phonetic}`}>{currentWord.phonetic}</span>
                </div>
                <div className="pronounce-container">
                  <button 
                    className={`pronounce-btn ${isSpeaking ? 'speaking' : ''}`} 
                    onClick={(e) => { e.stopPropagation(); pronounceWord(); }}
                    onKeyPress={(e) => { e.stopPropagation(); if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pronounceWord(); } }}
                    aria-label="播放单词发音"
                    tabIndex="-1"
                  >
                    {isSpeaking ? '🔊' : '🔊'}
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
                <p className="flip-hint">点击卡片查看含义</p>
              </div>
              {/* 卡片背面 */}
              <div className="card-back" aria-hidden={!isFlipped}>
                <h3>{currentWord.word}</h3>
                <p className="meaning" aria-label={`含义：${currentWord.meaning}`}>{currentWord.meaning}</p>
                <p className="example" aria-label={`例句：${currentWord.example}`}>{currentWord.example}</p>
                <button 
                  className="learned-btn" 
                  onClick={(e) => { e.stopPropagation(); markAsLearned(); }}
                  onKeyPress={(e) => { e.stopPropagation(); if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); markAsLearned(); } }}
                  disabled={learnedWords.has(currentWord.id)}
                  aria-label={learnedWords.has(currentWord.id) ? '已标记为学习' : '标记为已学习'}
                  tabIndex="-1"
                >
                  {learnedWords.has(currentWord.id) ? '已学习' : '标记为已学习'}
                </button>
                <p className="flip-hint">点击卡片返回</p>
              </div>
            </div>
          </div>
          <div className="word-actions">
            <div className="navigation" role="group" aria-label="单词导航">
              <button 
                onClick={prevWord}
                onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); prevWord(); } }}
                aria-label="上一个单词"
                tabIndex="0"
              >上一个</button>
              <span role="status" aria-live="polite" aria-label={`当前单词 ${currentWordIndex + 1} 共 ${currentWords.length} 个`}>{currentWordIndex + 1} / {currentWords.length}</span>
              <button 
                onClick={nextWord}
                onKeyPress={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); nextWord(); } }}
                aria-label="下一个单词"
                tabIndex="0"
              >下一个</button>
            </div>
          </div>
        </main>
        <footer className="App-footer">
          <p>© 2026 521词小学英语口语学习应用</p>
        </footer>
      </div>
    </LoadingAnimation>
  )
}

export default App