import { blogService } from '@/lib/blogService';
import HeroVideo from './hero/HeroVideo';
import HeroStatic from './hero/HeroStatic';
import HeroSlideshow from './hero/HeroSlideshow';
import HeroNews from './hero/HeroNews';

export default async function Hero({ settings }) {
    const template = settings?.hero?.template || 'static';

    // Fetch news if needed
    let newsPosts = [];
    if (template === 'news') {
        const allPosts = await blogService.getAllPosts();
        const count = settings?.hero?.newsCount || 3;
        newsPosts = allPosts
            .filter(p => p.status === 'published')
            .slice(0, count);
    }

    switch (template) {
        case 'video':
            return <HeroVideo settings={settings} />;
        case 'slideshow':
            return <HeroSlideshow settings={settings} />;
        case 'news':
            return <HeroNews settings={settings} posts={newsPosts} />;
        case 'static':
        default:
            return <HeroStatic settings={settings} />;
    }
}
