import { chromium, devices } from 'playwright'

const BASE_URL = 'http://localhost:4173/my-budget/'
const CHROME_PATH = '/opt/pw-browsers/chromium-1194/chrome-linux/chrome'

function assert(condition, message) {
  if (!condition) throw new Error(`Assertion failed: ${message}`)
}

const browser = await chromium.launch({ executablePath: CHROME_PATH })

try {
  const context = await browser.newContext({ ...devices['iPhone 13'] })
  const page = await context.newPage()
  await page.goto(BASE_URL, { waitUntil: 'networkidle' })

  assert(
    (await page.title()).includes('Мой бюджет'),
    'app shell should load under the subpath',
  )
  console.log('✓ App loads correctly at /my-budget/')

  assert(
    await page.getByText('Баланс месяца').isVisible(),
    'balance bar should render under the subpath',
  )
  console.log('✓ App UI renders correctly (balance bar visible)')

  const swState = await page.evaluate(async () => {
    const registration = await navigator.serviceWorker.ready
    return registration.active?.state ?? null
  })
  assert(
    swState === 'activated',
    `service worker should activate under the subpath, got: ${swState}`,
  )
  console.log('✓ Service worker registers and activates under the subpath scope')

  await context.close()
} finally {
  await browser.close()
}

console.log('\nGitHub Pages base-path build verified successfully.')
