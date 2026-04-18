import React, { useState, useEffect } from 'react';

// 游戏化系统组件
const Gamification = ({ progress, learnedWords, setProgress }) => {
  // 积分状态
  const [points, setPoints] = useState(0);
  // 奖励状态
  const [rewards, setRewards] = useState([]);
  // 显示奖励通知
  const [showReward, setShowReward] = useState(false);
  const [currentReward, setCurrentReward] = useState(null);
  // 连击数
  const [streak, setStreak] = useState(0);
  // 最高连击数
  const [highestStreak, setHighestStreak] = useState(0);

  // 奖励配置
  const rewardConfig = [
    {
      id: 'first_point',
      name: '第一分',
      description: '获得第一个积分',
      icon: '⭐',
      pointsRequired: 1,
      unlocked: false
    },
    {
      id: 'points_10',
      name: '积分新手',
      description: '获得10个积分',
      icon: '🏅',
      pointsRequired: 10,
      unlocked: false
    },
    {
      id: 'points_50',
      name: '积分达人',
      description: '获得50个积分',
      icon: '🎖️',
      pointsRequired: 50,
      unlocked: false
    },
    {
      id: 'points_100',
      name: '积分大师',
      description: '获得100个积分',
      icon: '👑',
      pointsRequired: 100,
      unlocked: false
    }
  ];

  // 从本地存储加载数据
  useEffect(() => {
    const savedPoints = localStorage.getItem('english_learning_points');
    const savedStreak = localStorage.getItem('english_learning_streak');
    const savedHighestStreak = localStorage.getItem('english_learning_highest_streak');
    const savedRewards = localStorage.getItem('english_learning_rewards');

    if (savedPoints) setPoints(parseInt(savedPoints));
    if (savedStreak) setStreak(parseInt(savedStreak));
    if (savedHighestStreak) setHighestStreak(parseInt(savedHighestStreak));
    if (savedRewards) setRewards(JSON.parse(savedRewards));
  }, []);

  // 保存数据到本地存储
  useEffect(() => {
    localStorage.setItem('english_learning_points', points);
    localStorage.setItem('english_learning_streak', streak);
    localStorage.setItem('english_learning_highest_streak', highestStreak);
    localStorage.setItem('english_learning_rewards', JSON.stringify(rewards));
  }, [points, streak, highestStreak, rewards]);

  // 检查奖励
  useEffect(() => {
    rewardConfig.forEach(reward => {
      if (!rewards.includes(reward.id) && points >= reward.pointsRequired) {
        setRewards(prev => [...prev, reward.id]);
        setCurrentReward(reward);
        setShowReward(true);
        setTimeout(() => setShowReward(false), 3000);
      }
    });
  }, [points, rewards]);

  // 增加积分
  const addPoints = (amount) => {
    // 计算连击奖励
    const newStreak = streak + 1;
    setStreak(newStreak);
    
    if (newStreak > highestStreak) {
      setHighestStreak(newStreak);
    }
    
    // 连击加成
    const streakBonus = Math.floor(newStreak / 5); // 每5连击加1分
    const totalPoints = amount + streakBonus;
    
    setPoints(prev => prev + totalPoints);
    
    return totalPoints;
  };

  // 重置连击
  const resetStreak = () => {
    setStreak(0);
  };

  return {
    points,
    streak,
    highestStreak,
    rewards,
    addPoints,
    resetStreak,
    showReward,
    currentReward
  };
};

export default Gamification;