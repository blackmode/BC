
<form method="post" action="">
	<inpur type="text" name="text" />

</form>
<?php

if ((isset($_GET['img']) && $_GET['img']!='') || (isset($_POST['text']) && $_POST['text']!='')) {

	$return = '';
	$match = '';

	$content = '';
	if (file_exists($_GET['img'])) {
		$content = (string)file_get_contents($_GET['img']);
	}
	else 
		$content = $_POST['text'];
print_r($content);
	 preg_match_all('#\begin{tikzpicture}(.*)\end{tikzpicture}#', $content, $match);
		$return = $match;
 
 


	echo '<xmp style="text-align: left;">';
	print_r($return);
	echo '</xmp><br />';
}
else 
	echo 'zadny vstup';