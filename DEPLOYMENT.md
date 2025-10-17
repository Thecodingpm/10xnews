# 10xNews Deployment Guide

## Admin Access for Production

### Current Setup
- **Development**: No authentication required (bypassed for easy testing)
- **Production**: Password-protected admin access

### Admin Credentials
The admin system uses environment variables for credentials:

```bash
ADMIN_EMAIL="admin@10xnews.com"
ADMIN_PASSWORD="your-secure-password-here"
```

### How to Access Admin Panel

1. **Go to**: `https://yourdomain.com/admin/login`
2. **Enter**:
   - Email: `admin@10xnews.com` (or your custom ADMIN_EMAIL)
   - Password: Your custom ADMIN_PASSWORD

### Environment Variables for Production

Create a `.env.local` file with these variables:

```bash
# Database
DATABASE_URL="your-mongodb-connection-string"

# NextAuth
NEXTAUTH_SECRET="your-super-secret-key-here"
NEXTAUTH_URL="https://yourdomain.com"

# News API
NEWS_API_KEY="your-news-api-key"

# Admin Credentials (CHANGE THESE!)
ADMIN_EMAIL="admin@10xnews.com"
ADMIN_PASSWORD="your-secure-admin-password-here"
```

### Deployment Platforms

#### Vercel (Recommended)
1. Connect your GitHub repository to Vercel
2. Add environment variables in Vercel dashboard
3. Deploy automatically on push

#### Netlify
1. Connect your GitHub repository to Netlify
2. Add environment variables in Netlify dashboard
3. Deploy automatically on push

#### Other Platforms
- Railway
- Render
- DigitalOcean App Platform

### Security Notes

1. **Change default credentials** before deploying
2. **Use strong passwords** for admin access
3. **Keep environment variables secret**
4. **Use HTTPS** in production
5. **Regularly update** your admin password

### Admin Features Available

- ✅ Create new articles manually
- ✅ Auto-fetch news from NewsAPI (every 6 hours)
- ✅ Manage existing articles
- ✅ View analytics and stats
- ✅ Access at: `/admin/dashboard`

### Troubleshooting

If you can't access admin:
1. Check environment variables are set correctly
2. Verify ADMIN_EMAIL and ADMIN_PASSWORD match
3. Check server logs for authentication errors
4. Ensure NEXTAUTH_SECRET is set
