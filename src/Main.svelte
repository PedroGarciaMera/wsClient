<script>  
    import { CFGs, View, imagesF, imagesB } from './game.js';

    export let gameName; let CFG = CFGs[gameName];

    import Settings from './Settings.svelte';
    import Game from './Play.svelte';

    let imgNamesF = []; for (let i=1; i<=CFG.f; i++) imgNamesF.push(i);
    let imgNamesB = []; for (let i=1; i<=CFG.b; i++) imgNamesB.push(i);
</script>

<svelte:head>
    <link rel='icon' type='image/png' href='/imgs/{gameName}/front/1.png'>
	<title>{gameName}</title>
</svelte:head>

{#if $View=="Settings"}
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