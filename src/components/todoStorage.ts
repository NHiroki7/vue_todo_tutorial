import { TodoItem } from './todoItem'

interface Storable {
  getItem(key: string): string | null
  setItem(key: string, value: string): void
}

const STORAGE_KEY = 'vue-ts-todoapp'

export default class TodoStorage {
  // 各TODO ユニーク ID の採番用
  get nextId(): number {
    return this.fetchAll().length + 1
  }

  constructor(
    // デフォルト引数でローカルストレージを DI
    private storage: Storable = localStorage
  ) { }

 // TODO リストを全件取得する
  public fetchAll(): TodoItem[] {
    const todos = JSON.parse(
      this.storage.getItem(STORAGE_KEY) || '[]'
    ) as TodoItem[]
    todos.forEach((todo, index) => todo.id = index)
    return todos
  }

  // TODO リストを保存する
  public save(todos: TodoItem[]) {
    this.storage.setItem(STORAGE_KEY, JSON.stringify(todos))
  }
}