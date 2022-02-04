const $noteTitle = $(".note-title");
const $noteText = $(".note-textarea");
const $saveBtn = $(".save-note");
const $newTaskBtn = $(".new-note");
const $noteList = $(".list-container .list-group");

let currentNote = {};

const renderCurrentNote = () => {
  $saveBtn.hide();

  if (currentNote.id) {
    $noteTitle.attr("readonly", true);
    $noteText.attr("readonly", true);
    $noteTitle.val(currentNote.title);
    $noteText.val(currentNote.text);
  } else {
    $noteTitle.attr("readonly", false);
    $noteText.attr("readonly", false);
    $noteTitle.val("");
    $noteText.val("");
  }
};

const btnSave = () => {
  $.post("/api/notes", {
    title: $noteTitle.val(),
    text: $noteText.val(),
  }).then(() => {
    getAndRenderNotes();
    renderCurrentNote();
  });
};

const listDelete = function (event, note_id) {
  event.stopPropagation();

  if (currentNote.id === note_id) {
    currentNote = {};
  }

  $.ajax({
    url: "/api/notes/" + note_id,
    method: "DELETE",
  }).then(() => {
    getAndRenderNotes();
    renderCurrentNote();
  }).catch(err => {
    alert(err.responseJSON.error)
  });
};

function listView(note_id) {
  $.get("/api/notes/" + note_id).then(note => {
    console.log('note', note)
    currentNote = note;
    renderCurrentNote();
  });
}

const NewListView = () => {
  currentNote = {};
  renderCurrentNote();
};


const upSaveBtn = () => {
  if (!$noteTitle.val().trim() || !$noteText.val().trim()) {
    $saveBtn.hide();
  } else {
    $saveBtn.show();
  }
};

const renderNoteList = (eachItemList) => {
  $noteList.empty();
  let code = ''

  if (eachItemList.length === 0) {
    code += `<li class='list-group-item'><span>No saved Notes</span></li>`
  }
  eachItemList.forEach((itemList) => {
    const deleteButton = `<i onclick='listDelete(event, ${itemList.id})' class='fas fa-trash-alt float-right text-danger delete-note'></i>`;
    code += `<li class='list-group-item' onclick='listView(${itemList.id})'>
              <span>${itemList.title}</span> ${deleteButton}
            </li>`
  });
  $noteList.html(code);
};

const getAndRenderNotes = () => {
  return $.get("/api/notes").then(renderNoteList);
};

// $saveBtn.on("click", btnSave);
// $noteList.on("click", ".list-group-item", listView);
// $newTaskBtn.on("click", NewListView);
// $noteList.on("click", ".delete-note", listDelete);
// $noteTitle.on("keyup", upSaveBtn);
// $noteText.on("keyup", upSaveBtn);

window.addEventListener('load', function () {
  getAndRenderNotes();
})