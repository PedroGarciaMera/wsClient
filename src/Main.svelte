<script>  
    import { onMount } from 'svelte';
    import { CFGs, View, imagesF, imagesB, serverIP } from './game.js';

    import Settings from './Settings.svelte';
    import Game from './Play.svelte';

    let gameName = "None"; let CFG;
    let imgNamesF = []; let imgNamesB = [];

    onMount(async () => {
        const res = await fetch(`http://${serverIP}:22122/`).catch(function(err) { $View = "Error"; return; });;
        gameName = await res.text();
        CFG = CFGs[gameName];

        for (let i=1; i<=CFG.f; i++) imgNamesF.push(i);
        for (let i=1; i<=CFG.b; i++) imgNamesB.push(i);

        $View = "Settings";
	});    
</script>

<svelte:head>
    <link rel='icon' type='image/png' href='/imgs/{gameName}/ico.png'>
	<title>{gameName}</title>
</svelte:head>

{#if $View=="Loading"}
    <div class="bigCenter"> ⏳ CARGANDO ⏳ </div>
{:else if $View=="Error"}
    <div class="bigCenter"> ⚠️ Unable to connect to server ⚠️ </div>
{:else if $View=="Settings"}
    <Settings game={gameName}/>
{:else if $View=="Game"}
    <Game gameCFG={CFG}/>
{:else}
    404 VIEW NOT FOUND
{/if}


<div style="display:none;">
    {#each imgNamesF as imgName}
        <img bind:this={imagesF[imgName]} src="/imgs/{gameName}/front/{imgName}.png" alt="{imgName}f">
    {/each}

    {#each imgNamesB as imgName}
        <img bind:this={imagesB[imgName]} src="/imgs/{gameName}/back/{imgName}.png" alt="{imgName}b">
    {/each}
</div>


<style>
    .bigCenter {
        height: 100%; width: 100%;
        display: flex; justify-content: center; align-items: center;
        font-size: 4vw; color:white;
    }
</style>