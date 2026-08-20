<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bridge</title>

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

            .fetch-button-1 {
                @apply text-white bg-green-500 dark:bg-green-700 rounded-lg
                box-border border border-transparent hover:bg-green-400 
                hover:dark:bg-green-600 focus:ring-4 focus:ring-green-600 
                focus:dark:ring-green-800 shadow-xs font-medium leading-5
                text-sm px-4 py-2.5 focus:outline-none
            }
        }
    </style>

</head>
<body class="min-h-screen flex flex-col">
    <main>
        <div class="flex-1 flex flex-col">
            <div class="w-full items-center p-4">
                <p class="text-center text-3xl font-semibold text-heading">Bridge</p>
            </div>
            <form method="POST" class="flex-1 flex flex-col">
                <div class="flex-1 flex flex-row w-full justify-evenly p-4">
                    <div class="w-1/3 flex flex-col items-center p-4 card-theme-1">
                        <label for="get_endpoint" class="mb-2">Get URL</label>
                        <input
                        name="get_endpoint"
                        id="get_endpoint"
                        placeholder="Paste your get endpoint url"
                        value="<?php echo isset($_POST['get_endpoint']) ? htmlspecialchars($_POST['get_endpoint']) : ''; ?>"
                        required
                        class="bg-neutral-secondary-medium border 
                        border-default-medium text-heading text-sm 
                        rounded-base focus:ring-brand focus:border-brand 
                        block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                        />
                    </div>
                    <div class="w-1/3 flex flex-col items-center p-4 card-theme-1">
                        <label for="post_endpoint" class="mb-2">Post URL</label>
                        <input
                        name="post_endpoint"
                        id="post_endpoint"
                        placeholder="Paste your post endpoint url"
                        value="<?php echo isset($_POST['post_endpoint']) ? htmlspecialchars($_POST['post_endpoint']) : ''; ?>"
                        required
                        class="bg-neutral-secondary-medium border 
                        border-default-medium text-heading text-sm 
                        rounded-base focus:ring-brand focus:border-brand 
                        block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                        />
                    </div>
                    <div class="w-1/6 items-center p-4">
                        <button type="submit" class="w-full mt-4 fetch-button-1">Fetch</button>
                    </div>
                </div>
            </form>
        <?php  
            include 'php/logic.php';
        ?>
        </div>        
    </main>
</body>
</html>