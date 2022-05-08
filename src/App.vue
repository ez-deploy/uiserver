<template>
  <router-view/>
</template>
<script>
import { MessagePlugin } from 'tdesign-vue';

export default {
  name: "App",
  created() {
    this.checkLoginStatus()
  },
  methods: {
    checkLoginStatus() {
      if (this.$route.path == '/user/login' || this.$route.path == '/user/create') {
        return
      }

      let _this = this

      let callback = function(err, data, response) {
        if (err) {
          MessagePlugin.error("not login, please login first" + err)
          _this.$router.push('/user/login')
        }
      }

      this.$identityClient.whoami(callback)
    }
  }
};
</script>
