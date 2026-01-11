# Blog Content Management Guide

This guide explains how to add and manage blog posts on your portfolio site.

## Overview

Blog posts are managed through a single JSON file: `content/blog-posts.json`. When you add a new post, it automatically appears on the blog listing page with proper SEO, sharing, and related posts.

## Adding a New Blog Post

###Step 1: Write Your Content

Write your blog post content in your preferred text editor. Keep these guidelines in mind:

- **Length**: Aim for 500-1500 words
- **Tone**: Conversational, personal, authentic
- **Format**: Write in paragraphs (double line breaks separate paragraphs)
- **Topics**: Creative process, album art stories, inspiration, tutorials

### Step 2: Choose an Image

Select a featured image for your post:
- Save it to `assets/images/blog/`
- Recommended size: 1200×630px (ideal for social sharing)
- Format: JPG or PNG
- Filename: descriptive (e.g., `creative-process-2025.jpg`)

### Step 3: Add Post to JSON

Open `content/blog-posts.json` and add a new entry to the `posts` array:

```json
{
  "id": "my-creative-process",
  "title": "My Creative Process: From Concept to Collage",
  "slug": "my-creative-process",
  "excerpt": "A behind-the-scenes look at how I transform musical inspiration into surreal digital collages.",
  "content": "Content goes here...\n\nUse double line breaks for paragraphs.\n\nYou can write multiple paragraphs this way.",
  "author": "Jolene Casko",
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-15",
  "featured": false,
  "category": "Process",
  "tags": ["creative process", "tutorial", "digital collage"],
  "image": {
    "url": "/assets/images/blog/creative-process.jpg",
    "alt": "Digital collage work in progress"
  },
  "seo": {
    "metaTitle": "My Creative Process - Jolene Casko",
    "metaDescription": "Behind-the-scenes look at how I create surreal digital collages from musical inspiration.",
    "keywords": ["creative process", "digital collage", "art tutorial"]
  },
  "readTime": 5
}
```

### Step 4: Field Reference

#### Required Fields

- **id**: Unique identifier (lowercase, hyphens, no spaces)
- **title**: Post title (appears in listings and post header)
- **slug**: URL-friendly version (usually same as id)
- **excerpt**: Short summary (150-200 characters, shown in listings)
- **content**: Full post content (use `\n\n` for paragraph breaks)
- **author**: Your name ("Jolene Casko")
- **datePublished**: ISO date format (YYYY-MM-DD)
- **dateModified**: ISO date format (same as published initially)

#### Optional But Recommended

- **featured**: Boolean - show as featured post? (true/false)
- **category**: Main category (e.g., "Process", "Inspiration", "Tutorial", "Behind the Scenes")
- **tags**: Array of tags for filtering and related posts
- **image**: Featured image object with url and alt text
- **readTime**: Estimated read time in minutes
- **seo**: SEO metadata object

#### SEO Metadata

- **metaTitle**: Page title for search results (include your name)
- **metaDescription**: Description for search snippets (150-160 characters)
- **keywords**: Array of relevant keywords

### Step 5: Commit and Deploy

```bash
git add content/blog-posts.json assets/images/blog/your-image.jpg
git commit -m "Add blog post: Your Post Title"
git push
```

Netlify will automatically deploy your new post (2-3 minutes).

## Content Best Practices

### Writing Style

- **Be Personal**: Share your unique perspective
- **Be Specific**: Use concrete examples and details
- **Be Visual**: Describe imagery, reference your artwork
- **Be Authentic**: Write in your own voice

### Topic Ideas

**Creative Process**
- How you select source imagery
- Your typical workflow
- Tools and techniques you use
- How music influences your choices

**Album Art Stories**
- Collaboration stories with musicians
- Challenges and breakthroughs
- How you translate sound to visuals
- Client testimonials

**Inspiration**
- Artists who influence you
- Music that inspires you
- Books, films, poetry references
- Themes you explore

**Tutorials**
- Digital collage techniques
- Tool recommendations
- Composition tips
- Color theory

**Behind the Scenes**
- Studio setup
- Work-in-progress shots
- Rejected concepts
- Evolution of a piece

### SEO Optimization

**Titles**
- Include primary keyword
- Be descriptive and compelling
- Keep under 60 characters
- Examples:
  - "How I Create Album Art: My Complete Process"
  - "5 Tools Every Digital Collage Artist Needs"
  - "From Vinyl to Visual: Translating Music to Art"

**Excerpts**
- Hook readers immediately
- Include keywords naturally
- Answer "What's in it for me?"
- 150-200 characters ideal

**Meta Descriptions**
- Expand on the excerpt
- Include call to action
- Use keywords naturally
- 150-160 characters

**Tags**
- 3-5 tags per post
- Mix broad and specific
- Use consistent tags across posts
- Examples: `["creative process", "photoshop", "album art", "surrealism"]`

### Image Guidelines

**Featured Images**
- Size: 1200×630px (optimal for social sharing)
- Format: JPG (smaller file size) or PNG (if transparency needed)
- Quality: High resolution but optimized (under 500KB)
- Subject: Relevant to post content
- Alt text: Descriptive for accessibility and SEO

**In-Content Images** (future feature)
- Add images to illustrate steps
- Place in `assets/images/blog/post-name/`
- Reference in content (markdown coming in future)

## Managing Existing Posts

### Update a Post

1. Open `content/blog-posts.json`
2. Find the post by its `id`
3. Edit any field except `id` and `slug`
4. Update `dateModified` to current date
5. Commit and push

### Mark as Featured

Set `"featured": true` to show post with special badge.
Limit to 1-2 featured posts at a time.

### Remove a Post

Delete the entire JSON object from the `posts` array.
The post will disappear from the blog listing.

## Categories

Suggested categories:
- **Process**: Creative workflow, techniques
- **Inspiration**: What inspires you
- **Tutorial**: How-to guides
- **Behind the Scenes**: Studio, work-in-progress
- **Collaboration**: Client work, partnerships
- **Reflection**: Thoughts on art, creativity

Use consistent categories to help readers find related content.

## Tags

Common tags to use:
- `digital collage`
- `creative process`
- `album art`
- `surrealism`
- `photoshop`
- `tutorial`
- `inspiration`
- `music`
- `vintage`
- `commissioned work`

Tags power the related posts feature—use them consistently!

## Example Post Template

```json
{
  "id": "post-slug-here",
  "title": "Your Post Title",
  "slug": "post-slug-here",
  "excerpt": "A compelling one-sentence summary that makes people want to read more.",
  "content": "Your first paragraph goes here. It should hook the reader and introduce the topic.\n\nSecond paragraph provides more context. Each paragraph is separated by \\n\\n in the JSON.\n\nContinue writing your post. You can have as many paragraphs as you need.\n\nEnd with a conclusion or call to action.",
  "author": "Jolene Casko",
  "datePublished": "2025-01-15",
  "dateModified": "2025-01-15",
  "featured": false,
  "category": "Process",
  "tags": ["tag1", "tag2", "tag3"],
  "image": {
    "url": "/assets/images/blog/your-image.jpg",
    "alt": "Descriptive alt text for accessibility"
  },
  "seo": {
    "metaTitle": "Your Post Title - Jolene Casko",
    "metaDescription": "150-160 character description for search results that includes keywords naturally.",
    "keywords": ["keyword1", "keyword2", "keyword3"]
  },
  "readTime": 5
}
```

## Publishing Schedule

**Frequency**: Aim for 1-2 posts per month

**Best Times to Publish**:
- Tuesday-Thursday mornings (higher engagement)
- When you have new artwork to promote
- Around album releases you worked on
- When commission slots open

**Promotion**:
- Share on Instagram Stories
- Post link on Twitter
- Include in newsletter
- Tag collaborating musicians

## SEO Benefits

Regular blogging helps your site rank for:
- "digital collage artist"
- "album art designer"
- "[your city] collage artist"
- "how to create digital collage"
- "surreal album art"

Each post is a new page Google can index!

## Future Features

Coming soon:
- Markdown support for easier formatting
- Image galleries within posts
- Comments section
- Post scheduling
- Draft/published status

---

**Questions?** Refer to CONTENT-GUIDE.md for artwork management or contact your developer.
