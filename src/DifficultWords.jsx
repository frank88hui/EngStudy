import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

const DifficultWords = () => {
  const [difficultWords, setDifficultWords] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('difficultWords');
    if (saved) {
      setDifficultWords(JSON.parse(saved));
    }
  }, [])

  // 从生词本中删除
  const removeFromDifficult = (wordId) => {
    setDifficultWords(prev => {
      const newDifficultWords = prev.filter(diff => diff.id !== wordId);
      localStorage.setItem('difficultWords', JSON.stringify(newDifficultWords));
      return newDifficultWords;
    });
  }

  // 清空生词本
  const clearDifficultWords = () => {
    setDifficultWords([]);
    localStorage.removeItem('difficultWords');
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
          <Link to="/test" className="nav-btn">
            🧪 单词测试
          </Link>
          <Link to="/studyplan" className="nav-btn">
            📅 学习计划
          </Link>
          <Link to="/favorites" className="nav-btn">
            ❤️ 收藏
          </Link>
          <Link to="/difficult" className="nav-btn active">
            📖 生词本
          </Link>
          <Link to="/report" className="nav-btn">
            📊 学习报告
          </Link>
        </div>
      </header>
      
      <main className="App-main">
        <div className="difficult-container">
          <h2>📖 生词本</h2>
          {difficultWords.length === 0 ? (
            <div className="empty-state">
              <p>生词本为空</p>
              <Link to="/words" className="back-btn">去学习单词</Link>
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
      <footer className="App-footer">
        <p>© 2026 521词小学英语口语学习应用</p>
      </footer>
    </div>
  )
}

export default DifficultWords