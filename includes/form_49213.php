<?php	
	if(empty($_POST['name_49213']) && strlen($_POST['name_49213']) == 0 || empty($_POST['email_49213']) && strlen($_POST['email_49213']) == 0 || empty($_POST['email_49213']) && strlen($_POST['email_49213']) == 0 || empty($_POST['email_49213']) && strlen($_POST['email_49213']) == 0)
	{
		return false;
	}
	
	$name_49213 = $_POST['name_49213'];
	$email_49213 = $_POST['email_49213'];
	$email_49213 = $_POST['email_49213'];
	$email_49213 = $_POST['email_49213'];
	$message_49213 = $_POST['message_49213'];
	
	$to = 'receiver@yoursite.com'; // Email submissions are sent to this email

	// Create email	
	$email_subject = "Message from a Blocs website.";
	$email_body = "You have received a new message. \n\n".
				  "Name_49213: $name_49213 \nEmail_49213: $email_49213 \nEmail_49213: $email_49213 \nEmail_49213: $email_49213 \nMessage_49213: $message_49213 \n";
	$headers = "MIME-Version: 1.0\r\nContent-type: text/plain; charset=UTF-8\r\n";	
	$headers .= "From: contact@yoursite.com\n";
	$headers .= "Reply-To: $email_49213";	
	
	mail($to,$email_subject,$email_body,$headers); // Post message
	return true;			
?>