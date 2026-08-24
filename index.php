<?php 
    include 'php/rest_api_methods.php'; 
?>

<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bridge</title>

    <!-- CodeMirror Core CSS -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.css">

    <!-- CodeMirror Core JS -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/codemirror.min.js"></script>

    <!-- CodeMirror JSON/JavaScript Mode -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/mode/javascript/javascript.min.js"></script>

    <!-- CodeMirror Dracula Dark Theme -->
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/codemirror/5.65.13/theme/dracula.min.css">

    <!-- Tailwind CSS -->
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>
    <style type="text/tailwindcss">
        @theme {
            --font-sans: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
                'Segoe UI Symbol', 'Noto Color Emoji';
        }

        @layer base {
            body {
                @apply bg-gray-50 text-gray-900 text-lg dark:bg-slate-800 dark:text-slate-50;
            }
        }

        @layer components {
            .card-theme-1 {
                @apply shadow-md bg-gray-200 dark:bg-slate-600 rounded-lg
            }

            .green-button-1 {
                @apply text-white bg-green-500 dark:bg-green-700 rounded-lg
                box-border border border-transparent hover:bg-green-400 
                hover:dark:bg-green-600 focus:ring-4 focus:ring-green-600 
                focus:dark:ring-green-800 shadow-xs font-medium leading-5
                text-sm px-4 py-2.5 focus:outline-none cursor-pointer
            }

            .blue-button-1 {
                @apply text-white bg-blue-500 dark:bg-blue-700 rounded-lg
                box-border border border-transparent hover:bg-blue-400 
                hover:dark:bg-blue-600 focus:ring-4 focus:ring-blue-600 
                focus:dark:ring-blue-800 shadow-xs font-medium leading-5
                text-sm px-4 py-2.5 focus:outline-none cursor-pointer
            }

            .red-button-1 {
                @apply bg-red-500 hover:bg-red-400 text-white px-3 py-1 rounded text-sm
            }

            .table-theme-1 {
                @apply bg-gray-300 dark:bg-slate-800 focus:outline-none rounded-lg
                box-border border border-transparent focus:ring-2 focus:ring-gray-400
                focus:dark:ring-slate-800 shadow-xs text-sm
            }

            .card-theme-2 {
                @apply shadow-md bg-gray-300 dark:bg-slate-800 rounded-lg
            }
        }
    </style>

    <style>
        .CodeMirror {
            height: 100% !important;
            font-family: monospace;
            font-size: medium;
            border-radius: 0.5rem;
            overflow: hidden;
            box-shadow: 0 1px 2px 0 rgb(0 0 0 / 0.05);
            cursor: text;
        }
    </style>

    <script>
        // Prevent browser from resubmitting the form on page refresh (F5)
        if (window.history.replaceState) {
            window.history.replaceState(null, null, window.location.href);
        }
    </script>

</head>
<body class="min-h-screen flex flex-col">
    <main>
        <form method="POST" class="flex-1 flex flex-col max-w-5xl m-auto">
            <div class="w-full items-center p-4">
                <p class="text-center text-4xl font-semibold text-heading">Bridge</p>
            </div>
            <div class="flex-1 flex flex-row justify-between">
                <button type="button" id="btn-new-bridge" class="green-button-1 cursor-pointer ml-4 p-2">
                    New Bridge
                </button>
                <button type="button" id="btn-clear" class="red-button-1 cursor-pointer mr-4 p-2">
                    Clear All
                </button>
            </div>
            
            <!-- POST Response Alert -->
            <?php if (isset($postResult)): ?>
                <div id="post-response-alert" 
                class="mx-4 m-4 p-4 rounded-lg shadow-md border 
                <?php echo $postResult['success'] ? 
                'bg-green-100 border-green-400 text-green-800 
                dark:bg-green-900/30 dark:text-green-300 dark:border-green-800' : 
                'bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 
                dark:text-red-300 dark:border-red-800'; ?>">
                    
                    <!-- Header & Close Button -->
                    <div class="flex justify-between items-center pb-2 mb-2 border-b 
                    <?php echo $postResult['success'] ? 
                    'border-green-300 dark:border-green-700/50' : 
                    'border-red-300 dark:border-red-700/50'; ?>">
                        <p class="font-bold text-lg">
                            <?php echo $postResult['success'] ? '✅ POST Successful!' : '❌ POST Failed'; ?>
                            <?php if(isset($postResult['code'])) echo " (HTTP " . $postResult['code'] . ")"; ?>
                        </p>
                        <!-- Inline JS to close the alert -->
                        <button type="button" 
                        onclick="document.getElementById('post-response-alert').style.display='none'" 
                        class="text-2xl font-bold cursor-pointer hover:opacity-70">
                            &times;
                        </button>
                    </div>
                    
                    <!-- Error Message (if cURL failed completely) -->
                    <?php if (isset($postResult['message'])): ?>
                        <p class="mb-2"><?php echo htmlspecialchars($postResult['message']); ?></p>
                    <?php endif; ?>
                    
                    <!-- The Server's Response Data -->
                    <?php if (isset($postResult['response']) && !empty($postResult['response'])): ?>
                        <p class="text-sm font-semibold mb-1">Server Response:</p>
                        <pre class="p-2 bg-white/60 dark:bg-black/30 rounded text-sm overflow-x-auto whitespace-pre-wrap"><?php 
                            // Try to pretty-print the response if it's JSON
                            $resDecoded = json_decode($postResult['response']);
                            echo htmlspecialchars(json_last_error() === JSON_ERROR_NONE ? 
                            json_encode($resDecoded, JSON_PRETTY_PRINT) : 
                            $postResult['response']); 
                            ?>
                        </pre>
                    <?php endif; ?>
                </div>
            <?php endif; ?>

            <!-- Fetch and Post inputs -->
            <div class="flex-1 flex flex-col card-theme-1 m-4 p-2">
                <div class="w-full items-center pb-2 border-b border-gray-300 dark:border-slate-500">
                    <p class="text-center text-2xl font-semibold text-heading">Bridge Details</p>
                </div>

                <div class="flex-1 flex flex-row">
                    <div class="w-1/3 flex flex-col items-center card-theme-2 p-4 m-4"> 
                        <label for="get-endpoint" class="mb-2">Bridge Name</label>
                        <input
                        name="bridge-name"
                        id="bridge-name"
                        placeholder="Bridge name"
                        class="bg-neutral-secondary-medium border 
                        border-default-medium text-heading text-sm 
                        rounded-base focus:ring-brand focus:border-brand 
                        block w-full px-3 py-2.5 shadow-xs placeholder:text-body
                        focus:outline-none"
                        />
                    </div>

                    <div class="w-1/3 flex flex-col items-center card-theme-2 p-4 m-4"> 
                        <label for="get-endpoint" class="mb-2">Get URL</label>
                        <input
                        name="get-endpoint"
                        id="get-endpoint"
                        placeholder="Get endpoint url"
                        value="<?php echo isset($_POST['get-endpoint']) ? htmlspecialchars($_POST['get-endpoint']) : ''; ?>"
                        class="bg-neutral-secondary-medium border 
                        border-default-medium text-heading text-sm 
                        rounded-base focus:ring-brand focus:border-brand 
                        block w-full px-3 py-2.5 shadow-xs placeholder:text-body
                        focus:outline-none"
                        />
                    </div>

                    <div class="w-1/3 flex flex-col items-center card-theme-2 p-4 m-4"> 
                        <label for="post-endpoint" class="mb-2">Post URL</label>
                        <input
                        name="post-endpoint"
                        id="post-endpoint"
                        placeholder="Post endpoint url"
                        value="<?php echo isset($_POST['post-endpoint']) ? htmlspecialchars($_POST['post-endpoint']) : ''; ?>"
                        class="bg-neutral-secondary-medium border 
                        border-default-medium text-heading text-sm 
                        rounded-base focus:ring-brand focus:border-brand 
                        block w-full px-3 py-2.5 shadow-xs placeholder:text-body
                        focus:outline-none"
                        />
                    </div>
                </div>
            </div>

            <!-- JSON Text Area -->
            <div class="flex-1 flex flex-col card-theme-1 m-4 p-2">
                <div class="w-full items-center pb-2 border-b border-gray-300 dark:border-slate-500">
                    <p class="text-center text-2xl font-semibold text-heading">JSON</p>
                </div>
                
                <!-- Code Mirror Text Areas -->
                <div class="flex-1 flex flex-row min-h-[400px]"> 
                    
                    <div class="flex flex-col w-1/2 p-2 border-r border-gray-300 dark:border-slate-500">
                        <p class="text-center text-xl font-semibold text-heading pb-2">GET</p>
                        <div class="w-full h-full text-left">
                            <textarea id="textarea-get" name="get-json"><?php echo htmlspecialchars($fetchedJson ?? ''); ?></textarea>
                        </div>
                    </div>
                    
                    <div class="flex flex-col w-1/2 p-2">
                        <p class="text-center text-xl font-semibold text-heading pb-2">POST</p>
                        <div class="w-full h-full text-left">
                            <textarea id="textarea-post" name="post-json"><?php echo htmlspecialchars($_POST['post-json'] ?? ''); ?></textarea>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Table Mapping -->
            <div class="flex-1 flex flex-col card-theme-1 m-4 p-2">
                <div class="w-full items-center pb-2 border-b border-gray-300 dark:border-slate-500">
                    <p class="text-center text-2xl font-semibold text-heading">Visual Mapper</p>
                </div>
                
                <div class="flex-1 flex flex-row min-h-[300px]"> 
                    <div class="flex flex-col w-1/2 p-2 border-r border-gray-300 dark:border-slate-500">
                        <p class="text-center text-xl font-semibold text-heading pb-2">GET Data (Drag from here)</p>
                        <div id="get-table-container" class="w-full h-full flex flex-col gap-2 overflow-y-auto table-theme-1 p-2">
                            <p class="text-center text-sm text-gray-500 mt-10">Waiting for valid GET JSON...</p>
                        </div>
                    </div>
                    
                    <div class="flex flex-col w-1/2 p-2">
                        <p class="text-center text-xl font-semibold text-heading pb-2">POST Payload (Drop here)</p>
                        <div id="post-table-container" class="w-full h-full flex flex-col gap-2 overflow-y-auto table-theme-1 p-2">
                            <p class="text-center text-sm text-gray-500 mt-10">Waiting for valid POST JSON...</p>
                        </div>
                    </div>
                </div>
            </div>
        </form>
    </main>

    <script type="module" src="js/main.js"></script>
</body>
</html>