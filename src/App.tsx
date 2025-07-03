import { useEffect, useState } from 'react'
import './App.css'
import { useTheme } from './ThemeContext'

interface TodoItem {
  id: string
  text: string
  completed: boolean
}

function App() {
  const taskKeyMemo = "tarefas"
  const { theme, toggleTheme } = useTheme()
  const [toDos, setToDos] = useState<TodoItem[]>([])
  const [newToDo, setNewToDo] = useState<string>("")
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [taskCounter, setTaskCounter] = useState<number>(0)

  const addTask = async (): Promise<void> => {
    console.log("Tentando adicionar:", newToDo)

    if (newToDo !== "") {
      try {
        const newId = taskCounter.toString()

        const newToDoItem: TodoItem = {
          id: newId,
          text: newToDo,
          completed: false
        }

        setToDos([...toDos, newToDoItem])
        setNewToDo("")
        setTaskCounter(prev => prev + 1)

        console.log("Adicionado:", newToDoItem)
      } catch (err) {
        alert("Erro ao adicionar tarefa")
        console.error(err)
      }
    }
  }

  const removeTask = (id: string): void => {
    const updatedTasks = toDos.filter((toDo) => toDo.id !== id)
    setToDos(updatedTasks)
  }

  const checkCompleted = (id: string): void => {
    const updatedToDos = toDos.map((toDo) => {
      if (toDo.id === id) {
        return { ...toDo, completed: !toDo.completed }
      }
      return toDo
    })

    setToDos(updatedToDos)
  }

  const getCompletedTask = (): TodoItem[] => {
    return toDos.filter(toDo => toDo.completed)
  }

  useEffect(() => {
    if (isLoading) {
      localStorage.setItem(taskKeyMemo, JSON.stringify(toDos))
    }
  }, [toDos, isLoading])

  useEffect(() => {
    const localTasks = localStorage.getItem(taskKeyMemo)

    if (localTasks) {
      setToDos(JSON.parse(localTasks))
    }

    setIsLoading(true)
  }, [])

  return (
    <div className={`app ${theme}`}>
      <div className={`container ${theme}`}>
        <h1>To Do List</h1>
        <p>Tasks | {getCompletedTask().length} / {toDos.length} | </p>
        <div className='input-container'>
          <input
            type="text"
            value={newToDo}
            onChange={(e) => setNewToDo(e.target.value)}
          />
          <button onClick={() => addTask()}>Add</button>
        </div>
        <ol>
          {
            toDos.map((toDo) => (
              <li key={toDo.id}>
                <input
                  type="checkbox"
                  checked={toDo.completed}
                  onChange={() => checkCompleted(toDo.id)}
                />
                <span style={{ textDecoration: toDo.completed ? 'line-through' : 'none' }}>
                  {toDo.text}
                </span>
                <button onClick={() => removeTask(toDo.id)}>X</button>
              </li>
            ))
          }
        </ol>
        <button onClick={toggleTheme}>
          {theme === "light" ? 'Light' : 'Dark'}
        </button>
      </div>
    </div>
  )
}

export default App
