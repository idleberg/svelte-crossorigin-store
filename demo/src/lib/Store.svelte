<script>
    import { Button, ButtonSet, Tag } from "carbon-components-svelte";
    import { createStore } from '../../../src/index.ts';

    import Add from "carbon-icons-svelte/lib/Add.svelte";
    import Subtract from "carbon-icons-svelte/lib/Subtract.svelte";
    import Reset from "carbon-icons-svelte/lib/Reset.svelte";

    const store = createStore(1, {
        callback: (value) => {
            localStorage.setItem('counter', value);
        }
    });

    const clickHandler = (value = 0) => {
        store.update(counter => value === null ? 0 : counter + value);
    }
</script>

<section>
    <h2>
        {window && window === window?.top ? 'Parent' : 'iFrame'}
        <Tag type="outline">{window?.location?.host}</Tag>
        <Tag type="high-contrast">Current Value: {$store}</Tag>
    </h2>
    
    <ButtonSet>
        <Button icon={Add} on:click={() => clickHandler(1)}>Add</Button>
        <Button icon={Subtract} on:click={() => clickHandler(-1)}>Subtract</Button>
        <Button icon={Reset} kind="secondary" on:click={() => clickHandler(null)}>reset</Button>
    </ButtonSet>
</section>

<style>
    h2 {
        margin: 1rem 0
    }

    section {
        height: 150px;
    }
</style>