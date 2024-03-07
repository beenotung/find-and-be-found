import { seedRow } from 'better-sqlite3-proxy'
import { proxy } from './proxy'

// This file serve like the knex seed file.
//
// You can setup the database with initial config and sample data via the db proxy.

proxy.question[1] = { title: 'know programming' }
proxy.question[2] = { title: 'will to teach' }
proxy.question[3] = { title: 'live in Hong Kong' }
proxy.question[4] = { title: 'live in Kowloon' }
proxy.question[5] = { title: 'sporty' }

proxy.user[1] = {
  username: 'alice',
  password_hash: null,
  email: 'alice@gmail.com',
  tel: null,
  avatar: null,
}

proxy.user[2] = {
  username: 'bob',
  password_hash: null,
  email: 'bob@gmail.com',
  tel: null,
  avatar: null,
}

proxy.user[3] = {
  username: 'charlie',
  password_hash: null,
  email: 'charlie@gmail.com',
  tel: null,
  avatar: null,
}

let answer_id = 0

/* user 1 */

answer_id++
proxy.answer[answer_id] = {
  question_id: 1,
  user_id: 1,
  option: 'yes',
}

answer_id++
proxy.answer[answer_id] = {
  question_id: 2,
  user_id: 1,
  option: 'yes',
}

answer_id++
proxy.answer[answer_id] = {
  question_id: 3,
  user_id: 1,
  option: 'yes',
}

answer_id++
proxy.answer[answer_id] = {
  question_id: 4,
  user_id: 1,
  option: 'no',
}

answer_id++
proxy.answer[answer_id] = {
  question_id: 5,
  user_id: 1,
  option: 'no',
}

/* user 2 */

answer_id++
proxy.answer[answer_id] = {
  question_id: 1,
  user_id: 2,
  option: 'no',
}

answer_id++
proxy.answer[answer_id] = {
  question_id: 2,
  user_id: 2,
  option: 'yes',
}

answer_id++
proxy.answer[answer_id] = {
  question_id: 3,
  user_id: 2,
  option: 'yes',
}

answer_id++
proxy.answer[answer_id] = {
  question_id: 4,
  user_id: 2,
  option: 'yes',
}

answer_id++
proxy.answer[answer_id] = {
  question_id: 5,
  user_id: 2,
  option: 'yes',
}

/* user 3 */

answer_id++
proxy.answer[answer_id] = {
  question_id: 1,
  user_id: 3,
  option: 'no',
}

answer_id++
proxy.answer[answer_id] = {
  question_id: 2,
  user_id: 3,
  option: 'no',
}

answer_id++
proxy.answer[answer_id] = {
  question_id: 3,
  user_id: 3,
  option: 'yes',
}

answer_id++
proxy.answer[answer_id] = {
  question_id: 4,
  user_id: 3,
  option: 'yes',
}

answer_id++
proxy.answer[answer_id] = {
  question_id: 5,
  user_id: 3,
  option: 'yes',
}
