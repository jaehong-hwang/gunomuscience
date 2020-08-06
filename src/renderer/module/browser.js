const playwright = require('playwright')
// const download = require('image-downloader')

// await download.image({
//   url: imageLink,
//   dest: './result/' + filename + '-' + offset + '.png'
// })

let browser, context, page

const initialBrowser = async () => {
  browser = await playwright['chromium'].launch()
  context = await browser.newContext()
  page = await context.newPage()

  console.log('page created')
  await page.goto('https://www.google.com')

  console.log('redirect to google')
  await page.focus('[name=q]')
  await page.fill('[name=q]', '1')
  await page.keyboard.press('Enter')

  console.log('query complete')

  let imageMenu = await findImageMenuFrom('.hdtb-mitem.hdtb-imb', '#hdtb-msb')
  if (imageMenu === false) {
    imageMenu = await findImageMenuFrom('#lb a', '#lb')
  }
  console.log(page)

  await imageMenu.click()

  console.log('initial complete')
}

const resetBrowser = async () => {
  await browser.close()
}

const imageLinksBySearch = async (query, count = 5) => {
  if (query === undefined) {
    console.error('query is undefined. try again')
    return
  }
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

  const images = []
  for (let i = 0; i < count; i++) {
    const imageLink = await getImageLink(i + 1)
    console.log(count, i, imageLink)
    if (imageLink === false) {
      count++
    } else {
      images.push(imageLink)
    }
  }

  return images
}

const findImageMenuFrom = async (selector, waitSelector) => {
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

const getImageLink = async offset => {
  await page.click('#islrg .isv-r.PNCib.MSM1fd.BUooTd:nth-of-type(' + offset + ') img')
  if (await page.$('.eHAdSb') === null) {
    await page.waitForSelector('.eHAdSb')
  }

  const imageLink = await findImageFromThumbnail()
  if (imageLink === false) {
    console.error('not found image.')
    return false
  }

  return imageLink
}

const findImageFromThumbnail = async () => {
  const imageHandler = await page.$('.tvh9oe.BIB1wf img.n3VNCb')
  let imageLink

  let repeat = 0

  do {
    await page.waitForTimeout(500)
    imageLink = await imageHandler.getAttribute('src')

    if (++repeat === 10) return false
  } while (imageLink.split(':')[0] === 'data')

  return imageLink
}

export {
  initialBrowser,
  resetBrowser,
  imageLinksBySearch
}
