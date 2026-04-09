#!/usr/bin/env node

/**
 * Screenshot Script
 *
 * Captures screenshots of the f(x) Protocol trading interface.
 * Useful for UI design review, documentation, and visual testing.
 *
 * Usage:
 *   npm run screenshot                    # Default screenshot (home page, 1920x1080)
 *   npm run screenshot -- --url=/trade   # Custom path
 *   npm run screenshot -- --width=1400   # Custom width
 *   npm run screenshot -- --mobile       # Mobile view (375x667)
 *   npm run screenshot -- --dark         # Dark mode
 */

const { chromium } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Parse command line arguments
const args = process.argv.slice(2);
const options = {
  url: '/',
  width: 1920,
  height: 1080,
  mobile: false,
  dark: false,
  output: 'screenshots',
};

for (const arg of args) {
  if (arg.startsWith('--url=')) options.url = arg.split('=')[1];
  if (arg.startsWith('--width=')) options.width = parseInt(arg.split('=')[1]);
  if (arg.startsWith('--height=')) options.height = parseInt(arg.split('=')[1]);
  if (arg.startsWith('--output=')) options.output = arg.split('=')[1];
  if (arg === '--mobile') { options.mobile = true; options.width = 375; options.height = 667; }
  if (arg === '--dark') options.dark = true;
}

async function captureScreenshot() {
  console.log('📸 Screenshot Script');
  console.log('==================');
  console.log(`URL: http://localhost:3000${options.url}`);
  console.log(`Size: ${options.width}x${options.height}`);
  console.log(`Mobile: ${options.mobile ? 'Yes' : 'No'}`);
  console.log(`Dark mode: ${options.dark ? 'Yes' : 'No'}`);
  console.log();

  // Ensure output directory exists
  if (!fs.existsSync(options.output)) {
    fs.mkdirSync(options.output, { recursive: true });
  }

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({
    viewport: { width: options.width, height: options.height },
    colorScheme: options.dark ? 'dark' : 'light',
    deviceScaleFactor: options.mobile ? 2 : 1,
  });

  const page = await context.newPage();

  // Check if dev server is running
  try {
    await page.goto('http://localhost:3000' + options.url, { waitUntil: 'networkidle' });
  } catch (error) {
    console.error('❌ Error: Could not connect to http://localhost:3000');
    console.error('   Make sure the dev server is running: npm run dev');
    await browser.close();
    process.exit(1);
  }

  // Wait a bit for any animations to complete
  await page.waitForTimeout(1000);

  // Generate filename
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-').slice(0, -5);
  const modeSuffix = options.dark ? '-dark' : '';
  const mobileSuffix = options.mobile ? '-mobile' : '';
  const filename = `fx-trade${mobileSuffix}${modeSuffix}-${timestamp}.png`;
  const filepath = path.join(options.output, filename);

  // Take screenshot
  await page.screenshot({ path: filepath, fullPage: false });

  console.log(`✅ Screenshot saved: ${filepath}`);
  console.log(`   Size: ${(await fs.promises.stat(filepath)).size} bytes`);

  await browser.close();
}

captureScreenshot().catch((error) => {
  console.error('❌ Screenshot failed:', error.message);
  process.exit(1);
});
