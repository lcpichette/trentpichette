<script lang='ts'>
    import { onMount } from 'svelte';
    import { fade } from 'svelte/transition';
    export let data;
    let artworks, tags, splashArt, signature;

    onMount(async () => {
		artworks = cleanArtworks();
        tags = data.props.tags
        splashArt = data.props.splashArts[0];
        signature = data.props.signatures[0];
	});

    function cleanArtworks() {
        return data.props.artworks.filter((art) => art.file).sort((art1, art2) => art1.made > art2.made).reverse();
    }

    $: {
        console.log('artworks:', artworks);
    }

    let filters = {
        sortBy: 'desc',
        tag: '',
        search: ''
    };

    const updateResults = () => {
        console.log('updating results, filters:', filters);
        if (filters.search !== '' && filters.tag !== '') {
            artworks = cleanArtworks().filter((art) => art.title.toLowerCase().includes(filters.search.toLowerCase()) && filters.tag === art.tag);
        } else if (filters.search !== '') {
            artworks = cleanArtworks().filter((art) => art.title.toLowerCase().includes(filters.search.toLowerCase()));
        } else if (filters.tag !== '') {
            console.log('just tags');
            console.log('filters.tag vs filtered-artwork:', filters.tag, cleanArtworks().filter((art) => filters.tag === art.tag));
            artworks = cleanArtworks().filter((art) => filters.tag === art.tag);
        } else {
            artworks = cleanArtworks();
        }

        if(filters.sortBy === 'asc') {
            artworks = artworks.filter((art) => art.file).sort((art1, art2) => art1.made > art2.made);
        } else {
            artworks = artworks.filter((art) => art.file).sort((art1, art2) => art1.made > art2.made).reverse();
        }
    }
</script>

<svelte:head>
	<title>Trent Pichette</title>
	<meta name="description" content="Trent Pichette's Portfolio" />
</svelte:head>

{#if splashArt && splashArt.splashArtImage && splashArt.splashArtImage.url}
<section class='splash fill-screen' style={`background-image:url(${splashArt.splashArtImage.url})`}>
    <div class='tint fill-screen'></div>
	<h1 class='fill-screen'>Trent Pichette</h1>
</section>
{:else}
<span>Loading...</span>
{/if}

<div id='navbar'>
    <a href='#portfolio'>Portfolio</a>
    <a href='/'>Contact</a>
</div>

{#if tags && artworks}
<div class='filters'>
    <div class='filter-option search'>
        <input type='text' placeholder='The one with lines...' bind:value={filters.search} on:change={() => updateResults()}/>
        <label for='tags'>Search For</label>
    </div>
    <div class='filter-option'>
        <select name='tags' id='tags' bind:value={filters.tag} on:change={() => updateResults()}>
            <option value='' selected>--</option>
            {#each tags as tag}
                <option value={tag}>{tag}</option>
            {/each}
        </select>
        <label for='tags'>Filter By</label>
    </div>
    <div class='filter-option'>
        <select id='sortBy' bind:value={filters.sortBy} on:change={() => updateResults()}>
            <option value='desc'>Newest</option>
            <option value='asc'>Oldest</option>
        </select>
        <label for='sortBy'>Sort By</label>
    </div>

</div>
{/if}

{#if artworks}
<p>{artworks.length}</p>
<section id='portfolio'>
    {#each artworks as art (art.id)}
        <img src={art.file.url} alt={art.title} out:fade={{ delay: Math.floor(Math.random() * 500) + 300 }} in:fade={{ delay: Math.floor(Math.random() * 350) + 150 }}/>
    {/each}
</section>
{/if}

<footer>
    <div class='top-bar'>
        <div>
            {#if signature}
            <img src={signature.signature.url} alt='signature' width='300' />
            {/if}
        </div>
        <div>
            <a href='/about'>Contact Me</a>
        </div>
    </div>
    <div class='bottom-bar'>
        <span>Copyright 2023 Trent Pichette. All rights reserved.</span>
    </div>
</footer>

<style>
    :root {
        --portfolio-padding: 80px;
        --portfolio-art-gap: 20px;
        --filters-height: 64px;
        --filter-label-gap: 6px;
        --filter-label-font-size: 0.75rem;
        --filter-label-opacity-default: 0;
        --filter-label-opacity-show: 0.8;
        --outline-rgb: 120,120,120;
    }
    * {
        transition: 250ms ease-in-out;
    }
    #navbar {
        position: absolute;
        top: 0;
        right: 0;

        display: flex;
        flex-direction: row;
        justify-content: flex-end;

        gap: 2rem;
        font-size: 1.5rem;
        padding: 0.5rem 1rem;

        width: 100vw;
        max-width: 100%;
        z-index: 100;
    }
    #navbar > a {
        margin: 0;
        height: 50px;
        color: white;
        text-decoration: none;
        padding: 1rem;
    }
    section.splash {
        display: block;
        position: relative;

        background-attachment: fixed;
    	background-size: 100vw 100vh;
    }
    h1 {
        text-transform: uppercase;
        font-size: 4rem;
        font-weight: 400;
        letter-spacing: 0.05em;
        color: white;

        text-align: center;
        line-height: 100vh;

        position: absolute;
        top: 0;
        left: 0;
        margin: 0;
        padding: 0;
    }
    .tint {
        position: absolute;
        top: 0;
        left: 0;
        background-color: rgba(0,0,0,.6);
    }
    div.filters {
        display: flex;
        margin: var(--portfolio-padding) calc(var(--portfolio-padding) * 3);
        gap: 1rem;
    }
    div.filters div.filter-option {
        display: flex;
        flex-direction: column-reverse;
        gap: var(--filter-label-gap);
        height: var(--filters-height);
    }
    div.filter-option label {
        font-size: var(--filter-label-font-size);
        opacity: var(--filter-label-opacity-default);
    }
    div.filter-option input:hover + label,
    div.filter-option select:hover + label{
        opacity: var(--filter-label-opacity-show);
    }
    .search {
        width: 100%;
        box-sizing: border-box;
    }
    div.filters select,
    div.filters input {
        border-radius: var(--filters-height);
        padding: 6px 16px;
        border: 1px solid rgba(var(--outline-rgb),.6);
        font-size: 1rem;
    }
    div.filters > *:focus {
        border: 1px solid rgba(var(--outline-rgb),.6);
        outline: 2px solid rgba(var(--outline-rgb),.3);
        outline-offset: 1px;
    }
    div.filters input[type='text'] {
        width: 100%;
        box-sizing: border-box;
        height: 100%;
    }
    div.filters select {
        width: 140px;
        height: calc(var(--filters-height) - var(--filter-label-gap));
        appearance: none;
        background: url(/angle-down-solid.png) no-repeat scroll calc(85%) center/8px auto;
    }
    option {
        border: 1px solid rgba(var(--outline-rgb),.6);
    }
    option:hover {
        background-color: rgba(0,255,0,0.3);
    }
    section#portfolio {
        max-width: 100%;
        width: 100vw;
        box-sizing: border-box;
        padding: 0 var(--portfolio-padding);
        display: grid;
        grid-auto-rows: auto;
        grid-template-columns: repeat(auto-fill, minmax(25vw, 1fr));
        grid-column-gap: var(--portfolio-art-gap);
        grid-row-gap: var(--portfolio-art-gap);
    }
    section#portfolio img {
        max-width: 100%;
    }

    footer {
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 300px;
        padding: 30px;
    }
    footer div.top-bar,
    footer div.bottom-bar {
        display: flex;
        flex-direction: row;
    }
    footer div.top-bar {
        justify-content: center;
        align-items: center;
        text-align: center;
        gap: 2rem;
        font-size: 1.25rem;
        font-weight: bold;
        height: 90%;
    }
    footer div.top-bar > div {
        width: 50%;
    }
    footer div top-bar img {
        align-self: center;
    }
    footer div.bottom-bar {
        justify-content: center;
        align-items: flex-end;
        height: 10%;
        font-size: 0.75rem;
    }
    footer a {
        color: black;
        text-decoration: none;
    }
</style>
