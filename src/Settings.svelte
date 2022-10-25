<script>
    import { CFGs, View, Name } from './game.js';

    export let game;  let gameCFG = CFGs[game];

    function join(){ $View="Game"; }
</script>


<svelte:window on:keyup={(e) => { if(e.key=='Enter') join(); }}/>

<div class="bg" style="background-image:url('/imgs/{game}/BG.png');">
    <div class="center" style="width:{gameCFG.lw};height:{gameCFG.lh};">
        <input style="margin:1%;" type="text" pattern="[A-Za-z]" bind:value={$Name} placeholder="Nickname" maxlength="10"/>
        <button style="margin:1%;" on:click={join} disabled={$Name==""}>JOIN</button>
    </div>
</div>


<style>
    .bg {
        width: 100%; height: 100%;
        background-repeat: no-repeat;
        background-size:100% 100%;
    }
    .center { display: flex; justify-content: center; align-items: center; }
</style>
