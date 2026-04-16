# Strapi CMS Setup Guide

This guide will help you set up Strapi CMS for The Cave blog.

## Option 1: Local Development

### 1. Create Strapi Project

In a separate directory (not inside this project):

```bash
npx create-strapi-app@latest the-cave-cms --quickstart
```

This creates a Strapi project with SQLite database.

### 2. Create Content Types

After Strapi starts, go to `http://localhost:1337/admin` and:

1. **Create "Post" Collection Type:**
   - `title` - Text (required)
   - `slug` - UID (attached to title)
   - `excerpt` - Text (max 160 chars)
   - `content` - Rich Text or Markdown
   - `publishedAt` - Datetime

2. **Create "Author" Collection Type (optional):**
   - `name` - Text
   - `bio` - Text
   - `avatar` - Media

3. **Create "Site Setting" Single Type:**
   - `siteName` - Text
   - `tagline` - Text
   - `heroHeadline` - Text
   - `heroSubtext` - Text
   - `subscriberCount` - Number

### 3. Configure Permissions

Go to Settings → Users & Permissions → Roles → Public:

- Enable `find` and `findOne` for Post
- Enable `find` for Site-setting

### 4. Create API Token

Go to Settings → API Tokens → Create new API Token:

- Name: "Blog Frontend"
- Type: Read-only
- Copy the token

### 5. Configure Environment

In your Next.js project, update `.env.local`:

```env
STRAPI_URL=http://localhost:1337
STRAPI_API_TOKEN=your-api-token-here
```

### 6. Set Up Webhook (for ISR)

In Strapi, go to Settings → Webhooks → Create new webhook:

- Name: "Revalidate Blog"
- URL: `https://yourdomain.com/api/revalidate`
- Headers: `x-webhook-secret: your-secret-here`
- Events: Entry create, update, delete for Post

Add the secret to your `.env.local`:

```env
STRAPI_WEBHOOK_SECRET=your-secret-here
```

---

## Option 2: Deploy to Railway (Recommended)

### 1. Create Railway Account

Go to [railway.app](https://railway.app) and sign up.

### 2. Deploy Strapi

1. Click "New Project"
2. Choose "Deploy a Template"
3. Search for "Strapi"
4. Click Deploy

Railway will automatically:
- Create a PostgreSQL database
- Deploy Strapi
- Give you a public URL

### 3. Configure Strapi

After deployment, access your Strapi admin at `https://your-app.railway.app/admin`

Follow steps 2-6 from Local Development above.

### 4. Update Environment

Update `.env.local` and Vercel environment variables:

```env
STRAPI_URL=https://your-app.railway.app
STRAPI_API_TOKEN=your-api-token
```

---

## Content Schema Reference

### Post

```json
{
  "title": "My Blog Post",
  "slug": "my-blog-post",
  "excerpt": "A short description for SEO and previews",
  "content": "# Heading\n\nMarkdown content here...",
  "publishedAt": "2025-01-15T00:00:00.000Z"
}
```

### Site Settings

```json
{
  "siteName": "The Cave",
  "tagline": "Insights from the depths",
  "heroHeadline": "Insights from the depths",
  "heroSubtext": "Join fellow cave dwellers for weekly thoughts...",
  "subscriberCount": 1000
}
```

---

## Development Without Strapi

The blog works without Strapi using mock data. Just leave `STRAPI_URL` empty in `.env.local` and the app will use the built-in sample posts.
