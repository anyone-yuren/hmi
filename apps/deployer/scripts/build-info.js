
import { execSync } from 'child_process';
import fs from 'fs';

// 获取当前分支
function getBranch() {
  try {
    return execSync('git rev-parse --abbrev-ref HEAD').toString().trim();
  } catch (e) {
    console.error('获取分支信息失败:', e.message);
    return 'unknown';
  }
}

function getCommitInfo() {
  try {
    const info = execSync('git log -1 --pretty=format:"%H|%an|%ae|%ad|%s"').toString().trim();
    const [hash, authorName, authorEmail, date, subject] = info.split('|');
    return { hash, authorName, authorEmail, date, subject };
  } catch (e) {
    console.error('获取提交信息失败:', e.message);
    return null;
  }
}

// 获取最后一次提交哈希（短格式）
function getCommitHash() {
  try {
    return execSync('git rev-parse --short HEAD').toString().trim();
  } catch (e) {
    console.error('获取提交哈希失败:', e.message);
    return 'unknown';
  }
}

// 获取最后一次提交时间
function getCommitDate() {
  try {
    return execSync('git log -1 --format=%cd --date=iso').toString().trim();
  } catch (e) {
    console.error('获取提交时间失败:', e.message);
    return 'unknown';
  }
}
// console.log("info",getCommitInfo())
// 生成环境变量内容
const envContent = `
# 自动生成的构建信息
VITE_APP_BUILD_BRANCH=${getBranch()}
VITE_APP_BUILD_COMMIT=${getCommitHash()}
VITE_APP_BUILD_DATE=${getCommitDate()}
VITE_APP_BUILD_TIME=${new Date().toISOString()}
VITE_APP_BUILD_INFO=${getCommitInfo().subject}
VITE_USE_GLOBAL_LOADING=true
`.trim();

// // 写入 .env.local 文件
fs.writeFileSync('./.env.production', envContent);

// console.log('✅ 构建信息已写入 .env.local 文件');
// console.log(envContent);