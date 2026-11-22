export const uk = {
  seo: {
    home: {
      title: 'Викуп авто у Харкові — AutoProfi',
      description: 'Викуп автомобілів у Харкові: оцінка за описом, огляд і гроші в день угоди.',
    },
    sell: {
      title: '...',
      description: '...',
    },
  },
  nav: [
    { label: 'Продати авто', href: '/#valuation' },
    { label: 'Купити авто', href: '/#catalog' },
    { label: 'Етапи викупу', href: '/#steps' },
    { label: 'Блог', href: '/#blog' },
  ],
  hero: {
    title: 'Викуп авто',
    titleAccent: 'у Харкові',
    text: 'Розкажіть про машину. Ми оцінимо її за описом і погодимо огляд у Харкові.',
    cta: 'Оцінити автомобіль',
    catalog: 'Авто в продажу',
  },
  steps: {
    title: 'Як усе проходить?',
    items: [
      { title: 'Заявка', text: 'Залиште номер телефону та модель автомобіля' },
      { title: 'Оцінка', text: 'Назвемо попередню ціну за описом' },
      { title: 'Огляд', text: 'Погодимо час і приїдемо на огляд' },
      { title: 'Угода', text: 'Оформимо документи та одразу виплатимо гроші' },
    ],
  },
};

export type Dictionary = typeof uk;
