import React, { useState, useRef, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './SceneDialogue.css'

// 场景对话数据
const scenesData = [
  {
    id: 'home',
    name: '家庭',
    icon: '🏠',
    color: '#4ECDC4',
    dialogues: [
      {
        id: 1,
        title: '早晨问候',
        roles: ['孩子', '妈妈'],
        script: [
          { role: '妈妈', text: 'Good morning, sweetie!', translation: '早上好，宝贝！' },
          { role: '孩子', text: 'Good morning, Mom!', translation: '早上好，妈妈！' },
          { role: '妈妈', text: 'Did you sleep well?', translation: '你睡得好吗？' },
          { role: '孩子', text: 'Yes, I did. Thank you!', translation: '是的，睡得很好。谢谢！' },
          { role: '妈妈', text: 'Time for breakfast!', translation: '该吃早餐了！' }
        ],
        interactiveType: 'none',
        progress: 0
      },
      {
        id: 2,
        title: '晚餐时间',
        roles: ['孩子', '爸爸'],
        script: [
          { role: '爸爸', text: 'How was your day?', translation: '你今天过得怎么样？' },
          { role: '孩子', text: 'It was great! I learned new words.', translation: '很棒！我学了新单词。' },
          { role: '爸爸', text: 'That\'s wonderful! What did you learn?', translation: '太好了！你学了什么？' },
          { role: '孩子', text: 'I learned words about animals.', translation: '我学了关于动物的单词。' },
          { role: '爸爸', text: 'That\'s cool!', translation: '太酷了！' }
        ],
        interactiveType: 'none',
        progress: 0
      }
    ]
  },
  {
    id: 'school',
    name: '学校',
    icon: '🏫',
    color: '#FF6B6B',
    dialogues: [
      {
        id: 1,
        title: '课堂问候',
        roles: ['学生', '老师'],
        script: [
          { role: '老师', text: 'Good morning, class!', translation: '早上好，同学们！' },
          { role: '学生', text: 'Good morning, teacher!', translation: '早上好，老师！' },
          { role: '老师', text: 'How are you today?', translation: '你们今天好吗？' },
          { role: '学生', text: 'We\'re fine, thank you!', translation: '我们很好，谢谢！' },
          { role: '老师', text: 'Let\'s start our lesson.', translation: '让我们开始上课。' }
        ],
        interactiveType: 'none',
        progress: 0
      },
      {
        id: 2,
        title: '问路',
        roles: ['学生A', '学生B'],
        script: [
          { role: '学生A', text: 'Excuse me, where is the library?', translation: '打扰一下，图书馆在哪里？' },
          { role: '学生B', text: 'It\'s on the second floor.', translation: '在二楼。' },
          { role: '学生A', text: 'Thank you very much!', translation: '非常感谢！' },
          { role: '学生B', text: 'You\'re welcome!', translation: '不客气！' }
        ],
        interactiveType: 'choice',
        choices: [
          {
            question: '学生A应该说什么？',
            options: ['Where is the library?', 'What is your name?', 'How old are you?'],
            correctAnswer: 0
          }
        ],
        progress: 0
      }
    ]
  },
  {
    id: 'park',
    name: '公园',
    icon: '🌳',
    color: '#45B7D1',
    dialogues: [
      {
        id: 1,
        title: '游玩',
        roles: ['孩子', '朋友'],
        script: [
          { role: '孩子', text: 'Let\'s play together!', translation: '让我们一起玩！' },
          { role: '朋友', text: 'Great! What do you want to play?', translation: '太好了！你想玩什么？' },
          { role: '孩子', text: 'Let\'s play hide and seek.', translation: '让我们玩捉迷藏。' },
          { role: '朋友', text: 'Okay! I\'ll count.', translation: '好的！我来数数。' }
        ],
        interactiveType: 'fill',
        fillBlanks: [
          {
            sentence: 'Let\'s play {}.',
            options: ['together', 'alone', 'quietly'],
            correctAnswer: 0
          }
        ],
        progress: 0
      }
    ]
  },
  {
    id: 'store',
    name: '商店',
    icon: '🛒',
    color: '#FFD166',
    dialogues: [
      {
        id: 1,
        title: '购物',
        roles: ['顾客', '店员'],
        script: [
          { role: '店员', text: 'Hello! Can I help you?', translation: '你好！我能帮你吗？' },
          { role: '顾客', text: 'Yes, I want an apple.', translation: '是的，我想要一个苹果。' },
          { role: '店员', text: 'Here you are!', translation: '给你！' },
          { role: '顾客', text: 'Thank you!', translation: '谢谢！' },
          { role: '店员', text: 'You\'re welcome!', translation: '不客气！' }
        ],
        interactiveType: 'none',
        progress: 0
      }
    ]
  }
]

// 模拟场景对话进度数据
const initialSceneProgress = {
  home: 0,
  school: 0,
  park: 0,
  store: 0
}

function SceneDialogue() {
  const [currentScene, setCurrentScene] = useState(null)
  const [currentDialogue, setCurrentDialogue] = useState(null)
  const [currentLine, setCurrentLine] = useState(0)
  const [isSpeaking, setIsSpeaking] = useState(false)
  const [audioWave, setAudioWave] = useState([])
  const [progress, setProgress] = useState(initialSceneProgress)
  const [showTranslation, setShowTranslation] = useState(false)
  const [selectedChoice, setSelectedChoice] = useState(null)
  const [choiceResult, setChoiceResult] = useState(null)
  const [filledAnswer, setFilledAnswer] = useState(null)
  const [fillResult, setFillResult] = useState(null)
  const [isRolePlaying, setIsRolePlaying] = useState(false)
  const [selectedRole, setSelectedRole] = useState(null)
  
  const audioRef = useRef(null)

  // 发音功能
  const pronounceLine = (text) => {
    if ('speechSynthesis' in window) {
      setIsSpeaking(true)
      
      // 生成音频波形动画数据
      let animationId = null
      
      const generateWave = () => {
        const wave = Array.from({ length: 8 }, () => Math.random() * 10 + 2)
        setAudioWave(wave)
        if (isSpeaking) {
          animationId = requestAnimationFrame(generateWave)
        }
      }
      
      generateWave()
      
      const utterance = new SpeechSynthesisUtterance(text)
      utterance.lang = 'en-US'
      utterance.onend = () => {
        setIsSpeaking(false)
        setAudioWave([])
        if (animationId) {
          cancelAnimationFrame(animationId)
        }
      }
      speechSynthesis.speak(utterance)
    }
  }

  // 选择场景
  const selectScene = (scene) => {
    setCurrentScene(scene)
    setCurrentDialogue(scene.dialogues[0])
    setCurrentLine(0)
    setSelectedChoice(null)
    setChoiceResult(null)
    setFilledAnswer(null)
    setFillResult(null)
    setIsRolePlaying(false)
    setSelectedRole(null)
  }

  // 选择对话
  const selectDialogue = (dialogue) => {
    setCurrentDialogue(dialogue)
    setCurrentLine(0)
    setSelectedChoice(null)
    setChoiceResult(null)
    setFilledAnswer(null)
    setFillResult(null)
    setIsRolePlaying(false)
    setSelectedRole(null)
  }

  // 下一行对话
  const nextLine = () => {
    if (currentLine < currentDialogue.script.length - 1) {
      setCurrentLine(currentLine + 1)
      setSelectedChoice(null)
      setChoiceResult(null)
      setFilledAnswer(null)
      setFillResult(null)
    } else {
      // 对话结束，更新进度
      updateProgress()
    }
  }

  // 上一行对话
  const prevLine = () => {
    if (currentLine > 0) {
      setCurrentLine(currentLine - 1)
      setSelectedChoice(null)
      setChoiceResult(null)
      setFilledAnswer(null)
      setFillResult(null)
    }
  }

  // 更新进度
  const updateProgress = () => {
    const newProgress = {
      ...progress,
      [currentScene.id]: Math.min(progress[currentScene.id] + 1, currentScene.dialogues.length)
    }
    setProgress(newProgress)
  }

  // 处理选择题
  const handleChoice = (index) => {
    setSelectedChoice(index)
    const isCorrect = index === currentDialogue.choices[0].correctAnswer
    setChoiceResult(isCorrect)
  }

  // 处理填空题
  const handleFill = (index) => {
    setFilledAnswer(index)
    const isCorrect = index === currentDialogue.fillBlanks[0].correctAnswer
    setFillResult(isCorrect)
  }

  // 开始角色扮演
  const startRolePlay = (role) => {
    setSelectedRole(role)
    setIsRolePlaying(true)
    setCurrentLine(0)
  }

  // 退出场景
  const exitScene = () => {
    setCurrentScene(null)
    setCurrentDialogue(null)
    setCurrentLine(0)
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
          <Link to="/dialogue" className="nav-btn active">
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
          <Link to="/difficult" className="nav-btn">
            📖 生词本
          </Link>
          <Link to="/report" className="nav-btn">
            📊 学习报告
          </Link>
        </div>
      </header>
      <div className="scene-dialogue">
      {/* 场景选择界面 */}
      {!currentScene ? (
        <div className="scene-selection">
          <h2>选择场景</h2>
          <div className="scene-grid">
            {scenesData.map((scene) => (
              <button
                key={scene.id}
                className="scene-card"
                onClick={() => selectScene(scene)}
                style={{ '--scene-color': scene.color }}
                aria-label={`${scene.name}场景，已完成${progress[scene.id]}/${scene.dialogues.length}个对话`}
              >
                <div className="scene-icon">{scene.icon}</div>
                <h3>{scene.name}</h3>
                <div className="scene-progress">
                  <div 
                    className="scene-progress-bar" 
                    style={{ width: `${(progress[scene.id] / scene.dialogues.length) * 100}%` }}
                  ></div>
                </div>
                <span className="scene-count">
                  {progress[scene.id]}/{scene.dialogues.length}
                </span>
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="dialogue-container">
          {/* 场景头部 */}
          <div className="dialogue-header">
            <button 
              className="back-btn"
              onClick={exitScene}
              aria-label="返回场景选择"
            >
              ← 返回
            </button>
            <h2>{currentScene.name}场景</h2>
          </div>

          {/* 对话选择 */}
          {!currentDialogue ? (
            <div className="dialogue-selection">
              <h3>选择对话</h3>
              <div className="dialogue-list">
                {currentScene.dialogues.map((dialogue) => (
                  <button
                    key={dialogue.id}
                    className="dialogue-card"
                    onClick={() => selectDialogue(dialogue)}
                  >
                    <h4>{dialogue.title}</h4>
                    <p>角色: {dialogue.roles.join('、')}</p>
                    <span className={`dialogue-status ${dialogue.progress > 0 ? 'completed' : ''}`}>
                      {dialogue.progress > 0 ? '已完成' : '未完成'}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ) : (
            <div className="dialogue-content">
              {/* 对话标题 */}
              <h3>{currentDialogue.title}</h3>

              {/* 角色扮演选择 */}
              {!isRolePlaying && (
                <div className="role-selection">
                  <h4>选择角色</h4>
                  <div className="role-buttons">
                    {currentDialogue.roles.map((role, index) => (
                      <button
                        key={index}
                        className="role-btn"
                        onClick={() => startRolePlay(role)}
                      >
                        {role}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              {/* 对话展示 */}
              {isRolePlaying && (
                <div className="dialogue-script">
                  {/* 对话内容 */}
                  <div className="dialogue-line">
                    <div className={`line-role ${currentDialogue.script[currentLine].role === selectedRole ? 'user-role' : 'other-role'}`}>
                      {currentDialogue.script[currentLine].role}:
                    </div>
                    <div className="line-content">
                      <p className="line-text">{currentDialogue.script[currentLine].text}</p>
                      {showTranslation && (
                        <p className="line-translation">{currentDialogue.script[currentLine].translation}</p>
                      )}
                      <button
                        className="pronounce-btn"
                        onClick={() => pronounceLine(currentDialogue.script[currentLine].text)}
                        aria-label="播放对话发音"
                      >
                        🔊
                      </button>
                      {isSpeaking && (
                        <div className="audio-wave">
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
                  </div>

                  {/* 互动元素 */}
                  {currentDialogue.interactiveType === 'choice' && currentLine === currentDialogue.script.length - 1 && (
                    <div className="interactive-section">
                      <h4>{currentDialogue.choices[0].question}</h4>
                      <div className="choice-options">
                        {currentDialogue.choices[0].options.map((option, index) => (
                          <button
                            key={index}
                            className={`choice-btn ${selectedChoice === index ? (choiceResult ? 'correct' : 'incorrect') : ''}`}
                            onClick={() => handleChoice(index)}
                            disabled={selectedChoice !== null}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      {selectedChoice !== null && (
                        <p className={`choice-result ${choiceResult ? 'correct' : 'incorrect'}`}>
                          {choiceResult ? '回答正确！' : '回答错误，再试一次！'}
                        </p>
                      )}
                    </div>
                  )}

                  {currentDialogue.interactiveType === 'fill' && currentLine === currentDialogue.script.length - 1 && (
                    <div className="interactive-section">
                      <h4>填空练习</h4>
                      <p className="fill-sentence">{currentDialogue.fillBlanks[0].sentence}</p>
                      <div className="fill-options">
                        {currentDialogue.fillBlanks[0].options.map((option, index) => (
                          <button
                            key={index}
                            className={`fill-btn ${filledAnswer === index ? (fillResult ? 'correct' : 'incorrect') : ''}`}
                            onClick={() => handleFill(index)}
                            disabled={filledAnswer !== null}
                          >
                            {option}
                          </button>
                        ))}
                      </div>
                      {filledAnswer !== null && (
                        <p className={`fill-result ${fillResult ? 'correct' : 'incorrect'}`}>
                          {fillResult ? '回答正确！' : '回答错误，再试一次！'}
                        </p>
                      )}
                    </div>
                  )}

                  {/* 控制按钮 */}
                  <div className="dialogue-controls">
                    <button
                      className="control-btn"
                      onClick={prevLine}
                      disabled={currentLine === 0}
                      aria-label="上一行"
                    >
                      上一行
                    </button>
                    <button
                      className="control-btn"
                      onClick={() => setShowTranslation(!showTranslation)}
                      aria-label={showTranslation ? '隐藏翻译' : '显示翻译'}
                    >
                      {showTranslation ? '隐藏翻译' : '显示翻译'}
                    </button>
                    <button
                      className="control-btn"
                      onClick={nextLine}
                      disabled={currentLine === currentDialogue.script.length - 1 && 
                        ((currentDialogue.interactiveType === 'choice' && selectedChoice === null) || 
                         (currentDialogue.interactiveType === 'fill' && filledAnswer === null))}
                      aria-label="下一行"
                    >
                      {currentLine === currentDialogue.script.length - 1 ? '完成' : '下一行'}
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
      </div>
      <footer className="App-footer">
        <p>© 2026 521词小学英语口语学习应用</p>
      </footer>
    </div>
  )
}

export default SceneDialogue