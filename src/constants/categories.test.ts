import { describe, expect, it } from 'vitest'
import { DEFAULT_EXPENSE_CATEGORIES, DEFAULT_INCOME_CATEGORIES } from './categories'

describe('default categories', () => {
  it('matches the expense list from docs/spec.md section 6.1', () => {
    expect(DEFAULT_EXPENSE_CATEGORIES).toEqual([
      'Продукты',
      'Кафе и рестораны',
      'Транспорт',
      'Дом и ЖКХ',
      'Здоровье и красота',
      'Одежда и обувь',
      'Развлечения',
      'Связь и интернет',
      'Образование',
      'Подарки',
      'Путешествия',
      'Прочее',
    ])
  })

  it('matches the income list from docs/spec.md section 6.2', () => {
    expect(DEFAULT_INCOME_CATEGORIES).toEqual([
      'Зарплата',
      'Подработка/Фриланс',
      'Подарки',
      'Инвестиции',
      'Возврат долга',
      'Прочее',
    ])
  })

  it('has no duplicate names within each list', () => {
    expect(new Set(DEFAULT_EXPENSE_CATEGORIES).size).toBe(DEFAULT_EXPENSE_CATEGORIES.length)
    expect(new Set(DEFAULT_INCOME_CATEGORIES).size).toBe(DEFAULT_INCOME_CATEGORIES.length)
  })
})
