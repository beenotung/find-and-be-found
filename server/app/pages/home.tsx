import { o } from '../jsx/jsx.js'
import { prerender } from '../jsx/html.js'
import SourceCode from '../components/source-code.js'
import { Link } from '../components/router.js'

// Calling <Component/> will transform the JSX into AST for each rendering.
// You can reuse a pre-compute AST like `let component = <Component/>`.

// If the expression is static (not depending on the render Context),
// you don't have to wrap it by a function at all.

let content = (
  <div id="home">
    <h1>Home Page</h1>
    <p>
      我們的網站讓您以幾個問題，就像遊戲《阿基納多》一樣，快速地找到您需要的人或商品。我們使用先進的算法和機器學習，將您的回答與我們的數據庫進行比較，幫助您找到最適合的搭檔、服務提供商或產品。
    </p>
    <p>
      我們的網站還允許您根據特定的條件進行篩選，以確保您獲得最佳的匹配結果。不需要浪費時間在搜尋和篩選，讓我們的網站幫助您快速找到最適合的人或商品。
    </p>

    <Link href="/search">
      <button>Start</button>
    </Link>
  </div>
)

// And it can be pre-rendered into html as well
let Home = prerender(content)

export default Home
