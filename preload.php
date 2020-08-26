<?php
    session_start();
//	if($_FILES['img']['size'] < 2000000)
//	{
		$destination = __DIR__ .'/upl/'.session_id().'_'.time().'.'.array_pop(explode('.',$_FILES['img']['name']));
		if(is_file($destination))
			unlink($destination);
		move_uploaded_file($_FILES['img']['tmp_name'], $destination);
		$destination_browser = str_replace($_SERVER['DOCUMENT_ROOT'], '', $destination).'?'.rand(0,9999999);
		echo $destination_browser;
//	}