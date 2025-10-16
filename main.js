// حكايات التاريخ - ملف JavaScript الرئيسي
// وظائف تفاعلية شاملة للمنصة التاريخية العربية

class ArabicHistoricalPlatform {
    constructor() {
        this.init();
        this.setupEventListeners();
        this.initializeComponents();
    }

    init() {
        // تهيئة المتغيرات الأساسية
        this.stories = [];
        this.discussions = [];
        this.polls = new Map();
        this.userVotes = new Map();
        
        // حالة الرسوم المتحركة والتأثيرات
        this.scrollAnimations = true;
        this.hoverEffects = true;
        
        console.log('تم تهيئة منصة حكايات التاريخ');
    }

    setupEventListeners() {
        // تحميل محتوى DOM
        document.addEventListener('DOMContentLoaded', () => {
            this.initializePage();
        });

        // الرسوم المتحركة عند التمرير
        window.addEventListener('scroll', () => {
            if (this.scrollAnimations) {
                this.handleScrollAnimations();
            }
        });

        // معالجة تغيير الحجم
        window.addEventListener('resize', () => {
            this.handleResize();
        });
    }

    initializePage() {
        const currentPage = this.getCurrentPage();
        
        switch (currentPage) {
            case 'index':
                this.initializeHomePage();
                break;
            case 'articles':
                this.initializeArticlesPage();
                break;
            case 'commentary':
                this.initializeCommentaryPage();
                break;
        }
    }

    getCurrentPage() {
        const path = window.location.pathname;
        if (path.includes('articles.html')) return 'articles';
        if (path.includes('commentary.html')) return 'commentary';
        return 'index';
    }

    // تهيئة الصفحة الرئيسية
    initializeHomePage() {
        this.initializeHeroAnimations();
        this.initializeFeaturedStories();
        this.initializePollSystem();
        this.initializeScrollReveal();
    }

    initializeHeroAnimations() {
        // تحريك عناصر البطل
        const heroElements = document.querySelectorAll('.reveal-text');
        
        anime({
            targets: heroElements,
            opacity: [0, 1],
            translateY: [30, 0],
            delay: anime.stagger(200, {start: 500}),
            duration: 800,
            easing: 'easeOutCubic'
        });

        // تأثيرات مرور خيارات التصويت
        const voteOptions = document.querySelectorAll('.vote-option');
        voteOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                this.handlePollVote(e.currentTarget);
            });
        });
    }

    initializeFeaturedStories() {
        // تهيئة عرض القصص المميز
        if (typeof Splide !== 'undefined') {
            const splide = new Splide('#featured-stories', {
                type: 'loop',
                perPage: 3,
                perMove: 1,
                gap: '2rem',
                autoplay: true,
                interval: 5000,
                pauseOnHover: true,
                direction: 'rtl', // دعم RTL
                breakpoints: {
                    1024: { perPage: 2 },
                    640: { perPage: 1 }
                }
            });
            
            splide.mount();
        }

        // تأثيرات مرور بطاقات القصص
        const storyCards = document.querySelectorAll('.story-card');
        storyCards.forEach(card => {
            card.addEventListener('mouseenter', () => {
                if (this.hoverEffects) {
                    anime({
                        targets: card,
                        scale: 1.02,
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                }
            });

            card.addEventListener('mouseleave', () => {
                if (this.hoverEffects) {
                    anime({
                        targets: card,
                        scale: 1,
                        duration: 300,
                        easing: 'easeOutCubic'
                    });
                }
            });
        });
    }

    // تهيئة صفحة المقالات
    initializeArticlesPage() {
        this.initializeStoryFilters();
        this.initializeSearch();
        this.initializeStoryEditor();
        this.loadStories();
    }

    initializeStoryFilters() {
        const filterButtons = document.querySelectorAll('.filter-button');
        
        filterButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                // إزالة الفئة النشطة من جميع الأزرار
                filterButtons.forEach(btn => btn.classList.remove('active'));
                
                // إضافة الفئة النشطة للزر المclicked
                e.target.classList.add('active');
                
                // تصفية القصص
                const category = e.target.dataset.category;
                this.filterStories(category);
            });
        });
    }

    initializeSearch() {
        const searchInput = document.getElementById('search-input');
        if (searchInput) {
            searchInput.addEventListener('input', (e) => {
                this.searchStories(e.target.value);
            });
        }
    }

    initializeStoryEditor() {
        const newStoryBtn = document.getElementById('new-story-btn');
        const storyModal = document.getElementById('story-modal');
        const closeModal = document.getElementById('close-modal');
        const storyForm = document.getElementById('story-form');

        if (newStoryBtn && storyModal) {
            newStoryBtn.addEventListener('click', () => {
                this.showModal(storyModal);
            });
        }

        if (closeModal && storyModal) {
            closeModal.addEventListener('click', () => {
                this.hideModal(storyModal);
            });
        }

        if (storyForm) {
            storyForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleStorySubmission(e);
            });

            // وظيفة حفظ المسودة
            const saveDraftBtn = document.getElementById('save-draft');
            if (saveDraftBtn) {
                saveDraftBtn.addEventListener('click', () => {
                    this.saveStoryDraft();
                });
            }
        }
    }

    // تهيئة صفحة النقاش
    initializeCommentaryPage() {
        this.initializePollingSystem();
        this.initializeDiscussionThreads();
        this.initializeTrendingTopics();
        this.initializeCommunityStats();
    }

    initializePollingSystem() {
        const voteOptions = document.querySelectorAll('.vote-option');
        
        voteOptions.forEach(option => {
            option.addEventListener('click', (e) => {
                this.handlePollVote(e.currentTarget);
            });
        });

        // تهيئة بيانات التصويت
        this.initializePollData();
    }

    initializeDiscussionThreads() {
        const newDiscussionBtn = document.getElementById('new-discussion-btn');
        const discussionModal = document.getElementById('discussion-modal');
        const closeDiscussionModal = document.getElementById('close-discussion-modal');
        const discussionForm = document.getElementById('discussion-form');

        if (newDiscussionBtn && discussionModal) {
            newDiscussionBtn.addEventListener('click', () => {
                this.showModal(discussionModal);
            });
        }

        if (closeDiscussionModal && discussionModal) {
            closeDiscussionModal.addEventListener('click', () => {
                this.hideModal(discussionModal);
            });
        }

        if (discussionForm) {
            discussionForm.addEventListener('submit', (e) => {
                e.preventDefault();
                this.handleDiscussionSubmission(e);
            });
        }

        // أزرار التصويت
        const voteButtons = document.querySelectorAll('.vote-button');
        voteButtons.forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleVote(e.currentTarget);
            });
        });
    }

    initializeTrendingTopics() {
        const trendingTopics = document.querySelectorAll('.trending-topic');
        
        trendingTopics.forEach(topic => {
            topic.addEventListener('click', (e) => {
                this.handleTrendingTopicClick(e.currentTarget);
            });
        });
    }

    // نظام التصويت
    handlePollVote(optionElement) {
        const pollId = optionElement.dataset.poll;
        const optionValue = optionElement.dataset.option;
        
        // التحقق إذا كان المستخدم قد صوت بالفعل
        const voteKey = `${pollId}-${optionValue}`;
        if (this.userVotes.has(voteKey)) {
            this.showNotification('لقد صوت بالفعل في هذا الاستطلاع!', 'warning');
            return;
        }

        // تسجيل التصويت
        this.userVotes.set(voteKey, true);
        
        // تحديث واجهة المستخدم
        optionElement.classList.add('voted');
        
        // تحريك تسجيل التصويت
        anime({
            targets: optionElement,
            scale: [1, 1.05, 1],
            duration: 400,
            easing: 'easeOutCubic'
        });

        // تحديث نتائج التصويت
        this.updatePollResults(pollId, optionValue);
        
        // إظهار رسالة النجاح
        this.showNotification('تم تسجيل تصويتك!', 'success');
    }

    updatePollResults(pollId, selectedOption) {
        // محاكاة تحديثات التصويت الفورية
        const pollContainer = document.querySelector(`[data-poll="${pollId}"]`).closest('#poll-container');
        if (!pollContainer) return;

        const options = pollContainer.querySelectorAll('.vote-option');
        
        options.forEach(option => {
            const progressBar = option.querySelector('.h-2 > div');
            const percentageSpan = option.querySelector('span:last-child');
            
            if (progressBar && percentageSpan) {
                // محاكاة النسب المحدثة
                const currentPercentage = parseInt(percentageSpan.textContent);
                const newPercentage = selectedOption === option.dataset.option ? 
                    Math.min(currentPercentage + 1, 100) : 
                    Math.max(currentPercentage - 1, 0);
                
                // تحريك تغيير النسبة
                anime({
                    targets: progressBar,
                    width: `${newPercentage}%`,
                    duration: 1000,
                    easing: 'easeOutCubic'
                });

                percentageSpan.textContent = `${newPercentage}%`;
            }
        });
    }

    // إدارة القصص
    filterStories(category) {
        const stories = document.querySelectorAll('.story-card');
        
        stories.forEach(story => {
            const storyCategory = story.dataset.category;
            
            if (category === 'all' || storyCategory === category) {
                story.style.display = 'block';
                anime({
                    targets: story,
                    opacity: [0, 1],
                    translateY: [20, 0],
                    duration: 400,
                    easing: 'easeOutCubic'
                });
            } else {
                anime({
                    targets: story,
                    opacity: [1, 0],
                    translateY: [0, -20],
                    duration: 300,
                    easing: 'easeOutCubic',
                    complete: () => {
                        story.style.display = 'none';
                    }
                });
            }
        });
    }

    searchStories(query) {
        const stories = document.querySelectorAll('.story-card');
        const searchTerm = query.toLowerCase();
        
        stories.forEach(story => {
            const title = story.querySelector('h3').textContent.toLowerCase();
            const summary = story.querySelector('p').textContent.toLowerCase();
            
            if (title.includes(searchTerm) || summary.includes(searchTerm)) {
                story.style.display = 'block';
            } else {
                story.style.display = 'none';
            }
        });
    }

    handleStorySubmission(form) {
        const formData = new FormData(form);
        const storyData = {
            title: document.getElementById('story-title').value,
            category: document.getElementById('story-category').value,
            summary: document.getElementById('story-summary').value,
            content: document.getElementById('story-content').value,
            timestamp: new Date().toISOString()
        };

        // التحقق من صحة النموذج
        if (!storyData.title || !storyData.content) {
            this.showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        // محاكاة إنشاء القصة
        this.createStory(storyData);
        
        // إغلاق النافذة وإعادة تعيين النموذج
        const modal = document.getElementById('story-modal');
        this.hideModal(modal);
        form.reset();
        
        this.showNotification('تم نشر القصة بنجاح!', 'success');
    }

    createStory(storyData) {
        // إضافة إلى مصفوفة القصص
        this.stories.unshift(storyData);
        
        // إنشاء عنصر القصص وإضافته إلى الشبكة
        const storiesGrid = document.getElementById('stories-grid');
        if (storiesGrid) {
            const storyElement = this.createStoryElement(storyData);
            storiesGrid.insertBefore(storyElement, storiesGrid.firstChild);
            
            // تحريك القصص الجديدة
            anime({
                targets: storyElement,
                opacity: [0, 1],
                translateY: [-50, 0],
                duration: 600,
                easing: 'easeOutCubic'
            });
        }
    }

    createStoryElement(story) {
        const storyDiv = document.createElement('article');
        storyDiv.className = 'story-card bg-white rounded-xl shadow-lg overflow-hidden';
        storyDiv.dataset.category = story.category;
        
        storyDiv.innerHTML = `
            <img src="resources/article-${story.category}.jpg" alt="${story.title}" class="w-full h-48 object-cover">
            <div class="p-6">
                <div class="flex items-center mb-3">
                    <span class="bg-blue-100 text-blue-800 text-xs font-semibold px-2.5 py-0.5 rounded">${this.getCategoryLabel(story.category)}</span>
                    <span class="text-gray-500 text-sm mr-3">${this.calculateReadTime(story.content)} دقيقة قراءة</span>
                </div>
                <h3 class="text-xl font-bold text-gray-900 mb-3 text-right">${story.title}</h3>
                <p class="text-gray-600 mb-4 text-right">${story.summary}</p>
                <div class="flex items-center justify-between">
                    <div class="flex items-center">
                        <img src="resources/user-avatar1.jpg" alt="الكاتب" class="w-8 h-8 rounded-full ml-3">
                        <span class="text-sm text-gray-500">أنت</span>
                    </div>
                    <span class="text-sm text-gray-500">الآن</span>
                </div>
            </div>
        `;
        
        return storyDiv;
    }

    // إدارة النقاشات
    handleDiscussionSubmission(form) {
        const discussionData = {
            title: document.getElementById('discussion-title').value,
            topic: document.getElementById('discussion-topic').value,
            content: document.getElementById('discussion-content').value,
            author: 'أنت',
            timestamp: new Date().toISOString(),
            votes: { up: 0, down: 0 },
            replies: 0
        };

        // التحقق من صحة النموذج
        if (!discussionData.title || !discussionData.content) {
            this.showNotification('يرجى ملء جميع الحقول المطلوبة', 'error');
            return;
        }

        // إنشاء النقاش
        this.createDiscussion(discussionData);
        
        // إغلاق النافذة وإعادة تعيين النموذج
        const modal = document.getElementById('discussion-modal');
        this.hideModal(modal);
        form.reset();
        
        this.showNotification('تم بدء النقاش بنجاح!', 'success');
    }

    createDiscussion(discussionData) {
        const discussionsContainer = document.getElementById('discussion-threads');
        if (discussionsContainer) {
            const discussionElement = this.createDiscussionElement(discussionData);
            discussionsContainer.insertBefore(discussionElement, discussionsContainer.firstChild);
            
            // تحريك النقاش الجديد
            anime({
                targets: discussionElement,
                opacity: [0, 1],
                translateY: [-30, 0],
                duration: 500,
                easing: 'easeOutCubic'
            });
        }
    }

    createDiscussionElement(discussion) {
        const discussionDiv = document.createElement('div');
        discussionDiv.className = 'comment-card border border-gray-200 rounded-lg p-4';
        
        discussionDiv.innerHTML = `
            <div class="flex items-start space-x-4">
                <img src="resources/user-avatar1.jpg" alt="أنت" class="w-10 h-10 rounded-full">
                <div class="flex-1">
                    <div class="flex items-center space-x-2 mb-2">
                        <h4 class="font-semibold text-gray-900">أنت</h4>
                        <span class="text-sm text-gray-500">مشارك نشط</span>
                        <span class="text-sm text-gray-500">• الآن</span>
                    </div>
                    <h3 class="font-semibold text-gray-900 mb-2 text-right">${discussion.title}</h3>
                    <p class="text-gray-700 mb-3 text-right">${discussion.content}</p>
                    <div class="flex items-center space-x-4 text-sm text-gray-500">
                        <button class="vote-button flex items-center space-x-1 hover:text-green-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 15l7-7 7 7"></path>
                            </svg>
                            <span>٠</span>
                        </button>
                        <button class="vote-button flex items-center space-x-1 hover:text-red-600">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7"></path>
                            </svg>
                            <span>٠</span>
                        </button>
                        <button class="hover:text-blue-600">رد</button>
                        <span>٠ رداً</span>
                    </div>
                </div>
            </div>
        `;
        
        return discussionDiv;
    }

    handleVote(button) {
        const isUpvote = button.querySelector('svg path').getAttribute('d').includes('M5 15l7-7');
        const counter = button.querySelector('span');
        let currentCount = parseInt(counter.textContent);
        
        // تبديل حالة التصويت
        if (button.classList.contains('upvoted') || button.classList.contains('downvoted')) {
            button.classList.remove('upvoted', 'downvoted');
            counter.textContent = isUpvote ? currentCount - 1 : currentCount + 1;
        } else {
            button.classList.add(isUpvote ? 'upvoted' : 'downvoted');
            counter.textContent = isUpvote ? currentCount + 1 : currentCount - 1;
        }

        // تحريك التصويت
        anime({
            targets: button,
            scale: [1, 1.2, 1],
            duration: 300,
            easing: 'easeOutCubic'
        });
    }

    // الرسوم المتحركة عند التمرير
    handleScrollAnimations() {
        const elements = document.querySelectorAll('.story-card, .comment-card, .trending-topic');
        
        elements.forEach(element => {
            const rect = element.getBoundingClientRect();
            const isVisible = rect.top < window.innerHeight * 0.8;
            
            if (isVisible && !element.classList.contains('animated')) {
                element.classList.add('animated');
                
                anime({
                    targets: element,
                    opacity: [0, 1],
                    translateY: [30, 0],
                    duration: 600,
                    easing: 'easeOutCubic',
                    delay: Math.random() * 200
                });
            }
        });
    }

    initializeScrollReveal() {
        // الكشف الأولي للعناصر في منفذ العرض
        setTimeout(() => {
            this.handleScrollAnimations();
        }, 500);
    }

    // وظائف المساعدة
    showModal(modal) {
        if (modal) {
            modal.classList.remove('hidden');
            
            anime({
                targets: modal.querySelector('.bg-white'),
                scale: [0.8, 1],
                opacity: [0, 1],
                duration: 300,
                easing: 'easeOutCubic'
            });
        }
    }

    hideModal(modal) {
        if (modal) {
            anime({
                targets: modal.querySelector('.bg-white'),
                scale: [1, 0.8],
                opacity: [1, 0],
                duration: 200,
                easing: 'easeOutCubic',
                complete: () => {
                    modal.classList.add('hidden');
                }
            });
        }
    }

    showNotification(message, type = 'info') {
        // إنشاء عنصر الإشعار
        const notification = document.createElement('div');
        notification.className = `fixed top-20 left-4 z-50 px-6 py-4 rounded-lg shadow-lg text-white ${
            type === 'success' ? 'bg-green-600' :
            type === 'error' ? 'bg-red-600' :
            type === 'warning' ? 'bg-yellow-600' : 'bg-blue-600'
        }`;
        
        notification.textContent = message;
        document.body.appendChild(notification);
        
        // تحريك الدخول
        anime({
            targets: notification,
            translateX: [-300, 0],
            opacity: [0, 1],
            duration: 300,
            easing: 'easeOutCubic'
        });
        
        // إزالة تلقائية بعد 3 ثواني
        setTimeout(() => {
            anime({
                targets: notification,
                translateX: [0, -300],
                opacity: [1, 0],
                duration: 300,
                easing: 'easeOutCubic',
                complete: () => {
                    document.body.removeChild(notification);
                }
            });
        }, 3000);
    }

    getCategoryLabel(category) {
        const labels = {
            'islamic': 'العصر الإسلامي',
            'scientists': 'العلماء العرب',
            'cultural': 'التراث الثقافي',
            'leaders': 'القادة العظماء',
            'healthcare': 'الطب العربي'
        };
        return labels[category] || 'عام';
    }

    calculateReadTime(content) {
        const wordsPerMinute = 200;
        const wordCount = content.split(' ').length;
        return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
    }

    handleTrendingTopicClick(topic) {
        const topicName = topic.querySelector('h4').textContent;
        this.showNotification(`تصفية النقاشات حسب: ${topicName}`, 'info');
        
        // محاكاة التصفية (في التطبيق الفعلي، هذا سيقوم بتصفية النقاشات)
        anime({
            targets: topic,
            backgroundColor: ['#ffffff', '#f3f4f6', '#ffffff'],
            duration: 600,
            easing: 'easeOutCubic'
        });
    }

    handleResize() {
        // معالجة التعديلات التفاعلية
        const isMobile = window.innerWidth < 768;
        
        if (isMobile) {
            // تعديل الرسوم المتحركة للجوال
            this.scrollAnimations = false;
        } else {
            this.scrollAnimations = true;
        }
    }

    initializeComponents() {
        // تهيئة أي مكونات إضافية
        this.initializeLoadMoreButtons();
        this.initializeNewsletterSignup();
    }

    initializeLoadMoreButtons() {
        const loadMoreBtns = document.querySelectorAll('#load-more, #load-more-discussions');
        
        loadMoreBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleLoadMore(e.target);
            });
        });
    }

    handleLoadMore(button) {
        // محاكاة تحميل المزيد من المحتوى
        button.textContent = 'جاري التحميل...';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = 'تحميل المزيد';
            button.disabled = false;
            this.showNotification('تم تحميل المزيد من المحتوى!', 'success');
        }, 1500);
    }

    initializeNewsletterSignup() {
        const newsletterForm = document.querySelector('input[type="email"]');
        if (newsletterForm) {
            newsletterForm.addEventListener('keypress', (e) => {
                if (e.key === 'Enter') {
                    e.preventDefault();
                    this.handleNewsletterSignup(e.target.value);
                }
            });
        }
    }

    handleNewsletterSignup(email) {
        if (email && email.includes('@')) {
            this.showNotification('شكراً لاشتراكك!', 'success');
        } else {
            this.showNotification('يرجى إدخال بريد إلكتروني صالح', 'error');
        }
    }

    // تهيئة بيانات التصويت
    initializePollData() {
        this.polls.set('islamic-achievements', {
            options: {
                'science': { votes: 52, percentage: 52 },
                'architecture': { votes: 28, percentage: 28 },
                'literature': { votes: 20, percentage: 20 }
            },
            totalVotes: 4213,
            active: true
        });
    }

    // تحميل القصص (محاكاة)
    loadStories() {
        // هذا عادةً ما يكون من API
        this.stories = [
            {
                title: 'العصر الإسلامي الذهبي: إنجازات غيرت مسيرة التاريخ',
                category: 'islamic',
                summary: 'اكتشف كيف أثرت الحضارة الإسلامية في تطور العلم والفلسفة والطب...',
                content: 'محتوى القصص التفصيلي...',
                author: 'د. أحمد الزهراوي',
                timestamp: new Date().toISOString()
            }
        ];
    }
}

// تهيئة المنصة عند تحميل DOM
document.addEventListener('DOMContentLoaded', () => {
    new ArabicHistoricalPlatform();
});

// تصدير للاستخدام كوحدة نمطية
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ArabicHistoricalPlatform;
}