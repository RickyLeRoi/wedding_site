// Listen for a submit
var el_msg = document.querySelector(".contact-form-message"), elClone_msg = el_msg.cloneNode(true);
    elClone_msg.addEventListener("submit", submitMessage);
    el_msg.parentNode.replaceChild(elClone_msg, el_msg);

function submitMessage(e) {
  e.preventDefault();

  //   Get input Values
  let name = document.querySelector("#person-nome").value;
  if (!name) {
    setCodeError("Prova a dirci chi sei...", true);
    return;
  } else {
    console.log(name);
    let msg = document.querySelector("#person-message").value;
    saveContactMessage(name, msg);
  }

  document.querySelector(".contact-form-code").reset();
}

// Save infos to Firebase
function saveContactMessage(name, msg) {
  let messaggiRep = firebase.database();
  try {
    messaggiRep.ref(`messaggi/${Date.now() + '_' + name}`).set(msg);
    setResultMessage('Conferma inviata. Grazie!', true);
    setTimeout( () => resetForm(), 3500);
  } catch (error) {
    setResultError("C'è stato un errore nell'inviare la conferma. Per favore prova a rinviarla.", true);
  }
}

function setCodeError(err, isMessage) {
  let form = isMessage ? document.querySelector(".contact-form-message") : document.querySelector(".contact-form-code");
  let msg = document.createElement('div');
  msg.className = 'code-error';
  msg.innerText = err;
  // if (form.children.length > 5) form.removeChild(msg);
  form.appendChild(msg);
  setTimeout(() => form.removeChild(msg), 4000);
}
function setResultMessage(info, isMessage) {
  let form = isMessage ? document.querySelector(".contact-form-message") : document.querySelector(".contact-form-code");
  let msg = document.createElement('div');
  msg.className = 'code-valid';
  msg.innerText = info;
  form.appendChild(msg);
  setTimeout(() => form.removeChild(msg), 3000);
}

function setResultError(err, isMessage) {
  let form = isMessage ? document.querySelector(".contact-form-message") : document.querySelector(".contact-form-code");
  let msg = document.createElement('div');
  msg.className = 'code-error';
  msg.innerText = err;
  form.appendChild(msg);
  setTimeout(() => form.removeChild(msg), 4000);
}
