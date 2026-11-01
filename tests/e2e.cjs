// End-to-end smoke test. Run against a server started with COACH_MOCK=1:
//   COACH_MOCK=1 npx next start -p 3100 & node tests/e2e.cjs http://localhost:3100
const { chromium } = require("playwright");
const BASE = process.argv[2] || "http://localhost:3100";
const SHOTS = process.env.SHOTS_DIR || "screenshots";
let failures = 0;
const ok = (cond, msg) => {
  console.log(`${cond ? "✓" : "✗"} ${msg}`);
  if (!cond) failures++;
};

(async () => {
  const browser = await chromium.launch();
  for (const [label, opts] of [
    ["desktop", { viewport: { width: 1360, height: 900 } }],
    ["mobile", { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 }],
  ]) {
    const ctx = await browser.newContext({ ...opts, locale: "en-GB", permissions: ["clipboard-read", "clipboard-write"] });
    const page = await ctx.newPage();
    const errors = [];
    page.on("console", (m) => m.type() === "error" && !/Failed to load resource.*google/.test(m.text()) && errors.push(m.text()));
    page.on("pageerror", (e) => errors.push(e.message));

    // Landing
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    ok(await page.getByRole("heading", { level: 1 }).isVisible(), `[${label}] landing hero visible`);
    const overflow = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
    ok(!overflow, `[${label}] landing has no horizontal scroll`);
    await page.screenshot({ path: `${SHOTS}/${label}-landing.png`, fullPage: label === "desktop" });

    // Chat: welcome sheet
    await page.goto(BASE + "/chat?mode=conflict", { waitUntil: "networkidle" });
    const welcome = page.getByRole("dialog");
    ok(await welcome.isVisible(), `[${label}] welcome sheet shown on first visit`);
    ok((await page.locator("#welcome-region").inputValue()) === "UK", `[${label}] country guessed from locale (en-GB → UK)`);
    await page.screenshot({ path: `${SHOTS}/${label}-welcome.png` });
    await page.getByRole("button", { name: "I'm 18 or older" }).click();
    ok(!(await welcome.isVisible().catch(() => false)), `[${label}] welcome dismissed`);
    ok(await page.getByRole("radio", { name: /Understand a conflict/ }).getAttribute("aria-checked") === "true", `[${label}] ?mode=conflict preselected`);
    await page.screenshot({ path: `${SHOTS}/${label}-chat-empty.png` });

    // Starter → streamed reply
    await page.getByRole("button", { name: "The more I try to talk, the more they shut down" }).click();
    await page.getByText("Neither of you is the problem").waitFor({ timeout: 10000 });
    await page.getByRole("button", { name: "See their side" }).waitFor({ timeout: 10000 });
    ok(true, `[${label}] reply streamed and next-step chips shown`);
    await page.getByRole("button", { name: "See their side" }).click();
    await page.getByText("overwhelmed", { exact: false }).first().waitFor({ timeout: 10000 });
    ok(true, `[${label}] "See their side" action works`);
    await page.getByRole("button", { name: "Send message" }).waitFor({ timeout: 10000 });
    await page.screenshot({ path: `${SHOTS}/${label}-chat-conversation.png` });

    // Typed message + crisis card
    await page.locator("#composer").fill("Honestly some nights I want to die");
    await page.keyboard.press("Enter");
    await page.getByLabel("Support resources").waitFor({ timeout: 5000 });
    ok(await page.getByText("Samaritans").first().isVisible(), `[${label}] crisis card shows UK resources (Samaritans)`);
    await page.getByText("Are you thinking about killing yourself?").waitFor({ timeout: 10000 });
    ok(true, `[${label}] coach responds to crisis`);
    await page.getByRole("button", { name: "Send message" }).waitFor({ timeout: 10000 });
    await page.screenshot({ path: `${SHOTS}/${label}-chat-crisis.png` });

    // Stop mid-stream
    await page.locator("#composer").fill("Tell me more");
    await page.keyboard.press("Enter");
    await page.getByRole("button", { name: "Stop the reply" }).click();
    await page.getByRole("button", { name: "Send message" }).waitFor({ timeout: 5000 });
    ok(true, `[${label}] stop button cancels streaming`);

    // Persistence
    await page.reload({ waitUntil: "networkidle" });
    if (label === "mobile") await page.getByRole("button", { name: "Open menu" }).click();
    const item = page.getByRole("navigation", { name: "Your conversations" }).getByRole("button", { name: /more I try to talk/ });
    ok(await item.first().isVisible(), `[${label}] conversation persisted after reload`);
    await item.first().click();
    ok(await page.getByText("Neither of you is the problem").isVisible(), `[${label}] reopened conversation shows history`);

    // Help panel
    await page.getByRole("button", { name: /Talk to a person|Help/ }).first().click();
    const help = page.getByRole("dialog", { name: "Talk to a person" });
    ok(await help.isVisible(), `[${label}] help panel opens`);
    await page.locator("#help-region").selectOption("AU");
    ok(await help.getByText("1800RESPECT").isVisible(), `[${label}] help panel switches region (AU)`);
    await page.screenshot({ path: `${SHOTS}/${label}-help.png` });
    await help.getByRole("button", { name: "Close" }).click();

    // Settings: name + dark theme
    if (label === "mobile") await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("button", { name: "Settings & privacy" }).first().click();
    await page.getByPlaceholder("e.g. Sam").fill("Sam");
    await page.getByRole("button", { name: "dark" }).click();
    await page.getByRole("button", { name: "Save" }).click();
    ok((await page.evaluate(() => document.documentElement.dataset.theme)) === "dark", `[${label}] dark theme applied`);
    await page.getByRole("button", { name: /New conversation/ }).first().click().catch(async () => {
      await page.getByRole("button", { name: "Open menu" }).click();
      await page.getByRole("button", { name: /New conversation/ }).first().click();
    });
    if (await page.getByRole("button", { name: "Close menu" }).isVisible().catch(() => false)) await page.getByRole("button", { name: "Close menu" }).click();
    ok(await page.getByRole("heading", { name: /Hi Sam/ }).isVisible(), `[${label}] name used in greeting`);
    await page.screenshot({ path: `${SHOTS}/${label}-chat-dark.png` });
    await page.goto(BASE + "/", { waitUntil: "networkidle" });
    ok((await page.evaluate(() => document.documentElement.dataset.theme)) === "dark", `[${label}] theme persists across pages (no flash script)`);
    await page.screenshot({ path: `${SHOTS}/${label}-landing-dark.png`, fullPage: label === "desktop" });

    // Rewriter
    await page.goto(BASE + "/rewrite", { waitUntil: "networkidle" });
    await page.getByRole("button", { name: "Try an example" }).click();
    await page.getByRole("button", { name: /Rewrite it/ }).click();
    await page.getByRole("heading", { name: "Gentle" }).waitFor({ timeout: 10000 });
    ok(await page.getByRole("heading", { name: "Brief" }).isVisible(), `[${label}] rewriter returns three versions`);
    await page.screenshot({ path: `${SHOTS}/${label}-rewrite.png`, fullPage: true });
    await page.getByRole("button", { name: "Talk it through with the coach" }).click();
    await page.waitForURL(/\/chat/);
    await page.waitForTimeout(300);
    ok((await page.locator("#composer").inputValue()).includes("not sure it'll land well"), `[${label}] rewriter hands text to chat without URL`);
    ok(!page.url().includes("never"), `[${label}] message text not in URL`);

    // Safety + privacy pages
    for (const path of ["/safety", "/privacy"]) {
      await page.goto(BASE + path, { waitUntil: "networkidle" });
      const ov = await page.evaluate(() => document.documentElement.scrollWidth > window.innerWidth + 1);
      ok(!ov, `[${label}] ${path} has no horizontal scroll`);
    }
    await page.screenshot({ path: `${SHOTS}/${label}-safety.png`, fullPage: label === "desktop" });

    // Delete everything
    await page.goto(BASE + "/chat", { waitUntil: "networkidle" });
    if (label === "mobile") await page.getByRole("button", { name: "Open menu" }).click();
    await page.getByRole("button", { name: "Settings & privacy" }).first().click();
    await page.getByRole("button", { name: "Delete everything" }).click();
    await page.getByRole("button", { name: "Yes, delete everything" }).click();
    const stored = await page.evaluate(() => localStorage.getItem("cg.conversations.v1"));
    ok(stored === null || stored === "[]", `[${label}] delete everything clears storage`);

    // Quick exit (Esc twice)
    await page.goto(BASE + "/safety", { waitUntil: "networkidle" });
    const nav = page.waitForRequest((r) => r.url().includes("google.com"), { timeout: 5000 }).then(() => true).catch(() => false);
    await page.keyboard.press("Escape");
    await page.keyboard.press("Escape");
    ok(await nav, `[${label}] Esc twice triggers quick exit`);

    ok(errors.length === 0, `[${label}] no console errors${errors.length ? ": " + errors.slice(0, 3).join(" | ") : ""}`);
    await ctx.close();
  }
  await browser.close();
  console.log(failures ? `\n${failures} check(s) failed` : "\nAll checks passed");
  process.exit(failures ? 1 : 0);
})().catch((e) => {
  console.error(e);
  process.exit(1);
});
