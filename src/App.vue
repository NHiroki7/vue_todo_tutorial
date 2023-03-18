<template>
  <div>
    <h1>Vue-TypeScript-TODOリスト</h1>
    <!--Map型をv-forで回すにはArray.fromで入れ子の配列する必要がある。
        イメージ `[[key1, val1], [key2, val2], [key3, val3]]`-->
    <label v-for="[state, text] in Array.from(labels)" :key="state">
      <input type="radio" v-model="current" :value="state">
      {{ text }}
    </label>
    {{ filteredTodos.length }} 件を表示中
    <table>
      <thead>
        <tr>
          <th class="id">ID</th>
          <th class="comment">コメント</th>
          <th class="state">状態</th>
          <th class="button">-</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="todo in filteredTodos" :key="todo.id">
          <th>{{ todo.id }}</th>
          <td>{{ todo.name }}</td>
          <td class="state">
            <button @click="toggleState(todo)">
              {{ labels.get(todo.state) }}
            </button>
          </td>
          <td class="button">
            <button @click.shift="removeTodo(todo)">
              削除
            </button>
          </td>
        </tr>
      </tbody>
    </table>

    <p>
      ※削除ボタンはコントロールキーを押しながらクリックして下さい
    </p>

    <h2>新しい作業の追加</h2>
    <form class="add-item" @submit.prevent="addTodo">
      コメント <input type="text" ref="name">
      <button type="submit">追加</button>
    </form>
  </div>
</template>

<script lang="ts">
import { Vue, Watch } from 'vue-property-decorator'
import Component from 'vue-class-component'
import TodoStorage from './components/todoStorage'
import { State, TodoItem } from './components/todoItem'

const todoStorage = new TodoStorage()

@Component
export default class App extends Vue {
  // TODO 一覧
  public todos: TodoItem[] = []

  // TODO 絞り込み作業区分
  public labels = new Map<State, string>([
    [State.All, '全て'],
    [State.Working, '作業中'],
    [State.Done, '完了']
  ])

  // 現在表示中の作業区分
  public current: State = State.All

  // 現在の表示する作業区分でTODO一覧を絞り込む
  public get filteredTodos() {
    return this.todos.filter(t =>
      this.current === State.All ? true : this.current === t.state)
  }

  // コンポーネントのインスタンスを作成がされた時にストレージからTODO全件を取得
  public created() {
    this.todos = todoStorage.fetchAll()
  }

  // TODO 追加する
  public addTodo() {
    const name = this.$refs.name as HTMLInputElement
    if (!name.value.length) {
      return
    }
    this.todos.push({
      id: todoStorage.nextId,
      name: name.value,
      state: State.Working
    })
    name.value = ''
  }

  // TODOを削除する
  public removeTodo(todo: TodoItem) {
    const index = this.todos.indexOf(todo)
    this.todos.splice(index, 1)
  }

  // TODOの作業中・完了を切り替える
  public toggleState(todo: TodoItem) {
    todo.state = todo.state === State.Working ? State.Done : State.Working
  }

  // TODO一覧が変更された度、ストレージに保存する
  @Watch('todos', { deep: true })
  public onTodoChanged(todos: TodoItem[]) {
    todoStorage.save(todos)
  }
}
</script>

<style>
* {
  box-sizing: border-box;
}

#app {
  max-width: 640px;
  margin: 0 auto;
}

table {
  width: 100%;
  border-collapse: collapse;
}

thead th {
  border-bottom: 2px solid #0099e4; /*#d31c4a */
  color: #0099e4;
}

th,
th {
  padding: 0 8px;
  line-height: 40px;
}

thead th.id {
  width: 50px;
}

thead th.state {
  width: 100px;
}

thead th.button {
  width: 60px;
}

tbody td.button, tbody td.state {
  text-align: center;
}

tbody tr td,
tbody tr th {
  border-bottom: 1px solid #ccc;
  transition: All 0.4s;
}

tbody tr.Done td,
tbody tr.Done th {
  background: #f8f8f8;
  color: #bbb;
}

tbody tr:hover td,
tbody tr:hover th {
  background: #f4fbff;
}

button {
  border: none;
  border-radius: 20px;
  line-height: 24px;
  padding: 0 8px;
  background: #0099e4;
  color: #fff;
  cursor: pointer;
}
</style>