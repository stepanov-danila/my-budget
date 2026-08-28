import { chromium, devices } from 'playwright'

const BASE_URL = 'http://localhost:4173'

const browser = await chromium.launch({
  executablePath: '/opt/pw-browsers/chromium-1194/chrome-linux/chrome',
})

try {
  const context = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await context.newPage()

  await page.goto(BASE_URL, { waitUntil: 'networkidle' })
  await page.waitForFunction(() => document.title.includes('Мой бюджет'))
  console.log('✓ App loaded on a mobile viewport')

  // Wait for the service worker to install and activate.
  const swState = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready
    return registration.active?.state ?? null
  })
  if (swState !== 'activated') {
    throw new Error(`Expected service worker to be activated, got: ${swState}`)
  }
  console.log('✓ Service worker registered and activated')

  // Add a category with an amount so we have data to check for after reload.
  await page.getByRole('button', { name: '+ Добавить категорию' }).click()
  await page.getByRole('option', { name: 'Продукты' }).click()
  await page.getByLabel('Сумма, вручную').fill('12400')
  await page.getByLabel('Сумма, вручную').blur()
  await page.waitForFunction(
    () =>
      document.body.textContent?.includes('12') &&
      document.body.textContent?.includes('400'),
  )
  console.log('✓ Category added while online')

  await context.setOffline(true)
  await page.reload({ waitUntil: 'networkidle' })

  const title = await page.title()
  if (!title.includes('Мой бюджет')) {
    throw new Error(`App shell did not load offline, title was: ${title}`)
  }
  console.log('✓ App shell loads offline (service worker cache)')

  const bodyText = await page.evaluate(() => document.body.textContent ?? '')
  if (!bodyText.includes('Продукты')) {
    throw new Error('Previously entered category data was not available offline')
  }
  console.log('✓ Previously entered data is still available offline (localStorage)')

  await context.setOffline(false)
  await context.close()
} finally {
  await browser.close()
}

console.log('\nAll offline PWA checks passed.')
