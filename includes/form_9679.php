<?php	
	if(empty($_POST['name_9679']) && strlen($_POST['name_9679']) == 0 || empty($_POST['email_9679']) && strlen($_POST['email_9679']) == 0 || empty($_POST['tel_9679']) && strlen($_POST['tel_9679']) == 0 || empty($_POST['message_9679']) && strlen($_POST['message_9679']) == 0)
	{
		return false;
	}
	
	$name_9679 = $_POST['name_9679'];
	$email_9679 = $_POST['email_9679'];
	$tel_9679 = $_POST['tel_9679'];
	$message_9679 = $_POST['message_9679'];
	
	$to = 'rickygiordy@hotmail.com'; // Email submissions are sent to this email

	// Create email	
	$email_subject = "Messaggio da contattaci";
	$email_body = "You have received a new message. \n\n".
				  "Name_9679: $name_9679 \nEmail_9679: $email_9679 \nTel_9679: $tel_9679 \nMessage_9679: $message_9679 \n";
	$headers = "MIME-Version: 1.0\r\nContent-type: text/plain; charset=UTF-8\r\n";	
	$headers .= "From: contact@yoursite.com\n";
	$headers .= "Reply-To: $tel_9679";	
	
	mail($to,$email_subject,$email_body,$headers); // Post message
	return true;			
?>