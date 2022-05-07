<template>
  <t-head-menu theme="light" value="item1" height="120px">
    <!-- logo -->
    <img
      slot="logo"
      alt="logo"
      width="158px"
      class="icon"
      @click="$router.push('/ui/index')"
      src="../assets/full-icon.svg"
    />
    <!-- ops -->
    <template #operations>
      <div class="operations-container">
        <!-- 主页 -->
        <t-tooltip class="button-operation-item" placement="bottom" content="返回主页">
          <t-button theme="default" shape="square" variant="text" @click="gotoHomePage">
            <home-icon class="operation-icon"/>
          </t-button>
        </t-tooltip>

        <!-- 帮助文档 -->
        <t-tooltip class="button-operation-item" placement="bottom" content="帮助文档">
          <t-button theme="default" shape="square" variant="text" @click="gotoHelpDoc">
            <help-circle-icon class="operation-icon"/>
          </t-button>
        </t-tooltip>

        <!-- 用户信息 -->
        <t-dropdown :min-column-width="125" trigger="click">
          <!-- 下拉菜单 -->
          <template #dropdown>
            <t-dropdown-menu>
              <t-dropdown-item class="operations-dropdown-container-item" @click="handleLogout">
                <poweroff-icon class="operation-icon"/> Sign Out
              </t-dropdown-item>
            </t-dropdown-menu>
          </template>
          <!-- 展示部分 -->
          <t-button class="header-user-btn" theme="default" variant="text">
            <template #icon>
              <user-circle-icon  class="operation-icon"/>
            </template>
            <div class="header-user-account">
                Tencent
                <chevron-down-icon class="operation-icon"/>
            </div>
          </t-button>
        </t-dropdown>
      </div>
    </template>
  </t-head-menu>
</template>

<script>
import {
  ChevronDownIcon,
  UserCircleIcon,
  PoweroffIcon,
  HomeIcon,
  HelpCircleIcon,
} from 'tdesign-icons-vue';
import { MessagePlugin } from 'tdesign-vue';
import EzDeployApiserver  from 'ez_deploy_apiserver';

export default {
    name: 'top-bar',
    components: {
      ChevronDownIcon,
      UserCircleIcon,
      PoweroffIcon,
      HomeIcon,
      HelpCircleIcon,
    },
    methods: {
      gotoHelpDoc: function () {
        window.open("/api/docs")
      },
      handleLogout: function () {
        let callback = function (error, data, response) {
          if (error) {
            MessagePlugin.error('Get error' + error)
          } else {
            MessagePlugin.success('Sign out success')
          }
        }

        this.$identityClient.logout(callback)
      },
      gotoHomePage: function () {
        if (this.$route.path === "/ui/index") {
          MessagePlugin.info('Already in home page')
          return;
        }

        this.$router.push("/ui/index")
      },
    }
}
</script>

<style>
.icon {
  cursor: pointer;
}

.operation-icon {
  width: 20px;
  height: 20px;
}

.operations-dropdown-container-item {
  width: 100%;
  display: flex;
  align-items: center;
}

.header-user-account {
  display: inline-flex;
  align-items: center;
}

.button-operation-item {
  margin-left: 5px;
}
</style>