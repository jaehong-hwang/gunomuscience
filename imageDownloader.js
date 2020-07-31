const playwright = require('playwright')
const download = require('image-downloader')

let browser, context, page

const initialBrowser = async () => {
  browser = await playwright['chromium'].launch()
  context = await browser.newContext()
  page = await context.newPage()

  await page.goto('https://www.google.com')

  await page.focus('[name=q]')
  await page.fill('[name=q]', '1')
  await page.keyboard.press('Enter')

  let imageMenu = await findImageMenuFrom(page, '.hdtb-mitem.hdtb-imb', '#hdtb-msb')
  if (imageMenu === false) {
    imageMenu = await findImageMenuFrom(page, '#lb a', '#lb')
  }

  await imageMenu.click()
}

const resetBrowser = async () => {
  await browser.close()
}

const imageDownloadBySearch = async (query, prefix = '') => {
  await page.waitForSelector('#sf')
  await page.focus('[name=q]')
  await page.fill('[name=q]', query)
  await page.keyboard.press('Enter')

  await page.waitForSelector('.tAcEof') // 메뉴 로딩 대기
  await page.click('.PNyWAd.ZXJQ7c') // 도구 클릭
  if (await (await page.$('.DZjDQ')).innerText() === 'Size') {
    await page.click('.DZjDQ') // 크기 클릭
    await page.click('.Ix6LGe a') // 큼 클릭
  }

  await page.waitForSelector('#islrg') // 이미지 리스트 대기

  await downloadImage(page, prefix + query, 1)
  await downloadImage(page, prefix + query, 2)
  await downloadImage(page, prefix + query, 3)
  await downloadImage(page, prefix + query, 4)
  await downloadImage(page, prefix + query, 5)
}

const findImageMenuFrom = async (page, selector, waitSelector) => {
  await page.waitForSelector(waitSelector)
  const menus = await page.$$(selector)

  for (const menu of menus) {
    const innerText = await menu.innerText()
    if (innerText === '이미지') {
      return menu
    }
  }

  return false
}

const downloadImage = async (page, filename, offset) => {
  await page.click('#islrg .isv-r.PNCib.MSM1fd.BUooTd:nth-of-type(' + offset + ') img')
  if (await page.$('.eHAdSb') === null) {
    await page.waitForSelector('.eHAdSb')
  }

  const imageLink = await findImageFromThumbnail(page)
  if (imageLink === false) {
    console.error('not found image. filename is ' + filename)
    return
  }

  console.log(imageLink)

  await download.image({
    url: imageLink,
    dest: './result/' + filename + '-' + offset + '.png'
  })
}

const findImageFromThumbnail = async (page) => {
  const imageHandlers = await page.$$('.eHAdSb img')
  let imageLink
  let repeat = 0

  while (true) {
    await page.waitForTimeout(300)
    for (const imageHandler of imageHandlers) {
      imageLink = await imageHandler.getAttribute('src')
      if (imageLink.split(':')[0] !== 'data') return imageLink
    }

    if (++repeat === 10) return false
  }
}

module.exports = {
  initialBrowser,
  resetBrowser,
  imageDownloadBySearch
}
