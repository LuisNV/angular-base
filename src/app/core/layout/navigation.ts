import type { VtoMenubarGroup } from '@vietinbank/vietinone-ui';

export const NAVIGATION: VtoMenubarGroup[] = [
  {
    id: 'main',
    items: [
      { id: 'home', label: 'Trang chủ', symbol: 'home' },
      { id: 'listening', label: 'Luyện nghe', symbol: 'headphones' },
      { id: 'vocabulary', label: 'Từ vựng', symbol: 'menu_book' },
      { id: 'grammar', label: 'Ngữ pháp', symbol: 'layers' },
      { id: 'lessons', label: 'Bài học', symbol: 'article' },
      { id: 'review', label: 'Ôn tập', symbol: 'sync' },
      { id: 'progress', label: 'Tiến độ', symbol: 'monitoring' },
      { id: 'profile', label: 'Cá nhân', symbol: 'person' },
    ],
  },
];
