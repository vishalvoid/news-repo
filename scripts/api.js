/**
 * News API Handler
 * Handles all API calls to NewsAPI.org
 */

class NewsAPI {
    constructor() {
        this.baseURL = 'https://newsapi.org/v2';
        // Note: For production, API key should be stored securely
        // For this demo, using a free tier API key (replace with your own)
        this.apiKey = 'YOUR_API_KEY_HERE'; // Replace with actual API key
        this.fallbackData = this.generateFallbackData(); // For demo when API key is not available
    }

    /**
     * Make API request to NewsAPI
     */
    async makeRequest(endpoint, params = {}) {
        try {
            // If no API key is provided, use fallback data for demo
            if (this.apiKey === 'YOUR_API_KEY_HERE') {
                console.warn('Using fallback data. Please add your NewsAPI key for live data.');
                return this.getFallbackData(endpoint, params);
            }

            const url = new URL(`${this.baseURL}/${endpoint}`);
            
            // Add API key
            url.searchParams.append('apiKey', this.apiKey);
            
            // Add other parameters
            Object.keys(params).forEach(key => {
                if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
                    url.searchParams.append(key, params[key]);
                }
            });

            const response = await fetch(url);
            
            if (!response.ok) {
                throw new Error(`API request failed: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.status === 'error') {
                throw new Error(data.message);
            }

            return data;
        } catch (error) {
            console.error('API request failed:', error);
            // Return fallback data on error
            return this.getFallbackData(endpoint, params);
        }
    }

    /**
     * Get top headlines
     */
    async getTopHeadlines(country = '', category = '', pageSize = 20, page = 1) {
        const params = {
            pageSize,
            page
        };

        if (country) {
            params.country = country;
        }

        if (category) {
            params.category = category;
        }

        return await this.makeRequest('top-headlines', params);
    }

    /**
     * Search for articles
     */
    async searchArticles(query, pageSize = 20, page = 1, sortBy = 'publishedAt') {
        const params = {
            q: query,
            pageSize,
            page,
            sortBy,
            language: 'en'
        };

        return await this.makeRequest('everything', params);
    }

    /**
     * Get articles by category and country
     */
    async getArticlesByCategory(category, country = '', pageSize = 20, page = 1) {
        return await this.getTopHeadlines(country, category, pageSize, page);
    }

    /**
     * Generate fallback data for demo purposes
     */
    generateFallbackData() {
        const sources = [
            'BBC News', 'CNN', 'Reuters', 'Associated Press', 'The Guardian',
            'New York Times', 'Washington Post', 'Bloomberg', 'TechCrunch', 'ESPN'
        ];

        const categories = ['general', 'business', 'technology', 'sports', 'entertainment', 'health', 'science'];

        const sampleTitles = {
            general: [
                'Breaking: Major Global Summit Concludes with Historic Agreement',
                'International Leaders Meet to Discuss Climate Change',
                'Economic Growth Shows Positive Trends Worldwide',
                'New Research Reveals Important Environmental Findings'
            ],
            business: [
                'Stock Markets Reach New Heights as Tech Sector Surges',
                'Major Corporation Announces Innovative Partnership',
                'Economic Indicators Point to Continued Growth',
                'New Business Regulations Take Effect Globally'
            ],
            technology: [
                'Revolutionary AI Technology Transforms Industry Standards',
                'New Smartphone Features Change User Experience',
                'Breakthrough in Quantum Computing Research',
                'Tech Giants Collaborate on Sustainability Initiative'
            ],
            sports: [
                'Championship Finals Draw Record-Breaking Viewership',
                'Athlete Breaks Long-Standing World Record',
                'New Stadium Opens with State-of-the-Art Features',
                'International Sports League Announces Expansion'
            ],
            entertainment: [
                'Award-Winning Film Premieres to Critical Acclaim',
                'Music Festival Lineup Announced with Surprise Headliners',
                'Streaming Platform Launches Original Content Series',
                'Celebrity Charity Event Raises Millions for Good Cause'
            ],
            health: [
                'Medical Breakthrough Offers Hope for Rare Disease',
                'New Health Study Reveals Important Lifestyle Insights',
                'Global Health Initiative Launches Vaccination Program',
                'Mental Health Awareness Campaign Gains Momentum'
            ],
            science: [
                'Space Exploration Mission Discovers New Planetary System',
                'Climate Research Reveals Promising Conservation Methods',
                'Scientific Study Uncovers Ancient Historical Artifacts',
                'Renewable Energy Technology Achieves Efficiency Milestone'
            ]
        };

        const descriptions = [
            'This groundbreaking development has captured global attention and is expected to have far-reaching implications across multiple sectors.',
            'Experts are closely monitoring the situation as new details continue to emerge from reliable sources.',
            'The announcement comes at a critical time when stakeholders are seeking innovative solutions to complex challenges.',
            'Initial reports suggest this could mark a significant turning point in how we approach these important issues.',
            'Comprehensive analysis reveals multiple factors contributing to this noteworthy development.',
            'Industry leaders are optimistic about the potential positive impact of these recent developments.'
        ];

        return { sources, categories, sampleTitles, descriptions };
    }

    /**
     * Get fallback data when API is not available
     */
    getFallbackData(endpoint, params) {
        const { sources, categories, sampleTitles, descriptions } = this.fallbackData;
        const articles = [];

        // Determine which titles to use based on category
        let titles = [];
        if (params.category && sampleTitles[params.category]) {
            titles = [...sampleTitles[params.category]];
        } else if (params.q) {
            // For search, mix different categories
            titles = Object.values(sampleTitles).flat();
        } else {
            // For general/top headlines, use general category
            titles = [...sampleTitles.general];
        }

        // Generate articles
        const pageSize = params.pageSize || 20;
        for (let i = 0; i < pageSize; i++) {
            const randomTitle = titles[Math.floor(Math.random() * titles.length)];
            const randomSource = sources[Math.floor(Math.random() * sources.length)];
            const randomDescription = descriptions[Math.floor(Math.random() * descriptions.length)];
            
            // Generate a random date within the last 7 days
            const randomDate = new Date();
            randomDate.setDate(randomDate.getDate() - Math.floor(Math.random() * 7));

            articles.push({
                title: randomTitle,
                description: randomDescription,
                url: '#',
                urlToImage: `https://picsum.photos/400/250?random=${i}`,
                publishedAt: randomDate.toISOString(),
                source: {
                    name: randomSource
                },
                author: 'Demo Author'
            });
        }

        return {
            status: 'ok',
            totalResults: 100,
            articles: articles
        };
    }

    /**
     * Format date for display
     */
    formatDate(dateString) {
        const date = new Date(dateString);
        const now = new Date();
        const diffTime = Math.abs(now - date);
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

        if (diffDays === 1) {
            return '1 day ago';
        } else if (diffDays < 7) {
            return `${diffDays} days ago`;
        } else {
            return date.toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric'
            });
        }
    }

    /**
     * Get placeholder image if article image is not available
     */
    getPlaceholderImage() {
        return 'https://via.placeholder.com/400x250/e2e8f0/64748b?text=No+Image';
    }
}

// Export for use in other files
window.NewsAPI = NewsAPI;