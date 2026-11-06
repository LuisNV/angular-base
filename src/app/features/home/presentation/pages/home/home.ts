import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';

interface Lesson { title: string; category: string; icon: string; minutes: number; image: string; alt: string; }
const palace = 'https://images.unsplash.com/photo-1508804185872-d7badad00f7d?w=400&auto=format&fit=crop&q=80';
const street = 'https://images.unsplash.com/photo-1513326738677-b964603b136d?w=400&auto=format&fit=crop&q=80';
const writing = 'https://images.unsplash.com/photo-1455390582262-044cdead277a?w=400&auto=format&fit=crop&q=80';

@Component({ selector: 'app-home', templateUrl: './home.html', styleUrl: './home.scss', changeDetection: ChangeDetectionStrategy.OnPush })
export class Home {
  readonly currentSlide = signal(0);
  readonly selectedCategory = signal('');
  readonly showProgress = signal(false);
  readonly activeLesson = signal<Lesson | null>(null);
  readonly slides = [
    { id: 1, title: 'Học tiếng Trung qua luyện nghe', subtitle: 'Mỗi ngày nghe một chút, tiến bộ mỗi ngày.' },
    { id: 2, title: 'Tập luyện mỗi ngày', subtitle: 'Sự kiên trì là chìa khóa thành công.' },
    { id: 3, title: 'Tiến bộ mỗi tuần', subtitle: 'Chinh phục HSK 1 cùng TingTing nhé!' },
  ];
  readonly features = [
    { name: 'Luyện nghe', category: 'Nghe hiểu', icon: 'headphones', color: 'blue', description: 'Nghe và hiểu hội thoại' },
    { name: 'Từ vựng', category: 'Từ vựng', icon: 'menu_book', color: 'purple', description: 'Học và ghi nhớ từ mới' },
    { name: 'Ngữ pháp', category: 'Ngữ pháp', icon: 'layers', color: 'orange', description: 'Nắm vững cấu trúc' },
    { name: 'Ôn tập', category: 'Ôn tập', icon: 'event_available', color: 'green', description: 'Củng cố kiến thức' },
  ];
  readonly lessons: Lesson[] = [
    { title: 'Bài 4: Ở nhà hàng', category: 'Nghe hiểu', icon: 'headphones', minutes: 10, image: palace, alt: 'Kiến trúc cung điện Trung Hoa' },
    { title: 'Bài 5: Mua sắm', category: 'Từ vựng', icon: 'menu_book', minutes: 12, image: street, alt: 'Con phố mua sắm' },
    { title: 'Bài 6: Hỏi đường', category: 'Ngữ pháp', icon: 'layers', minutes: 15, image: writing, alt: 'Sổ tay học ngôn ngữ' },
  ];
  readonly filteredLessons = computed(() => this.lessons.filter(lesson => !this.selectedCategory() || lesson.category === this.selectedCategory()));
  readonly days = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  readonly suggestions = [
    { title: 'Lộ trình HSK 1 cho người mới', image: palace, category: '' },
    { title: '100 từ vựng thông dụng nhất', image: street, category: 'Từ vựng' },
    { title: 'Luyện nghe theo chủ đề hằng ngày', image: palace, category: 'Nghe hiểu' },
  ];
  goToSlide(index: number) { if (index >= 0 && index < this.slides.length) this.currentSlide.set(index); }
  nextSlide() { this.currentSlide.update(i => (i + 1) % this.slides.length); }
  prevSlide() { this.currentSlide.update(i => (i + this.slides.length - 1) % this.slides.length); }
}
