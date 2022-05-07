<template>
  <t-layout>
    <t-aside class="aside">
      <t-menu
        theme="light"
        v-model="selected_menu_item"
        value="status"
        style="margin-right: 50px"
      >
        <t-menu-item 
          value="status"
          @click=" () => {
            if ($route.name !== 'serviceinfo') {
              $router.push('/ui/service/show/' + $route.params.id + '/info')
            }
          }"
        >
          <template #icon>
            <dashboard-icon />
          </template>
          Service Status
        </t-menu-item>
        <t-menu-item 
          value="version"
          @click=" () => {
            if ($route.name !== 'serviceversion') {
              $router.push('/ui/service/show/' + $route.params.id + '/version')
            }
          }"
        >
          <template #icon>
            <fork-icon />
          </template>
          Version Control
        </t-menu-item>
      </t-menu>
    </t-aside>
    <t-content>
      <div class="project-page-holder">
        <router-view/>
      </div>
    </t-content>
  </t-layout>
</template>

<script>
import { Message, MessagePlugin } from 'tdesign-vue';
import { 
  DashboardIcon,
  ForkIcon
} from 'tdesign-icons-vue';

import EzDeployApiserver from 'ez_deploy_apiserver';

export default {
  name: 'service-show',
  components: {
    DashboardIcon,
    ForkIcon
  },
  created() {
    this.set_select_menu_item_by_route()
  },
  watch: {
    '$route': 'set_select_menu_item_by_route'
  },
  data() {
    return {
      selected_menu_item: "status"
    }
  },
  methods: {
    set_select_menu_item_by_route() {
      if (this.$route.name === 'serviceversion') {
        this.selected_menu_item = "version"
      } else {
        this.selected_menu_item = "status"
      }
    }
  }
}
</script>

<style>

.project-page-holder {
  min-height: calc(100vh - 64px);
}

.aside {
  border-top: 1.5px solid #eee;
}
</style>