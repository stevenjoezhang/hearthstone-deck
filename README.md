# Hearthstone Deck

利用Node.js实现的炉石传说卡组解析应用。

## 使用方法

```bash
# Clone this repository
git clone https://github.com/stevenjoezhang/hsdeck.git
# Go into the repository
cd hsdeck
# Install dependencies
npm install
```

从[HearthstoneJSON](https://hearthstonejson.com/docs/cards.html)上找到最新的`cards.collectible.json`，替换掉本项目下的同名文件。  
如果你直接点击这个网页上的链接，会跳转到一个类似于  
https://api.hearthstonejson.com/v1/30103/enUS/cards.collectible.json  
的网址。这里只有英文版本的卡牌描述。如果需要多语言版本，需要手动修改为：  
https://api.hearthstonejson.com/v1/30103/all/cards.collectible.json  
然后下载该文件并替换即可。

执行`node server.js`，通过浏览器访问`localhost:8080`即可查看效果。

## 鸣谢

本项目受到了[mashirozx/Awesome-Deck](https://github.com/mashirozx/Awesome-Deck)的启发。

## License
Released under the GNU General Public License v3  
http://www.gnu.org/licenses/gpl-3.0.html
