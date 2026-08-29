const { test, expect } = require("@playwright/test");

const defaultPaths = "/,/guides/,/guides/actionable-observability/";
const paths = (process.env.BROWSER_QA_PATHS || defaultPaths)
  .split(",")
  .map((path) => path.trim())
  .filter(Boolean);

const fileNameFor = (path) => {
  const slug = path.replace(/^\/+|\/+$/g, "").replace(/[^a-z0-9]+/gi, "-");
  return slug || "home";
};

for (const path of paths) {
  test(`${path} passes browser QA`, async ({ page, request }, testInfo) => {
    const browserProblems = [];
    const baseOrigin = new URL(testInfo.project.use.baseURL).origin;

    page.on("console", (message) => {
      if (message.type() === "error") browserProblems.push(`console: ${message.text()}`);
    });
    page.on("pageerror", (error) => browserProblems.push(`pageerror: ${error.message}`));
    page.on("requestfailed", (failedRequest) => {
      const url = new URL(failedRequest.url());
      const failure = failedRequest.failure()?.errorText || "unknown failure";
      if (url.origin === baseOrigin && failure !== "net::ERR_ABORTED") {
        browserProblems.push(`requestfailed: ${url.pathname} (${failure})`);
      }
    });

    const response = await page.goto(path, { waitUntil: "load" });
    expect(response, `No document response for ${path}`).not.toBeNull();
    expect(response.ok(), `Document request failed for ${path}`).toBeTruthy();

    const main = page.locator("main").first();
    await expect(main).toBeVisible();
    await expect(page).toHaveTitle(/\S/);
    await page.evaluate(() => document.fonts?.ready);

    const horizontalOverflow = await page.evaluate(() => {
      const root = document.documentElement;
      const viewportWidth = root.clientWidth;
      const offenders = Array.from(document.querySelectorAll("body *"))
        .map((element) => {
          const rectangle = element.getBoundingClientRect();
          return {
            element: `${element.tagName.toLowerCase()}${element.id ? `#${element.id}` : ""}${
              element.classList.length ? `.${Array.from(element.classList).join(".")}` : ""
            }`,
            left: Math.round(rectangle.left * 100) / 100,
            right: Math.round(rectangle.right * 100) / 100,
            width: Math.round(rectangle.width * 100) / 100,
          };
        })
        .filter(({ left, right }) => left < -1 || right > viewportWidth + 1)
        .slice(0, 10);

      return {
        amount: root.scrollWidth - viewportWidth,
        scrollWidth: root.scrollWidth,
        viewportWidth,
        offenders,
      };
    });
    expect(
      horizontalOverflow.amount,
      `Page has horizontal overflow: ${JSON.stringify(horizontalOverflow)}`,
    ).toBeLessThanOrEqual(1);

    const sourcedImages = page.locator("img[src], img[srcset]");
    await sourcedImages.evaluateAll((images) => {
      for (const image of images) image.loading = "eager";
    });
    await page.waitForFunction(() =>
      Array.from(document.querySelectorAll("img[src], img[srcset]")).every(
        (image) => image.complete,
      ),
    );
    const brokenImages = await sourcedImages.evaluateAll((images) =>
      images
        .filter((image) => image.naturalWidth === 0)
        .map(
          (image) =>
            image.currentSrc || image.getAttribute("src") || image.alt || "unknown image",
        ),
    );
    expect(brokenImages, "Page contains broken images").toEqual([]);

    await page.keyboard.press("Tab");
    const hasKeyboardFocus = await page.evaluate(
      () => document.activeElement && document.activeElement !== document.body,
    );
    expect(hasKeyboardFocus, "Tab did not move focus into the document").toBeTruthy();

    if (testInfo.project.name === "mobile") {
      const toggle = page.locator("[data-nav-toggle], button[aria-controls]").first();
      if (await toggle.isVisible().catch(() => false)) {
        const controlledId = await toggle.getAttribute("aria-controls");
        expect(controlledId, "Visible navigation toggle has no aria-controls target").toBeTruthy();
        const controlled = page.locator(`[id="${controlledId}"]`);
        await expect(controlled, `Navigation target #${controlledId} is missing`).toHaveCount(1);
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await expect(controlled).toBeHidden();

        await toggle.click();
        await expect(toggle).toHaveAttribute("aria-expanded", "true");
        await expect(controlled).toBeVisible();
        await page.screenshot({ path: testInfo.outputPath("navigation-open.png") });

        await toggle.click();
        await expect(toggle).toHaveAttribute("aria-expanded", "false");
        await expect(controlled).toBeHidden();
      }
    }

    const internalLinks = await page.locator('a[href]').evaluateAll((anchors, origin) => {
      const urls = new Set();
      for (const anchor of anchors) {
        const target = new URL(anchor.href, origin);
        if (target.origin === origin && !target.hash && ["http:", "https:"].includes(target.protocol)) {
          urls.add(target.href);
        }
      }
      return Array.from(urls).slice(0, 12);
    }, baseOrigin);
    for (const href of internalLinks) {
      const linkedResponse = await request.get(href, { failOnStatusCode: false });
      expect(linkedResponse.status(), `Internal link failed: ${href}`).toBeLessThan(400);
    }

    const name = fileNameFor(path);
    await page.screenshot({ path: testInfo.outputPath(`${name}-viewport.png`) });
    await page.screenshot({ path: testInfo.outputPath(`${name}-full-page.png`), fullPage: true });
    expect(browserProblems, "Browser emitted runtime errors").toEqual([]);
  });
}
