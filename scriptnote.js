const addBox = document.querySelector(".add-box"),
popupBox = document.querySelector(".popup-box"),
popupTitle = popupBox.querySelector("header p"),
closeIcon = popupBox.querySelector("header i"),
titleTag = popupBox.querySelector("input"),
descTag = popupBox.querySelector("textarea"),
addBtn = popupBox.querySelector("button");

const months = ["January", "Februari", "Maret", "April", "Mei",
 "Juni", "Juli", "Agustus", "September", "Oktober", "November", "Desember"];

let notes = JSON.parse(localStorage.getItem("notes") || "[]");
let isUpdate = false, updateId;

addBox.addEventListener("click", () => {
    titleTag.focus();
    popupBox.classList.add("show");
});

closeIcon.addEventListener("click", () => {
    titleTag.value = "";
    descTag.value = "";
    popupBox.classList.remove("show");
    addBtn.innerText = "Add Note";
    popupTitle.innerText = "Add a new note";
    isUpdate = false;
});

function showNotes() {
    const wrapper = document.querySelector(".wrapper");
    // Clear existing notes before displaying new ones
    wrapper.innerHTML = '<li class="add-box"> <div class="icon"> <i class="uil uil-plus"></i></div><p>Add new note</p></li>';

    notes.forEach((note, index) => {
        let liTag = `
            <li class="note">
                <div class="details">
                    <p>${note.title}</p>
                    <span>${note.description}</span>
                </div>
                <div class="bottom-content">
                    <span>${note.date}</span>
                    <div class="settings">
                        <i onclick="showMenu(this)" class="uil uil-ellipsis-h"></i>
                        <ul class="menu">
                            <li onclick="updateNote(${index}, '${note.title}', '${note.description}')"><i class="uil uil-pen"></i>edit</li>
                            <li onclick="deleteNote(${index})"><i class="uil uil-trash"></i>delete</li>
                        </ul>
                    </div>
                </div>
            </li>`;
        wrapper.insertAdjacentHTML("beforeend", liTag);
    });

    const newAddBox = document.querySelector(".add-box");
    newAddBox.addEventListener("click", () => {
        popupBox.classList.add("show");
    });
}

showNotes();

function showMenu(elem) {
    elem.parentElement.classList.add("show");
    document.addEventListener("click", e => {
        if (e.target.tagName != "I" || e.target != elem) {
            elem.parentElement.classList.remove("show");
        }
    });
}

function deleteNote(noteId) {
    notes.splice(noteId, 1);
    localStorage.setItem("notes", JSON.stringify(notes));
    showNotes();
}

function updateNote(noteId, title, desc) {
    updateId = noteId;
    isUpdate = true;
    addBox.click();
    titleTag.value = title;
    descTag.value = desc;
    addBtn.innerText = "Update Note";
    popupTitle.innerText = "Update a Note";
}

addBtn.addEventListener("click", (e) => {
    e.preventDefault();
    let noteTitle = titleTag.value,
        noteDesc = descTag.value;

    if (noteTitle || noteDesc) {
        let dateObj = new Date(),
            month = months[dateObj.getMonth()],
            day = dateObj.getDate(),
            year = dateObj.getFullYear();

        let noteInfo = {
            title: noteTitle,
            description: noteDesc,
            date: `${month} ${day}, ${year}` // Use backticks here
        };

        if (!isUpdate) {
            notes.push(noteInfo);
        } else {
            notes[updateId] = noteInfo;
            isUpdate = false;
        }

        localStorage.setItem("notes", JSON.stringify(notes)); // Save the updated notes array
        titleTag.value = ""; // Clear the title input field
        descTag.value = "";  // Clear the description textarea
        closeIcon.click();
        showNotes(); // Refresh the notes display
    }
});
