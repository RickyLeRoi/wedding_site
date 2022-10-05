// Listen for a submit
var el_code = document.querySelector(".contact-form-code"), elClone_code = el_code.cloneNode(true);
    elClone_code.addEventListener("submit", submitForm);
    el_code.parentNode.replaceChild(elClone_code, el_code);

function submitForm(e) {
  e.preventDefault();

  //   Get input Values
  let code = document.querySelector("#family-code");
  if (!!code) {
    console.log(code.value);
    getContactInfo(code.value.toLowerCase().trim());
  } else {
    let c = document.querySelector('.persona-grid').id;
    let l_nm = document.querySelectorAll('[id$="_nome"]');
    let l_p = document.querySelectorAll('[id$="_partecipo"]');
    let l_b = document.querySelectorAll('[id$="_bimbo"]');
    let l_v = document.querySelectorAll('[id$="_vegetariano"]');
    let l_int = document.querySelectorAll('[id$="_intolleranze"]');
    let l_nt = document.querySelectorAll('[id$="_note"]');
    let objs = [];
    for (let i = 0; i < l_nm.length; i++) {
      let nm = l_nm[i].innerHTML;
      let p = l_p[i].checked ? 'SI' : 'NO';
      let b = l_b[i].checked ? 'SI' : 'NO';
      let v = l_v[i].checked ? 'SI' : 'NO';
      let int = l_int[i].value || null;
      let nt = l_nt[i].value || null;
      console.log(c, nm, p, b, v, int, nt);
      objs.push({ code: c, intolleranze: int, menu_bambino: b, menu_vegetariano: v, nome: nm, note: nt, partecipa: p });
    }

    saveContactInfo(c, objs);
  }

  // document.querySelector(".contact-form-code").reset();
}

function getContactInfo(code) {
  if (code === '') {
    setCodeError('Il codice inserito è vuoto. Prova ad inserirlo nuovamente.');
    return;
  }
  firebase.database().ref(`tentativi/${code}`).set(new Date(Date.now()).toLocaleString());
  let codiciRep = firebase.database().ref("codici");
  codiciRep.child(code).on('value', (snapshot) => {
    let names = snapshot.val();
    if (!names || names.length === 0) setCodeError('Il codice inserito è non valido. Prova ad inserirne un altro.');
    else if (names.length === 10) {
      if (names[9] === 'check')
        getRecap();
      else
        setCodeError('Il codice inserito è non valido. Prova ad inserirne un altro.');
    }
    else setCodeError('Dopo quanto scade un “ti faremo sapere”? È scaduto giorno 1 ottobre!'); //buildFormWithNames(code, names);
  });
}
function getRecap() {
  let conferme = firebase.database().ref("conferme");
  let messaggiRep = firebase.database().ref("messaggi");
  let tentativiRep = firebase.database().ref("tentativi");
  let l_conferme = [];
  let l_messaggi = [];
  let l_tentativi = [];
  buildFormWithRecap();
  conferme.on('value', (snapshot) => {
    let confs = snapshot.val();
    let codes = Object.keys(confs);
    for (const code of codes) {
      let cf = confs[code];
      let names = Object.keys(cf);
      if (names.length === 10) continue;
      for (const pers of names) {
        let obj = cf[pers];
        l_conferme.push(obj);
      }
    }
    buildConfermeGrid(l_conferme);
  });
  messaggiRep.on('value', (snapshot) => {
    let confs = snapshot.val();
    let codes = Object.keys(confs);
    for (const code of codes) {
      let data = code.split('_')[0];
      let nome = code.split('_')[1];
      let msg = confs[code];
      l_messaggi.push({nome: nome, data: new Date(parseInt(data)).toLocaleString(), messaggio: msg});
    }
    buildMessaggiGrid(l_messaggi);
  });
  tentativiRep.on('value', (snapshot) => {
    let confs = snapshot.val();
    let codes = Object.keys(confs);
    for (const code of codes) {
      let cf = confs[code];
      l_tentativi.push({code: code, data: cf});
    }
    buildTentativiGrid(l_tentativi);
  });
}

function buildFormWithRecap() {
  let form = document.querySelector(".contact-form-code");
  let childrenLen = form.children.length;
  while (childrenLen--) {
    form.removeChild(form.children[childrenLen]);
  }

  let change = form.appendChild(document.createElement('button'));
  change.onclick = resetForm; change.innerText = '← Cambia codice';
}
function buildFormWithNames(code, names) {
  let form = document.querySelector(".contact-form-code");
  let childrenLen = form.children.length;
  while (childrenLen--) {
    form.removeChild(form.children[childrenLen]);
  }

  let change = form.appendChild(document.createElement('button'));
  change.onclick = resetForm; change.innerText = '← Cambia codice';

  let smallDevice = form.clientWidth < 400;
  form.appendChild(getPersonaGrid(code, names, smallDevice));
  if (smallDevice) {
    // form.appendChild(getSmallDeviceExtraTable(code, names));
  }
  setTimeout(() => {
    let submit = form.appendChild(document.createElement('button'));
    submit.className = 'submit submit-persona';
    submit.type = 'submit';
    submit.innerText = 'Invia';
  },100);
}

function getPersonaGrid(code, names, smallDevice) {
  let grid = document.createElement('div');
  grid.id = code;
  grid.className = 'persona-grid';
  grid.style.gridTemplateColumns = smallDevice ? 'repeat(4, 1fr)' : 'repeat(6, 1fr)';
  let h_nome = grid.appendChild(document.createElement('div')).innerText = 'Name';
  let h_partecipa = grid.appendChild(document.createElement('div')).innerText = 'Partecipa';
  let h_menu_bambino = grid.appendChild(document.createElement('div')).innerText = 'Menu Bambino';
  let h_menu_vegetariano = grid.appendChild(document.createElement('div')).innerText = 'Menu Vegetariano';
  if (!smallDevice) {
    let h_intolleranze = grid.appendChild(document.createElement('div')).innerHTML = 'Intolleranze<br>Allergie';
    let h_note = grid.appendChild(document.createElement('div')).innerText = 'Note';
  }
  for (let n = 0; n < names.length; n++) {
    const name = names[n];
    let r_nome = grid.appendChild(document.createElement('div'))
    r_nome.id = `${name}_${'nome'}`; r_nome.innerText = name; r_nome.style.fontWeight = 'bold';
    let r_partecipa = grid.appendChild(createCustomCheckbox(`${name}_${'partecipo'}`, 'Partecipo!'));
    let r_menu_bambino = grid.appendChild(createCustomCheckbox(`${name}_${'bimbo'}`, 'Menu bimbo'));
    let r_menu_vegetariano = grid.appendChild(createCustomCheckbox(`${name}_${'vegetariano'}`, 'Menu veg'));
    if (!smallDevice) {
      let r_intolleranze = grid.appendChild(document.createElement('input'));
      r_intolleranze.id = `${name}_${'intolleranze'}`; r_intolleranze.type = 'text';
      let r_note = grid.appendChild(document.createElement('input'));
      r_note.id = `${name}_${'note'}`; r_note.type = 'text';
    } else {
      let h_intolleranze = grid.appendChild(document.createElement('div'));
      h_intolleranze.innerHTML = 'Intolleranze<br>Allergie'; h_intolleranze.className = 'cols-2-s';
      let r_intolleranze = grid.appendChild(document.createElement('input'));
      r_intolleranze.id = `${name}_${'intolleranze'}`; r_intolleranze.type = 'text'; r_intolleranze.className = 'cols-2-e';
      let h_note = grid.appendChild(document.createElement('div'));
      h_note.innerText = 'Note'; h_note.className = 'cols-2-s';
      let r_note = grid.appendChild(document.createElement('input'));
      r_note.id = `${name}_${'note'}`; r_note.type = 'text'; r_note.className = 'cols-2-e';
    }
  }
  return grid;
}
function getSmallDeviceExtraTable(code, names) {
  let sm_grid = document.createElement('div');
  sm_grid.id = code;
  sm_grid.className = 'persona-grid-extra';
  sm_grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
  h_nome = sm_grid.appendChild(document.createElement('div')).innerText = 'Name';
  h_intolleranze = sm_grid.appendChild(document.createElement('div')).innerHTML = 'Intolleranze<br>Allergie';
  h_note = sm_grid.appendChild(document.createElement('div')).innerText = 'Note';
  for (let n = 0; n < names.length; n++) {
    const name = names[n];
    let r_nome = sm_grid.appendChild(document.createElement('div'))
    r_nome.id = `${name}_${'nome'}`; r_nome.innerText = name;
    let r_intolleranze = sm_grid.appendChild(document.createElement('input'));
    r_intolleranze.id = `${name}_${'intolleranze'}`; r_intolleranze.type = 'text';
    let r_note = sm_grid.appendChild(document.createElement('input'));
    r_note.id = `${name}_${'note'}`; r_note.type = 'text';
  }
  return sm_grid;
}
function buildConfermeGrid(l_conferme) {
  let form = document.querySelector(".contact-form-code");
  let smallDevice = form.clientWidth < 400;
  l_conferme.sort( (a,b) => b.partecipa.localeCompare(a.partecipa) || a.code.localeCompare(b.code));
  let count = document.createElement('p');
  count.id = 'conferme_count';
  count.className = 'text-center p-bloc-5-style dark';
  form.appendChild(count);
  let grid = document.createElement('div');
  grid.className = 'persona-grid conferme-grid';
  grid.style.gridTemplateColumns = smallDevice ? 'repeat(4, 1fr)' : 'repeat(6, 1fr)';
  let h_nome = grid.appendChild(document.createElement('div')).innerText = 'Name';
  let h_partecipa = grid.appendChild(document.createElement('div')).innerText = 'Partecipa';
  let h_menu_bambino = grid.appendChild(document.createElement('div')).innerText = 'Menu Bambino';
  let h_menu_vegetariano = grid.appendChild(document.createElement('div')).innerText = 'Menu Vegetariano';
  if (!smallDevice) {
    let h_intolleranze = grid.appendChild(document.createElement('div')).innerHTML = 'Intolleranze<br>Allergie';
    let h_note = grid.appendChild(document.createElement('div')).innerText = 'Note';
  }
  let conferme_count = 0;
  grid.appendChild
  for (let n = 0; n < l_conferme.length; n++) {
    const obj = l_conferme[n];
    let r_nome = grid.appendChild(document.createElement('div'))
    let r_partecipa = grid.appendChild(document.createElement('div'))
    let r_menu_bambino = grid.appendChild(document.createElement('div'))
    let r_menu_vegetariano = grid.appendChild(document.createElement('div'))
    r_nome.innerText = obj.nome; r_nome.title = obj.code; r_nome.style.fontWeight = 'bold';
    r_partecipa.innerText = obj.partecipa; r_menu_bambino.innerText = obj.menu_bambino; r_menu_vegetariano.innerText = obj.menu_vegetariano;
    if (obj.partecipa === 'SI')
      conferme_count++;
    r_partecipa.classList.add(obj.partecipa === 'SI' ? 'valid' : 'invalid');
    r_menu_bambino.classList.add(obj.menu_bambino === 'SI' ? 'valid' : 'invalid');
    r_menu_vegetariano.classList.add(obj.menu_vegetariano === 'SI' ? 'valid' : 'invalid');
    if (!smallDevice) {
      let r_intolleranze = grid.appendChild(document.createElement('div'));
      r_intolleranze.innerText = r_intolleranze.title = obj.intolleranze || '';
      let r_note = grid.appendChild(document.createElement('div'));
      r_note.innerText = r_note.title = obj.note || '';
    } else {
      let h_intolleranze = grid.appendChild(document.createElement('div'));
      h_intolleranze.innerHTML = 'Intolleranze<br>Allergie'; h_intolleranze.className = 'cols-2-s';
      let r_intolleranze = grid.appendChild(document.createElement('div'));
      r_intolleranze.innerText = r_intolleranze.title = obj.intolleranze || ''; r_intolleranze.className = 'cols-2-e';
      let h_note = grid.appendChild(document.createElement('div'));
      h_note.innerText = 'Note'; h_note.className = 'cols-2-s';
      let r_note = grid.appendChild(document.createElement('div'));
      r_note.innerText = r_note.title = obj.note || ''; r_note.className = 'cols-2-e';
    }
  }
  count.innerText = conferme_count.toString() + ' confermati ad oggi.';
  form.appendChild(grid);
}
function buildMessaggiGrid(l_messaggi) {
  let form = document.querySelector(".contact-form-code");
  let grid = document.createElement('div');
  grid.className = 'persona-grid messaggi-grid';
  grid.style.gridTemplateColumns = 'repeat(3, 1fr)';
  let h_data = grid.appendChild(document.createElement('div')).innerText = 'Data';
  let h_nome = grid.appendChild(document.createElement('div')).innerText = 'Nome';
  let h_messaggio = grid.appendChild(document.createElement('div')).innerText = 'Messaggio';
  for (let n = 0; n < l_messaggi.length; n++) {
    const obj = l_messaggi[n];
    let r_data = grid.appendChild(document.createElement('div'))
    let r_nome = grid.appendChild(document.createElement('div'))
    let r_messaggio = grid.appendChild(document.createElement('div'))
    r_data.innerText = obj.data;
    r_nome.innerText = obj.nome; r_nome.style.fontWeight = 'bold';
    r_messaggio.innerText = obj.messaggio;
  }
  form.appendChild(grid);
}
function buildTentativiGrid(l_tentativi) {
  let form = document.querySelector(".contact-form-code");
  let grid = document.createElement('div');
  grid.className = 'persona-grid tentativi-grid';
  grid.style.gridTemplateColumns = 'repeat(2, 1fr)';
  let h_codice = grid.appendChild(document.createElement('div')).innerText = 'Codice';
  let h_data = grid.appendChild(document.createElement('div')).innerText = 'Data';
  for (let n = 0; n < l_tentativi.length; n++) {
    const obj = l_tentativi[n];
    let r_codice = grid.appendChild(document.createElement('div'))
    let r_data = grid.appendChild(document.createElement('div'))
    r_codice.innerText = obj.code; r_codice.style.fontWeight = 'bold';
    r_data.innerText = obj.data;
  }
  form.appendChild(grid);
}

function createCustomCheckbox(id, msg) {
  let span = document.createElement('span');
  let input = span.appendChild(document.createElement('input'));
  input.type = 'checkbox';
  input.id = id;
  let label = span.appendChild(document.createElement('label'));
  label.className = 'checkbox_control';
  label.setAttribute('for', input.id);
  return span;
}

// Save infos to Firebase
function saveContactInfo(codice, objs) {
  let confermeRep = firebase.database();
  try {
    for (const ob of objs) {
      confermeRep.ref(`conferme/${codice}/${ob.nome}`).set(ob);
    }
    setResultMessage('Conferma inviata. Grazie!', false);
    setTimeout( () => resetForm(), 3500);
  } catch (error) {
    setResultError("C'è stato un errore nell'inviare la conferma. Per favore prova a rinviarla.");
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

function resetForm() {
  let form = document.querySelector(".contact-form-code");
  let childrenLen = form.children.length;
  while (childrenLen--) {
    form.removeChild(form.children[childrenLen]);
  }

  let label = form.appendChild(document.createElement('p'));
  label.className = 'p-bloc-5-style'; label.innerText = 'Codice: ';
  let input = form.appendChild(document.createElement('input'));
  input.id = 'family-code'; input.className = 'field code'; input.placeholder = 'codice'; input.type = 'text';
  
  let submit = form.appendChild(document.createElement('button'));
  submit.className = 'submit submit-persona';
  submit.type = 'submit';
  submit.innerText = 'Invia';
}
