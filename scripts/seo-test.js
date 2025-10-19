#!/usr/bin/env node

/**
 * SEO Testing Script
 * Run with: node scripts/seo-test.js
 */

const https = require('https');
const http = require('http');

const URL = process.env.TEST_URL || 'http://localhost:3000';

function makeRequest(url) {
  return new Promise((resolve, reject) => {
    const client = url.startsWith('https') ? https : http;
    
    client.get(url, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });
      
      res.on('end', () => {
        resolve({
          statusCode: res.statusCode,
          headers: res.headers,
          content: data,
          contentLength: data.length
        });
      });
    }).on('error', (err) => {
      reject(err);
    });
  });
}

function extractMetaTags(html) {
  const metaTags = {};
  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  const descriptionMatch = html.match(/<meta[^>]*name=["']description["'][^>]*content=["']([^"']*)["']/i);
  const keywordsMatch = html.match(/<meta[^>]*name=["']keywords["'][^>]*content=["']([^"']*)["']/i);
  const ogTitleMatch = html.match(/<meta[^>]*property=["']og:title["'][^>]*content=["']([^"']*)["']/i);
  const ogDescriptionMatch = html.match(/<meta[^>]*property=["']og:description["'][^>]*content=["']([^"']*)["']/i);
  const canonicalMatch = html.match(/<link[^>]*rel=["']canonical["'][^>]*href=["']([^"']*)["']/i);
  
  if (titleMatch) metaTags.title = titleMatch[1];
  if (descriptionMatch) metaTags.description = descriptionMatch[1];
  if (keywordsMatch) metaTags.keywords = keywordsMatch[1];
  if (ogTitleMatch) metaTags.ogTitle = ogTitleMatch[1];
  if (ogDescriptionMatch) metaTags.ogDescription = ogDescriptionMatch[1];
  if (canonicalMatch) metaTags.canonical = canonicalMatch[1];
  
  return metaTags;
}

function checkSEOIssues(metaTags, url) {
  const issues = [];
  
  // Check title
  if (!metaTags.title) {
    issues.push('❌ Missing title tag');
  } else if (metaTags.title.length > 60) {
    issues.push(`⚠️  Title too long (${metaTags.title.length} chars, max 60)`);
  } else if (metaTags.title.length < 30) {
    issues.push(`⚠️  Title too short (${metaTags.title.length} chars, min 30)`);
  } else {
    issues.push('✅ Title tag optimized');
  }
  
  // Check description
  if (!metaTags.description) {
    issues.push('❌ Missing meta description');
  } else if (metaTags.description.length > 160) {
    issues.push(`⚠️  Description too long (${metaTags.description.length} chars, max 160)`);
  } else if (metaTags.description.length < 120) {
    issues.push(`⚠️  Description too short (${metaTags.description.length} chars, min 120)`);
  } else {
    issues.push('✅ Meta description optimized');
  }
  
  // Check Open Graph
  if (!metaTags.ogTitle) {
    issues.push('❌ Missing Open Graph title');
  } else {
    issues.push('✅ Open Graph title present');
  }
  
  if (!metaTags.ogDescription) {
    issues.push('❌ Missing Open Graph description');
  } else {
    issues.push('✅ Open Graph description present');
  }
  
  // Check canonical
  if (!metaTags.canonical) {
    issues.push('❌ Missing canonical URL');
  } else {
    issues.push('✅ Canonical URL present');
  }
  
  return issues;
}

async function testSEO() {
  console.log('🔍 Starting SEO audit...\n');
  
  const testPages = [
    { name: 'Home Page', url: URL },
    { name: 'Pakistan News', url: `${URL}/categories/pakistan` },
    { name: 'Pakistan Politics', url: `${URL}/categories/pakistan/politics` },
    { name: 'Pakistan Economy', url: `${URL}/categories/pakistan/economy` },
    { name: 'Pakistan Sports', url: `${URL}/categories/pakistan/sports` },
    { name: 'Pakistan Culture', url: `${URL}/categories/pakistan/culture` },
    { name: 'Pakistan Breaking', url: `${URL}/categories/pakistan/breaking` },
  ];
  
  const results = [];
  
  for (const page of testPages) {
    try {
      console.log(`Testing ${page.name}...`);
      const response = await makeRequest(page.url);
      
      if (response.statusCode === 200) {
        const metaTags = extractMetaTags(response.content);
        const issues = checkSEOIssues(metaTags, page.url);
        
        results.push({
          page: page.name,
          url: page.url,
          status: 'success',
          metaTags,
          issues
        });
        
        console.log(`✅ ${page.name} - ${response.statusCode}`);
        issues.forEach(issue => console.log(`   ${issue}`));
      } else {
        console.log(`❌ ${page.name} - ${response.statusCode}`);
        results.push({
          page: page.name,
          url: page.url,
          status: 'error',
          statusCode: response.statusCode
        });
      }
    } catch (error) {
      console.log(`❌ ${page.name} - Error: ${error.message}`);
      results.push({
        page: page.name,
        url: page.url,
        status: 'error',
        error: error.message
      });
    }
    
    console.log(''); // Empty line for readability
  }
  
  // Test sitemap and robots.txt
  try {
    console.log('Testing sitemap...');
    const sitemapResponse = await makeRequest(`${URL}/sitemap.xml`);
    if (sitemapResponse.statusCode === 200) {
      console.log('✅ Sitemap accessible');
    } else {
      console.log(`❌ Sitemap error - ${sitemapResponse.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ Sitemap error - ${error.message}`);
  }
  
  try {
    console.log('Testing robots.txt...');
    const robotsResponse = await makeRequest(`${URL}/robots.txt`);
    if (robotsResponse.statusCode === 200) {
      console.log('✅ Robots.txt accessible');
    } else {
      console.log(`❌ Robots.txt error - ${robotsResponse.statusCode}`);
    }
  } catch (error) {
    console.log(`❌ Robots.txt error - ${error.message}`);
  }
  
  console.log('\n📊 SEO Summary:');
  console.log('================');
  
  const successfulPages = results.filter(r => r.status === 'success');
  const errorPages = results.filter(r => r.status === 'error');
  
  console.log(`Total pages tested: ${results.length}`);
  console.log(`Successful: ${successfulPages.length}`);
  console.log(`Errors: ${errorPages.length}`);
  
  if (errorPages.length > 0) {
    console.log('\n❌ Pages with errors:');
    errorPages.forEach(page => {
      console.log(`   - ${page.page}: ${page.error || page.statusCode}`);
    });
  }
  
  console.log('\n🎯 SEO Recommendations:');
  console.log('1. Ensure all pages have unique, descriptive titles');
  console.log('2. Add meta descriptions to all pages');
  console.log('3. Implement Open Graph tags for social sharing');
  console.log('4. Add canonical URLs to prevent duplicate content');
  console.log('5. Submit sitemap to Google Search Console');
  console.log('6. Monitor Core Web Vitals for performance');
}

testSEO().catch(console.error);
