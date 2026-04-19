import React from 'react';
import { Link } from 'react-router-dom';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-page">
      <div className="hero-section">
        <h1>521词小学英语口语</h1>
        <p>让英语学习变得有趣又简单</p>
        <Link to="/words" className="start-btn">开始学习</Link>
      </div>
      
      <div className="features-section">
        <h2>学习功能</h2>
        <div className="features-grid">
          <Link to="/words" className="feature-card">
            <div className="feature-icon">📚</div>
            <h3>单词学习</h3>
            <p>通过分类学习英语单词，包含发音、含义和例句</p>
          </Link>
          <Link to="/dialogue" className="feature-card">
            <div className="feature-icon">💬</div>
            <h3>场景对话</h3>
            <p>在真实场景中练习英语对话，提高口语能力</p>
          </Link>
          <Link to="/sentence" className="feature-card">
            <div className="feature-icon">📝</div>
            <h3>句型训练</h3>
            <p>学习常用英语句型，掌握基础语法</p>
          </Link>
          <Link to="/test" className="feature-card">
            <div className="feature-icon">🧪</div>
            <h3>单词测试</h3>
            <p>通过测试检验学习成果，巩固记忆</p>
          </Link>
          <Link to="/studyplan" className="feature-card">
            <div className="feature-icon">📅</div>
            <h3>学习计划</h3>
            <p>制定学习目标，跟踪学习进度</p>
          </Link>
          <Link to="/report" className="feature-card">
            <div className="feature-icon">📊</div>
            <h3>学习报告</h3>
            <p>查看学习数据，了解学习情况</p>
          </Link>
        </div>
      </div>
      
      <div className="stats-section">
        <div className="stat-item">
          <div className="stat-number">521</div>
          <div className="stat-label">核心单词</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">6</div>
          <div className="stat-label">学习级别</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">37</div>
          <div className="stat-label">单词分类</div>
        </div>
        <div className="stat-item">
          <div className="stat-number">100%</div>
          <div className="stat-label">免费使用</div>
        </div>
      </div>
      
      <footer className="home-footer">
        <p>© 2026 521词小学英语口语学习应用</p>
        <div className="footer-links">
          <Link to="/about">关于我们</Link>
          <Link to="/contact">联系我们</Link>
          <Link to="/privacy">隐私政策</Link>
        </div>
      </footer>
    </div>
  );
};

export default HomePage;
