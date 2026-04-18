import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './StudyPlan.css'

function StudyPlan() {
  // 学习计划状态
  const [dailyGoal, setDailyGoal] = useState(5) // 默认每日学习5个单词
  const [todayProgress, setTodayProgress] = useState(0)
  const [weeklyProgress, setWeeklyProgress] = useState([])
  const [reminderTime, setReminderTime] = useState('18:00')
  const [showReminder, setShowReminder] = useState(false)
  const [reminderEnabled, setReminderEnabled] = useState(true)
  const [completedDays, setCompletedDays] = useState([])
  const [streakCount, setStreakCount] = useState(0)
  
  // 初始化周进度数据
  useEffect(() => {
    const today = new Date()
    const weekStart = new Date(today)
    weekStart.setDate(today.getDate() - today.getDay())
    
    const weekData = []
    for (let i = 0; i < 7; i++) {
      const date = new Date(weekStart)
      date.setDate(weekStart.getDate() + i)
      const dateStr = date.toISOString().split('T')[0]
      
      // 从本地存储加载数据
      const dayProgress = localStorage.getItem(`studyplan_${dateStr}`) || 0
      weekData.push({
        date: dateStr,
        day: ['周日', '周一', '周二', '周三', '周四', '周五', '周六'][i],
        progress: parseInt(dayProgress),
        completed: parseInt(dayProgress) >= dailyGoal
      })
    }
    
    setWeeklyProgress(weekData)
    
    // 加载今天的进度
    const todayStr = today.toISOString().split('T')[0]
    const todayData = localStorage.getItem(`studyplan_${todayStr}`) || 0
    setTodayProgress(parseInt(todayData))
    
    // 检查连续学习天数
    checkStreak()
    
  }, [dailyGoal])
  
  // 检查连续学习天数
  const checkStreak = () => {
    let streak = 0
    let currentDate = new Date()
    
    while (true) {
      const dateStr = currentDate.toISOString().split('T')[0]
      const dayProgress = localStorage.getItem(`studyplan_${dateStr}`) || 0
      
      if (parseInt(dayProgress) >= dailyGoal) {
        streak++
        currentDate.setDate(currentDate.getDate() - 1)
      } else {
        break
      }
    }
    
    setStreakCount(streak)
  }
  
  // 更新每日学习目标
  const updateDailyGoal = (e) => {
    const goal = parseInt(e.target.value)
    if (goal > 0 && goal <= 20) { // 限制目标在1-20个单词之间
      setDailyGoal(goal)
    }
  }
  
  // 更新提醒时间
  const updateReminderTime = (e) => {
    setReminderTime(e.target.value)
  }
  
  // 保存设置
  const saveSettings = () => {
    localStorage.setItem('studyplan_dailyGoal', dailyGoal)
    localStorage.setItem('studyplan_reminderTime', reminderTime)
    localStorage.setItem('studyplan_reminderEnabled', reminderEnabled)
    
    // 重新设置提醒
    setupReminder()
  }
  
  // 设置学习提醒
  const setupReminder = () => {
    if (!reminderEnabled) return
    
    // 清除之前的提醒
    if (window.reminderTimeout) {
      clearTimeout(window.reminderTimeout)
    }
    
    // 计算今天的提醒时间
    const [hours, minutes] = reminderTime.split(':').map(Number)
    const now = new Date()
    const reminderDate = new Date()
    reminderDate.setHours(hours, minutes, 0, 0)
    
    // 如果今天的提醒时间已过，设置为明天
    if (reminderDate < now) {
      reminderDate.setDate(reminderDate.getDate() + 1)
    }
    
    // 计算时间差
    const timeUntilReminder = reminderDate - now
    
    // 设置提醒
    window.reminderTimeout = setTimeout(() => {
      setShowReminder(true)
      // 播放提醒音效（如果支持）
      if ('Notification' in window && Notification.permission === 'granted') {
        new Notification('521词小学英语口语', {
          body: '该开始今天的英语学习了！',
          icon: 'https://trae-api-cn.mchost.guru/api/ide/v1/text_to_image?prompt=colorful%20cartoon%20english%20learning%20app%20icon%20for%20children&image_size=square'
        })
      }
    }, timeUntilReminder)
  }
  
  // 处理学习完成
  const handleStudyComplete = (wordsLearned) => {
    const today = new Date().toISOString().split('T')[0]
    const newProgress = todayProgress + wordsLearned
    setTodayProgress(newProgress)
    
    // 保存到本地存储
    localStorage.setItem(`studyplan_${today}`, newProgress)
    
    // 更新周进度
    setWeeklyProgress(prev => prev.map(day => {
      if (day.date === today) {
        return {
          ...day,
          progress: newProgress,
          completed: newProgress >= dailyGoal
        }
      }
      return day
    }))
    
    // 检查是否完成今日目标
    if (newProgress >= dailyGoal) {
      // 添加到完成天数
      if (!completedDays.includes(today)) {
        setCompletedDays([...completedDays, today])
      }
      
      // 更新连续学习天数
      checkStreak()
    }
  }
  
  // 请求通知权限
  const requestNotificationPermission = () => {
    if ('Notification' in window) {
      Notification.requestPermission()
    }
  }
  
  // 初始化时请求通知权限
  useEffect(() => {
    requestNotificationPermission()
    setupReminder()
    
    // 从本地存储加载设置
    const savedGoal = localStorage.getItem('studyplan_dailyGoal')
    const savedTime = localStorage.getItem('studyplan_reminderTime')
    const savedEnabled = localStorage.getItem('studyplan_reminderEnabled')
    
    if (savedGoal) setDailyGoal(parseInt(savedGoal))
    if (savedTime) setReminderTime(savedTime)
    if (savedEnabled !== null) setReminderEnabled(savedEnabled === 'true')
    
  }, [])
  
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
          <Link to="/studyplan" className="nav-btn active">
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
      <div className="study-plan-container">
      <h2>📅 学习计划</h2>
      
      {/* 学习统计 */}
      <div className="study-stats">
        <div className="stat-card">
          <div className="stat-icon">🎯</div>
          <div className="stat-content">
            <h3>今日目标</h3>
            <p className="stat-value">{dailyGoal} 单词</p>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">📈</div>
          <div className="stat-content">
            <h3>今日进度</h3>
            <p className="stat-value">{todayProgress} / {dailyGoal}</p>
            <div className="progress-bar-small">
              <div 
                className="progress-fill-small" 
                style={{ width: `${Math.min((todayProgress / dailyGoal) * 100, 100)}%` }}
              ></div>
            </div>
          </div>
        </div>
        
        <div className="stat-card">
          <div className="stat-icon">🔥</div>
          <div className="stat-content">
            <h3>连续学习</h3>
            <p className="stat-value">{streakCount} 天</p>
          </div>
        </div>
      </div>
      
      {/* 周进度 */}
      <div className="weekly-progress">
        <h3>📊 本周学习进度</h3>
        <div className="week-days">
          {weeklyProgress.map((day, index) => (
            <div 
              key={day.date} 
              className={`day-card ${day.completed ? 'completed' : ''} ${index === new Date().getDay() ? 'today' : ''}`}
            >
              <div className="day-name">{day.day}</div>
              <div className="day-progress-bar">
                <div 
                  className="day-progress-fill" 
                  style={{ width: `${Math.min((day.progress / dailyGoal) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="day-progress-text">{day.progress}/{dailyGoal}</div>
            </div>
          ))}
        </div>
      </div>
      
      {/* 设置 */}
      <div className="study-settings">
        <h3>⚙️ 学习设置</h3>
        <div className="settings-form">
          <div className="form-group">
            <label htmlFor="daily-goal">每日学习目标（单词数）：</label>
            <input 
              type="number" 
              id="daily-goal" 
              min="1" 
              max="20" 
              value={dailyGoal} 
              onChange={updateDailyGoal}
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="reminder-time">学习提醒时间：</label>
            <input 
              type="time" 
              id="reminder-time" 
              value={reminderTime} 
              onChange={updateReminderTime}
            />
          </div>
          
          <div className="form-group checkbox-group">
            <input 
              type="checkbox" 
              id="reminder-enabled" 
              checked={reminderEnabled} 
              onChange={(e) => setReminderEnabled(e.target.checked)}
            />
            <label htmlFor="reminder-enabled">启用学习提醒</label>
          </div>
          
          <button className="save-settings-btn" onClick={saveSettings}>
            保存设置
          </button>
        </div>
      </div>
      
      {/* 学习建议 */}
      <div className="study-tips">
        <h3>💡 学习建议</h3>
        <ul>
          <li>每天坚持学习，养成良好的学习习惯</li>
          <li>利用碎片时间，每次学习10-15分钟</li>
          <li>结合场景对话和句型训练，提高口语能力</li>
          <li>定期进行单词测试，巩固学习成果</li>
        </ul>
      </div>
      
      {/* 提醒通知 */}
      {showReminder && (
        <div className="reminder-notification" role="alert" aria-live="assertive">
          <div className="reminder-icon">⏰</div>
          <div className="reminder-content">
            <h3>学习提醒</h3>
            <p>该开始今天的英语学习了！</p>
            <button 
              className="dismiss-reminder" 
              onClick={() => setShowReminder(false)}
            >
              知道了
            </button>
          </div>
        </div>
      )}
      </div>
      <footer className="App-footer">
        <p>© 2026 521词小学英语口语学习应用</p>
      </footer>
    </div>
  )
}

export default StudyPlan