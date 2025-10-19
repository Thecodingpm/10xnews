#!/usr/bin/env node

/**
 * Simple performance testing script
 * Run with: node scripts/performance-test.js
 */

const https = require('https');
const http = require('http');

const URL = process.env.TEST_URL || 'http://localhost:3000';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const start = Date.now();
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        const end = Date.now();
        resolve({
          statusCode: res.statusCode,
          responseTime: end - start,
          contentLength: data.length,
          headers: res.headers
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

async function runPerformanceTest() {
  console.log('🚀 Starting performance test...\n');
  
  const tests = [
    { name: 'Home Page', url: URL },
    { name: 'Pakistan Category', url: `${URL}/categories/pakistan` },
    { name: 'Politics Subcategory', url: `${URL}/categories/pakistan/politics` },
    { name: 'Economy Subcategory', url: `${URL}/categories/pakistan/economy` },
    { name: 'Sports Subcategory', url: `${URL}/categories/pakistan/sports` },
    { name: 'Culture Subcategory', url: `${URL}/categories/pakistan/culture` },
    { name: 'Breaking News Subcategory', url: `${URL}/categories/pakistan/breaking` },
  ];
  
  const results = [];
  
  for (const test of tests) {
    try {
      console.log(`Testing ${test.name}...`);
      const result = await makeRequest(test.url);
      results.push({ ...test, ...result });
      
      const status = result.statusCode === 200 ? '✅' : '❌';
      console.log(`${status} ${test.name}: ${result.responseTime}ms (${result.statusCode})`);
    } catch (error) {
      console.log(`❌ ${test.name}: Error - ${error.message}`);
      results.push({ ...test, error: error.message });
    }
  }
  
  console.log('\n📊 Performance Summary:');
  console.log('========================');
  
  const successfulTests = results.filter(r => !r.error && r.statusCode === 200);
  const avgResponseTime = successfulTests.reduce((sum, r) => sum + r.responseTime, 0) / successfulTests.length;
  
  console.log(`Average Response Time: ${Math.round(avgResponseTime)}ms`);
  console.log(`Successful Requests: ${successfulTests.length}/${results.length}`);
  
  if (avgResponseTime < 1000) {
    console.log('🎉 Excellent performance!');
  } else if (avgResponseTime < 2000) {
    console.log('👍 Good performance!');
  } else {
    console.log('⚠️  Performance could be improved');
  }
  
  console.log('\nDetailed Results:');
  successfulTests.forEach(test => {
    const performance = test.responseTime < 500 ? '🟢' : test.responseTime < 1000 ? '🟡' : '🔴';
    console.log(`${performance} ${test.name}: ${test.responseTime}ms`);
  });
}

runPerformanceTest().catch(console.error);
