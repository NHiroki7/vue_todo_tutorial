import { Component, Vue, Watch } from 'vue-property-decorator';
import { State, TodoItem } from './components/todoItem';
import { todoStorage } from './App.vue';


@Component
export default class App extends Vue {
// TODO 一覧
public todos: TodoItem[] = [];

// TODO 絞り込み作業区分
public labels = new Map<State, string>([
[State.All, '全て'],
[State.Working, '作業中'],
[State.Done, '完了']
]);

// 現在表示中の作業区分
public current: State = State.All;

// 現在の表示する作業区分でTODO一覧を絞り込む
public get filteredTodos() {
return this.todos.filter(t => this.current === State.All ? true : this.current === t.state);
}

// コンポーネントのインスタンスを作成がされた時にストレージからTODO全件を取得
public created() {
this.todos = todoStorage.fetchAll();
}

// TODO 追加する
public addTodo() {
const name = this.$refs.name as HTMLInputElement;
if (!name.value.length) {
return;
}
this.todos.push({
id: todoStorage.nextId,
name: name.value,
state: State.Working
});
name.value = '';
}

// TODOを削除する
public removeTodo(todo: TodoItem) {
const index = this.todos.indexOf(todo);
this.todos.splice(index, 1);
}

// TODOの作業中・完了を切り替える
public toggleState(todo: TodoItem) {
todo.state = todo.state === State.Working ? State.Done : State.Working;
}

// TODO一覧が変更された度、ストレージに保存する
@Watch('todos', { deep: true })
public onTodoChanged(todos: TodoItem[]) {
todoStorage.save(todos);
}
}
