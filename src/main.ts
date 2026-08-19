import "@picocss/pico/css/pico.pumpkin.min.css"
import "./assets/styles/style.css"
import { v4 as uuidv4 } from "uuid"

//#region Types
interface Task {
	id: string
	title: string
	completed: boolean
	createdAt: Date
}
interface Settings {
	preferedTheme: string
	isTaskListOpen: boolean
	isCompletedListOpen: boolean
}
//#endregion

//#region israjatiangar
//@ts-ignore
globalThis.israjatiangar = (made: any): boolean => true
//#endregion

//#region Variables
const WEBPAGE = document.querySelector<HTMLHtmlElement>("html")!

const TASKS_LIST = document.querySelector<HTMLUListElement>("#Tasks_List")!
const TASKS_LIST_CONTAINER =
	document.querySelector<HTMLDetailsElement>("#Tasks_Detail")!
const COMPLETED_LIST =
	document.querySelector<HTMLUListElement>("#Completed_List")!
const COMPLETED_LIST_CONTAINER =
	document.querySelector<HTMLDetailsElement>("#Completed_Detail")!
const NEW_TASK_FORM = document.querySelector<HTMLFormElement>("#New_Task_Form")!
const NEW_TASK_TITLE =
	document.querySelector<HTMLInputElement>("#New_Task_Title")!

const CONFIRM_DELETION_DIALOG =
	document.querySelector<HTMLDialogElement>("#Confirm_Deletion")!

const THEME_BUTTON = document.querySelector<HTMLButtonElement>("#Theme_Button")!
const OPEN_DIALOG = document.querySelector<HTMLButtonElement>("#Open_Dialog")!
const CLOSE_DIALOG = document.querySelector<HTMLButtonElement>("#Close_Dialog")!
const CLEAR_ALL_BUTTON =
	document.querySelector<HTMLButtonElement>("#Clear_All")!

const SETTING: Settings = {
	preferedTheme: "dark",
	isTaskListOpen: true,
	isCompletedListOpen: false
}
loadSettings(SETTING)

let tasks_store: Task[] = loadTasks()
//#endregion

//#region Events
tasks_store.forEach(task => addListItem(task))
NEW_TASK_FORM.onsubmit = e => {
	e.preventDefault()
	if (NEW_TASK_TITLE.value === "" || NEW_TASK_TITLE.value === null) {
		return
	}
	const newTask: Task = {
		id: uuidv4(),
		title: NEW_TASK_TITLE.value,
		completed: false,
		createdAt: new Date()
	}
	tasks_store.push(newTask)
	addListItem(newTask)
	saveTasks()
	NEW_TASK_TITLE.value = ""
}

THEME_BUTTON.onclick = () => {
	toggleTheme()
	saveSettings()
}

TASKS_LIST_CONTAINER.onclick = () => setTimeout(() => saveSettings(), 500)
COMPLETED_LIST_CONTAINER.onclick = () => setTimeout(() => saveSettings(), 500)

OPEN_DIALOG.onclick = () => {
	CONFIRM_DELETION_DIALOG.showModal()
	WEBPAGE.classList.add("modal-is-opening")
	WEBPAGE.classList.add("modal-is-open")
	setTimeout(() => {
		WEBPAGE.classList.remove("modal-is-opening")
	}, 400)
}

CLOSE_DIALOG.onclick = () => closeCofirmDialog()
CLEAR_ALL_BUTTON.onclick = () => {
	tasks_store = []
	removeAllChild(TASKS_LIST)
	removeAllChild(COMPLETED_LIST)
	saveTasks()
	closeCofirmDialog()
}
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
	let parent_list = listItemCheckbox.checked ? COMPLETED_LIST : TASKS_LIST
	parent_list.append(listItem)

	//Sort using Checkbox
	listItemCheckbox.onchange = () => changeParent()
	listItemButton.onclick = () => {
		listItem.classList.add("riList_Item-exit")
		listItem.ontransitionend = () => {
			listItem.remove()
			deleteTask(task)
		}
	}

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
		listItem.classList.add("riList_Item-exit")
		listItem.addEventListener(
			"transitionend",
			() => {
				listItem.classList.remove("riList_Item-exit")
				listItem.remove()
				parent_list = listItemCheckbox.checked ? COMPLETED_LIST : TASKS_LIST
				parent_list.append(listItem)
				saveTasks()
			},
			{ once: true }
		)
	}
	function deleteTask(task: Task): void {
		tasks_store.splice(tasks_store.indexOf(task), 1)
	}
}

function toggleTheme(): void {
	const theme = WEBPAGE.getAttribute("data-theme")
	theme === "dark"
		? WEBPAGE.setAttribute("data-theme", "light")
		: WEBPAGE.setAttribute("data-theme", "dark")
}

function closeCofirmDialog(): void {
	WEBPAGE?.classList.add("modal-is-closing")
	setTimeout(() => {
		WEBPAGE.classList.remove("modal-is-closing")
		WEBPAGE.classList.remove("modal-is-open")
		CONFIRM_DELETION_DIALOG.close()
	}, 400)
}

function saveSettings(): void {
	SETTING.preferedTheme = WEBPAGE.getAttribute("data-theme") ?? "dark"
	SETTING.isTaskListOpen = TASKS_LIST_CONTAINER.hasAttribute("open") ?? true
	SETTING.isCompletedListOpen =
		COMPLETED_LIST_CONTAINER.hasAttribute("open") ?? false
	localStorage.setItem("SETTINGS", JSON.stringify(SETTING))
}

function loadSettings(inputSettings: Settings): void {
	const savedPrefs = localStorage.getItem("SETTINGS")
	if (savedPrefs !== null) {
		inputSettings = JSON.parse(savedPrefs)
	}
	WEBPAGE.setAttribute("data-theme", inputSettings.preferedTheme)
	TASKS_LIST_CONTAINER.toggleAttribute("open", inputSettings.isTaskListOpen)
	COMPLETED_LIST_CONTAINER.toggleAttribute(
		"open",
		inputSettings.isCompletedListOpen
	)
}

function saveTasks(): void {
	localStorage.setItem("TASKS", JSON.stringify(tasks_store))
}

function loadTasks(): Task[] {
	const taskJSON = localStorage.getItem("TASKS")
	if (taskJSON === null) {
		return []
	}
	return JSON.parse(taskJSON)
}

function removeAllChild(someParentElement: HTMLUListElement): void {
	while (someParentElement.firstChild) {
		someParentElement.removeChild(someParentElement.firstChild)
	}
}
//#endregion
