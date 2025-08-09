/**
 * Main Application Logic
 * Handles all user interactions and app state
 */

class NewsApp {
    constructor() {
        this.newsAPI = new NewsAPI();
        this.ui = new UIComponents();
        this.currentCategory = '';
        this.currentCountry = '';
        this.currentQuery = '';
        this.currentPage = 1;
        this.isLoading = false;
        this.hasMoreArticles = true;
        
        this.init();
    }

    /**
     * Initialize the application
     */
    init() {
        this.setupEventListeners();
        this.ui.addAnimationStyles();
        this.loadTopHeadlines();
        
        // Show welcome notification
        setTimeout(() => {
            this.ui.showNotification('Welcome to WorldNews! Latest headlines loaded.', 'info');
        }, 1000);
    }

    /**
     * Setup all event listeners
     */
    setupEventListeners() {
        // Sidebar toggle
        const sidebarToggle = document.getElementById('sidebarToggle');
        if (sidebarToggle) {
            sidebarToggle.addEventListener('click', () => {
                this.ui.toggleSidebar();
            });
        }

        // Sidebar overlay
        const sidebarOverlay = document.getElementById('sidebarOverlay');
        if (sidebarOverlay) {
            sidebarOverlay.addEventListener('click', () => {
                this.ui.closeSidebar();
            });
        }

        // Category navigation
        const categoryItems = document.querySelectorAll('.nav-item');
        categoryItems.forEach(item => {
            item.addEventListener('click', (e) => {
                const category = e.currentTarget.dataset.category;
                this.selectCategory(category);
                
                // Close sidebar on mobile after selection
                if (window.innerWidth <= 1024) {
                    this.ui.closeSidebar();
                }
            });
        });

        // Country selection
        const countrySelect = document.getElementById('countrySelect');
        if (countrySelect) {
            countrySelect.addEventListener('change', (e) => {
                this.selectCountry(e.target.value);
            });
        }

        // Search functionality
        const searchInput = document.getElementById('searchInput');
        const searchBtn = document.getElementById('searchBtn');
        
        if (searchInput) {
            // Debounced search
            const debouncedSearch = this.ui.debounce((query) => {
                if (query.trim().length > 2) {
                    this.performSearch(query);
                } else if (query.trim().length === 0) {
                    this.loadTopHeadlines();
                }
            }, 500);

            searchInput.addEventListener('input', (e) => {
                debouncedSearch(e.target.value);
            });

            searchInput.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.performSearch(e.target.value);
                }
            });
        }

        if (searchBtn) {
            searchBtn.addEventListener('click', () => {
                const query = searchInput?.value || '';
                this.performSearch(query);
            });
        }

        // View toggle
        const viewButtons = document.querySelectorAll('.view-btn');
        viewButtons.forEach(btn => {
            btn.addEventListener('click', (e) => {
                const viewType = e.currentTarget.dataset.view;
                this.ui.toggleView(viewType);
            });
        });

        // Load more button
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.addEventListener('click', () => {
                this.loadMoreArticles();
            });
        }

        // Infinite scroll (optional)
        window.addEventListener('scroll', this.ui.debounce(() => {
            if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 1000) {
                if (!this.isLoading && this.hasMoreArticles) {
                    this.loadMoreArticles();
                }
            }
        }, 200));

        // Handle window resize
        window.addEventListener('resize', () => {
            if (window.innerWidth > 1024) {
                this.ui.closeSidebar();
            }
        });

        // Handle escape key to close sidebar
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                this.ui.closeSidebar();
            }
        });
    }

    /**
     * Load top headlines
     */
    async loadTopHeadlines() {
        this.resetPagination();
        this.ui.showLoading();
        this.ui.updatePageTitle('Top Headlines');
        this.ui.updateNavigation('');
        this.clearSearch();

        try {
            this.isLoading = true;
            const response = await this.newsAPI.getTopHeadlines(
                this.currentCountry, 
                this.currentCategory,
                20,
                1
            );

            if (response.articles && response.articles.length > 0) {
                this.ui.displayArticles(response.articles);
                this.hasMoreArticles = response.articles.length === 20 && response.totalResults > 20;
                
                if (this.hasMoreArticles) {
                    this.ui.showLoadMore();
                }
            } else {
                this.ui.showNoResults();
            }
        } catch (error) {
            console.error('Error loading headlines:', error);
            this.ui.showError('Failed to load headlines. Please try again.');
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Select category
     */
    async selectCategory(category) {
        if (this.currentCategory === category) return;

        this.currentCategory = category;
        this.currentQuery = '';
        this.resetPagination();
        this.ui.showLoading();
        this.ui.updateNavigation(category);
        this.clearSearch();

        const categoryName = category ? 
            category.charAt(0).toUpperCase() + category.slice(1) : 
            'Top Headlines';
        this.ui.updatePageTitle(categoryName);

        try {
            this.isLoading = true;
            const response = await this.newsAPI.getTopHeadlines(
                this.currentCountry, 
                category,
                20,
                1
            );

            if (response.articles && response.articles.length > 0) {
                this.ui.displayArticles(response.articles);
                this.hasMoreArticles = response.articles.length === 20 && response.totalResults > 20;
                
                if (this.hasMoreArticles) {
                    this.ui.showLoadMore();
                } else {
                    this.ui.hideLoadMore();
                }
            } else {
                this.ui.showNoResults();
                this.ui.hideLoadMore();
            }
        } catch (error) {
            console.error('Error loading category:', error);
            this.ui.showError(`Failed to load ${categoryName.toLowerCase()} news. Please try again.`);
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Select country
     */
    async selectCountry(country) {
        if (this.currentCountry === country) return;

        this.currentCountry = country;
        
        // If we're currently searching, don't reload
        if (this.currentQuery) {
            this.ui.showNotification('Country filter will apply to new searches.', 'info');
            return;
        }

        // Reload current view with new country
        if (this.currentCategory) {
            await this.selectCategory(this.currentCategory);
        } else {
            await this.loadTopHeadlines();
        }

        const countryName = country ? 
            document.querySelector(`option[value="${country}"]`)?.textContent || 'Selected Country' :
            'Global';
        this.ui.showNotification(`Switched to ${countryName} news.`, 'info');
    }

    /**
     * Perform search
     */
    async performSearch(query) {
        if (!query || query.trim().length === 0) {
            this.loadTopHeadlines();
            return;
        }

        this.currentQuery = query.trim();
        this.currentCategory = '';
        this.resetPagination();
        this.ui.showLoading();
        this.ui.updatePageTitle(`Search: "${this.currentQuery}"`);
        this.ui.updateNavigation('');

        try {
            this.isLoading = true;
            const response = await this.newsAPI.searchArticles(
                this.currentQuery,
                20,
                1
            );

            if (response.articles && response.articles.length > 0) {
                this.ui.displayArticles(response.articles);
                this.hasMoreArticles = response.articles.length === 20 && response.totalResults > 20;
                
                if (this.hasMoreArticles) {
                    this.ui.showLoadMore();
                } else {
                    this.ui.hideLoadMore();
                }

                this.ui.showNotification(`Found ${this.ui.formatNumber(response.totalResults)} articles.`, 'info');
            } else {
                this.ui.showNoResults();
                this.ui.hideLoadMore();
            }
        } catch (error) {
            console.error('Error searching articles:', error);
            this.ui.showError('Search failed. Please try again.');
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Load more articles
     */
    async loadMoreArticles() {
        if (this.isLoading || !this.hasMoreArticles) return;

        this.currentPage++;
        this.isLoading = true;

        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        }

        try {
            let response;

            if (this.currentQuery) {
                response = await this.newsAPI.searchArticles(
                    this.currentQuery,
                    20,
                    this.currentPage
                );
            } else {
                response = await this.newsAPI.getTopHeadlines(
                    this.currentCountry,
                    this.currentCategory,
                    20,
                    this.currentPage
                );
            }

            if (response.articles && response.articles.length > 0) {
                this.ui.displayArticles(response.articles, true);
                this.hasMoreArticles = response.articles.length === 20;
                
                if (this.hasMoreArticles) {
                    if (loadMoreBtn) {
                        loadMoreBtn.disabled = false;
                        loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Articles';
                    }
                } else {
                    this.ui.disableLoadMore();
                }
            } else {
                this.hasMoreArticles = false;
                this.ui.disableLoadMore();
            }
        } catch (error) {
            console.error('Error loading more articles:', error);
            this.ui.showError('Failed to load more articles.');
            
            if (loadMoreBtn) {
                loadMoreBtn.disabled = false;
                loadMoreBtn.innerHTML = '<i class="fas fa-plus"></i> Load More Articles';
            }
        } finally {
            this.isLoading = false;
        }
    }

    /**
     * Reset pagination
     */
    resetPagination() {
        this.currentPage = 1;
        this.hasMoreArticles = true;
        this.ui.hideLoadMore();
    }

    /**
     * Clear search input
     */
    clearSearch() {
        const searchInput = document.getElementById('searchInput');
        if (searchInput) {
            searchInput.value = '';
        }
        this.currentQuery = '';
    }

    /**
     * Handle app errors
     */
    handleError(error, context = '') {
        console.error(`Error in ${context}:`, error);
        this.ui.showError(`Something went wrong${context ? ` while ${context}` : ''}. Please try again.`);
        this.isLoading = false;
    }

    /**
     * Refresh current view
     */
    refresh() {
        if (this.currentQuery) {
            this.performSearch(this.currentQuery);
        } else if (this.currentCategory) {
            this.selectCategory(this.currentCategory);
        } else {
            this.loadTopHeadlines();
        }
    }

    /**
     * Get app state for debugging
     */
    getState() {
        return {
            currentCategory: this.currentCategory,
            currentCountry: this.currentCountry,
            currentQuery: this.currentQuery,
            currentPage: this.currentPage,
            isLoading: this.isLoading,
            hasMoreArticles: this.hasMoreArticles
        };
    }
}

// Initialize the app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.newsApp = new NewsApp();
    
    // Add some global utility functions
    window.refreshNews = () => {
        window.newsApp.refresh();
    };
    
    window.scrollToTop = () => {
        window.newsApp.ui.scrollToTop();
    };
    
    // Add keyboard shortcuts
    document.addEventListener('keydown', (e) => {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            if (searchInput) {
                searchInput.focus();
                searchInput.select();
            }
        }
        
        // F5 or Ctrl/Cmd + R to refresh
        if (e.key === 'F5' || ((e.ctrlKey || e.metaKey) && e.key === 'r')) {
            e.preventDefault();
            window.newsApp.refresh();
        }
    });
});

// Add service worker for offline support (optional)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        // Service worker can be added later for offline functionality
        console.log('Service Worker support detected');
    });
}