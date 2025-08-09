import { NewsResponse, NewsCategory, SearchParams } from '@/types/news';

const NEWSAPI_BASE_URL = 'https://newsapi.org/v2';
const NEWSAPI_KEY = process.env.NEWSAPI_KEY;

export class NewsService {
  private static async fetchNewsAPI(endpoint: string, params: Record<string, string> = {}) {
    if (!NEWSAPI_KEY) {
      throw new Error('NewsAPI key is not configured');
    }

    const url = new URL(`${NEWSAPI_BASE_URL}${endpoint}`);
    
    // Add API key and default parameters
    url.searchParams.set('apiKey', NEWSAPI_KEY);
    url.searchParams.set('pageSize', '20');
    
    // Add custom parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value) url.searchParams.set(key, value);
    });

    try {
      const response = await fetch(url.toString(), {
        next: { revalidate: 300 }, // Cache for 5 minutes
      });

      if (!response.ok) {
        throw new Error(`NewsAPI error: ${response.status}`);
      }

      const data: NewsResponse = await response.json();
      
      if (data.status === 'error') {
        throw new Error('NewsAPI returned an error');
      }

      return data;
    } catch (error) {
      console.error('Error fetching news:', error);
      // Return mock data in case of API failure
      return this.getMockData();
    }
  }

  static async getTopHeadlines(country: string = 'us', category?: NewsCategory): Promise<NewsResponse> {
    const params: Record<string, string> = {
      country,
    };

    if (category && category !== 'general') {
      params.category = category;
    }

    return this.fetchNewsAPI('/top-headlines', params);
  }

  static async searchNews(searchParams: SearchParams): Promise<NewsResponse> {
    const params: Record<string, string> = {};

    if (searchParams.q) params.q = searchParams.q;
    if (searchParams.page) params.page = searchParams.page.toString();
    if (searchParams.pageSize) params.pageSize = searchParams.pageSize.toString();

    return this.fetchNewsAPI('/everything', params);
  }

  static async getNewsByCategory(category: NewsCategory): Promise<NewsResponse> {
    return this.getTopHeadlines('us', category);
  }

  // Mock data for development and fallback
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