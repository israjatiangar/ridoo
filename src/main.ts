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
type SETTINGS = {
	preferedTheme: string
	isTaskListOpen: boolean
	isCompletedListOpen: boolean
}
//#endregion

//#region israjatiangar
const israjatiangar = (): boolean => true
console.log(israjatiangar())
//#endregion

//#region Variables
const WEBPAGE = document.querySelector<HTMLHtmlElement>("html")!

const tasksList = document.querySelector<HTMLUListElement>("#tasksList")!
const tasksListContainer =
	document.querySelector<HTMLDetailsElement>("#tasksDetail")!
const completedList =
	document.querySelector<HTMLUListElement>("#completedList")!
const completedListContainer =
	document.querySelector<HTMLDetailsElement>("#completedDetail")!
const newTaskForm = document.querySelector<HTMLFormElement>("#newTaskForm")!
const newTaskTitle = document.querySelector<HTMLInputElement>("#newTaskTitle")!

const confirmDeletionDialog =
	document.querySelector<HTMLDialogElement>("#confirmDeletion")!

const themeButton = document.querySelector<HTMLButtonElement>("#themeButton")!
const openDialog = document.querySelector<HTMLButtonElement>("#openDialog")!
const closeDialog = document.querySelector<HTMLButtonElement>("#closeDialog")!
const clearAllButton = document.querySelector<HTMLButtonElement>("#clearAll")!

let setting: SETTINGS = {
	preferedTheme: "dark",
	isTaskListOpen: true,
	isCompletedListOpen: false
}
loadSettings(setting)

let tasksStore: Task[] = loadTasks()
//#endregion

//#region Events
tasksStore.forEach((task) => addListItem(task))
newTaskForm.addEventListener("submit", (e) => {
	e.preventDefault()
	if (newTaskTitle.value === "" || newTaskTitle.value == null) {
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

themeButton.onclick = () => {
	toggleTheme()
	saveSettings()
}
// tasksListContainer?.addEventListener("pointerdown", () => {
// 	setTimeout(() => saveSettings(), 500)
// })
// completedList?.addEventListener("pointerdown", () => {
// 	setTimeout(() => saveSettings(), 500)
// })

tasksListContainer.onclick = () => setTimeout(() => saveSettings(), 500)
completedListContainer.onclick = () => setTimeout(() => saveSettings(), 500)

openDialog.addEventListener("click", () => {
	confirmDeletionDialog.showModal()
	WEBPAGE.classList.add("modal-is-opening")
	WEBPAGE.classList.add("modal-is-open")
	setTimeout(() => {
		WEBPAGE.classList.remove("modal-is-opening")
	}, 400)
})
closeDialog.addEventListener("click", () => {
	closeCofirmDialog()
})
clearAllButton.addEventListener("click", () => {
	tasksStore = []
	removeAllChild(tasksList)
	removeAllChild(completedList)
	saveTasks()
	closeCofirmDialog()
})
//#endregion

//#region functions
function addListItem(task: Task): void {
	//Convert String to Date
	if (!(task.createdAt instanceof Date)) {
		task.createdAt = new Date(task.createdAt)
	}

	// Declare Variables
	const template = document.querySelector(
		"[new-task-list-item]"
	) as HTMLTemplateElement
	const clonnedNode = template.content.cloneNode(true)! as DocumentFragment
	const listItem = clonnedNode.querySelector<HTMLLIElement>("li")!
	const listItemLabel = listItem!.querySelector<HTMLLabelElement>("label")!
	const listItemTime = listItem!.querySelector<HTMLTimeElement>("time")!
	const listItemButton = listItem.querySelector<HTMLAnchorElement>("a")!
	const listItemCheckbox =
		listItemLabel.querySelector<HTMLInputElement>("input")!

	// Set Variables
	listItemLabel.append(task.title)
	listItemTime.append(getTime(task.createdAt))
	listItemCheckbox.checked = task.completed

	//Set Parent List & Append Items
	let parentList = listItemCheckbox.checked ? completedList : tasksList
	parentList?.append(listItem)

	//Sort using Checkbox
	listItemCheckbox.addEventListener("change", () => {
		changeParent()
	})
	listItemButton.addEventListener("click", (e) => {
		e.preventDefault
		listItem.remove()
		deleteTask(task)
		console.table(tasksStore)
	})

	//Child Functions
	function getTime(time: Date): string {
		return `${time.toLocaleString("en-US", {
			localeMatcher: "best fit",
			timeStyle: "short",
			hour12: false
		})}`
	}

	function changeParent() {
		task.completed = listItemCheckbox.checked
		listItem.remove()
		parentList = listItemCheckbox.checked ? completedList : tasksList
		parentList!.append(listItem)
		saveTasks()
	}
	function deleteTask(task: Task): void {
		tasksStore.splice(tasksStore.indexOf(task), 1)
	}
}

function toggleTheme(): void {
	let theme = WEBPAGE!.getAttribute("data-theme")
	if (theme === "dark") {
		WEBPAGE.setAttribute("data-theme", "light")
	} else {
		WEBPAGE.setAttribute("data-theme", "dark")
	}
}

function closeCofirmDialog(): void {
	WEBPAGE?.classList.add("modal-is-closing")
	setTimeout(() => {
		WEBPAGE.classList.remove("modal-is-closing")
		WEBPAGE.classList.remove("modal-is-open")
		confirmDeletionDialog?.close()
	}, 400)
}

function saveSettings(): void {
	setting.preferedTheme = WEBPAGE.getAttribute("data-theme") ?? "dark"
	setting.isTaskListOpen = tasksListContainer.hasAttribute("open") ?? true
	setting.isCompletedListOpen = completedList.hasAttribute("open") ?? false
	localStorage.setItem("SETTINGS", JSON.stringify(setting))
}

function loadSettings(inputSettings: SETTINGS): void {
	const savedPrefs = localStorage.getItem("SETTINGS")
	if (savedPrefs !== null) {
		inputSettings = JSON.parse(savedPrefs)
	}
	WEBPAGE.setAttribute("data-theme", inputSettings.preferedTheme)
	tasksListContainer.toggleAttribute("open", inputSettings.isTaskListOpen)
	completedListContainer.toggleAttribute(
		"open",
		inputSettings.isCompletedListOpen
	)
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
