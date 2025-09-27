#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const matter = require('gray-matter');

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

// Load environment variables
loadEnvFile();

// Configuration
const POSTS_DIR = path.join(__dirname, '..', 'posts');
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
    console.error('❌ OPENAI_API_KEY environment variable is required');
    console.error(
        '💡 Make sure to add OPENAI_API_KEY to your .env file or set it as an environment variable',
    );
    process.exit(1);
}

// Blog post topics and themes for JobMeerkat
const BLOG_TOPICS = [
    'Remote work productivity tips',
    'Job search strategies for 2025',
    'Remote company culture insights',
    'Career development in remote teams',
    'Remote work tools and software',
    'Building a remote work routine',
    'Remote job interview preparation',
    'Managing remote team communication',
    'Remote work challenges and solutions',
    'Freelancing vs remote employment',
    'Remote work benefits and perks',
    'Time zone management for remote workers',
    'Remote work security best practices',
    'Building professional relationships remotely',
    'Remote work burnout prevention',
    'Remote work legal considerations',
    'Remote work equipment and setup',
    'Remote work performance metrics',
    'Remote work networking strategies',
    'Remote work career advancement',
];

// Get existing blog post titles to avoid repetition
function getExistingTitles() {
    const files = fs.readdirSync(POSTS_DIR);
    const titles = [];

    files.forEach((file) => {
        if (file.endsWith('.md')) {
            const filePath = path.join(POSTS_DIR, file);
            const content = fs.readFileSync(filePath, 'utf8');
            const { data } = matter(content);
            if (data.title) {
                titles.push(data.title);
            }
        }
    });

    return titles;
}

// Generate a unique blog post topic
function generateUniqueTopic(existingTitles) {
    const usedTopics = new Set();

    // Extract topics from existing titles
    existingTitles.forEach((title) => {
        const lowerTitle = title.toLowerCase();
        BLOG_TOPICS.forEach((topic) => {
            if (lowerTitle.includes(topic.toLowerCase().split(' ')[0])) {
                usedTopics.add(topic);
            }
        });
    });

    // Find unused topics
    const availableTopics = BLOG_TOPICS.filter(
        (topic) => !usedTopics.has(topic),
    );

    if (availableTopics.length === 0) {
        // If all topics are used, pick a random one and add variation
        const randomTopic =
            BLOG_TOPICS[Math.floor(Math.random() * BLOG_TOPICS.length)];
        return `${randomTopic} - Advanced Strategies`;
    }

    return availableTopics[Math.floor(Math.random() * availableTopics.length)];
}

// Call OpenAI API to generate blog post
async function generateBlogPost(topic, existingTitles) {
    const existingTitlesText = existingTitles.slice(-5).join(', '); // Use last 5 titles for context

    const prompt = `You are a professional blog writer for JobMeerkat.com, a remote job board. Generate a high-quality blog post about "${topic}".

REQUIREMENTS:
1. Write in a professional, helpful, and engaging tone
2. Target remote job seekers and professionals
3. Include actionable advice and practical tips
4. Use clear headings and bullet points
5. Include a call-to-action to JobMeerkat.com as a markdown link.
6. Write 800-1200 words
7. Use the exact frontmatter format below
8. Avoid topics already covered in these recent posts: ${existingTitlesText}

FRONTMATTER FORMAT:
---
title: 'Your Title Here'
description: 'Your meta description here (150-160 characters)'
date: '${new Date().toISOString().split('T')[0]}'
---

CONTENT GUIDELINES:
- Start with an engaging introduction
- The title will be included in the frontmatter, so do not include it in the content
- Use numbered lists and bullet points
- Include practical examples
- End with a strong conclusion
- Add a call-to-action to visit JobMeerkat.com. Remember that the link should be formated as a markdown link. Like this: [JobMeerkat](https://jobmeerkat.com).
- Use emojis sparingly but effectively
- Include relevant keywords for SEO

Generate the complete blog post with frontmatter:`;

    try {
        const response = await fetch(
            'https://api.openai.com/v1/chat/completions',
            {
                method: 'POST',
                headers: {
                    Authorization: `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    model: 'gpt-4.1-mini',
                    messages: [
                        {
                            role: 'system',
                            content:
                                'You are an expert blog writer specializing in remote work, job search, and career advice. You write engaging, SEO-optimized content that helps job seekers succeed.',
                        },
                        {
                            role: 'user',
                            content: prompt,
                        },
                    ],
                    max_tokens: 2000,
                    temperature: 0.7,
                }),
            },
        );

        if (!response.ok) {
            throw new Error(
                `OpenAI API error: ${response.status} ${response.statusText}`,
            );
        }

        const data = await response.json();
        return data.choices[0].message.content;
    } catch (error) {
        console.error('❌ Error generating blog post:', error.message);
        throw error;
    }
}

// Save blog post to file
function saveBlogPost(content, topic) {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0];
    const filename =
        topic
            .toLowerCase()
            .replace(/[^a-z0-9\s-]/g, '')
            .replace(/\s+/g, '-')
            .replace(/-+/g, '-')
            .replace(/^-|-$/g, '') + '.md';

    const filepath = path.join(POSTS_DIR, filename);

    // Check if file already exists
    if (fs.existsSync(filepath)) {
        const timestamp = Date.now();
        const newFilename = filename.replace('.md', `-${timestamp}.md`);
        const newFilepath = path.join(POSTS_DIR, newFilename);
        fs.writeFileSync(newFilepath, content);
        console.log(`✅ Blog post saved: ${newFilename}`);
        return newFilename;
    }

    fs.writeFileSync(filepath, content);
    console.log(`✅ Blog post saved: ${filename}`);
    return filename;
}

// Main execution
async function main() {
    try {
        console.log('🚀 Starting blog post generation...');

        // Get existing titles to avoid repetition
        const existingTitles = getExistingTitles();
        console.log(`📚 Found ${existingTitles.length} existing blog posts`);

        // Generate unique topic
        const topic = generateUniqueTopic(existingTitles);
        console.log(`📝 Selected topic: ${topic}`);

        // Generate blog post
        console.log('🤖 Generating blog post with AI...');
        const blogContent = await generateBlogPost(topic, existingTitles);

        // Save blog post
        const filename = saveBlogPost(blogContent, topic);

        console.log('🎉 Blog post generation completed successfully!');
        console.log(`📄 Generated file: ${filename}`);
    } catch (error) {
        console.error('❌ Blog post generation failed:', error.message);
        process.exit(1);
    }
}

// Run the script
if (require.main === module) {
    main();
}

module.exports = { generateBlogPost, saveBlogPost, generateUniqueTopic };
