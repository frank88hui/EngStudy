import React, { useState, useEffect } from 'react';
import './StudyReport.css';

// 学习报告组件
function StudyReport() {
  const [learningData, setLearningData] = useState({
    totalLearningTime: 0, // 总学习时间（秒）
    dailyLearningTime: {}, // 每日学习时间
    weeklyProgress: [], // 每周学习进度
    wordMastery: {}, // 单词掌握程度
    categoryProgress: {}, // 分类学习进度
    streak: 0, // 连续学习天数
  });
  
  // 初始化学习数据
  useEffect(() => {
    loadLearningData();
  }, []);
  
  // 加载学习数据
  const loadLearningData = () => {
    // 从本地存储获取数据
    const savedData = localStorage.getItem('learningStats');
    if (savedData) {
      setLearningData(JSON.parse(savedData));
    } else {
      // 初始化默认数据
      const defaultData = {
        totalLearningTime: 0,
        dailyLearningTime: {},
        weeklyProgress: [],
        wordMastery: {},
        categoryProgress: {},
        streak: 0,
      };
      setLearningData(defaultData);
      localStorage.setItem('learningStats', JSON.stringify(defaultData));
    }
  };
  
  // 格式化时间（秒转时分秒）
  const formatTime = (seconds) => {
    const hours = Math.floor(seconds / 3600);
    const minutes = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    return `${hours}小时 ${minutes}分钟 ${secs}秒`;
  };
  
  // 计算最近7天的学习时间
  const getRecent7DaysData = () => {
    const days = [];
    const today = new Date();
    
    for (let i = 6; i >= 0; i--) {
      const date = new Date(today);
      date.setDate(today.getDate() - i);
      const dateStr = date.toISOString().split('T')[0];
      const dayName = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][date.getDay()];
      days.push({
        date: dateStr,
        day: dayName,
        time: learningData.dailyLearningTime[dateStr] || 0,
      });
    }
    
    return days;
  };
  
  // 生成进步曲线图表数据
  const generateProgressChart = () => {
    const days = getRecent7DaysData();
    const maxTime = Math.max(...days.map(day => day.time), 3600); // 至少1小时
    
    return (
      <div className="progress-chart">
        <div className="chart-container">
          {days.map((day, index) => {
            const height = (day.time / maxTime) * 100;
            return (
              <div key={day.date} className="chart-bar-container">
                <div 
                  className="chart-bar" 
                  style={{ height: `${height}%` }}
                  title={`${day.day}: ${formatTime(day.time)}`}
                ></div>
                <div className="chart-label">{day.day}</div>
              </div>
            );
          })}
        </div>
      </div>
    );
  };
  
  // 计算总体掌握程度
  const calculateOverallMastery = () => {
    const categories = Object.values(learningData.categoryProgress);
    if (categories.length === 0) return 0;
    
    const totalWords = categories.reduce((sum, cat) => sum + cat.total, 0);
    const learnedWords = categories.reduce((sum, cat) => sum + cat.learned, 0);
    
    return totalWords > 0 ? Math.round((learnedWords / totalWords) * 100) : 0;
  };
  
  return (
    <div className="study-report">
      <div className="report-header">
        <h2>📊 学习报告</h2>
        <p>了解你的学习情况</p>
      </div>
      
      <div className="report-cards">
        {/* 总学习时间卡片 */}
        <div className="report-card time-card">
          <div className="card-icon">⏰</div>
          <h3>总学习时间</h3>
          <p className="time-value">{formatTime(learningData.totalLearningTime)}</p>
        </div>
        
        {/* 连续学习天数卡片 */}
        <div className="report-card streak-card">
          <div className="card-icon">🔥</div>
          <h3>连续学习</h3>
          <p className="streak-value">{learningData.streak} 天</p>
        </div>
        
        {/* 总体掌握程度卡片 */}
        <div className="report-card mastery-card">
          <div className="card-icon">🎯</div>
          <h3>掌握程度</h3>
          <div className="mastery-progress">
            <div 
              className="mastery-bar" 
              style={{ width: `${calculateOverallMastery()}%` }}
            ></div>
          </div>
          <p className="mastery-value">{calculateOverallMastery()}%</p>
        </div>
      </div>
      
      {/* 学习时间曲线 */}
      <div className="report-section">
        <h3>📈 最近7天学习时间</h3>
        {generateProgressChart()}
      </div>
      
      {/* 分类学习进度 */}
      <div className="report-section">
        <h3>📋 分类学习进度</h3>
        <div className="category-progress-list">
          {Object.entries(learningData.categoryProgress).map(([category, progress]) => {
            const percentage = progress.total > 0 ? Math.round((progress.learned / progress.total) * 100) : 0;
            return (
              <div key={category} className="category-progress-item">
                <div className="category-info">
                  <span className="category-name">{category}</span>
                  <span className="category-count">{progress.learned}/{progress.total}</span>
                </div>
                <div className="category-progress-bar">
                  <div 
                    className="category-progress-fill" 
                    style={{ width: `${percentage}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
      
      {/* 学习建议 */}
      <div className="report-section suggestions">
        <h3>💡 学习建议</h3>
        <div className="suggestions-list">
          <div className="suggestion-item">
            <span className="suggestion-icon">✅</span>
            <span>每天坚持学习15-30分钟，效果最佳</span>
          </div>
          <div className="suggestion-item">
            <span className="suggestion-icon">🎯</span>
            <span>重点复习掌握程度较低的分类</span>
          </div>
          <div className="suggestion-item">
            <span className="suggestion-icon">🔄</span>
            <span>定期回顾已学习的单词，加深记忆</span>
          </div>
          <div className="suggestion-item">
            <span className="suggestion-icon">🎮</span>
            <span>通过游戏化功能增加学习趣味性</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default StudyReport;