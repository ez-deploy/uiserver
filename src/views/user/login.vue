<template>
  <div>
    <div class="icon-holder">
      <img src="../../assets/full-icon.svg"/>
    
    </div>

    <h1 class="sign-in-title">Sign in</h1>
    <t-card 
      class="login-card"
      shadow
    >
      <!-- email -->
      <label
        class="label"
      >
        Email address
      </label>
      <t-input
        class="input-block"
        placeholder=""
        size="large"
        v-model="user.email"
      >
      </t-input>

      <!-- password  -->
      <label
        class="label"
      >
        Password
      </label>
      <t-input
        class="input-block"
        placeholder=""
        size="large"
        type="password"
        v-model="user.password"
      >
      </t-input>

      <!-- Button -->
      <t-button
        class="login-button"
        size="large"
        shadow
        @click="login"
      >
        Sign In
      </t-button>
    </t-card>
    <t-card class="new-account-card">
      New to easy-deploy? <router-link to="/user/create">Create an account</router-link>.
    </t-card>
  </div>
</template>

<script>
import EzDeployApiserver  from 'ez_deploy_apiserver'
import { MessagePlugin } from 'tdesign-vue';

export default {
  name: 'login',
  data() {
    let user = new EzDeployApiserver.UserInfo();
    user.email = user.password = ""

    return {
      user: user
    }
  },
  methods: {
    login() {
      let _this = this;

      let callback = function(error, data, response) {
        if (error) {
          MessagePlugin.error("login failed, check your username and password");
          console.error(error);
        } else {
          console.log(data, response)
          MessagePlugin.success("login success, welcome back");
          _this.$router.push('/ui/index');
        }
      }

      this.$identityClient.login(this.user, callback);
    }
  }
}
</script>

<style scoped>
.icon-holder {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 15vh;
}

.sign-in-title {
  margin-bottom: 1em;
  font-size: 2rem;
  color: #191918;
  text-align: center;
}

.label {
  display: block;
  margin-bottom: 8px;
  font-weight: 400;
  text-align: left;
  line-height: 1.5;
  font-size: 14px;
}

.input-block {
  margin-top: 4px;
  margin-bottom: 16px;
  border-radius: 4px;
}

.login-button {
  margin-top: 2em;
  margin-bottom: 1em;
  display: block;
  width: 100%;
  text-align: center;
  border-radius: 4px;
}

.login-card {
  left: 40%;
  width: 20vw;
  background-color: #f6f8fa;
  border: 1px solid hsl(210, 18%, 87%);
  border-radius: 10px;
}

.new-account-card {
  left: 40%;
  width: 20vw;
  border: 1px solid hsl(210, 18%, 87%);
  border-radius: 10px;
  text-align: center;
  border-radius: 6px;
  margin-block-start: 1em;
  margin-block-end: 1em;
  margin-inline-start: 0px;
  margin-inline-end: 0px;
  font-size: 17px;
  padding: 16px 16px;
}
</style>
