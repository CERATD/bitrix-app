<?php

// ===== 1. Получаем входящие данные =====
$input = file_get_contents('php://input');
$data = json_decode($input, true);

// Логируем вход (для отладки)
file_put_contents(__DIR__ . '/log.txt', date('c') . "\n" . $input . "\n\n", FILE_APPEND);

// ===== 2. Достаём нужные поля =====
$dealId = $data['data']['FIELDS']['ID'] ?? null;
$brand  = $data['data']['FIELDS']['UF_CRM_1777624909'] ?? null; // код поля "Марка"
$model  = $data['data']['FIELDS']['UF_CRM_1777625516'] ?? null; // код поля "Модель"

// ===== 3. Проверка =====
if (!$dealId || !$brand) {
    exit('No dealId or brand');
}

// ===== 4. Карта моделей =====
$map = [
    'BMW' => ['X5', 'X3', '3-Series'],
    'Audi' => ['A4', 'Q5', 'A6'],
    'Mercedes' => ['C-Class', 'E-Class', 'GLA'],
];

// ===== 5. Проверяем допустимые модели =====
$allowedModels = $map[$brand] ?? [];

if (empty($allowedModels)) {
    exit('No models for brand');
}

// ===== 6. Если модель невалидна =====
if (!in_array($model, $allowedModels, true)) {

    // Берём первую модель из списка
    $newModel = $allowedModels[0];

    // ===== 7. Отправка в Bitrix =====
    $webhookUrl = 'https://electropro.bitrix24.ru/rest/1/x3do1uj742y3myx9/crm.deal.update';

    $params = [
        'id' => $dealId,
        'fields' => [
            'UF_CRM_MODEL' => $newModel,
        ],
    ];

    $ch = curl_init($webhookUrl);

    curl_setopt_array($ch, [
        CURLOPT_POST => true,
        CURLOPT_POSTFIELDS => http_build_query($params),
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT => 10,
    ]);

    $response = curl_exec($ch);
    $error    = curl_error($ch);

    curl_close($ch);

    // ===== 8. Лог результата =====
    file_put_contents(
        __DIR__ . '/log.txt',
        "UPDATE RESPONSE:\n" . $response . "\nERROR:\n" . $error . "\n\n",
        FILE_APPEND
    );
}

echo 'OK';
