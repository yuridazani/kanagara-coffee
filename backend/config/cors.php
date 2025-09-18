<?php

return [

    /*
    |--------------------------------------------------------------------------
    | Cross-Origin Resource Sharing (CORS) Configuration
    |--------------------------------------------------------------------------
    |
    | Here you may configure your settings for cross-origin resource sharing
    | or "CORS". This determines what cross-origin operations may execute
    | in web browsers. You are free to adjust these settings as needed.
    |
    | To learn more: https://developer.mozilla.org/en-US/docs/Web/HTTP/CORS
    |
    */

    'paths' => ['api/*', 'sanctum/csrf-cookie'],

    'allowed_methods' => ['*'],

    'allowed_origins' => [
        'http://localhost:5173',
        'http://127.0.0.1:5173',
        'http://192.168.1.6:5173',
        // Add ngrok URLs if needed
        'https://2e987f68e3f2.ngrok-free.app',
        'https://23b6f650c308.ngrok-free.app',
    ],

    // Alternative: Use patterns for more flexibility
    'allowed_origins_patterns' => [
        '/^http:\/\/192\.168\.1\.\d+:5173$/', // Allow any IP in 192.168.1.x range
        '/^https:\/\/.*\.ngrok-free\.app$/',   // Allow any ngrok subdomain
    ],

    'allowed_headers' => ['*'],

    'exposed_headers' => [],

    'max_age' => 0,

    'supports_credentials' => false,

];