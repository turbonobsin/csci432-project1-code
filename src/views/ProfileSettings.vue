<script setup lang="ts">
</script>

<template>
    <section class="container">
        <header class="sub-header">
            <RouterLink to="/profile" class="go-back">
                <div class="icon">west</div>
            </RouterLink>
            <div>Account Settings</div>
        </header>

        <main>
            <div class="info-item no-bg">
                <h3 class="flex align-center space-between">
                    <div>Password</div>
                    <button>Change Password</button>
                </h3>
                <!-- <p class="note">Making your account public means that anyone can view your information.</p> -->
            </div>
            <hr>
            <div class="info-item no-bg">
                <h3 class="flex align-center space-between">
                    <div>Change Account Visibility</div>
                    <button>Go Public</button>
                </h3>
                <p class="note">Making your account public means that anyone can view your information.</p>
            </div>
            <hr>
        </main>
    </section>
</template>

<style scoped>

.info-item{
    margin-block:var(--size-400);
}
.info-item p.note{
    color:var(--clr-neutral-900);
    font-size:var(--fs-400);
    font-style:italic;
    margin-top:var(--size-400);
}

</style>