#!/usr/bin/env node

/**
 * Deployment Folder Creator
 * Creates a clean deployment folder excluding unnecessary files for Netlify upload
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const EXCLUDE_PATTERNS = [
  'node_modules',
  '.next',
  'out',
  '.git',
  '.DS_Store',
  '*.log',
  '.env',
  '.env.local',
  '.env.development.local',
  '.env.test.local',
  '.env.local.example',
  'debug-*.js',
  'run-*.sh',
  'run-*.js',
  'create-deploy-folder.js',
  'create-deploy-zip.js',
  'data',
  './docs',
  'index.html',
  'util',
  'out',
  '.next',
  'coverage',
  '.nyc_output',
  'build',
  '.cache',
  '.tmp',
  'cram-mongo-deploy' // Exclude the output directory itself
];

function shouldExclude(filePath) {
  const fileName = path.basename(filePath);
  const relativePath = path.relative(process.cwd(), filePath);

  // Check exact matches
  if (EXCLUDE_PATTERNS.includes(fileName)) {
    return true;
  }

  // Check pattern matches
  for (const pattern of EXCLUDE_PATTERNS) {
    if (pattern.includes('*')) {
      const regex = new RegExp(pattern.replace(/\*/g, '.*'));
      if (regex.test(fileName) || regex.test(relativePath)) {
        return true;
      }
    }
  }

  // Check if path contains excluded directories
  for (const exclude of EXCLUDE_PATTERNS) {
    if (!exclude.includes('*') && relativePath.includes(exclude + path.sep)) {
      return true;
    }
  }

  return false;
}

function createDeploymentFolder() {
  const outputDir = path.join(process.cwd(), 'cram-mongo-deploy');

  console.log('🚀 Creating deployment folder...');
  console.log('📁 Output:', outputDir);
  console.log('');

  // Remove existing folder if it exists
  if (fs.existsSync(outputDir)) {
    fs.rmSync(outputDir, { recursive: true, force: true });
    console.log('🗑️  Removed existing deployment folder');
  }

  // Create output directory
  fs.mkdirSync(outputDir);

  let totalFiles = 0;
  let totalSize = 0;

  // Copy files recursively
  function copyDirectory(srcDir, destDir, relativePath = '') {
    const items = fs.readdirSync(srcDir);

    for (const item of items) {
      const srcPath = path.join(srcDir, item);
      const destPath = path.join(destDir, item);
      const itemRelativePath = path.join(relativePath, item);

      // Skip excluded files/directories
      if (shouldExclude(srcPath)) {
        console.log(`⏭️  Skipping: ${itemRelativePath}`);
        continue;
      }

      const stat = fs.statSync(srcPath);

      if (stat.isDirectory()) {
        // Create directory and recurse
        fs.mkdirSync(destPath, { recursive: true });
        copyDirectory(srcPath, destPath, itemRelativePath);
      } else {
        // Copy file
        fs.copyFileSync(srcPath, destPath);
        totalFiles++;
        totalSize += stat.size;
        console.log(`📄 Copied: ${itemRelativePath}`);
      }
    }
  }

  // Start copying from root directory
  copyDirectory('.', outputDir);

  // Add a deployment info file
  const deployInfo = {
    created: new Date().toISOString(),
    nodeVersion: process.version,
    platform: process.platform,
    excluded: EXCLUDE_PATTERNS,
    buildCommand: 'npm run build',
    publishDirectory: '.next',
    totalFiles: totalFiles,
    totalSizeBytes: totalSize
  };

  fs.writeFileSync(
    path.join(outputDir, 'deploy-info.json'),
    JSON.stringify(deployInfo, null, 2)
  );

  const sizeMB = (totalSize / 1024 / 1024).toFixed(2);
  console.log(`✅ Deployment folder created successfully!`);
  console.log(`📊 Files: ${totalFiles}`);
  console.log(`📏 Size: ${sizeMB} MB`);
  console.log(`🎯 Ready for Netlify deployment!`);
  console.log('');
  console.log('📤 Upload this folder to Netlify:');
  console.log(`   ${outputDir}`);
}

// Run the folder creation
try {
  createDeploymentFolder();
} catch (error) {
  console.error('❌ Error creating deployment folder:', error.message);
  process.exit(1);
}
