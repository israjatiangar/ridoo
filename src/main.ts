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
	let theme = toggleTheme()
	if (theme === null) {
		return
	}
	if (theme === "light") {
		themeButton.innerHTML = `<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" >
  		<path d="M10 2a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 2ZM10 15a.75.75 0 0 1 .75.75v1.5a.75.75 0 0 1-1.5 0v-1.5A.75.75 0 0 1 10 15ZM10 7a3 3 0 1 0 0 6 3 3 0 0 0 0-6ZM15.657 5.404a.75.75 0 1 0-1.06-1.06l-1.061 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM6.464 14.596a.75.75 0 1 0-1.06-1.06l-1.06 1.06a.75.75 0 0 0 1.06 1.06l1.06-1.06ZM18 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 18 10ZM5 10a.75.75 0 0 1-.75.75h-1.5a.75.75 0 0 1 0-1.5h1.5A.75.75 0 0 1 5 10ZM14.596 15.657a.75.75 0 0 0 1.06-1.06l-1.06-1.061a.75.75 0 1 0-1.06 1.06l1.06 1.06ZM5.404 6.464a.75.75 0 0 0 1.06-1.06l-1.06-1.06a.75.75 0 1 0-1.061 1.06l1.06 1.06Z" /></svg>`
	} else {
		themeButton.innerHTML = `
		<svg class="icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor">
		<path d="M14.438 10.148c.19-.425-.321-.787-.748-.601A5.5 5.5 0 0 1 6.453 2.31c.186-.427-.176-.938-.6-.748a6.501 6.501 0 1 0 8.585 8.586Z" /></svg>`
	}
})

clearAllButton?.addEventListener("click", () => {
	tasksStore = []
	removeAllChild(tasksList)
	removeAllChild(completedList)
	saveTasks()
})

function toggleTheme(): string {
	let theme = document.querySelector("html")?.getAttribute("data-theme")
	if (theme === "dark") {
		document.querySelector("html")?.setAttribute("data-theme", "light")
	} else {
		document.querySelector("html")?.setAttribute("data-theme", "dark")
	}
	return theme ?? "dark"
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
