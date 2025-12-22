import { BlogPost } from './types';

export const posts: BlogPost[] = [
  {
    id: 1,
    title: 'Welcome to the MatchMakers Blog!',
    preview: 'A new era of hiring and tech talent matchmaking begins here.',
    content: 'This is your first blog post. Start sharing your insights with the world!',
    image: '',
    date: new Date().toISOString().substring(0, 10)
  },
  // Add more posts here
];
