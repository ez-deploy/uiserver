<template>
  <div class="project-page-holder">
    <t-row 
      class="project-name-and-operations-holder"
      :gutter="16"
      align="middle"
    >
      <h1 class="my-projects-title">My Projects</h1>

      <t-button 
        size="large"
        shape="round"
        @click="dialogVisible = true"
      >
        Create New
        <folder-add-icon/>
      </t-button>
    </t-row>
    <div class="project-card-flex-holder">
      <div v-for="(project_info, project_id, index) in projects" :key="index">
        <t-card class="project-card">
          <template #title>
            <a
              :href="'/ui/project/show/' + project_info.id"
              class="project-name"
            >
              {{project_info.name}}
            </a>
          </template>
          <template #subtitle>
            <p class="project-description">{{project_info.description}} </p>
          </template>
        </t-card>
      </div>
    </div>
    <t-dialog
      :visible="dialogVisible"
      header="Create New Project"
      :onClose="() => {dialogVisible = false}"
      :onOpened="() => {create_project_info.name = create_project_info.description = ''}"
    >
      <template #title>
        <h1>Create New Project</h1>
      </template>
      <t-divider></t-divider>
      <label
        class="label"
      >
        Project Name
      </label>
      <t-input
        class="create-project-input"
        v-model="create_project_info.name"
        placeholder=""
        :rules="[{ required: true, message: 'Please input project name' }]"
      />
      
      <label
        class="label"
      >
        Project Description
      </label>
      <t-input
        class="create-project-input"
        v-model="create_project_info.description"
        placeholder=""
        :rules="[{ required: true, message: 'Please input project description' }]"
      />
      <template #footer>
        <t-button
          size="large"
          shape="round"
          @click="createProject"
        >
          Create
        </t-button>
      </template>
    </t-dialog>
  </div>
</template>

<script>
import EzDeployApiserver  from 'ez_deploy_apiserver'

import {
  FolderAddIcon,
} from 'tdesign-icons-vue';
import { MessagePlugin } from 'tdesign-vue';

export default {
  name: 'project-list',
  components: {
    FolderAddIcon,
  },
  data() {
    let projects = {};
    let create_project_info = new EzDeployApiserver.ProjectInfo()
    create_project_info.name = create_project_info.description = ""

    return {
      projects: projects,
      dialogVisible: false,
      create_project_info: create_project_info
    }
  },
  created: function() {
    this.set_projects()
  },
  methods: {
    createProject() {
      let _this = this

      let callback = function (err, dada, resp) {
        if (err) {
          MessagePlugin.error("create project error " + err)
        } else {
          MessagePlugin.success("create project success")
          _this.dialogVisible = false
          _this.set_projects() // refresh projects
        }
      }

      this.$projectClient.createProject(this.create_project_info, callback)
    },
    set_projects() {
      let _this = this;

      // get project info by id.
      let set_project_info_by_id = function (id, o_project) {
        var callback = function(error, data, response) {
          if (error) {
            console.error("get project info error" + error);
          } else {
            o_project.name = data.name
            o_project.description = data.description
          }
        };
        
        _this.$projectClient.getProject(id, callback);
      }

      let fill_user_info = function (members) {
        for (let member of members) {
          let callback = function (error, data, resp) {
            if (error) {
              console.error("get user info error" + error)
            } else {
              member.name = data.name
              member.email = data.email
            }
          }

          conosle.log("get user info " + member)
          _this.$identityClient.getUser(member.user_id, callback)
        }
      } 

      // rols is a list of role object.
      let get_project_map_from_roles = function (roles) {
        let ret_map = {}
        for (const role of roles) {
          let project_id = role.info.projectId

          let ret_item = {
            role_id: role.info.id,
            role_name: role.info.name,
            permissions: [],
          }

          for (const permission of role.permissions) {
            ret_item.permissions.push(permission.permission)
          }

          if (ret_map[project_id] === undefined) {
            ret_map[project_id] = {
              id: project_id,
              name: "", // get by `set_project_info_by_id`
              description: "", // get by `set_project_info_by_id`
              roles: [],
              members: [],
            }

            set_project_info_by_id(project_id, ret_map[project_id])
          }

          ret_map[project_id].roles.push(ret_item)
        }

        return ret_map
      }

      // 获取有权限的项目列表.
      let callback = function(error, data, response) {
        if (error) {
          MessagePlugin.error('get project list error' + error)
        } else {
          _this.projects = get_project_map_from_roles(data.roles)
        }
      };

      this.$rbacClient.getUserRBAC(callback);
    }
  }
}
</script>

<style>
.project-page-holder {
  min-height: calc(100vh - 64px);
}

.my-projects-title {
  margin-left: 36px;
  margin-right: 18px;
}

.project-name-and-operations-holder {
  margin-top: 2vh;
  width: 100%;
}

.project-card-flex-holder {
  margin-bottom: 1vh;
  margin-left: 1vw;
  margin-right: 1vw;
  max-width: 100%;
  display: flex;
  flex-direction: row;
  align-content: flex-end;
  flex-wrap: wrap;
  justify-content: space-between;
  align-items: center;
}

.project-card {
  width: 23.5vw;
  height: 15vh;

  margin-bottom: 1vh;
  margin-top: 1vh;
}

.project-name {
  font-size: 1vw;
  font-weight: bold;
}

.project-description {
  font-size: 0.7vw;
}


.label {
  display: block;
  margin-bottom: 8px;
  font-weight: 400;
  text-align: left;
  line-height: 1.5;
  font-size: 14px;
}

.create-project-input {
  margin-bottom: 12px;
}

</style>