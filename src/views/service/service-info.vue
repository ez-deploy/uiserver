<template>
  <div>
    <t-row 
      class="project-name-and-operations-holder"
      align="middle"
    >
      <h1 class="my-projects-title">
        <a :href="'/ui/project/show/' + project_info.id">
          {{project_info.name}}
        </a>/<a :href="'/ui/service/show/' + service_info.id + '/info'">
          {{service_info.name}}
        </a>
      </h1>

      <a class="description">
        {{service_info.description}}
      </a>

    </t-row>
    <t-card
      class="info-card"
    >
      <t-row>
        <b style="font-size: 1.5vh">Service Info</b>
      </t-row>
      <t-row align="middle" style="margin-top: 24px"> 
        <t-col flex="100px"><b>ExposeType:</b> </t-col>
        <t-col flex="200px">
          <t-select 
            v-model="edit_service_info.expose_type"
            :options="[
              {label: 'none', value: 'none'},
              {label: 'incluster', value: 'incluster'},
              {label: 'nodeport', value: 'nodeport'}
            ]"
          />
        </t-col>
        <t-col v-if="edit_service_info.expose_type !== 'none'" flex="50px">
        </t-col>
        <t-col v-if="edit_service_info.expose_type !== 'none'" flex="100px">
          <b> ExposePort: </b>
        </t-col>
        <t-col flex="200px">
          <t-input
            v-if="edit_service_info.expose_type === 'incluster'"
            v-model="edit_service_info.in_cluster_port"
          > </t-input>
          <t-input
            v-else-if="edit_service_info.expose_type === 'nodeport'"
            v-model="edit_service_info.node_port"
            role="number"
          > </t-input>
        </t-col>
      </t-row>
      <t-divider></t-divider>
      <t-row align="middle">
        <t-col flex="170px"><b style="font-size: 1.5vh">Deploy Info</b></t-col>
        <t-col flex="100px">
          <t-switch 
            v-model="edit_service_info.running"
            size="large"
            :label="['Running', 'Stopped']"
            style="width: 100%"
          />
        </t-col>
      </t-row>

      <t-row align="middle" style="margin-top: 24px">
        <t-col flex="100px"><b>Version:</b></t-col>
        <t-col flex="200px">
          <t-select
            :options="version_options"
            v-model="edit_service_info.version_id"
          >
          </t-select>
        </t-col>

        <t-col flex="50px"></t-col>
        <t-col flex="100px"><b>Replica:</b></t-col>
        <t-col flex="200px">
          <t-input v-model="edit_service_info.replica" />
        </t-col>
      </t-row>

      <t-divider></t-divider>
      <t-row align="middle" style="margin-top: 36px">
        <t-col :span="8">
        </t-col>
        
        <t-col :span="2">
          <t-button
            style="width: 90%"
            @click="update_service_info()"
          >
            应用
          </t-button>
        </t-col>
        <t-col :span="2">
          <t-button
            style="width: 90%"
            variant="dashed"
            @click="cancle_edit_service_info()"
          >
            重置
          </t-button>
        </t-col>
      </t-row>
    </t-card>
    <t-card class="pod-infos">
      <t-row>
        <b style="font-size: 1.5vh">Pod Infos</b>
      </t-row>
      <t-table
        rowKey="name"
        :data="pods_info"
        :columns="table_cols"
        stripe
        bordered
        hover
        size="medium"
        table-layout="auto"
      >
        <template #status={row}>
          <div v-if="row.status === 'Pending'" style="color: #4787f0">● Pending </div>
          <div v-else-if="row.status === 'Running'" style="color: #078d5c">● Running </div>
          <div v-else-if="row.status === 'Succeeded'" style="color: #8b8b8b">● Succeeded </div>
          <div v-else-if="row.status === 'Failed'" style="color: #e34d59">● Failed </div>
          <div v-else-if="row.status === 'Unkonwn'" style="color: #f2995f">● Unkonwn </div>
        </template>
      </t-table>
    </t-card>
  </div>
</template>
<script>
import { Message, MessagePlugin } from 'tdesign-vue';
import { 
  DashboardIcon,
  ForkIcon
} from 'tdesign-icons-vue';

import EzDeployApiserver from 'ez_deploy_apiserver';

let table_cols = [
  {
    width: '300',
    colKey: 'name',
    title: 'Name',
    align: 'center',
    attrs: {
      'data-id': 'first-column',
    },
  },
  {
    width: '300',
    colKey: 'ip',
    title: 'IP',
  },
  {
    width: '100',
    colKey: 'status',
    title: 'Status'
  },
]

export default {
  name: "service-info",
  created() {
    this.set_service_info()
    this.set_version_infos()
    this.fetch_pods_info()
    this.timer = setInterval(this.fetch_pods_info, 5000);
  },
  beforeDestroy() {
    clearInterval(this.timer);
  },
  data() {
    let service_info = {
      "create_at": 1528894200,
      "description": "foobar service",
      "expose_type": "service",
      "id": 1,
      "in_cluster_port": 80,
      "name": "foobar",
      "node_port": 80,
      "project_id": 1,
      "replica": 16,
      "running": false,
      "update_at": 1528894200,
      "version_id": 1
    }

    let edit_service_info = service_info

    let project_info = {
      "name": "",
      "id": 0,
      "description": ""
    }

    let version_options = [
      {
        label: 'None',
        value: 0
      }
    ]

    return {
      service_info: service_info,
      edit_service_info: edit_service_info,
      project_info: project_info,
      version_options: version_options,
      pods_info: [],
      table_cols: table_cols
    }
  },
  methods: {
    fetch_pods_info() {
      let _this = this
      let callback = function (err, data, resp) {
        if (err) {
          MessagePlugin.error("fetch pods info error" + err)
        } else {
          _this.pods_info = data.pods
        }
      }

      this.$serviceClient.listServicePod(Number(this.$route.params.id), callback)
    },
    update_service_info() {
      let callback = function (err, data, resp) {
        let _this = this
        if (err) {
          MessagePlugin.error("update service info error: " + err)
        } else {
          MessagePlugin.success("update service info success")
          _this.set_service_info()
        }
      }

      this.edit_service_info.in_cluster_port = Number(this.edit_service_info.in_cluster_port)
      this.edit_service_info.node_port = Number(this.edit_service_info.node_port)
      this.edit_service_info.replica = Number(this.edit_service_info.replica)
      this.$serviceClient.updateServiceVersion(this.edit_service_info, callback)
    },
    cancle_edit_service_info() {
      this.set_service_info()
    },
    set_service_info() {
      let _this = this

      let callback = function (err, data, resp) {
        if (err) {
          MessagePlugin.error("get service info error " + err)
          _this.$router.push("/ui/project/list")
        } else if (data.services === undefined || data.services.length === 0) {
          MessagePlugin.error("service info not found")
          _this.$router.push("/ui/project/list")
        } else {
          let svc = _this.service_info
          svc = data.services[0]
          svc.running = (svc.running === undefined) ? false : svc.running
          svc.replica = (svc.replica === undefined) ? 0 : svc.replica
          svc.expose_type = (svc.expose_type === undefined) ? "none" : svc.expose_type
          svc.in_cluster_port = (svc.in_cluster_port === undefined) ? 80 : svc.in_cluster_port
          svc.node_port = (svc.node_port === undefined) ? 30010 : svc.node_port
          svc.version_id = (svc.version_id === undefined) ? 0 : svc.version_id

          // write back
          _this.service_info = svc 
          _this.edit_service_info = svc

          _this.set_project_info(svc.project_id)
        }
      }

      let svc_id = this.$route.params.id
      var opts = { 
        'serviceId': svc_id,
      };

      this.$serviceClient.listService(opts, callback)
    },
    set_project_info(project_id) {
      let _this = this;

      let callback = function (err, data, resp) {
        if (err) {
          MessagePlugin.error("get project info error " + err)
          _this.$router.push("/ui/project/list")
        } else {
          _this.project_info = data
        }
      }
      
      this.$projectClient.getProject(project_id, callback)
    },
    set_version_infos() {
      let _this = this

      let callback = function (err, data, resp) {
        if (err) {
          MessagePlugin.error("get version info error " + err)
        } else {
          let set_versions = [
            {
              label: 'None',
              value: 0
            }
          ]
          for (const version of data.versions) {
            set_versions.push({
              label: version.name,
              value: version.id
            })
          }
          
          _this.version_options=  set_versions
        }
      }

      this.$serviceClient.listServiceVersion(this.$route.params.id, callback)
    }
  }
}
</script>

<style>

.status {
  position: absolute;
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  content: "";
  background-color: #00a870;
  width: 6px;
  height: 6px;
  border-radius: 50%;
}

.info-card {
  left: 18px;
  width: 800px;
  margin-bottom: 2vh;
}

.pod-infos {
  left: 18px;
  width: calc(100% - 36px);
}

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