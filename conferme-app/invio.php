<?php
// verifico, attraverso la funzione is_uploaded_file, che il file sia stato caricato
if (!isset($_FILES['immagine']) || !is_uploaded_file($_FILES['immagine']['tmp_name'])) {
    echo 'File non inviato';
    exit;   
}
// verifico, attraverso la funzione is_uploaded_file, che il file sia stato caricato
if (!isset($_FILES['video']) || !is_uploaded_file($_FILES['video']['tmp_name'])) {
    echo 'File non inviato';
    exit;   
}
// limito la dimensione massima a 4MB
if ($_FILES['immagine']['size'] > 4194304) {
    echo 'Il file non può eccedere i 4 MB';
    exit;
}
// limito la dimensione massima a 250MB
if ($_FILES['video']['size'] > 262144000) {
    echo 'Il file non può eccedere i 250 MB';
    exit;
}
$target_file = 'mioupload/' . $_FILES['immagine']['name'];
if (file_exists($target_file)) {
    echo 'Il file esiste già';
    exit;
}
$target_file = 'mioupload/' . $_FILES['video']['name'];
if (file_exists($target_file)) {
    echo 'Il file esiste già';
    exit;
}
//imposto il percorso della cartella dove mettere il file caricato dall’utente
$uploaddir = 'mioupload/';
//recupero il percorso temporaneo del file
$immagine_tmp = $_FILES['immagine']['tmp_name'];
//recupero il nome originale del file caricato
$immagine_name = $_FILES['immagine']['name'];
// verifico, attraverso la funzione move_uploaded_file, se il file è stato spostato nella cartella mioupload del server
if (move_uploaded_file($immagine_tmp, $uploaddir . $immagine_name)) {
    echo 'File inviato';
}else{
    echo 'Caricamento invalido';
}
//recupero il percorso temporaneo del file
$video_tmp = $_FILES['video']['tmp_name'];
//recupero il nome originale del file caricato
$video_name = $_FILES['video']['name'];
// verifico, attraverso la funzione move_uploaded_file, se il file è stato spostato nella cartella mioupload del server
if (move_uploaded_file($video_tmp, $uploaddir . $video_name)) {
    echo 'File inviato';
}else{
    echo 'Caricamento invalido';
}
?>
<form enctype="multipart/form-data" method="POST">
<input type="hidden" name="MAX_FILE_SIZE" value="4194304">
Carica un'immagine in formato jpg o png<br>
<input type="file" name="immagine"><br><br>
<input type="submit" value="Invia"><br>
Il tempo di caricamento dipende dalla tua velocità di connessione. <br>
Attendi la scritta: "File inviato con successo." per essere sicuro di aver spedito il file.
</form>

<form enctype="multipart/form-data" method="POST">
<input type="hidden" name="MAX_FILE_SIZE" value="262144000">
Carica un video<br>
<input type="file" name="video"><br><br>
<input type="submit" value="Invia"><br>
Il tempo di caricamento dipende dalla tua velocità di connessione. <br>
Attendi la scritta: "File inviato con successo." per essere sicuro di aver spedito il file.
</form>