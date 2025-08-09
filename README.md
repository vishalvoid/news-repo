# NewsHub - Modern News Aggregation Platform

A production-ready, modern news aggregation website built with Next.js, Tailwind CSS, and Framer Motion. NewsHub provides breaking news, in-depth analysis, and stories from trusted sources worldwide.

![NewsHub Homepage](https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=1200&q=80)

## 🚀 Features

### ✨ Core Functionality
- **News Aggregation**: Fetches and displays news articles from multiple free news APIs
- **Server-Side Rendering**: SEO-friendly content with Next.js SSR
- **Category Navigation**: Organized news by categories (World, Politics, Technology, Sports, etc.)
- **Search Functionality**: Search across all news articles
- **Individual Article Pages**: Dedicated pages with full content and related articles

### 🎨 Modern UI/UX
- **Responsive Design**: Mobile-first design that works on all devices
- **Dark Mode**: Toggle between light and dark themes with persistence
- **Smooth Animations**: Framer Motion animations for page transitions and interactions
- **Clean Design**: Modern, minimal design inspired by leading news sites

### 🔧 Technical Features
- **Next.js 15**: Latest version with App Router and TypeScript
- **Image Optimization**: Next.js Image component for optimized loading
- **SEO Optimized**: Proper meta tags, Open Graph, and structured data
- **Performance**: Cached content and optimized builds
- **Error Handling**: Graceful fallbacks when APIs are unavailable

## 🛠️ Technology Stack

- **Framework**: Next.js 15 with TypeScript
- **Styling**: Tailwind CSS
- **Animations**: Framer Motion
- **Icons**: Lucide React
- **Date Handling**: date-fns
- **News APIs**: NewsAPI.org (with mock data fallback)

## 📦 Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/vishalvoid/news-repo.git
   cd news-repo
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env.local
   ```

4. **Add your API keys** to `.env.local`:
   ```env
   NEWSAPI_KEY=your_newsapi_key_here
   GUARDIAN_API_KEY=your_guardian_api_key_here
   NEXT_PUBLIC_SITE_URL=http://localhost:3000
   NEXT_PUBLIC_SITE_NAME=NewsHub
   ```

5. **Run the development server**
   ```bash
   npm run dev
   ```

6. **Open your browser** and visit [http://localhost:3000](http://localhost:3000)

## 🔑 API Keys Setup

### NewsAPI
1. Visit [NewsAPI.org](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env.local` file

### Guardian API (Optional)
1. Visit [Guardian Open Platform](https://open-platform.theguardian.com/)
2. Register for a developer key
3. Add it to your `.env.local` file

> **Note**: The application includes mock data fallback, so it works even without API keys for development and testing.

## 🚀 Deployment

### Deploy to Vercel (Recommended)

1. **Push your code** to GitHub
2. **Connect to Vercel**:
   - Visit [vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables in Vercel dashboard
3. **Deploy**: Vercel will automatically deploy your application

### Deploy to Netlify

1. **Build the application**:
   ```bash
   npm run build
   npm run export
   ```
2. **Deploy the `out` folder** to Netlify

### Deploy to Other Platforms

The application can be deployed to any platform that supports Node.js applications:
- Railway
- Heroku
- DigitalOcean App Platform
- AWS Amplify

## 📁 Project Structure

```
src/
├── app/                    # Next.js app directory
│   ├── article/[id]/      # Individual article pages
│   ├── category/[category]/ # Category pages
│   ├── search/            # Search results page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Homepage
├── components/            # React components
│   ├── news/              # News-related components
│   │   ├── ArticleCard.tsx
│   │   └── NewsGrid.tsx
│   └── ui/                # UI components
│       ├── Navigation.tsx
│       └── LoadingSkeleton.tsx
├── lib/                   # Utility functions
│   └── newsService.ts     # News API service
└── types/                 # TypeScript types
    └── news.ts
```

## 🎯 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run start` - Start production server
- `npm run lint` - Run ESLint

## 📱 Pages & Routes

- `/` - Homepage with breaking news and category previews
- `/category/[category]` - Category-specific news pages
- `/article/[id]` - Individual article pages
- `/search?q=[query]` - Search results page

## 🎨 Categories

- General
- Business
- Entertainment
- Health
- Science
- Sports
- Technology
- World
- Politics

## 🌟 Features in Detail

### Homepage
- Hero section with branding
- Breaking news grid with featured articles
- Category previews for Technology and Business
- Quick category navigation links

### Category Pages
- Category-specific news listings
- SEO-optimized with category-specific meta tags
- Responsive grid layout

### Article Pages
- Full article content with featured images
- Source attribution and external links
- Related articles section
- Social sharing capabilities
- Breadcrumb navigation

### Search
- Real-time search across all articles
- Query highlighting and result counts
- SEO-friendly search URLs

## 🔧 Configuration

### Image Domains
External image domains are configured in `next.config.ts`:
- images.unsplash.com
- newsapi.org
- Major news source domains (CNN, BBC, Guardian, etc.)

### Environment Variables
- `NEWSAPI_KEY` - Your NewsAPI.org API key
- `GUARDIAN_API_KEY` - Your Guardian API key
- `NEXT_PUBLIC_SITE_URL` - Your site URL for SEO
- `NEXT_PUBLIC_SITE_NAME` - Your site name

## 🐛 Troubleshooting

### API Issues
- Check your API keys are correct
- Verify API quotas and limits
- The app includes mock data for development without APIs

### Build Issues
- Clear Next.js cache: `rm -rf .next`
- Reinstall dependencies: `rm -rf node_modules && npm install`

### Image Loading Issues
- Ensure image domains are added to `next.config.ts`
- Check network connectivity for external images

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Run tests: `npm run build`
5. Commit changes: `git commit -m 'Add feature'`
6. Push to branch: `git push origin feature-name`
7. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/) for the amazing framework
- [Tailwind CSS](https://tailwindcss.com/) for utility-first styling
- [Framer Motion](https://www.framer.com/motion/) for smooth animations
- [NewsAPI](https://newsapi.org/) for news data
- [Unsplash](https://unsplash.com/) for stock photos

## 📞 Support

If you have any questions or issues, please:
1. Check the troubleshooting section above
2. Search existing [GitHub issues](https://github.com/vishalvoid/news-repo/issues)
3. Create a new issue if needed

---

**Built with ❤️ using Next.js, Tailwind CSS, and Framer Motion**
