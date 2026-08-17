import "@picocss/pico/css/pico.pumpkin.min.css"
import "./style.css"
import { v4 as uuidv4 } from "uuid"

//#region Types
type Task = {
	id: string
	title: string
	completed: boolean
	createdAt: Date
}
//#endregion

//#region israjatiangar
const israjatiangar = (): boolean => true
console.log(israjatiangar())
//#endregion

//#region Variables

const tasksList = document.querySelector<HTMLUListElement>("#tasksList")
const completedList = document.querySelector<HTMLUListElement>("#completedList")
const newTaskForm = document.querySelector<HTMLFormElement>("#newTaskForm")
const newTaskTitle = document.querySelector<HTMLInputElement>("#newTaskTitle")
const confirmDeletionDialog =
	document.querySelector<HTMLDialogElement>("#confirmDeletion")

const themeButton = document.querySelector<HTMLButtonElement>("#themeButton")
const openDialog = document.querySelector<HTMLButtonElement>("#openDialog")
const closeDialog = document.querySelector<HTMLButtonElement>("#closeDialog")
const clearAllButton = document.querySelector<HTMLButtonElement>("#clearAll")

let tasksStore: Task[] = loadTasks()

//#endregion

//#region Events
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

themeButton?.addEventListener("click", () => {
	toggleTheme()
})

openDialog?.addEventListener("click", () => {
	confirmDeletionDialog?.showModal()
	document.querySelector("html")?.classList.add("modal-is-opening")
	document.querySelector("html")?.classList.add("modal-is-open")
	setTimeout(() => {
		document.querySelector("html")?.classList.remove("modal-is-opening")
	}, 400)
})
closeDialog?.addEventListener("click", () => {
	closeCofirmDialog()
})
clearAllButton?.addEventListener("click", () => {
	tasksStore = []
	removeAllChild(tasksList)
	removeAllChild(completedList)
	saveTasks()
	closeCofirmDialog()
})
//#endregion

//#region functions

function addListItem(task: Task): void {
	const template = document.querySelector(
		"[new-task-list-item]"
	) as HTMLTemplateElement
	const clonnedNode = template.content.cloneNode(true) as DocumentFragment

	const listItem = clonnedNode.querySelector("li") as HTMLLIElement
	const label = listItem?.querySelector("label") as HTMLLabelElement
	const checkbox = label?.querySelector("input") as HTMLInputElement

	let parentList = tasksList
	parentList?.append(listItem)

	checkbox.addEventListener("change", () => {
		task.completed = checkbox.checked
		listItem?.parentElement?.removeChild(listItem)
		parentList = checkbox.checked ? completedList : tasksList
		parentList?.append(listItem)
		saveTasks()
	})

	checkbox.checked = task.completed
	label.append(task.title)
}

function toggleTheme(): void {
	let theme = document.querySelector("html")?.getAttribute("data-theme")
	if (theme === "dark") {
		document.querySelector("html")?.setAttribute("data-theme", "light")
	} else {
		document.querySelector("html")?.setAttribute("data-theme", "dark")
	}
}

function closeCofirmDialog(): void {
	document.querySelector("html")?.classList.add("modal-is-closing")
	setTimeout(() => {
		document.querySelector("html")?.classList.remove("modal-is-closing")
		document.querySelector("html")?.classList.remove("modal-is-open")
		confirmDeletionDialog?.close()
	}, 400)
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
//#endregion
