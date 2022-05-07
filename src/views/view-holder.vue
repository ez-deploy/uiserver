<template>
  <t-layout>
    <t-header>
      <topbar/>
    </t-header>
    <t-layout>
      <t-content>
        <router-view/>
      </t-content>
    </t-layout>
  </t-layout>
</template>

<script>

import topbar from './top-bar.vue';

export default {
    name: 'view-holder',
    components: {
      topbar,
    },
}
</script>

<style>
.icon {
  margin-left: 28px;
}
</style>