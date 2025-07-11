# Pixiv Downloader
Download pics from pixiv with or without an account

### If you want to see a use case go into the Code tab and look for the `lib/main.js` file !!
### All the functions who who need to be logged in will be noted in the JSDoc and in the README

## Getting started
`npm i @ibaraki-douji/pixivts --save`

### Getting pixiv Tags
```js
const Pixiv = require("@ibaraki-douji/pixivts");
const pixiv = new Pixiv.Pixiv();
// or just const pixiv = new require("@ibaraki-douji/pixivts").Pixiv();

pixiv.predict('a tag').then(tags => {
    console.log(tags);
    /* log an array of
    {
        tag_name: string,
        access_count: string,
        type: string,
        tag_translation: string
    }
    ------------
    tag_name = the pixiv tag (in japanese)
    access_count = number of time this tag is searched
    type = type of the tag
    tag_translation = the english traduction for the tag
    */
})
```

### Search artworks by tag
```js
pixiv.getIllustsByTag('YOUR PIXIV TAG').then(res => {
    console.log(res);
    /*
    Returns an array of
    {
        id: string,
        title: string,
        illustType: number,
        description: string,
        tags: Array<string>,
        userId: string,
        userName: string,
        width: number,
        height: number,
        pageCount: number,
        createDate: string,
        updateDate: string
    }
    */
});

// You can also parse optionals parameters
pixiv.getIllustsByTag('YOUR PIXIV TAG', {mode: 'all', page: 2}).then((res) => {
    console.log(res);
});
/*
    The mode is for selecting what you want : 'safe' = All age artworks | 'r18' = NSFW only | 'all' = both of them
    And the page of the artworks
*/
```

### Count all the pics for a tag
```js
pixiv.getTagIllustCount("YOUR PIXIV TAG").then((res) => {
    console.log(res);
    // Returns a number
});

// It also takes the mode option
pixiv.getTagIllustCount("YOUR PIXIV TAG", {mode: 'all'}).then((res) => {
    console.log(res);
});
```

### Get related tags from another tag
```js
pixiv.getRelatedTags("YOUR PIXIV TAG").then((res) => {
    console.log(res);
    /*
    Returns an Array of
    {
        tag_name: string,
        tag_translation: string
    }
    */
});
```

### Search Artworks by User
```js
pixiv.getIllustsByUserID('THE ID', {limit: 100}).then(res => {
    console.log(res);
    /*
    Returns an array of
    {
        id: string,
        title: string,
        illustType: number,
        description: string,
        tags: Array<string>,
        userId: string,
        userName: string,
        width: number,
        height: number,
        pageCount: number,
        createDate: string,
        updateDate: string
    }
    */
});
// You can edit the limit with the number of artwork you want (0 = unlimited)
```

### Retriving All infos from an artwork
```js
pixiv.getIllustByID('ID').then(res => {
   console.log(res);
   /*
   Return an object :
   {
        AI: boolean,
        restricted: number,
        pageCount: number,
        urls: Array<Image>,
        illustID: string,
        illustType: number,
        description: string,
        tags: Array<string>,
        createDate: string,
        uploadDate: string,
        width: number,
        height: number,
        like: number,
        bookmark: number,
        view: number,
        comment: number,
        user: {
            id: string,
            name: string
        },
        title: string,
    }
    
    for the urls
    Array<Image> = An array of that
    {
        mini: string,
        thumb: string,
        small: string,
        regular: string,
        original: string,
    }
   */
});
```

### Download the image
```js
pixiv.download(new URL(artwork.urls[0].original)).then(res => {
    fs.writeFileSync("./test.jpg", res);
    
    /*
    returns a buffer who contains the downloaded image.
    */
});
```

### Get daily ranking (Login required)
```js
pixiv.getDailyRanking().then(res => {
    console.log(res);
    /*
    Returns an array of string ID
    */
});
```

### Get recommended users (Login required)
```js
pixiv.getRecommendedUsers().then(res => {
    console.log(res);
    /*
    Returns an array of string ID
    */
});
```

### Get favorite tags (Login required)
```js
pixiv.getFavoriteTags().then(res => {
    console.log(res);
    /*
    Returns an array of string ID
    */
});
```

### Get recommended illusts (Login required)
```js
pixiv.getRecommendedIllusts().then(res => {
    console.log(res);
    /*
    Returns an array of string ID
    */
});
```

### Get new illusts (Login required)
```js
pixiv.getNewIllusts().then(res => {
    console.log(res);
    /*
    Returns an array of :
    {
        id: string,
        title: string,
        illustType: number,
        description: string,
        tags: Array<string>,
        userId: string,
        userName: string,
        width: number,
        height: number,
        pageCount: number,
        createDate: string,
        updateDate: string
    }
    */
});
```

### Login with credentials
⚠ You need to install puppeteer `npm i puppeteer --save`
This function will open a browser to login and the user can verify the captcha (if prompted)
```js
pixiv.login('email or id', 'pass').then(logged => {
    console.log(logged);
    /*
    returns true or false if logged or not
    */
});
```

### Login with cookies (Recommended)
To get the cookies go to pixiv, login to your account.
Then open the dev tools `Ctrl+Shift+I` or `F12`, go in the network tab.
After select a line (a picture or anything), in the popup search Headers tab and find cookies. After that copy ALL cookies (this is a big cookie data) and parse it in the program. (btw don't take the `cookies: ` just take the value).
```js
pixiv.staticLogin('cookies 🍪', 'the same useragent of the cookies');
```

### Check the login
```js
let loged = pixiv.isLogged();
// Retunrs true if logged, false if not.
```

### Logout
```js
pixiv.logout();
```

### Get the current login infos
```js
let creds = pixiv.getLogin();
console.log(creds);
/*
Returns an object ;
{
    cookies: string,
    agent: string
}
*/
```

---
Thanks for downloading my pixiv package, if you have any questions or suggestions, feel free to contact me on Discord : `Ibaraki Douji#1406`