/// <reference types="node" />
export declare class Pixiv {
    private browser;
    private cookies;
    private agent;
    /**
     *
     * Requires puppeteer
     *
     * @param username
     * @param password
     * @returns
     */
    login(username: string, password: string): Promise<boolean>;
    /**
     * Login without puppeteer
     * @param cookies
     * @param useragent
     */
    staticLogin(cookies: string, useragent: string): void;
    /**
     * Check if logged in
     * @returns boolean
     */
    isLogged(): boolean;
    /**
     * Check if logged in
     * @returns boolean
     * @deprecated Use isLogged() instead
     */
    isLoged(): boolean;
    /**
     * Logout and close browser if puppeteer is used
     */
    logout(): Promise<void>;
    /**
     * Get illustrations from a tag
     * @param tag
     * @param options
     * @returns Artwork[]
     */
    getIllustsByTag(tag: string, options?: {
        mode: "all" | "r18" | "safe";
        page: number;
    }): Promise<Array<Artwork>>;
    /**
     * Get daily ranking
     * @param options
     * @returns string[]
     * @requires login
     */
    getDailyRanking(options?: {
        mode: "r18" | "all";
    }): Promise<Array<string>>;
    /**
     * Get recommended users
     * @returns string[]
     * @requires login
     */
    getRecommendedUsers(): Promise<Array<string>>;
    /**
     * Get favorite tags
     * @returns string[]
     * @requires login
     */
    getFavoriteTags(): Promise<Array<string>>;
    /**
     * Get recommended illusts
     * @returns string[]
     * @requires login
     */
    getRecommendedIllusts(): Promise<Array<string>>;
    /**
     * Count illustrations from a tag
     * @param tag
     * @param options
     * @returns number
     */
    getTagIllustCount(tag: string, options?: {
        mode: "all" | "r18" | "safe";
    }): Promise<number>;
    /**
     * Get related tags from a tag
     * @param tag
     * @returns Tag[]
     */
    getRelatedTags(tag: string): Promise<Array<Tag>>;
    /**
     * Get new illustrations
     * @param options
     * @returns Artwork[]
     * @requires login
     */
    getNewIllusts(options?: {
        mode: "r18" | "safe";
        limit: number;
    }): Promise<Array<Artwork>>;
    /**
     * Get more details about an Artwork from its ID
     * @param id
     * @returns Illust
     */
    getIllustByID(id: string): Promise<Illust>;
    /**
     * Get more details about an Artwork from its Artwork object
     * @param artwork
     * @returns Illust
     */
    getIllustByArtwork(artwork: Artwork): Promise<Illust>;
    /**
     * Get illustrations from a user ID
     * @param id
     * @param options
     * @returns Illust[]
     */
    getIllustsByUserID(id: string, options?: {
        limit?: number;
    }): Promise<Array<Illust>>;
    /**
     * Get illustrations from a user object
     * @param user
     * @returns Illust[]
     */
    getIllustsByUser(user: User): Promise<Array<Illust>>;
    /**
     * Predict tags from a tag
     * @param tag
     * @returns Tag[]
     */
    predict(tag: string): Promise<Array<Tag>>;
    /**
     * Download an image from its URL
     * @param url
     * @returns Buffer
     */
    download(url: URL): Promise<Buffer>;
    private fetch;
    private createPage;
}
export interface Artwork {
    id: string;
    title: string;
    illustType: number;
    description: string;
    tags: Array<string>;
    userId: string;
    userName: string;
    width: number;
    height: number;
    pageCount: number;
    createDate: string;
    updateDate: string;
}
export interface Illust {
    AI: boolean;
    pageCount: number;
    urls: Array<Image>;
    illustID: string;
    illustType: number;
    description: string;
    tags: Array<string>;
    createDate: string;
    uploadDate: string;
    width: number;
    height: number;
    like: number;
    bookmark: number;
    view: number;
    comment: number;
    user: {
        id: string;
        name: string;
    };
    title: string;
    restricted: boolean;
}
export interface User {
    id: string;
    name: string;
    avatar: string;
    premium: boolean;
    backgound: string;
    partial: number;
}
export interface Image {
    mini: string;
    thumb: string;
    small: string;
    regular: string;
    original: string;
}
export interface Tag {
    access_count?: string;
    tag_name: string;
    tag_translation: string;
}
