const puppeteer = require('puppeteer');

const sessionFactory = require('./factories/sessionFactory');

let browser, page;
beforeEach(async () => {
    browser = await puppeteer.launch({
        headless: false,
    });
    page = await browser.newPage();
    await page.goto('localhost:3000');
})

afterEach(async () => {
    await browser.close();
})

test('the header has the correct text', async () => {
    const text = await page.$eval('a.brand-logo', el => el.innerHTML);

    expect(text).toEqual('Blogster');
    await browser.close()
});

test('clicking login starts oauth flow', async () => {
    await page.click('.right a');
    const url = await page.url();
    expect(url).toMatch(/accounts\.google\.com/)
});

test('when signed in shows logged out button', async() => {

    const { session, sig } = sessionFactory();


    await page.setCookie({ name: 'session', value: session });
    await page.setCookie({ name: 'session.sig', value: sig});
    await page.goto('localhost:3000');
    // the test might fail here if we change the design to not have Logout button
    await page.waitFor('a[href="/auth/logout"]');

    const text = await page.$eval('a[href="/auth/logout"]', el => el.innerHtml);
    console.log('!!!!!!!!!!!!: -----------------------')
    console.log('!!!!!!!!!!!!: text', text)
    console.log('!!!!!!!!!!!!: -----------------------')

    expect(text).toEqual('Logout')
})
