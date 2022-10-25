import App from './Main.svelte';

// "Carcassone", "Chess", "MrJackPocket"
const app = new App({
	target: document.body,
	props: { gameName:"MrJackPocket" }
});

export default app;