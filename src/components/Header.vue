<script setup>
import Logo from "./Logo.vue";
</script>

<template>
    <header>
        <div class="container">
            <Logo />
            <slot></slot>
        </div>
    </header>
</template>

<style scoped>
header{
    background-color:var(--clr-neutral-200);
}
.container{
    display:flex;
    justify-content:space-between;
    align-items:center;
}
:slotted(a){
    text-decoration:none;
    color:var(--clr-neutral-900);
    text-transform:uppercase;
    font-weight:var(--fw-bold);
    position:relative;
    cursor:pointer;
    user-select:none;
    margin:var(--size-400);
}
:slotted(a)::after{
    content:"";
    border-bottom:solid 3px currentColor;
    width:50%;
    height:4px;
    position:absolute;
    bottom:-5px;
    left:0px;
    pointer-events:none;
    transition:all 0.1s cubic-bezier(0.215, 0.610, 0.055, 1);
}
:slotted(a):hover::after{
    /* width:100%; */
    margin-left:50%;
}

:slotted(*){
    font-size:var(--fs-600);
}
</style>