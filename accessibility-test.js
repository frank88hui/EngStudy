import { JSDOM } from 'jsdom';
import axe from 'axe-core';

// 读取构建后的HTML文件
import fs from 'fs';
const html = fs.readFileSync('./dist/index.html', 'utf8');

// 创建虚拟DOM
const dom = new JSDOM(html, {
  runScripts: 'dangerously',
  resources: 'usable'
});

// 等待页面加载完成
setTimeout(() => {
  // 运行axe测试
  axe.run(dom.window.document, {
    rules: {
      'color-contrast': { enabled: true },
      'button-name': { enabled: true },
      'label': { enabled: true },
      'landmark-one-main': { enabled: true },
      'page-has-heading-one': { enabled: true },
      'region': { enabled: true }
    }
  }, (err, results) => {
    if (err) {
      console.error('测试错误:', err);
      return;
    }

    // 输出测试结果
    console.log('无障碍测试结果:');
    console.log(`发现 ${results.violations.length} 个问题`);
    
    if (results.violations.length > 0) {
      console.log('问题详情:');
      results.violations.forEach((violation, index) => {
        console.log(`\n${index + 1}. ${violation.id}: ${violation.description}`);
        console.log(`   严重程度: ${violation.impact}`);
        console.log(`   受影响的元素: ${violation.nodes.length}`);
        violation.nodes.forEach(node => {
          console.log(`     - ${node.target}`);
        });
      });
    } else {
      console.log('恭喜！没有发现无障碍问题。');
    }
  });
}, 1000);
