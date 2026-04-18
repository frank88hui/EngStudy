import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './App.css'

const Favorites = () => {
  const [favorites, setFavorites] = useState([])

  useEffect(() => {
    const saved = localStorage.getItem('favorites');
    if (saved) {
      setFavorites(JSON.parse(saved));
    }
  }, [])

  // 从收藏中删除
  const removeFromFavorites = (wordId) => {
    setFavorites(prev => {
      const newFavorites = prev.filter(fav => fav.id !== wordId);
      localStorage.setItem('favorites', JSON.stringify(newFavorites));
      return newFavorites;
    });
  }

  // 清空收藏
  const clearFavorites = () => {
    setFavorites([]);
    localStorage.removeItem('favorites');
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
          <Link to="/favorites" className="nav-btn active">
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
      
      <main className="App-main">
        <div className="favorites-container">
          <h2>❤️ 收藏单词</h2>
          {favorites.length === 0 ? (
            <div className="empty-state">
              <p>还没有收藏的单词</p>
              <Link to="/words" className="back-btn">去学习单词</Link>
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
      <footer className="App-footer">
        <p>© 2026 521词小学英语口语学习应用</p>
      </footer>
    </div>
  )
}

export default Favorites