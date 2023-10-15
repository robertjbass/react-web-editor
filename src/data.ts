export const defaultCode = `// imports are converted to CDN script tags
import axios from 'axios'

function Todos({todos, handleToggle}) {
  return (
    <ul>
      {todos?.map((todo) => {
        return (
          <li
            key={todo.id}
            onClick={() => handleToggle(todo.id)}
            className={["cursor-pointer select-none",todo.completed && "line-through"].join(" ")}>
              {todo.title}
          </li>
        )
      })}
    </ul>
  );
}

function App() {
  // Hooks can be used with React.useHookName syntax
  const [todos, setTodos] = React.useState([])

  const fetchTodos = async () => {
    // imported libraries can be called
    const response = await axios.get("https://jsonplaceholder.typicode.com/todos")
    setTodos(response.data)
  }

  const handleToggle = (todoId) => {
    const newTodos = todos.map(todo => {
      if (todo.id !== todoId) {
        return todo
      }
      return {...todo, completed: !todo.completed}
    })

    setTodos(newTodos)

  }

  React.useEffect(() => {
    // You can log to the browser console inside of useEffect
    console.log("Hello World")
    fetchTodos()
  },[])

  return (
    <div className="p-4">
      {/* You can use Tailwind */}
      <h1 className="text-xl font-semibold">Todos</h1>
      {/* You can nest components just like with regular react */}
      <Todos todos={todos} handleToggle={handleToggle} />
    </div>
  );
}`;
