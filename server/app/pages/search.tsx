import { o } from '../jsx/jsx.js'
import { Routes, getContextSearchParams } from '../routes.js'
import { apiEndpointTitle, title } from '../../config.js'
import Style from '../components/style.js'
import { Context, DynamicContext, getContextFormBody } from '../context.js'
import { mapArray } from '../components/fragment.js'
import { object, string } from 'cast.ts'
import { Link, Redirect } from '../components/router.js'
import { renderError } from '../components/error.js'
import { getAuthUser } from '../auth/user.js'
import { proxy } from '../../../db/proxy.js'
import { count, filter } from 'better-sqlite3-proxy'
import { getContextCookies } from '../cookie.js'

let pageTitle = 'Search'
let addPageTitle = 'Add New Question'

let style = Style(/* css */ `
#Search {

}
.buttons {
  margin-bottom: 1rem
}
.buttons button {
  font-size: larger;
  margin: 0.5rem;
}
`)

let page = (
  <>
    {style}
    <div id="Search">
      <h1>{pageTitle}</h1>
      <Main />
    </div>
  </>
)

let items = proxy.question

function Main(attrs: {}, context: Context) {
  let user = getAuthUser(context)
  let cookies = getContextCookies(context)
  let matchedUsers = proxy.user.map(user => user)
  let filters = (cookies?.unsignedCookies['filters'] || '').split('|')
  filters.pop()
  for (let filter of filters) {
    let [question_id, option] = filter.split(',')
    matchedUsers = matchedUsers.filter(user =>
      count(proxy.answer, {
        user_id: user.id!,
        question_id: +question_id,
        option,
      }),
    )
  }
  console.log('number of matches:', matchedUsers.length)
  console.log('matches:', matchedUsers)
  return (
    <>
      {mapArray(items, item => (
        <>
          <p>Does he/she {item.title}?</p>
          <div class="buttons">
            <Link href={`/filter/${item.id}/yes`}>
              <button>
                Yes (
                {
                  filter(proxy.answer, {
                    question_id: item.id!,
                    option: 'yes',
                  }).filter(answer =>
                    matchedUsers.find(user => user.id == answer.user_id),
                  ).length
                }
                )
              </button>
            </Link>
            <Link href={`/filter/${item.id}/no`}>
              <button>
                No (
                {
                  filter(proxy.answer, {
                    question_id: item.id!,
                    option: 'no',
                  }).filter(answer =>
                    matchedUsers.find(user => user.id == answer.user_id),
                  ).length
                }
                )
              </button>
            </Link>
          </div>
        </>
      ))}
      <h2>Matched Users</h2>
      <ul>
        {mapArray(matchedUsers, user => (
          <li>{user.username}</li>
        ))}
      </ul>

      <div class="buttons">
        <button>Undo</button>
        <Link href="/filter/reset">
          <button>Reset filter</button>
        </Link>
      </div>

      {user ? (
        <Link href="/search/add">
          <button>Add new question</button>
        </Link>
      ) : (
        <p>
          You can add new questions after <Link href="/register">register</Link>
          .
        </p>
      )}
    </>
  )
}

let addPage = (
  <div id="AddSearch">
    {Style(/* css */ `
#AddSearch .field {
  margin-block-end: 1rem;
}
#AddSearch .field label input {
  display: block;
  margin-block-start: 0.25rem;
}
#AddSearch .field label .hint {
  display: block;
  margin-block-start: 0.25rem;
}
`)}
    <h1>{addPageTitle}</h1>
    <form method="POST" action="/search/add/submit" onsubmit="emitForm(event)">
      <div class="field">
        <label>
          Title*:
          <input name="title" required minlength="3" maxlength="50" />
          <p class="hint">(3-50 characters)</p>
        </label>
      </div>
      <input type="submit" value="Submit" />
      <p>
        Remark:
        <br />
        *: mandatory fields
      </p>
    </form>
  </div>
)

function AddPage(attrs: {}, context: DynamicContext) {
  let user = getAuthUser(context)
  if (!user) return <Redirect href="/login" />
  return addPage
}

let submitParser = object({
  title: string({ minLength: 3, maxLength: 50 }),
})

function Submit(attrs: {}, context: DynamicContext) {
  try {
    let user = getAuthUser(context)
    if (!user) throw 'You must be logged in to submit ' + pageTitle
    let body = getContextFormBody(context)
    let input = submitParser.parse(body)
    let id = items.push({
      title: input.title,
    })
    return <Redirect href={`/search/result?id=${id}`} />
  } catch (error) {
    return (
      <Redirect
        href={'/search/result?' + new URLSearchParams({ error: String(error) })}
      />
    )
  }
}

function SubmitResult(attrs: {}, context: DynamicContext) {
  let params = new URLSearchParams(context.routerMatch?.search)
  let error = params.get('error')
  let id = params.get('id')
  return (
    <div>
      {error ? (
        renderError(error, context)
      ) : (
        <>
          <p>Your submission is received (#{id}).</p>
          <p>
            Back to <Link href="/search">{pageTitle}</Link>
          </p>
        </>
      )}
    </div>
  )
}

function Filter(attrs: {}, context: DynamicContext) {
  let params = context.routerMatch?.params
  let question_id = params.question_id
  let option = params.option
  let cookies = getContextCookies(context)
  let filters = cookies?.unsignedCookies['filters'] || ''

  filters += question_id + ',' + option + '|'
  cookies!.unsignedCookies['filters'] = filters

  console.log('filters:', filters)
  console.log('question:', question_id)
  console.log('option:', option)

  return page
}

function ResetFilter(attrs: {}, context: DynamicContext) {
  let cookies = getContextCookies(context)
  cookies!.unsignedCookies['filters'] = ''
  return page
}

let routes: Routes = {
  '/search': {
    title: title(pageTitle),
    description: 'TODO',
    menuText: pageTitle,
    node: page,
  },
  '/search/add': {
    title: title(addPageTitle),
    description: 'TODO',
    node: <AddPage />,
    streaming: false,
  },
  '/search/add/submit': {
    title: apiEndpointTitle,
    description: 'TODO',
    node: <Submit />,
    streaming: false,
  },
  '/search/result': {
    title: apiEndpointTitle,
    description: 'TODO',
    node: <SubmitResult />,
    streaming: false,
  },
  '/filter/:question_id/:option': {
    title: apiEndpointTitle,
    description: 'TODO',
    node: <Filter />,
    streaming: false,
  },
  '/filter/reset': {
    title: apiEndpointTitle,
    description: 'TODO',
    node: <ResetFilter />,
    streaming: false,
  },
}

export default { routes }
