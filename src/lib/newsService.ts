import { NewsResponse, NewsCategory, SearchParams, NewsArticle } from '@/types/news';

// RSS to JSON converter service (free)
const RSS_TO_JSON_API = 'https://api.rss2json.com/v1/api.json';

// Hacker News API (completely free)
const HACKER_NEWS_API = 'https://hacker-news.firebaseio.com/v0';

export class NewsService {
  // Fetch from Hacker News API (completely free, no keys needed)
  private static async fetchHackerNews(): Promise<NewsArticle[]> {
    try {
      // Get top stories IDs
      const topStoriesResponse = await fetch(`${HACKER_NEWS_API}/topstories.json`, {
        next: { revalidate: 300 }
      });
      const topStoryIds: number[] = await topStoriesResponse.json();
      
      // Get first 10 stories details
      const stories = await Promise.all(
        topStoryIds.slice(0, 10).map(async (id) => {
          const storyResponse = await fetch(`${HACKER_NEWS_API}/item/${id}.json`, {
            next: { revalidate: 300 }
          });
          return storyResponse.json();
        })
      );

      return stories
        .filter(story => story && story.title && story.url)
        .map((story) => ({
          id: `hn-${story.id}`,
          title: story.title,
          description: story.text ? story.text.substring(0, 200) + '...' : 'Technology news from Hacker News community',
          content: story.text || story.title,
          url: story.url,
          urlToImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
          publishedAt: new Date(story.time * 1000).toISOString(),
          source: { name: 'Hacker News' },
          author: story.by || 'HN User',
          category: 'technology'
        }));
    } catch (error) {
      console.error('Error fetching Hacker News:', error);
      return [];
    }
  }

  // Fetch from RSS feeds using RSS to JSON converter (free)
  private static async fetchRSSNews(rssUrl: string, category: string, sourceName: string): Promise<NewsArticle[]> {
    try {
      const url = `${RSS_TO_JSON_API}?rss_url=${encodeURIComponent(rssUrl)}`;
      const response = await fetch(url, {
        next: { revalidate: 600 } // Cache for 10 minutes
      });
      
      const data = await response.json();
      
      if (data.status !== 'ok' || !data.items) {
        throw new Error('RSS feed fetch failed');
      }

      return data.items.slice(0, 10).map((item: {
        title: string;
        description?: string;
        content?: string;
        link: string;
        thumbnail?: string;
        enclosure?: { link: string };
        pubDate?: string;
        author?: string;
      }, index: number) => ({
        id: `rss-${category}-${index}-${Date.now()}`,
        title: item.title,
        description: item.description || item.content || 'No description available',
        content: item.content || item.description || item.title,
        url: item.link,
        urlToImage: item.thumbnail || item.enclosure?.link || this.getDefaultImage(category),
        publishedAt: item.pubDate || new Date().toISOString(),
        source: { name: sourceName },
        author: item.author || sourceName,
        category: category
      }));
    } catch (error) {
      console.error(`Error fetching RSS news for ${sourceName}:`, error);
      return [];
    }
  }

  // Get default images for categories
  private static getDefaultImage(category: string): string {
    const imageMap: Record<string, string> = {
      business: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
      technology: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
      world: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800',
      health: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
      sports: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
      entertainment: 'https://images.unsplash.com/photo-1489599558687-33b4b1ca7ac1?w=800',
      science: 'https://images.unsplash.com/photo-1507413245164-6160d8298b31?w=800',
      general: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800'
    };
    return imageMap[category] || imageMap.general;
  }

  // Aggregate news from multiple free sources
  private static async fetchFreeNews(category?: NewsCategory): Promise<NewsArticle[]> {
    const allArticles: NewsArticle[] = [];

    try {
      // First try to get a small sample from external sources
      let hasExternalData = false;

      // Quick test with Hacker News (most reliable)
      if (!category || category === 'general' || category === 'technology') {
        try {
          const hackerNewsArticles = await this.fetchHackerNews();
          if (hackerNewsArticles.length > 0) {
            allArticles.push(...hackerNewsArticles.slice(0, 3));
            hasExternalData = true;
          }
        } catch (error) {
          console.log('Hacker News unavailable, using mock data');
        }
      }

      // If external sources are working, try to get more data
      if (hasExternalData) {
        // RSS feeds for different categories (all free, no API keys needed)
        const rssFeeds: Record<string, { url: string; source: string }[]> = {
          general: [
            { url: 'https://feeds.bbci.co.uk/news/rss.xml', source: 'BBC News' },
            { url: 'http://rss.cnn.com/rss/edition.rss', source: 'CNN' },
            { url: 'https://www.reuters.com/rssFeed/topNews', source: 'Reuters' }
          ],
          business: [
            { url: 'https://feeds.bbci.co.uk/news/business/rss.xml', source: 'BBC Business' },
            { url: 'http://rss.cnn.com/rss/money_latest.rss', source: 'CNN Business' }
          ],
          technology: [
            { url: 'https://feeds.bbci.co.uk/news/technology/rss.xml', source: 'BBC Technology' },
            { url: 'http://rss.cnn.com/rss/edition_technology.rss', source: 'CNN Tech' }
          ],
          world: [
            { url: 'https://feeds.bbci.co.uk/news/world/rss.xml', source: 'BBC World' },
            { url: 'http://rss.cnn.com/rss/edition_world.rss', source: 'CNN World' }
          ],
          health: [
            { url: 'https://feeds.bbci.co.uk/news/health/rss.xml', source: 'BBC Health' }
          ],
          sports: [
            { url: 'https://feeds.bbci.co.uk/sport/rss.xml', source: 'BBC Sport' },
            { url: 'http://rss.cnn.com/rss/edition_sport.rss', source: 'CNN Sports' }
          ],
          science: [
            { url: 'https://feeds.bbci.co.uk/news/science_and_environment/rss.xml', source: 'BBC Science' }
          ],
          entertainment: [
            { url: 'https://feeds.bbci.co.uk/news/entertainment_and_arts/rss.xml', source: 'BBC Entertainment' }
          ]
        };

        // If specific category requested, fetch from that category
        if (category && category !== 'general' && rssFeeds[category]) {
          const feeds = rssFeeds[category];
          for (const feed of feeds.slice(0, 1)) { // Only try first feed to avoid timeout
            try {
              const articles = await this.fetchRSSNews(feed.url, category, feed.source);
              allArticles.push(...articles.slice(0, 5));
            } catch (error) {
              console.log(`RSS feed ${feed.source} unavailable`);
            }
          }
        } else {
          // For general or no category, fetch from general feeds
          const feeds = rssFeeds.general;
          for (const feed of feeds.slice(0, 1)) { // Only try first feed to avoid timeout
            try {
              const articles = await this.fetchRSSNews(feed.url, 'general', feed.source);
              allArticles.push(...articles.slice(0, 5));
            } catch (error) {
              console.log(`RSS feed ${feed.source} unavailable`);
            }
          }
        }
      }

      // If we have some external data, return it; otherwise use mock data
      if (allArticles.length > 0) {
        // Shuffle and sort by date
        const shuffled = allArticles.sort(() => Math.random() - 0.5);
        return shuffled.sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime());
      } else {
        console.log('No external news sources available, using mock data');
        return this.getMockDataForCategory(category);
      }
      
    } catch (error) {
      console.error('Error fetching free news:', error);
      return this.getMockDataForCategory(category);
    }
  }

  static async getTopHeadlines(_country: string = 'us', category?: NewsCategory): Promise<NewsResponse> {
    try {
      const articles = await this.fetchFreeNews(category);
      return {
        status: 'ok',
        totalResults: articles.length,
        articles: articles.slice(0, 20)
      };
    } catch (error) {
      console.error('Error in getTopHeadlines:', error);
      return {
        status: 'ok',
        totalResults: 6,
        articles: this.getMockDataForCategory(category)
      };
    }
  }

  static async searchNews(searchParams: SearchParams): Promise<NewsResponse> {
    try {
      // For search, we'll get general news and filter by query
      const articles = await this.fetchFreeNews();
      
      let filteredArticles = articles;
      
      if (searchParams.q) {
        const query = searchParams.q.toLowerCase();
        filteredArticles = articles.filter(article => 
          article.title.toLowerCase().includes(query) ||
          article.description?.toLowerCase().includes(query) ||
          article.content?.toLowerCase().includes(query)
        );
      }

      const startIndex = ((searchParams.page || 1) - 1) * (searchParams.pageSize || 20);
      const endIndex = startIndex + (searchParams.pageSize || 20);

      return {
        status: 'ok',
        totalResults: filteredArticles.length,
        articles: filteredArticles.slice(startIndex, endIndex)
      };
    } catch (error) {
      console.error('Error in searchNews:', error);
      return {
        status: 'ok',
        totalResults: 0,
        articles: []
      };
    }
  }

  static async getNewsByCategory(category: NewsCategory): Promise<NewsResponse> {
    try {
      const articles = await this.fetchFreeNews(category);
      return {
        status: 'ok',
        totalResults: articles.length,
        articles: articles.slice(0, 20)
      };
    } catch (error) {
      console.error('Error in getNewsByCategory:', error);
      return {
        status: 'ok',
        totalResults: 6,
        articles: this.getMockDataForCategory(category)
      };
    }
  }

  // Enhanced mock data with category-specific content
  private static getMockDataForCategory(category?: NewsCategory): NewsArticle[] {
    const baseArticles = this.getMockData().articles;
    
    if (!category || category === 'general') {
      return baseArticles;
    }

    // Filter or generate category-specific mock data
    const categoryArticles = baseArticles.filter(article => article.category === category);
    
    if (categoryArticles.length > 0) {
      return categoryArticles;
    }

    // Generate fresh mock data for the category
    return this.generateMockArticlesForCategory(category);
  }

  private static generateMockArticlesForCategory(category: NewsCategory): NewsArticle[] {
    const categoryData: Record<NewsCategory, Array<{
      title: string;
      description: string;
      category: string;
    }>> = {
      business: [
        {
          title: 'Stock Market Reaches New Heights',
          description: 'Major indices show continued growth as investor confidence remains strong.',
          category: 'business'
        },
        {
          title: 'Tech Giants Report Strong Quarterly Earnings',
          description: 'Technology companies exceed expectations with robust financial performance.',
          category: 'business'
        }
      ],
      technology: [
        {
          title: 'Revolutionary AI Breakthrough Announced',
          description: 'Scientists achieve major milestone in artificial intelligence research.',
          category: 'technology'
        },
        {
          title: 'New Smartphone Technology Changes Everything',
          description: 'Latest mobile technology promises to transform user experience.',
          category: 'technology'
        }
      ],
      health: [
        {
          title: 'Medical Research Shows Promising Results',
          description: 'New treatment approaches offer hope for patients worldwide.',
          category: 'health'
        },
        {
          title: 'Health Study Reveals Important Findings',
          description: 'Long-term research provides insights into preventive medicine.',
          category: 'health'
        }
      ],
      sports: [
        {
          title: 'Championship Finals Deliver Excitement',
          description: 'Athletes compete at the highest level in thrilling matches.',
          category: 'sports'
        },
        {
          title: 'Record-Breaking Performance Stuns Fans',
          description: 'New world record set in spectacular fashion.',
          category: 'sports'
        }
      ],
      world: [
        {
          title: 'International Summit Addresses Global Challenges',
          description: 'World leaders collaborate on pressing international issues.',
          category: 'world'
        },
        {
          title: 'Diplomatic Breakthrough in International Relations',
          description: 'Historic agreement reached between nations.',
          category: 'world'
        }
      ],
      entertainment: [
        {
          title: 'Blockbuster Film Breaks Box Office Records',
          description: 'Latest movie release captures audiences worldwide.',
          category: 'entertainment'
        },
        {
          title: 'Music Industry Celebrates Innovation',
          description: 'New streaming platform revolutionizes music consumption.',
          category: 'entertainment'
        }
      ],
      science: [
        {
          title: 'Space Exploration Reaches New Milestone',
          description: 'Scientific mission reveals exciting discoveries about the universe.',
          category: 'science'
        },
        {
          title: 'Climate Research Provides New Insights',
          description: 'Environmental scientists publish groundbreaking findings.',
          category: 'science'
        }
      ],
      politics: [
        {
          title: 'Legislative Session Addresses Key Issues',
          description: 'Political leaders work on important policy initiatives.',
          category: 'politics'
        },
        {
          title: 'Election Results Shape Future Direction',
          description: 'Voters make their voices heard in democratic process.',
          category: 'politics'
        }
      ],
      general: []
    };

    const articles = categoryData[category] || [];
    
    return articles.map((article, index) => ({
      id: `mock-${category}-${index}`,
      title: article.title,
      description: article.description,
      content: `${article.description} This is expanded content for the ${category} article.`,
      url: `https://example.com/${category}-${index}`,
      urlToImage: this.getDefaultImage(category),
      publishedAt: new Date(Date.now() - index * 3600000).toISOString(),
      source: { name: `${category.charAt(0).toUpperCase() + category.slice(1)} News` },
      author: 'News Reporter',
      category: category
    }));
  }

  // Original mock data method (kept for backwards compatibility)
  private static getMockData(): NewsResponse {
    return {
      status: 'ok',
      totalResults: 6,
      articles: [
        {
          id: '1',
          title: 'Breaking: Major Technology Breakthrough Announced',
          description: 'Scientists have made a significant advancement in quantum computing technology that could revolutionize the field.',
          content: 'This is a longer content preview that would normally contain the full article text from the news source...',
          url: 'https://example.com/tech-breakthrough',
          urlToImage: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800',
          publishedAt: new Date().toISOString(),
          source: { name: 'Tech News Daily' },
          author: 'John Smith',
          category: 'technology'
        },
        {
          id: '2',
          title: 'Global Markets Show Strong Performance',
          description: 'International stock markets continue their upward trend as economic indicators remain positive.',
          content: 'Market analysis shows continued growth across multiple sectors...',
          url: 'https://example.com/market-performance',
          urlToImage: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?w=800',
          publishedAt: new Date(Date.now() - 3600000).toISOString(),
          source: { name: 'Financial Times' },
          author: 'Sarah Johnson',
          category: 'business'
        },
        {
          id: '3',
          title: 'Climate Summit Reaches Historic Agreement',
          description: 'World leaders unite on ambitious climate goals and renewable energy initiatives.',
          content: 'The international climate summit concluded with unprecedented cooperation...',
          url: 'https://example.com/climate-summit',
          urlToImage: 'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e3?w=800',
          publishedAt: new Date(Date.now() - 7200000).toISOString(),
          source: { name: 'Global News Network' },
          author: 'Maria Garcia',
          category: 'world'
        },
        {
          id: '4',
          title: 'Revolutionary Health Study Results Released',
          description: 'New research reveals promising developments in personalized medicine and treatment approaches.',
          content: 'Medical researchers have published groundbreaking findings...',
          url: 'https://example.com/health-study',
          urlToImage: 'https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=800',
          publishedAt: new Date(Date.now() - 10800000).toISOString(),
          source: { name: 'Medical Journal Today' },
          author: 'Dr. Robert Chen',
          category: 'health'
        },
        {
          id: '5',
          title: 'Championship Game Delivers Thrilling Finish',
          description: 'Last-minute victory caps off an incredible season of professional sports.',
          content: 'In a game that will be remembered for years to come...',
          url: 'https://example.com/championship-game',
          urlToImage: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800',
          publishedAt: new Date(Date.now() - 14400000).toISOString(),
          source: { name: 'Sports Central' },
          author: 'Mike Williams',
          category: 'sports'
        },
        {
          id: '6',
          title: 'New Entertainment Series Breaks Streaming Records',
          description: 'The latest release on streaming platforms has captured global audience attention.',
          content: 'Entertainment industry analysts report record-breaking viewership...',
          url: 'https://example.com/streaming-records',
          urlToImage: 'https://images.unsplash.com/photo-1489599558687-33b4b1ca7ac1?w=800',
          publishedAt: new Date(Date.now() - 18000000).toISOString(),
          source: { name: 'Entertainment Weekly' },
          author: 'Lisa Park',
          category: 'entertainment'
        }
      ]
    };
  }
}