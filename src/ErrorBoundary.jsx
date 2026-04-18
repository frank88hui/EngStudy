import React from 'react'

class ErrorBoundary extends React.Component {
  constructor(props) {
    super(props)
    this.state = { hasError: false, error: null, errorInfo: null }
  }

  static getDerivedStateFromError(error) {
    // 更新 state 使下一次渲染显示降级 UI
    return { hasError: true }
  }

  componentDidCatch(error, errorInfo) {
    // 你同样可以将错误日志上报给服务器
    console.error('Error caught by ErrorBoundary:', error, errorInfo)
    this.setState({ error, errorInfo })
  }

  render() {
    if (this.state.hasError) {
      // 你可以自定义降级 UI
      return (
        <div className="error-boundary">
          <h2>出错了</h2>
          <p>很抱歉，应用程序出现了错误。</p>
          <button onClick={() => this.setState({ hasError: false, error: null, errorInfo: null })}>
            刷新页面
          </button>
          {this.state.error && (
            <details style={{ whiteSpace: 'pre-wrap' }}>
              <summary>错误详情</summary>
              <p>{this.state.error.toString()}</p>
              {this.state.errorInfo && (
                <p>{this.state.errorInfo.componentStack}</p>
              )}
            </details>
          )}
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary