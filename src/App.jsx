import React, { useState, useEffect, useRef } from 'react'
import './App.css'
import LoadingAnimation from './LoadingAnimation'
import SceneDialogue from './SceneDialogue'
import SentencePattern from './SentencePattern'
import Gamification from './Gamification'
import TestModule from './TestModule'
import StudyPlan from './StudyPlan'
import StudyReport from './StudyReport'
import { wordsData } from './data'

// 计算总单词数
const totalWords = wordsData.reduce((total, category) => total + category.words.length, 0)

// 初始化学习进度数据
const initialProgress = {
  totalWords: totalWords,
  learnedWords: 0,
  categories: Object.fromEntries(
    wordsData.map(category => [category.category, 0])
  )
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
    id: 'advanced',
    name: '高级学习者',
    description: '学习50个单词',
    icon: '💎',
    requiredWords: 50,
    unlocked: false
  },
  {
    id: 'master',
    name: '单词大师',
    description: '学习所有单词',
    icon: '👑',
    requiredWords: totalWords,
    unlocked: false
  }
]

// 分类成就
const categoryAchievements = wordsData.map((category, index) => ({
  id: `${category.category.toLowerCase().replace(/\s+/g, '_')}_master`,
  name: `${category.category}专家`,
  description: `学习所有${category.category}单词`,
  icon: category.icon,
  category: category.category,
  requiredWords: category.words.length,
  unlocked: false
}))

function App() {
  const [isLoading, setIsLoading] = useState(true)
  const [currentPage, setCurrentPage] = useState('words') // 'words', 'dialogue', 'sentence', 'test' or 'studyplan'
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
  
  // 收藏和生词本状态
  const [favorites, setFavorites] = useState(() => {
    const saved = localStorage.getItem('favorites');
    return saved ? JSON.parse(saved) : [];
  })
  const [difficultWords, setDifficultWords] = useState(() => {
    const saved = localStorage.getItem('difficultWords');
    return saved ? JSON.parse(saved) : [];
  })
  
  // 游戏化系统状态
  const [gamification, setGamification] = useState(null)
  const [showReward, setShowReward] = useState(false)
  const [currentReward, setCurrentReward] = useState(null)
  
  // 学习时间统计
  const [learningStartTime, setLearningStartTime] = useState(null)
  
  // 使用ref存储wordCard元素引用
  const wordCardRef = useRef(null)

  // 模拟数据加载
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])
  
  // 学习时间统计
  useEffect(() => {
    // 开始计时
    const startTime = Date.now();
    setLearningStartTime(startTime);
    
    // 定期更新学习时间
    const interval = setInterval(() => {
      updateLearningTime();
    }, 60000); // 每分钟更新一次
    
    // 组件卸载时停止计时并保存学习时间
    return () => {
      clearInterval(interval);
      updateLearningTime();
    };
  }, []);
  
  // 更新学习时间
  const updateLearningTime = () => {
    if (learningStartTime) {
      const currentTime = Date.now();
      const sessionTime = Math.floor((currentTime - learningStartTime) / 1000);
      
      // 从本地存储获取现有数据
      const savedStats = localStorage.getItem('learningStats');
      let learningStats = savedStats ? JSON.parse(savedStats) : {
        totalLearningTime: 0,
        dailyLearningTime: {},
        weeklyProgress: [],
        wordMastery: {},
        categoryProgress: {},
        streak: 0,
      };
      
      // 更新总学习时间
      learningStats.totalLearningTime += sessionTime;
      
      // 更新每日学习时间
      const today = new Date().toISOString().split('T')[0];
      learningStats.dailyLearningTime[today] = (learningStats.dailyLearningTime[today] || 0) + sessionTime;
      
      // 更新分类学习进度
      learningStats.categoryProgress = {
        ...learningStats.categoryProgress,
        ...Object.fromEntries(
          words.map(category => [
            category.category,
            {
              total: category.words.length,
              learned: category.words.filter(word => learnedWords.has(word.id)).length
            }
          ])
        )
      };
      
      // 保存到本地存储
      localStorage.setItem('learningStats', JSON.stringify(learningStats));
      
      // 重置开始时间
      setLearningStartTime(Date.now());
    }
  };

  // 初始化游戏化系统
  useEffect(() => {
    if (!isLoading) {
      const gameSystem = Gamification({ progress, learnedWords, setProgress });
      setGamification(gameSystem);
      
      // 监听游戏化系统的奖励通知
      const checkRewards = () => {
        if (gameSystem.showReward && gameSystem.currentReward) {
          setShowReward(true);
          setCurrentReward(gameSystem.currentReward);
          setTimeout(() => setShowReward(false), 3000);
        }
      };
      
      const interval = setInterval(checkRewards, 1000);
      return () => clearInterval(interval);
    }
  }, [isLoading, progress, learnedWords])

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

    // 增加积分（每个单词10分）
    if (gamification) {
      gamification.addPoints(10);
    }

    // 更新学习计划进度
    const today = new Date().toISOString().split('T')[0]
    const todayProgress = localStorage.getItem(`studyplan_${today}`) || 0
    const newTodayProgress = parseInt(todayProgress) + 1
    localStorage.setItem(`studyplan_${today}`, newTodayProgress)

    // 更新学习时间
    updateLearningTime();

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

  // 切换收藏状态
  const toggleFavorite = (word) => {
    setFavorites(prev => {
      const isFavorite = prev.some(fav => fav.id === word.id);
      let newFavorites;
      if (isFavorite) {
        newFavorites = prev.filter(fav => fav.id !== word.id);
      } else {
        newFavorites = [...prev, word];
      }
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }

  // 添加到生词本
  const addToDifficult = (word) => {
    setDifficultWords(prev => {
      if (!prev.some(diff => diff.id === word.id)) {
        const newDifficultWords = [...prev, word];
        localStorage.setItem('difficultWords', JSON.stringify(newDifficultWords));
        return newDifficultWords;
      }
      return prev;
    });
  }

  // 从收藏中删除
  const removeFromFavorites = (wordId) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(fav => fav.id !== wordId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }

  // 从生词本中删除
  const removeFromDifficult = (wordId) => {
    setDifficultWords(prev => {
      const newDifficultWords = prev.filter(diff => diff.id !== wordId);
      localStorage.setItem('difficultWords', JSON.stringify(newDifficultWords));
      return newDifficultWords;
    });
  }

  // 清空收藏
  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorites');
  }

  // 清空生词本
  const clearDifficultWords = () => {
    setDifficultWords([]);
    localStorage.removeItem('difficultWords');
  }

  return (
    <LoadingAnimation isLoading={isLoading}>
      <div className="App" style={{ opacity: isLoading ? 0 : 1, transition: 'opacity 0.5s ease' }}>
        <header className="App-header">
          <h1>521词小学英语口语</h1>
          
          {/* 导航栏 */}
          <div className="navigation-bar">
            <button 
              className={`nav-btn ${currentPage === 'words' ? 'active' : ''}`}
              onClick={() => setCurrentPage('words')}
              aria-label="单词学习"
            >
              📚 单词学习
            </button>
            <button 
              className={`nav-btn ${currentPage === 'dialogue' ? 'active' : ''}`}
              onClick={() => setCurrentPage('dialogue')}
              aria-label="场景对话"
            >
              💬 场景对话
            </button>
            <button 
              className={`nav-btn ${currentPage === 'sentence' ? 'active' : ''}`}
              onClick={() => setCurrentPage('sentence')}
              aria-label="句型训练"
            >
              📝 句型训练
            </button>
            <button 
              className={`nav-btn ${currentPage === 'test' ? 'active' : ''}`}
              onClick={() => setCurrentPage('test')}
              aria-label="单词测试"
            >
              🧪 单词测试
            </button>
            <button 
              className={`nav-btn ${currentPage === 'studyplan' ? 'active' : ''}`}
              onClick={() => setCurrentPage('studyplan')}
              aria-label="学习计划"
            >
              📅 学习计划
            </button>
            <button 
              className={`nav-btn ${currentPage === 'favorites' ? 'active' : ''}`}
              onClick={() => setCurrentPage('favorites')}
              aria-label="收藏单词"
            >
              ❤️ 收藏
            </button>
            <button 
              className={`nav-btn ${currentPage === 'difficult' ? 'active' : ''}`}
              onClick={() => setCurrentPage('difficult')}
              aria-label="生词本"
            >
              📖 生词本
            </button>
            <button 
              className={`nav-btn ${currentPage === 'report' ? 'active' : ''}`}
              onClick={() => setCurrentPage('report')}
              aria-label="学习报告"
            >
              📊 学习报告
            </button>
          </div>
          
          {/* 游戏化状态显示 */}
          <div className="gamification-status">
            <div className="points-display">
              <span className="points-icon">💰</span>
              <span className="points-value">{gamification?.points || 0}</span>
              <span className="points-label">积分</span>
            </div>
            {gamification?.streak > 0 && (
              <div className="streak-display">
                <span className="streak-icon">🔥</span>
                <span className="streak-value">{gamification.streak}</span>
                <span className="streak-label">连击</span>
              </div>
            )}
          </div>
          
          {currentPage === 'words' && (
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
          )}
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
        
        {/* 奖励通知 */}
        {showReward && currentReward && (
          <div className="reward-notification" role="alert" aria-live="assertive" aria-atomic="true">
            <div className="reward-icon">{currentReward.icon}</div>
            <div className="reward-content">
              <h3>🎁 新奖励获得！</h3>
              <h4>{currentReward.name}</h4>
              <p>{currentReward.description}</p>
            </div>
          </div>
        )}
        
        {/* 页面内容 */}
        {currentPage === 'words' ? (
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
                  <div className="word-icon">{currentWord.icon || words[currentCategory].icon}</div>
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
                  <button 
                    className={`favorite-btn ${favorites.some(fav => fav.id === currentWord.id) ? 'favorited' : ''}`}
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(currentWord); }}
                    onKeyPress={(e) => { e.stopPropagation(); if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggleFavorite(currentWord); } }}
                    aria-label={favorites.some(fav => fav.id === currentWord.id) ? '取消收藏' : '收藏单词'}
                    tabIndex="-1"
                  >
                    {favorites.some(fav => fav.id === currentWord.id) ? '❤️' : '🤍'}
                  </button>
                  <p className="flip-hint">点击卡片查看含义</p>
                </div>
                {/* 卡片背面 */}
                <div className="card-back" aria-hidden={!isFlipped}>
                  <h3>{currentWord.word}</h3>
                  <p className="meaning" aria-label={`含义：${currentWord.meaning}`}>{currentWord.meaning}</p>
                  <p className="example" aria-label={`例句：${currentWord.example}`}>{currentWord.example}</p>
                  <div className="card-buttons">
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
                    <button 
                      className="difficult-btn"
                      onClick={(e) => { e.stopPropagation(); addToDifficult(currentWord); }}
                      onKeyPress={(e) => { e.stopPropagation(); if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); addToDifficult(currentWord); } }}
                      disabled={difficultWords.some(diff => diff.id === currentWord.id)}
                      aria-label={difficultWords.some(diff => diff.id === currentWord.id) ? '已添加到生词本' : '添加到生词本'}
                      tabIndex="-1"
                    >
                      {difficultWords.some(diff => diff.id === currentWord.id) ? '📖 已添加' : '📖 添加到生词本'}
                    </button>
                  </div>
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
        ) : currentPage === 'favorites' ? (
          <main className="App-main">
            <div className="favorites-container">
              <h2>❤️ 收藏单词</h2>
              {favorites.length === 0 ? (
                <div className="empty-state">
                  <p>还没有收藏的单词</p>
                  <button 
                    className="back-btn"
                    onClick={() => setCurrentPage('words')}
                  >去学习单词</button>
                </div>
              ) : (
                <>
                  <div className="favorites-header">
                    <p>共 {favorites.length} 个收藏单词</p>
                    <button 
                      className="clear-btn"
                      onClick={clearFavorites}
                      aria-label="清空收藏"
                    >清空收藏</button>
                  </div>
                  <div className="words-list">
                    {favorites.map((word) => (
                      <div key={word.id} className="word-item">
                        <div className="word-info">
                          <span className="word-icon">{word.icon}</span>
                          <div className="word-details">
                            <h3>{word.word}</h3>
                            <p className="phonetic">{word.phonetic}</p>
                            <p className="meaning">{word.meaning}</p>
                            <p className="example">{word.example}</p>
                          </div>
                        </div>
                        <div className="word-actions">
                          <button 
                            className="play-btn"
                            onClick={() => {
                              // 临时设置当前单词并播放发音
                              const utterance = new SpeechSynthesisUtterance(word.word);
                              utterance.lang = 'en-US';
                              speechSynthesis.speak(utterance);
                            }}
                            aria-label="播放单词发音"
                          >🔊</button>
                          <button 
                            className="remove-btn"
                            onClick={() => removeFromFavorites(word.id)}
                            aria-label="从收藏中删除"
                          >🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </main>
        ) : currentPage === 'difficult' ? (
          <main className="App-main">
            <div className="difficult-container">
              <h2>📖 生词本</h2>
              {difficultWords.length === 0 ? (
                <div className="empty-state">
                  <p>生词本为空</p>
                  <button 
                    className="back-btn"
                    onClick={() => setCurrentPage('words')}
                  >去学习单词</button>
                </div>
              ) : (
                <>
                  <div className="difficult-header">
                    <p>共 {difficultWords.length} 个生词</p>
                    <button 
                      className="clear-btn"
                      onClick={clearDifficultWords}
                      aria-label="清空生词本"
                    >清空生词本</button>
                  </div>
                  <div className="words-list">
                    {difficultWords.map((word) => (
                      <div key={word.id} className="word-item">
                        <div className="word-info">
                          <span className="word-icon">{word.icon}</span>
                          <div className="word-details">
                            <h3>{word.word}</h3>
                            <p className="phonetic">{word.phonetic}</p>
                            <p className="meaning">{word.meaning}</p>
                            <p className="example">{word.example}</p>
                          </div>
                        </div>
                        <div className="word-actions">
                          <button 
                            className="play-btn"
                            onClick={() => {
                              // 临时设置当前单词并播放发音
                              const utterance = new SpeechSynthesisUtterance(word.word);
                              utterance.lang = 'en-US';
                              speechSynthesis.speak(utterance);
                            }}
                            aria-label="播放单词发音"
                          >🔊</button>
                          <button 
                            className="remove-btn"
                            onClick={() => removeFromDifficult(word.id)}
                            aria-label="从生词本中删除"
                          >🗑️</button>
                        </div>
                      </div>
                    ))}
                  </div>
                </>
              )}
            </div>
          </main>
        ) : currentPage === 'dialogue' ? (
          <SceneDialogue />
        ) : currentPage === 'sentence' ? (
          <SentencePattern />
        ) : currentPage === 'test' ? (
          <TestModule wordsData={words} onTestComplete={(result) => {
            // 测试完成后的处理逻辑
            console.log('测试结果:', result);
            // 可以在这里添加积分奖励等逻辑
            if (gamification) {
              gamification.addPoints(result.score);
            }
          }} />
        ) : currentPage === 'report' ? (
          <StudyReport />
        ) : (
          <StudyPlan />
        )}
        <footer className="App-footer">
          <p>© 2026 521词小学英语口语学习应用</p>
        </footer>
      </div>
    </LoadingAnimation>
  )
}

export default App