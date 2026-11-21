import { Component } from '@angular/core';

interface Step {
  title: string;
  text: string;
}

@Component({
  selector: 'app-steps',
  imports: [],
  templateUrl: './steps.html',
})
export class Steps {
  protected readonly steps: Step[] = [
    { title: 'Заявка', text: 'Оставьте номер телефона и модель автомобиля' },
    { title: 'Оценка', text: 'Обсудим состояние, пробег и предварительную цену' },
    { title: 'Осмотр', text: 'Встретимся в Харькове и согласуем итоговую цену' },
    { title: 'Сделка', text: 'Согласуем расчёт и оформим передачу автомобиля' },
  ];
}
