"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pixiv = void 0;
const node_fetch_1 = require("node-fetch");
class Pixiv {
    constructor() {
        this.cookies = "";
        this.agent = "";
    }
    /**
     *
     * Requires puppeteer
     *
     * @param username
     * @param password
     * @returns
     */
    async login(username, password) {
        if (!this.browser)
            this.browser = await require('puppeteer').launch({
                headless: true
            });
        const page = await this.createPage();
        await page.goto("https://accounts.pixiv.net/login?return_to=https%3A%2F%2Fwww.pixiv.net%2Fen%2F&lang=en&source=pc&view_type=page", { waitUntil: "networkidle2" });
        const log = await page.$("#container-login input[type='text']");
        const pass = await page.$("#container-login input[type='password']");
        const sub = await page.$("#container-login button");
        await log.type(username, { delay: 50 });
        await pass.type(password, { delay: 50 });
        await sub.click({ delay: 100 });
        await page.waitForTimeout(3000);
        const form = await page.$("#container-login li");
        const cap = form != null;
        if (cap) {
            await page.close();
            this.browser.close();
            this.browser = undefined;
            return false;
        }
        await page.waitForNavigation({ waitUntil: "domcontentloaded" });
        this.cookies = "";
        for (let c of await page.cookies()) {
            this.cookies += c.name + "=" + c.value + "; ";
        }
        this.agent = await this.browser.userAgent();
        this.cookies = this.cookies.substring(0, this.cookies.length - 2);
        page.close();
        this.browser.close();
        this.browser = undefined;
        return true;
    }
    /**
     * Login without puppeteer
     * @param cookies
     * @param useragent
     */
    staticLogin(cookies, useragent) {
        this.cookies = cookies,
            this.agent = useragent;
    }
    /**
     * Check if logged in
     * @returns boolean
     */
    isLogged() {
        return this.cookies != "" && this.agent != "";
    }
    /**
     * Check if logged in
     * @returns boolean
     * @deprecated Use isLogged() instead
     */
    isLoged() {
        return this.isLogged();
    }
    /**
     * Logout and close browser if puppeteer is used
     */
    async logout() {
        if (this.browser)
            await this.browser.close();
        this.browser = undefined;
        this.cookies = "";
        this.agent = "";
    }
    /**
     * Get illustrations from a tag
     * @param tag
     * @param options
     * @returns Artwork[]
     */
    async getIllustsByTag(tag, options = { mode: "safe", page: 1 }) {
        const res = await this.fetch(new URL("https://www.pixiv.net/ajax/search/artworks/" + tag + "?word=" + tag + "&order=date_d&mode=" + options.mode + "&p=" + options.page + "&s_mode=s_tag_full&type=all&lang=en"));
        const json = JSON.parse(await res.text());
        let arr = [];
        arr = arr.concat(json.body.illustManga.data);
        return arr;
    }
    /**
     * Get daily ranking
     * @param options
     * @returns string[]
     * @requires login
     */
    async getDailyRanking(options = { mode: "all" }) {
        const res = await this.fetch(new URL("https://www.pixiv.net/ajax/top/illust?mode=" + options.mode + "&lang=en"));
        const json = JSON.parse(await res.text());
        return json.body.page.ranking.items.map((i) => i.id);
    }
    /**
     * Get recommended users
     * @returns string[]
     * @requires login
     */
    async getRecommendedUsers() {
        const res = await this.fetch(new URL("https://www.pixiv.net/ajax/top/illust?mode=all&lang=en"));
        const json = JSON.parse(await res.text());
        return json.body.page.recommendedUser.map((i) => i.id);
    }
    /**
     * Get favorite tags
     * @returns string[]
     * @requires login
     */
    async getFavoriteTags() {
        const res = await this.fetch(new URL("https://www.pixiv.net/ajax/top/illust?mode=all&lang=en"));
        const json = JSON.parse(await res.text());
        return json.body.page.myFavoriteTags;
    }
    /**
     * Get recommended illusts
     * @returns string[]
     * @requires login
     */
    async getRecommendedIllusts() {
        const res = await this.fetch(new URL("https://www.pixiv.net/ajax/top/illust?mode=all&lang=en"));
        const json = JSON.parse(await res.text());
        return json.body.page.recommended.ids;
    }
    /**
     * Count illustrations from a tag
     * @param tag
     * @param options
     * @returns number
     */
    async getTagIllustCount(tag, options = { mode: "safe" }) {
        const res = await this.fetch(new URL("https://www.pixiv.net/ajax/search/artworks/" + tag + "?word=" + tag + "&order=date_d&mode=" + options.mode + "&p=1&s_mode=s_tag_full&type=all&lang=en"));
        const json = JSON.parse(await res.text());
        return json.body.illustManga.total;
    }
    /**
     * Get related tags from a tag
     * @param tag
     * @returns Tag[]
     */
    async getRelatedTags(tag) {
        const res = await this.fetch(new URL("https://www.pixiv.net/ajax/search/artworks/" + tag + "?word=" + tag + "&order=date_d&mode=safe&p=1&s_mode=s_tag_full&type=all&lang=en"));
        const json = JSON.parse(await res.text());
        return json.body.relatedTags.map((r) => {
            return {
                tag_name: r,
                tag_translation: (json.body.tagTranslation[r] || {}).en
            };
        });
    }
    /**
     * Get new illustrations
     * @param options
     * @returns Artwork[]
     * @requires login
     */
    async getNewIllusts(options = { mode: "safe", limit: 20 }) {
        const res = await this.fetch(new URL("https://www.pixiv.net/ajax/illust/new?lastId=0&limit=" + options.limit + "&type=illust&r18=" + (options.mode == "r18") + "&lang=en"));
        const json = JSON.parse(await res.text());
        return json.body.illusts;
    }
    /**
     * Get more details about an Artwork from its ID
     * @param id
     * @returns Illust
     */
    async getIllustByID(id) {
        const res = await this.fetch(new URL("https://www.pixiv.net/ajax/illust/" + id));
        const json = JSON.parse(await res.text()).body;
        const arr = [];
        for (let a = 0; a < json.pageCount; a++) {
            arr.push({
                mini: json.urls.mini.replace("p0", "p" + a),
                original: json.urls.original.replace("p0", "p" + a),
                regular: json.urls.regular.replace("p0", "p" + a),
                small: json.urls.small.replace("p0", "p" + a),
                thumb: json.urls.thumb.replace("p0", "p" + a),
            });
        }
        const illust = {
            AI: json.aiType == 2,
            restricted: json.xRestrict == 1,
            bookmark: json.bookmarkCount,
            comment: json.commentCount,
            createDate: json.createDate,
            uploadDate: json.uploadDate,
            description: json.description,
            height: json.height,
            illustID: json.illustId,
            illustType: json.illustType,
            like: json.likeCount,
            pageCount: json.pageCount,
            tags: json.tags,
            view: json.viewCount,
            width: json.width,
            user: {
                id: json.userId,
                name: json.userName
            },
            urls: arr,
            title: json.title
        };
        return illust;
    }
    /**
     * Get more details about an Artwork from its Artwork object
     * @param artwork
     * @returns Illust
     */
    async getIllustByArtwork(artwork) {
        return this.getIllustByID(artwork.id);
    }
    /**
     * Get illustrations from a user ID
     * @param id
     * @param options
     * @returns Illust[]
     */
    async getIllustsByUserID(id, options = { limit: 100 }) {
        let res = await this.fetch(new URL("https://www.pixiv.net/ajax/user/" + id + "/profile/all?lang=en"));
        let json = JSON.parse(await res.text());
        const arr = [];
        if (options.limit == 0)
            options.limit = Number.MAX_VALUE;
        let i = 1;
        for (let ID of Object.keys(json.body.illusts)) {
            if (i > options.limit)
                break;
            arr.push(await this.getIllustByID(ID));
            i++;
        }
        return arr;
    }
    /**
     * Get illustrations from a user object
     * @param user
     * @returns Illust[]
     */
    async getIllustsByUser(user) {
        return this.getIllustsByUserID(user.id);
    }
    /**
     * Predict tags from a tag
     * @param tag
     * @returns Tag[]
     */
    async predict(tag) {
        const res = await this.fetch(new URL("https://www.pixiv.net/rpc/cps.php?keyword=" + tag + "&lang=en"));
        const json = JSON.parse(await res.text());
        return json.candidates;
    }
    /**
     * Download an image from its URL
     * @param url
     * @returns Buffer
     */
    async download(url) {
        return new Promise(resolve => {
            resolve(this.fetch(url)
                .then(res => res.arrayBuffer())
                .then(buff => Buffer.from(buff)));
        });
    }
    async fetch(url) {
        return new Promise(async (resolve) => {
            resolve(node_fetch_1.default(url.toString(), {
                headers: {
                    'Referer': 'https://www.pixiv.net/',
                    'User-Agent': (this.agent != "" ? (this.agent) : 'Cloudflare Workers'),
                    'cookie': ((this.cookies != "" && this.agent != "") ? this.cookies : undefined)
                }
            }));
        });
    }
    async createPage() {
        if (!this.browser)
            return null;
        const page = await this.browser.newPage();
        page.setDefaultNavigationTimeout(0);
        page.setDefaultTimeout(0);
        return page;
    }
}
exports.Pixiv = Pixiv;
