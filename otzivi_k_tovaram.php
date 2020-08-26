<?require($_SERVER["DOCUMENT_ROOT"]."/bitrix/modules/main/include/prolog_before.php");
	header('Content-Type: application/json');

	use Bitrix\Main\Context;

	$request = Context::GetCurrent()->getRequest();
	$values = $request->get('values');
	$recaptcha = $request->get('g-recaptcha-response');

	$secret = '6LcuBqQUAAAAAMcCJjxO_bWofoybsLCsuVVmGD_O';
	$verifyResponse = file_get_contents('https://www.google.com/recaptcha/api/siteverify?secret='.$secret.'&response='.$recaptcha);
	$responseData = json_decode($verifyResponse, true);

	$response = array();
	if($responseData['success']){

		$imgs = array();
		foreach ($values[5] as $img){
			array_push($imgs, CFile::MakeFileArray($_SERVER["DOCUMENT_ROOT"].stristr($img, '?', true)));
		}

		$el = new CIBlockElement;

		$PROP = array();
		$PROP[207] = $values[3];
		$PROP[208] = $values[1];
		$PROP[209] = $values[2];
		$PROP[210] = $imgs;


		$arLoadProductArray = Array(
			"MODIFIED_BY"    => $USER->GetID(),
			"IBLOCK_SECTION_ID" => false,
			"IBLOCK_ID"      => Constants::OTZIV_K_TOVARAM_IBLOCK_ID,
			"PROPERTY_VALUES"=> $PROP,
			"NAME"           => $values[0],
			"DETAIL_TEXT"    => $values[4],
			"ACTIVE"         => "Y",
		);

		if($PRODUCT_ID = $el->Add($arLoadProductArray)){
			array_push($response, true);
			array_push($response, "Ваш отзыв отправлен");
		}else{
			$error = $el->LAST_ERROR;
			array_push($response, false);
			array_push($response, $error);
		}
	}else{
		array_push($response, false);
		array_push($response, 'Не заполнена CAPTCHA');
	}

	echo json_encode($response, JSON_UNESCAPED_UNICODE);
