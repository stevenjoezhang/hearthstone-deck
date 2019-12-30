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

依赖安装完成后，执行 `npm start`，然后通过浏览器访问 `localhost:8080` 即可查看效果。可以接受三个 GET 参数：

| 参数 | 含义 |
| - | - |
| `code` | Base64编码的卡组代码 |
| `name` | 卡组名称 |
| `lang` | 卡牌语言 |

## 更新

随着炉石传说新版本的发布，或补丁的上线，卡池也会发生改变。这时，需要更新数据才能正确解析最新的卡组代码。由于作者不一定会及时更新此仓库，你可能需要手动执行更新脚本：
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

## License

Released under the GNU General Public License v3  
http://www.gnu.org/licenses/gpl-3.0.html
