<template>
  <div class="project-page-holder">
    <t-row 
      class="project-name-and-operations-holder"
      :gutter="16"
      align="middle"
    >
      <h1 class="my-projects-title">
        <a :href="'/ui/project/show/' + project_info.id">
          {{project_info.name}}
        </a>
        /Services
      </h1>
      <t-button 
        size="large"
        shape="round"
        @click="dialogVisible = true"
      >
        Create New
        <add-icon/>
      </t-button>
    </t-row>
    <div class="project-card-flex-holder">
      <div v-for="(service_info, index) in service_infos.services" :key="index">
        <t-card class="project-card">
          <template #title>
            <a
              :href="'/ui/service/show/' + service_info.id + '/info'"
              class="project-name"
            >
              {{service_info.name}}
            </a>
          </template>
          <template #subtitle>
            <p class="project-description">{{service_info.description}} </p>
          </template>
          <template #actions>
            <t-row align="middle" :gutter="16">
              <div v-if="service_info.running === true">
                <play-circle-stroke-icon/> Running
              </div>
              <div v-else class="stop-color">
                <stop-circle-icon class="status-icon"/> 
                <b class="status-font">Stoping</b>
              </div>
            </t-row>
            
          </template>
        </t-card>
      </div>
    </div>

    <t-dialog
      :visible="dialogVisible"
      :header="'Create New Service for ' + project_info.name"
      :onClose="() => {dialogVisible = false}"
      :onOpened="() => {create_service_info.name = create_service_info.description = ''}"
    >
      <template #title>
        <h1>Create New Project</h1>
      </template>
      <t-divider></t-divider>
      <label
        class="label"
      >
        Service Name
      </label>
      <t-input
        class="create-project-input"
        v-model="create_service_info.name"
        placeholder=""
        :rules="[{ required: true, message: 'Please input project name' }]"
      />
      
      <label
        class="label"
      >
        Service Description
      </label>
      <t-input
        class="create-project-input"
        v-model="create_service_info.description"
        placeholder=""
        :rules="[{ required: true, message: 'Please input project description' }]"
      />
      <template #footer>
        <t-button
          size="large"
          shape="round"
          @click="createService"
        >
          Create
        </t-button>
      </template>
    </t-dialog>
  </div>
</template>

<script>
import EzDeployApiserver from 'ez_deploy_apiserver'

import {
  AddIcon,
  PlayCircleStrokeIcon,
  StopCircleIcon,
} from 'tdesign-icons-vue';
import {MessagePlugin} from 'tdesign-vue';

export default {
  name: 'project-show',
  components: {
    AddIcon,
    PlayCircleStrokeIcon,
    StopCircleIcon,
  },
  data() {
    let project_info = {
      id: this.$route.params.id,
      name: '',
      description: '',
    }

    let service_infos = []

    let create_service_info = new EzDeployApiserver.ServiceInfo()
    create_service_info.name = create_service_info.description = ""

    return {
      project_info: project_info,
      service_infos: service_infos,
      dialogVisible: false,
      create_service_info: create_service_info
    }
  },
  created() {
    this.set_project_info();
    this.set_service_infos()
  },
  methods: {
    createService() {
      let _this = this

      let callback = function (err, dada, resp) {
        if (err) {
          MessagePlugin.error("create service error " + err)
        } else {
          _this.set_service_infos()
          _this.dialogVisible = false
        }
      }

      this.create_service_info.project_id = Number(this.$route.params.id)
      this.$serviceClient.createService(this.create_service_info, callback)
    },
    set_project_info() {
      let _this = this;

      let callback = function (err, data, resp) {
        if (err) {
          MessagePlugin.error("get project info error " + err)
          _this.$router.push("/ui/project/list")
        } else {
          _this.project_info = data
        }
      }
      
      this.$projectClient.getProject(this.$route.params.id, callback)
    },
    set_service_infos() {
      let _this = this;

      let callback = function (err, data, resp) {
        if (err) {
          MessagePlugin.error("get service info error " + err)
        } else {
          _this.service_infos = data
          // fill some key fields.
          for (let svc of _this.service_infos.services) {
            svc.running = (svc.running === undefined) ? false : svc.running
            svc.replica = (svc.replica === undefined) ? 0 : svc.replica
          }
        }
      }

      var opts = { 
        'projectId': this.$route.params.id,
      };

      this.$serviceClient.listService(opts, callback)
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
  justify-content: flex-start;
  align-items: center;
}

.project-card {
  width: 23.5vw;
  height: 15vh;

  margin-bottom: 1vh;
  margin-top: 1vh;
  margin-left: 0.3vw;
  margin-right: 0.3vw;
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

.status-font {
  font-size: 1.3vh;
}

.status-icon {
  width: 1.4vh;
  height: 1.4vh;
}

.stop-color {
  color: lightcoral;
}


.description {
  color: gray;
}
</style>