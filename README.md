# Hearthstone Deck

利用 Node.js 实现的炉石传说卡组解析应用。  
具体实现可参见博文：https://zhangshuqiao.org/2018-12/炉石卡组代码解析/

## 使用方法

```bash
# Clone this repository
git clone https://github.com/stevenjoezhang/hsdeck.git
# Go into the repository
cd hsdeck
# Install dependencies
npm install
```

依赖安装完成后，执行 `npm start`，然后通过浏览器访问 `localhost:8080` 即可查看效果。支持以下 GET 参数：

| 参数 | 含义 | 典型有效值 |
| - | - | - |
| `code` | 卡组代码 | Base64 编码的 String |
| `name` | 卡组名称 | `炉石传说卡组` |
| `lang` | 卡牌语言 | `zhCN` |
| `lazy` | 是否懒加载卡牌图片 | `lazy`, `eager`, `auto` |

## 更新

随着炉石传说的版本更新，卡池也会发生改变。这时，需要更新数据才能正确解析最新的卡组代码。你可以手动执行更新脚本：
```bash
npm run postinstall
```

这个脚本会从 [HearthstoneJSON](https://hearthstonejson.com/docs/cards.html) 上找到最新的 `cards.collectible.json`，下载并替换掉本项目下的同名文件（这就是全部的卡牌数据库文件）。

你也可以自己进行下载。如果你直接点击这个网页上的链接，会跳转到一个类似于  
https://api.hearthstonejson.com/v1/35057/enUS/cards.collectible.json  
的网址。这里只有英文版本的卡牌描述。如果需要多语言版本，需要手动将链接中的 `enUS` 替换为 `all`：  
https://api.hearthstonejson.com/v1/35057/all/cards.collectible.json  
然后下载该文件并替换即可。

## 鸣谢

本项目受到了 [mashirozx/Awesome-Deck](https://github.com/mashirozx/Awesome-Deck) 的启发。

## TODO

提供更多的卡牌图片 API 选项。

### 网易

#### 旧 API

```js
let purify_name = card.name.enUS.replace(/\s|'|,|!|:|-/g, "");
return `http://hearthstone.nos.netease.com/1/hscards/${card.cardClass}__${card.id}_zhCN_${purify_name}.png`;
```

#### 新 API

https://hs.blizzard.cn/gameguide/cards/?cardset=the-boomsday-project
https://hs.blizzard.cn/js/minisite/58beac0d.classCards.js

```js
var versionsDatajson = {
	"the-boomsday-project": {
		"title": "“砰砰计划”扩展包卡牌预览",
		"buyHref": "https://shop.battlenet.com.cn/zh-cn/product/hearthstone-boomsday-project-cn",
		"buyBtnTxt": "立即购买",
		"shareTxt": "《炉石传说》最新扩展包“女巫森林”现已公布。",
		"sharePic": "https://hearthstone.nosdn.127.net/3/minisite/wd3rrew/share.jpg",
		"logo": "https://blz.nosdn.127.net/1/tm/hearthstone/gameguide/cards/the-boomsday-project-logo.png"
	},
	"rastakhans-rumble": {
		"title": "拉斯塔哈的大乱斗",
		"buyHref": "https://shop.battlenet.com.cn/zh-cn/product/hearthstone-rastakhans-rumble",
		"buyBtnTxt": "立即购买",
		"shareTxt": "《炉石传说》全新扩展包“拉斯塔哈的大乱斗”现已公布，预购50包卡包赠送萨满新英雄！",
		"sharePic": "https://blz.nosdn.127.net/1/tm/hearthstone/activities/rastakhans/share.jpg",
		"logo": "https://blz.nosdn.127.net/1/tm/hearthstone/gameguide/cards/rastakhans-rumble-logo.png"
	},
	"rise-of-shadows": {
		"title": "暗影崛起",
		"buyHref": "https://shop.battlenet.com.cn/zh-cn/product/hearthstone-rise-of-shadows",
		"buyBtnTxt": "立即购买",
		"shareTxt": "《炉石传说》最新扩展包“暗影崛起”现已公布，预购也已同步开启",
		"sharePic": "https://blz.nosdn.127.net/1/tm/hearthstone/gameguide/rise/share.jpg",
		"logo": "https://blz.nosdn.127.net/1/tm/hearthstone/gameguide/cards/rise-of-shadows-logo.png"
	},
	"saviors-of-uldum": {
		"title": "奥丹姆奇兵",
		"buyHref": "https://shop.battlenet.com.cn/zh-cn/product/hearthstone-saviors-of-uldum",
		"buyBtnTxt": "立即购买",
		"shareTxt": "《炉石传说》最新扩展包“奥丹姆奇兵”现已公布。预购超级合集即可获得德鲁伊新英雄“伊莉斯·逐星”。",
		"sharePic": "https://blz.nosdn.127.net/1/tm/hearthstone/gameguide/saviors-of-uldum/share.jpg",
		"logo": "https://blz.nosdn.127.net/1/tm/hearthstone/gameguide/cards/saviors-of-uldum-logo.png"
	},
	"descent-of-dragons": {
		"title": "巨龙降临",
		"buyHref": "https://shop.battlenet.com.cn/zh-cn/product/hearthstone-descent-of-dragons",
		"buyBtnTxt": "立即购买",
		"shareTxt": "《炉石传说》最新扩展包“巨龙降临”现已上线，登录即可免费获得大量福利。",
		"sharePic": "https://blz.nosdn.127.net/1/tm/hearthstone/gameguide/descent-of-dragons/share.jpg",
		"logo": "https://blz.nosdn.127.net/1/tm/hearthstone/gameguide/descent-of-dragons/logo.png"
	}
};
$.post("https://hs.blizzard.cn/action/gameguide/cards", {
	cardSet: "saviors-of-uldum",
	cardClass: "",
	t: Date().now()
}, json => {
	if (json.status === "success") {
		console.log(json.data);
	}
});
```

### RapidAPI

https://rapidapi.com/omgvamp/api/hearthstone?endpoint=5525c4eee4b0b0dce8949cac

```js
fetch("https://omgvamp-hearthstone-v1.p.rapidapi.com/cards/Ysera?locale=zhCN", {
	"method": "GET",
	"headers": {
		"x-rapidapi-host": "omgvamp-hearthstone-v1.p.rapidapi.com",
		"x-rapidapi-key": "bb9e83cdfemsh39788a29ababa6dp1edc8ajsnbdfe142ae585"
	}
})
.then(response => {
	return response.json();
})
.then(card => {
	console.log(card);
});
```

## License

Released under the GNU General Public License v3  
http://www.gnu.org/licenses/gpl-3.0.html
