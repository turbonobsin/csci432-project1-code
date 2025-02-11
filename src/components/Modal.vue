<script setup lang="ts">
import { onMounted, ref } from 'vue';

let showModal = ref(false);

function open(){
    console.log("open modal");
    showModal.value = true;
}
function close(){
    console.log("close modal");
    showModal.value = false;
}

defineExpose({
    open,close
});

</script>

<template>
    <div v-show="showModal" class="modal-backdrop fade-in" @click.self="close" @keydown.esc="close">
        <div class="modal">
            <header>
                <slot name="header"></slot>
                <button @click.stop="close" class="icon model-btn b-close">close</button>
            </header>

            <main>
                <slot name="main"></slot>
            </main>

            <footer>
                <slot name="footer"></slot>
            </footer>
        </div>
    </div>
</template>

<style scoped>

.modal-backdrop{
    position:fixed;
    inset:0px;
    background-color:var(--clr-modal-backdrop);
    display:flex;
    justify-content:center;
    align-items:center;
}
.modal{
    background-color:var(--clr-modal-bg);
    /* padding:var(--size-300); */
    border-radius:var(--size-200);
    overflow:hidden;
}
.modal-btn{
    border-radius:50%;
}

header{
    display:flex;
    align-items:center;
    font-size:var(--fs-650);
    background-color:var(--clr-neutral-300);
    padding:var(--size-300) var(--size-500);
    text-transform:uppercase;
    font-family:monospace;
    /* border-bottom:solid 5px var(--clr-accent-400); */
}
footer{
    display:flex;
    justify-content:center;
    align-items:center;
    margin-top:var(--size-400);
    justify-content:space-between;
    gap:var(--size-300);
    padding:var(--size-300);
}
footer > :deep(button){
    width:100%;
}
main{
    padding:var(--size-500);
}
.b-close{
    margin-left:auto;
}

:deep(.form){
    width:300px;
}

</style>