import { Component, signal } from '@angular/core';

@Component({
  selector: 'app-faq',
  imports: [],
  templateUrl: './faq.html',
})
export class Faq {
  protected readonly faqs = [
    {
      question: 'От чего зависит цена?',
      answer:
        'От модели, года, пробега и состояния. Предварительную оценку уточняем после осмотра.',
    },
    {
      question: 'Можно продать авто после ДТП?',
      answer: 'Да. Оценим с учётом повреждений и согласуем условия после осмотра.',
    },
    {
      question: 'Где проходит осмотр?',
      answer: 'В Харькове, в удобное для вас время и место, которое согласуем заранее.',
    },
  ];

  protected readonly openIndex = signal<number | null>(0);

  protected toggle(index: number) {
    this.openIndex.update((current) => (current === index ? null : index));
  }
}
