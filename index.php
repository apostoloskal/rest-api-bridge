<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Bridge</title>
    <script src="https://unpkg.com/@tailwindcss/browser@4"></script>

    <!-- Tailwind Css -->
    <style type="text/tailwindcss">
        @theme {
            --font-sans: 'Instrument Sans', ui-sans-serif, system-ui, sans-serif, 'Apple Color Emoji', 'Segoe UI Emoji',
                'Segoe UI Symbol', 'Noto Color Emoji';
        }

        @layer base {
            body {
                @apply bg-gray-50 text-gray-900 dark:bg-slate-900 dark:text-slate-50;
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
            <div class="flex-1 flex flex-row w-full justify-evenly p-4">
                <div class="w-1/3 flex flex-col items-center p-4 shadow-md bg-gray-200 dark:bg-gray-700">
                    <label htmlFor="get_restpoint" class="mb-2">Get Endpoint</label>
                    <input
                    name="get_restpoint"
                    id="get_restpoint"
                    placeholder="Paste your get url"
                    required
                    class="bg-neutral-secondary-medium border 
                    border-default-medium text-heading text-sm 
                    rounded-base focus:ring-brand focus:border-brand 
                    block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    />
                </div>
                <div class="w-1/3 flex flex-col items-center p-4 shadow-md bg-gray-200 dark:bg-gray-700">
                    <label htmlFor="post_restpoint" class="mb-2">Post Endpoint</label>
                    <input
                    name="post_restpoint"
                    id="post_restpoint"
                    placeholder="Paste your post url"
                    required
                    class="bg-neutral-secondary-medium border 
                    border-default-medium text-heading text-sm 
                    rounded-base focus:ring-brand focus:border-brand 
                    block w-full px-3 py-2.5 shadow-xs placeholder:text-body"
                    />
                </div>
            </div>
        </div>        
        <?php  
            include 'components/logic.php';
        ?>
    </main>
</body>
</html>