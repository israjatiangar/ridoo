import "@picocss/pico/css/pico.pumpkin.min.css"
import "./style.css"
import { v4 as uuidv4 } from "uuid"

type Task = {
	id: string
	title: string
	completed: boolean
	createdAt: Date
}

const israjatiangar = (): boolean => true
console.log(israjatiangar())

const tasksList = document.querySelector<HTMLUListElement>("#tasksList")
const completedList = document.querySelector<HTMLUListElement>("#completedList")
const newTaskForm = document.querySelector<HTMLFormElement>("#newTaskForm")
const newTaskTitle = document.querySelector<HTMLInputElement>("#newTaskTitle")

const themeButton = document.querySelector<HTMLButtonElement>("#themeButton")
const clearAllButton = document.querySelector<HTMLButtonElement>("#clearAll")

let tasksStore: Task[] = loadTasks()

tasksStore.forEach((task) => addListItem(task))

newTaskForm?.addEventListener("submit", (e) => {
	e.preventDefault()
	if (newTaskTitle?.value === "" || newTaskTitle?.value == null) {
		return
	}
	const newTask: Task = {
		id: uuidv4(),
		title: newTaskTitle.value,
		completed: false,
		createdAt: new Date()
	}
	tasksStore.push(newTask)
	addListItem(newTask)
	saveTasks()

	newTaskTitle.value = ""
})

function addListItem(task: Task): void {
	let parentList = tasksList
	const listItem = document.createElement("li")
	const label = document.createElement("label")
	const checkbox = document.createElement("input")

	checkbox.addEventListener("change", () => {
		parentList?.removeChild(listItem)
		task.completed = checkbox.checked
		parentList = checkbox.checked ? completedList : tasksList
		parentList?.append(listItem)
		saveTasks()
	})
	checkbox.type = "checkbox"
	checkbox.checked = task.completed
	parentList = checkbox.checked ? completedList : tasksList
	label.append(checkbox, task.title)
	label.classList.add("taskListItemLabel")
	listItem.append(label)
	listItem.classList.add("taskListItem")
	parentList?.append(listItem)
}

themeButton?.addEventListener("click", () => {
	toggleTheme()
})

clearAllButton?.addEventListener("click", () => {
	tasksStore = []
	removeAllChild(tasksList)
	removeAllChild(completedList)
	saveTasks()
})

function toggleTheme(): void {
	let theme = document.querySelector("html")?.getAttribute("data-theme")
	console.log(theme)
	if (theme === "dark") {
		document.querySelector("html")?.setAttribute("data-theme", "light")
	} else {
		document.querySelector("html")?.setAttribute("data-theme", "dark")
	}
}
function saveTasks(): void {
	localStorage.setItem("TASKS", JSON.stringify(tasksStore))
}

function loadTasks(): Task[] {
	const taskJSON = localStorage.getItem("TASKS")
	if (taskJSON === null) {
		return []
	}
	return JSON.parse(taskJSON)
}
function removeAllChild(someParentElement: HTMLUListElement | null): void {
	if (someParentElement === null) {
		return
	}
	while (someParentElement.firstChild) {
		someParentElement.removeChild(someParentElement.firstChild)
	}
}
