/**
 * Reusable UI Components
 * Contains all reusable component functions
 */

class UIComponents {
    constructor() {
        this.newsAPI = new NewsAPI();
    }

    /**
     * Create a news card element
     */
    createNewsCard(article) {
        const card = document.createElement('article');
        card.className = 'news-card';
        
        const imageUrl = article.urlToImage || this.newsAPI.getPlaceholderImage();
        const publishedDate = this.newsAPI.formatDate(article.publishedAt);
        const title = article.title || 'No title available';
        const description = article.description || 'No description available';
        const source = article.source?.name || 'Unknown Source';
        const url = article.url || '#';

        card.innerHTML = `
            <div class="news-card-image">
                <img src="${imageUrl}" alt="${title}" onerror="this.src='${this.newsAPI.getPlaceholderImage()}'">
            </div>
            <div class="news-card-content">
                <div class="news-card-meta">
                    <span class="news-source">${source}</span>
                    <span class="news-date">
                        <i class="fas fa-clock"></i>
                        ${publishedDate}
                    </span>
                </div>
                <h3 class="news-title">${title}</h3>
                <p class="news-description">${description}</p>
                <div class="news-card-footer">
                    <button class="read-more-btn" onclick="window.open('${url}', '_blank')">
                        Read More
                        <i class="fas fa-external-link-alt"></i>
                    </button>
                </div>
            </div>
        `;

        return card;
    }

    /**
     * Show loading spinner
     */
    showLoading() {
        const spinner = document.getElementById('loadingSpinner');
        const newsContainer = document.getElementById('newsContainer');
        const noResults = document.getElementById('noResults');
        
        if (spinner) spinner.style.display = 'flex';
        if (newsContainer) newsContainer.style.display = 'none';
        if (noResults) noResults.style.display = 'none';
    }

    /**
     * Hide loading spinner
     */
    hideLoading() {
        const spinner = document.getElementById('loadingSpinner');
        const newsContainer = document.getElementById('newsContainer');
        
        if (spinner) spinner.style.display = 'none';
        if (newsContainer) newsContainer.style.display = 'grid';
    }

    /**
     * Show no results message
     */
    showNoResults() {
        const spinner = document.getElementById('loadingSpinner');
        const newsContainer = document.getElementById('newsContainer');
        const noResults = document.getElementById('noResults');
        
        if (spinner) spinner.style.display = 'none';
        if (newsContainer) newsContainer.style.display = 'none';
        if (noResults) noResults.style.display = 'block';
    }

    /**
     * Display articles in the news container
     */
    displayArticles(articles, append = false) {
        const newsContainer = document.getElementById('newsContainer');
        
        if (!newsContainer) return;

        if (!append) {
            newsContainer.innerHTML = '';
        }

        if (!articles || articles.length === 0) {
            if (!append) {
                this.showNoResults();
            }
            return;
        }

        articles.forEach((article, index) => {
            const card = this.createNewsCard(article);
            // Add slight delay for animation effect
            setTimeout(() => {
                newsContainer.appendChild(card);
            }, index * 50);
        });

        this.hideLoading();
    }

    /**
     * Update page title
     */
    updatePageTitle(title) {
        const pageTitle = document.getElementById('pageTitle');
        if (pageTitle) {
            pageTitle.textContent = title;
        }
    }

    /**
     * Show error message
     */
    showError(message) {
        const newsContainer = document.getElementById('newsContainer');
        if (!newsContainer) return;

        newsContainer.innerHTML = `
            <div class="error-message" style="
                grid-column: 1 / -1;
                text-align: center;
                padding: 3rem;
                background: #fee2e2;
                border: 1px solid #fecaca;
                border-radius: 8px;
                color: #dc2626;
            ">
                <i class="fas fa-exclamation-triangle" style="font-size: 2rem; margin-bottom: 1rem;"></i>
                <h3>Error Loading News</h3>
                <p>${message}</p>
                <button onclick="location.reload()" style="
                    margin-top: 1rem;
                    padding: 0.5rem 1rem;
                    background: #dc2626;
                    color: white;
                    border: none;
                    border-radius: 6px;
                    cursor: pointer;
                ">
                    Try Again
                </button>
            </div>
        `;
        
        this.hideLoading();
    }

    /**
     * Toggle sidebar on mobile
     */
    toggleSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            const isOpen = sidebar.classList.contains('open');
            
            if (isOpen) {
                sidebar.classList.remove('open');
                overlay.classList.remove('active');
                document.body.style.overflow = '';
            } else {
                sidebar.classList.add('open');
                overlay.classList.add('active');
                document.body.style.overflow = 'hidden';
            }
        }
    }

    /**
     * Close sidebar
     */
    closeSidebar() {
        const sidebar = document.getElementById('sidebar');
        const overlay = document.getElementById('sidebarOverlay');
        
        if (sidebar && overlay) {
            sidebar.classList.remove('open');
            overlay.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    /**
     * Toggle view between grid and list
     */
    toggleView(viewType) {
        const newsContainer = document.getElementById('newsContainer');
        const viewButtons = document.querySelectorAll('.view-btn');
        
        if (newsContainer) {
            if (viewType === 'list') {
                newsContainer.classList.add('list-view');
            } else {
                newsContainer.classList.remove('list-view');
            }
        }

        // Update active button
        viewButtons.forEach(btn => {
            btn.classList.remove('active');
            if (btn.dataset.view === viewType) {
                btn.classList.add('active');
            }
        });
    }

    /**
     * Update navigation active state
     */
    updateNavigation(category = '') {
        const navItems = document.querySelectorAll('.nav-item');
        
        navItems.forEach(item => {
            item.classList.remove('active');
            if (item.dataset.category === category) {
                item.classList.add('active');
            }
        });
    }

    /**
     * Scroll to top smoothly
     */
    scrollToTop() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }

    /**
     * Show load more button
     */
    showLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'flex';
            loadMoreBtn.disabled = false;
        }
    }

    /**
     * Hide load more button
     */
    hideLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = 'none';
        }
    }

    /**
     * Disable load more button
     */
    disableLoadMore() {
        const loadMoreBtn = document.getElementById('loadMoreBtn');
        if (loadMoreBtn) {
            loadMoreBtn.disabled = true;
            loadMoreBtn.innerHTML = '<i class="fas fa-check"></i> All articles loaded';
        }
    }

    /**
     * Create notification toast
     */
    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'error' ? '#dc2626' : '#10b981'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1);
            z-index: 10000;
            animation: slideInRight 0.3s ease-out;
            max-width: 300px;
        `;
        
        notification.innerHTML = `
            <div style="display: flex; align-items: center; gap: 0.5rem;">
                <i class="fas fa-${type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
                <span>${message}</span>
                <button onclick="this.parentElement.parentElement.remove()" style="
                    background: none;
                    border: none;
                    color: white;
                    cursor: pointer;
                    margin-left: auto;
                    padding: 0;
                    font-size: 1.2rem;
                ">×</button>
            </div>
        `;

        document.body.appendChild(notification);

        // Auto remove after 5 seconds
        setTimeout(() => {
            if (notification.parentElement) {
                notification.remove();
            }
        }, 5000);
    }

    /**
     * Debounce function for search
     */
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    /**
     * Format number with commas
     */
    formatNumber(num) {
        return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    }

    /**
     * Truncate text with ellipsis
     */
    truncateText(text, maxLength) {
        if (text.length <= maxLength) return text;
        return text.substring(0, maxLength).trim() + '...';
    }

    /**
     * Check if element is in viewport
     */
    isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    /**
     * Add CSS animation styles dynamically
     */
    addAnimationStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes slideInRight {
                from {
                    transform: translateX(100%);
                    opacity: 0;
                }
                to {
                    transform: translateX(0);
                    opacity: 1;
                }
            }
            
            @keyframes pulse {
                0%, 100% {
                    opacity: 1;
                }
                50% {
                    opacity: 0.5;
                }
            }
            
            .loading-pulse {
                animation: pulse 2s infinite;
            }
        `;
        document.head.appendChild(style);
    }
}

// Export for use in other files
window.UIComponents = UIComponents;