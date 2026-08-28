import { chromium, devices } from 'playwright'

const BASE_URL = 'http://localhost:4173'
const CHROME_PATH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`)
}

const browser = await chromium.launch({ executablePath: CHROME_PATH })

try {
  const context = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await context.newPage()
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })
  console.log('✓ App loaded on a mobile viewport (iPhone 13 emulation)')

  // --- Month management ---
  const firstMonthTab = page
    .getByRole('button', { name: /^\p{Lu}\p{Ll}+ \d{4}$/u })
    .first()
  await assert(await firstMonthTab.isVisible(), 'initial month tab should be visible')
  const firstMonthName = await firstMonthTab.textContent()

  await page.getByLabel('Добавить месяц').click()
  await page.getByRole('menuitem', { name: 'Начать с пустого месяца' }).click()
  const monthTabs = page.locator('nav[aria-label="Месяцы"] button[aria-current]')
  const newMonthName = await monthTabs.first().textContent()
  assert(newMonthName !== firstMonthName, 'a new month tab should become active')
  console.log(`✓ Added a new empty month (${newMonthName}) and it became active`)

  await page.getByRole('button', { name: firstMonthName, exact: true }).click()
  assert(
    (await page
      .getByRole('button', { name: firstMonthName, exact: true })
      .getAttribute('aria-current')) === 'true',
    'switching tabs should change the active month',
  )
  console.log('✓ Switched back to the original month')

  // --- Category management + amount entry ---
  await page.getByRole('button', { name: '+ Добавить категорию' }).click()
  await page.getByRole('option', { name: 'Продукты' }).click()
  await page.getByLabel('Сумма, вручную').fill('5000')
  console.log('✓ Added "Продукты" from defaults and set its amount manually to 5000')

  await page.getByRole('button', { name: '+ Добавить категорию' }).click()
  await page.getByPlaceholder('Своё название').fill('Ипотека')
  await page.getByRole('button', { name: 'Добавить', exact: true }).click()
  const sliders = page.getByLabel('Сумма, слайдер')
  await sliders.nth(1).fill('12000')
  console.log('✓ Added "Ипотека" manually and set its amount via the slider to 12000')

  const rowNames = await page
    .locator('ul[aria-label="Список категорий"] li')
    .allTextContents()
  assert(rowNames[0].includes('Ипотека'), 'the higher-amount category should sort first')
  console.log('✓ Categories are sorted by amount descending (Ипотека above Продукты)')

  const balance = await page.getByTestId('balance-difference').textContent()
  assert(
    balance?.includes('17'),
    `balance should reflect -17000 expenses, got: ${balance}`,
  )
  console.log(`✓ Balance bar reflects the entered amounts (${balance?.trim()})`)

  // --- Chart ---
  assert(
    await page.getByTestId('category-chart').isVisible(),
    'chart should render once categories have amounts',
  )
  console.log('✓ Category breakdown chart is visible')

  // --- Delete + undo ---
  await page.getByLabel('Удалить категорию Продукты').click()
  await page.getByText('Категория «Продукты» удалена').waitFor({ state: 'visible' })
  console.log('✓ Undo toast appeared after deleting a category')
  await page.getByRole('button', { name: 'Отменить' }).click()
  assert(
    (await page.locator('ul[aria-label="Список категорий"] li').count()) === 2,
    'category should be restored after Undo',
  )
  console.log('✓ Deleted a category and restored it via Undo')

  // --- Theme switching ---
  await page.getByLabel('Включить тёмную тему').click()
  const isDark = await page.evaluate(() =>
    document.documentElement.classList.contains('dark'),
  )
  assert(isDark, 'html element should carry the dark class after toggling theme')
  console.log('✓ Switched to dark theme')

  // --- Month deletion with confirmation ---
  await page.getByLabel(`Удалить ${newMonthName}`).click()
  await page.getByRole('button', { name: 'Отмена' }).click()
  assert(
    await page.getByRole('button', { name: newMonthName, exact: true }).isVisible(),
    'cancelling deletion should keep the month',
  )
  await page.getByLabel(`Удалить ${newMonthName}`).click()
  await page.getByRole('alertdialog').getByRole('button', { name: 'Удалить' }).click()
  assert(
    (await page.getByRole('button', { name: newMonthName, exact: true }).count()) === 0,
    'confirming deletion should remove the month',
  )
  console.log('✓ Cancelled one month deletion, then confirmed another')

  // --- PWA install + offline ---
  const swState = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready
    return registration.active?.state ?? null
  })
  assert(swState === 'activated', `service worker should be activated, got: ${swState}`)

  await context.setOffline(true)
  await page.reload({ waitUntil: 'networkidle' })
  assert((await page.title()).includes('Мой бюджет'), 'app shell should load offline')
  const offlineBody = await page.evaluate(() => document.body.textContent ?? '')
  assert(
    offlineBody.includes('Ипотека'),
    'previously entered data should survive offline reload',
  )
  assert(
    await page.evaluate(() => document.documentElement.classList.contains('dark')),
    'theme choice should survive offline reload',
  )
  console.log('✓ App works offline as an installed PWA, with data and theme intact')

  await context.setOffline(false)
  await context.close()
} finally {
  await browser.close()
}

console.log('\nFull end-to-end flow verified successfully.')
