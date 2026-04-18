// 游戏化系统
const Gamification = (props) => {
  // 积分状态
  let points = 0;
  // 奖励状态
  let rewards = [];
  // 显示奖励通知
  let showReward = false;
  let currentReward = null;
  // 连击数
  let streak = 0;
  // 最高连击数
  let highestStreak = 0;

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
  const loadData = () => {
    const savedPoints = localStorage.getItem('english_learning_points');
    const savedStreak = localStorage.getItem('english_learning_streak');
    const savedHighestStreak = localStorage.getItem('english_learning_highest_streak');
    const savedRewards = localStorage.getItem('english_learning_rewards');

    if (savedPoints) points = parseInt(savedPoints);
    if (savedStreak) streak = parseInt(savedStreak);
    if (savedHighestStreak) highestStreak = parseInt(savedHighestStreak);
    if (savedRewards) rewards = JSON.parse(savedRewards);
  };

  // 保存数据到本地存储
  const saveData = () => {
    localStorage.setItem('english_learning_points', points);
    localStorage.setItem('english_learning_streak', streak);
    localStorage.setItem('english_learning_highest_streak', highestStreak);
    localStorage.setItem('english_learning_rewards', JSON.stringify(rewards));
  };

  // 检查奖励
  const checkRewards = () => {
    rewardConfig.forEach(reward => {
      if (!rewards.includes(reward.id) && points >= reward.pointsRequired) {
        rewards.push(reward.id);
        currentReward = reward;
        showReward = true;
        setTimeout(() => showReward = false, 3000);
        saveData();
      }
    });
  };

  // 增加积分
  const addPoints = (amount) => {
    // 计算连击奖励
    const newStreak = streak + 1;
    streak = newStreak;
    
    if (newStreak > highestStreak) {
      highestStreak = newStreak;
    }
    
    // 连击加成
    const streakBonus = Math.floor(newStreak / 5); // 每5连击加1分
    const totalPoints = amount + streakBonus;
    
    points += totalPoints;
    saveData();
    checkRewards();
    
    return totalPoints;
  };

  // 重置连击
  const resetStreak = () => {
    streak = 0;
    saveData();
  };

  // 初始化加载数据
  loadData();

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