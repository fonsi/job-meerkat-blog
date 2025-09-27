#!/usr/bin/env node

const {
    generateBlogPost,
    saveBlogPost,
    generateUniqueTopic,
} = require('./generate-blog-post');
const fs = require('fs');
const path = require('path');

// Load environment variables from .env file
function loadEnvFile() {
    // Try different env files in order of preference
    const envFiles = ['.env.local', '.env', '.env.dev'];

    for (const envFile of envFiles) {
        const envPath = path.join(__dirname, '..', envFile);
        if (fs.existsSync(envPath)) {
            console.log(`📁 Loading environment variables from ${envFile}`);
            const envContent = fs.readFileSync(envPath, 'utf8');
            const envLines = envContent.split('\n');

            envLines.forEach((line) => {
                const trimmedLine = line.trim();
                if (trimmedLine && !trimmedLine.startsWith('#')) {
                    const [key, ...valueParts] = trimmedLine.split('=');
                    if (key && valueParts.length > 0) {
                        const value = valueParts
                            .join('=')
                            .replace(/^["']|["']$/g, ''); // Remove quotes
                        process.env[key.trim()] = value;
                    }
                }
            });
            return; // Found and loaded a file, exit
        }
    }

    console.log('⚠️ No .env file found, using system environment variables');
}

// Test script to verify blog post generation works
async function testBlogGenerator() {
    console.log('🧪 Testing blog post generator...');

    // Load environment variables
    loadEnvFile();

    try {
        // Test topic generation
        const existingTitles = [
            'How to Find a Remote Job in 2025: Tips for Success',
            'How to Stand Out in a Competitive Job Market',
            'How to Negotiate Your Salary Like a Pro',
        ];

        const topic = generateUniqueTopic(existingTitles);
        console.log(`✅ Generated topic: ${topic}`);

        // Test blog post generation (only if API key is available)
        if (process.env.OPENAI_API_KEY) {
            console.log('🤖 Testing AI blog post generation...');
            const blogContent = await generateBlogPost(topic, existingTitles);

            console.log('🔍 Blog content:');
            console.log(blogContent);
            console.log('🔍 Blog content end');

            // Save test blog post
            const filename = saveBlogPost(blogContent, topic);
            console.log(`✅ Test blog post saved: ${filename}`);

            // Clean up test file
            const testFilePath = path.join(__dirname, '..', 'posts', filename);
            if (fs.existsSync(testFilePath)) {
                fs.unlinkSync(testFilePath);
                console.log('🧹 Test file cleaned up');
            }
        } else {
            console.log(
                '⚠️ OPENAI_API_KEY not found in .env file or environment, skipping AI generation test',
            );
        }

        console.log('✅ All tests passed!');
    } catch (error) {
        console.error('❌ Test failed:', error.message);
        process.exit(1);
    }
}

if (require.main === module) {
    testBlogGenerator();
}
